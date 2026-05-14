import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { recordStripePayment } from '@/lib/quickbooks'
import Stripe from 'stripe'

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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      if (!userId) break

      if (session.mode === 'subscription') {
        const subscription = await getStripe().subscriptions.retrieve(session.subscription as string)
        const priceId = subscription.items.data[0]?.price.id

        // Determine plan from price
        let plan = 'starter'
        if (priceId === process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID || priceId === process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID) {
          plan = 'growth'
        } else if (priceId === process.env.STRIPE_PARTNER_MONTHLY_PRICE_ID || priceId === process.env.STRIPE_PARTNER_ANNUAL_PRICE_ID) {
          plan = 'partner'
        }

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

      // Sync to QuickBooks Live
      await recordStripePayment({
        customerEmail: invoice.customer_email || 'unknown',
        customerName: invoice.customer_name || invoice.customer_email || 'Unknown',
        amount: amountPaid,
        planName,
        stripeInvoiceId: invoice.id,
        stripeSubscriptionId: (invoice.subscription as string) || '',
      })
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
      if (subscription.cancel_at_period_end) {
        // Will be cancelled at end of period - could notify user
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
