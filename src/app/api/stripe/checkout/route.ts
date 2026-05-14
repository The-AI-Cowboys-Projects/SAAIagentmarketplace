import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PLANS } from '@/lib/stripe'
import { createServerSupabase } from '@/lib/supabase/server'

// Server-side plan validation — never trust client-supplied priceId
type PlanId = 'starter' | 'growth' | 'partner'
type BillingInterval = 'monthly' | 'annual'

function resolveStripePriceId(plan: PlanId, billing: BillingInterval): string | undefined {
  const planConfig = PLANS[plan]
  if (!planConfig) return undefined
  return billing === 'annual' ? planConfig.stripeAnnualPriceId : planConfig.stripeMonthlyPriceId
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const plan = body.plan as PlanId
    const billing = (body.billing || 'monthly') as BillingInterval

    // Validate plan and billing server-side
    if (!plan || !['starter', 'growth', 'partner'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan. Must be starter, growth, or partner.' }, { status: 400 })
    }
    if (!['monthly', 'annual'].includes(billing)) {
      return NextResponse.json({ error: 'Invalid billing interval. Must be monthly or annual.' }, { status: 400 })
    }

    const priceId = resolveStripePriceId(plan, billing)
    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price not configured for ${plan}/${billing}. Contact support.` },
        { status: 500 }
      )
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanantonioaiagents.com'

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/dashboard?checkout=success`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
      metadata: { supabase_user_id: user.id, plan, billing },
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
