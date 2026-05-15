import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { recordStripePayment } from '@/lib/quickbooks'
import Stripe from 'stripe'

// Resolve plan from Stripe price ID (supports new + legacy env var names)
function resolvePlanFromPriceId(priceId: string | undefined): string {
  if (!priceId) return 'starter'
  const growthIds = [
    process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
    process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID,
  ].filter(Boolean)
  const partnerIds = [
    process.env.STRIPE_PARTNER_MONTHLY_PRICE_ID,
    process.env.STRIPE_PARTNER_ANNUAL_PRICE_ID,
    process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID,
  ].filter(Boolean)
  if (growthIds.includes(priceId)) return 'growth'
  if (partnerIds.includes(priceId)) return 'partner'
  return 'starter'
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('[stripe-webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  // Idempotency: claim the event before processing (insert-first)
  const { error: claimError } = await supabase.from('stripe_events').insert({
    event_id: event.id,
    event_type: event.type,
    processing_status: 'processing',
    processed_at: new Date().toISOString(),
  })

  if (claimError) {
    if (claimError.code === '23505') {
      // Duplicate event — already processed or in-progress
      return NextResponse.json({ received: true, deduplicated: true })
    }
    console.error('[stripe-webhook] Failed to claim event:', claimError)
    return NextResponse.json({ error: 'Failed to process event' }, { status: 500 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        if (!userId) break

        if (session.mode === 'subscription' && session.subscription) {
          const subResponse = await getStripe().subscriptions.retrieve(session.subscription as string)
          const sub = subResponse as any as Stripe.Subscription
          const priceId = sub.items.data[0]?.price.id
          const plan = resolvePlanFromPriceId(priceId)

          // Upsert subscription record
          await supabase.from('subscriptions').upsert({
            user_id: userId,
            stripe_subscription_id: sub.id,
            stripe_customer_id: sub.customer as string,
            status: sub.status,
            plan,
            stripe_price_id: priceId,
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })

          // Denormalized plan on profile for fast reads
          await supabase.from('profiles').update({
            plan,
            stripe_customer_id: sub.customer as string,
          }).eq('id', userId)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = sub.customer as string
        const priceId = sub.items.data[0]?.price.id
        const plan = resolvePlanFromPriceId(priceId)

        // Find user by stripe_customer_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase.from('subscriptions').upsert({
            user_id: profile.id,
            stripe_subscription_id: sub.id,
            stripe_customer_id: customerId,
            status: sub.status,
            plan,
            stripe_price_id: priceId,
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })

          // Update denormalized plan
          const effectivePlan = sub.status === 'active' ? plan : 'free'
          await supabase.from('profiles').update({ plan: effectivePlan }).eq('id', profile.id)
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const amountPaid = invoice.amount_paid
        if (amountPaid <= 0) break

        const lineItem = invoice.lines?.data?.[0]
        const planName = lineItem?.description || 'SA AI Agent Marketplace Subscription'

        // Fire-and-forget QBO sync — don't block webhook response
        recordStripePayment({
          customerEmail: invoice.customer_email || 'unknown',
          customerName: invoice.customer_name || invoice.customer_email || 'Unknown',
          amount: amountPaid,
          planName,
          stripeInvoiceId: invoice.id,
          stripeSubscriptionId: String((invoice as any).subscription || ''),
        }).catch((err) => console.error('[QBO] Background sync error:', err))
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase.from('subscriptions').update({
            status: 'canceled',
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          }).eq('user_id', profile.id)

          // Downgrade to free
          await supabase.from('profiles').update({ plan: 'free' }).eq('id', profile.id)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase.from('subscriptions').update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          }).eq('user_id', profile.id)
        }
        break
      }
    }

    // Mark event as completed
    await supabase.from('stripe_events').update({
      processing_status: 'completed',
      completed_at: new Date().toISOString(),
    }).eq('event_id', event.id)

  } catch (err: any) {
    console.error('[stripe-webhook] Processing error:', err.message)
    await supabase.from('stripe_events').update({
      processing_status: 'failed',
      error_message: err.message?.slice(0, 500),
    }).eq('event_id', event.id)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
