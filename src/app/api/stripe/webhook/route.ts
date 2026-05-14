import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { recordStripePayment } from '@/lib/quickbooks'
import Stripe from 'stripe'

// ── Resolve plan from Stripe price ID (supports new + legacy env var names) ──
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

// ── Idempotency: track processed event IDs in-memory + Supabase ─────────
// In-memory set for fast dedup within a single serverless instance.
// Supabase stripe_events table is the durable store across instances.
const processedEvents = new Set<string>()

async function isEventProcessed(supabase: ReturnType<typeof createServiceRoleClient>, eventId: string): Promise<boolean> {
  if (processedEvents.has(eventId)) return true
  const { data } = await supabase
    .from('stripe_events')
    .select('id')
    .eq('event_id', eventId)
    .maybeSingle()
  return !!data
}

async function markEventProcessed(supabase: ReturnType<typeof createServiceRoleClient>, eventId: string, eventType: string): Promise<void> {
  processedEvents.add(eventId)
  // Cap in-memory set to prevent unbounded growth
  if (processedEvents.size > 10000) {
    const entries = Array.from(processedEvents)
    for (let i = 0; i < 5000; i++) processedEvents.delete(entries[i])
  }
  await supabase.from('stripe_events').upsert(
    { event_id: eventId, event_type: eventType, processed_at: new Date().toISOString() },
    { onConflict: 'event_id' }
  )
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  // ── Idempotency check ─────────────────────────────────────────────────
  if (await isEventProcessed(supabase, event.id)) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      if (!userId) break

      if (session.mode === 'subscription') {
        const subscription = await getStripe().subscriptions.retrieve(session.subscription as string)
        const priceId = subscription.items.data[0]?.price.id

        // Determine plan from price (check new + legacy env var names)
        const plan = resolvePlanFromPriceId(priceId)

        await supabase.from('profiles').update({ plan }).eq('id', userId)
      }
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      const amountPaid = invoice.amount_paid
      if (amountPaid <= 0) break

      // Determine plan name from line items
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
        await supabase.from('profiles').update({ plan: 'starter' }).eq('id', profile.id)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const priceId = subscription.items.data[0]?.price.id

      // Sync plan changes (upgrades/downgrades)
      const plan = resolvePlanFromPriceId(priceId)

      const customerId = subscription.customer as string
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabase.from('profiles').update({ plan }).eq('id', profile.id)
      }
      break
    }
  }

  // ── Mark event as processed ───────────────────────────────────────────
  await markEventProcessed(supabase, event.id, event.type)

  return NextResponse.json({ received: true })
}
