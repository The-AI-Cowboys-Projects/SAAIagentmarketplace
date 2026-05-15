import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

export const PLANS = {
  starter: {
    name: 'Starter',
    monthlyPrice: 4900,
    annualPrice: 47000,
    stripeMonthlyPriceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
    stripeAnnualPriceId: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID,
  },
  growth: {
    name: 'Growth',
    monthlyPrice: 14900,
    annualPrice: 143000,
    stripeMonthlyPriceId: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID,
    stripeAnnualPriceId: process.env.STRIPE_GROWTH_ANNUAL_PRICE_ID,
  },
  partner: {
    name: 'Partner',
    monthlyPrice: 49900,
    annualPrice: 479000,
    stripeMonthlyPriceId: process.env.STRIPE_PARTNER_MONTHLY_PRICE_ID,
    stripeAnnualPriceId: process.env.STRIPE_PARTNER_ANNUAL_PRICE_ID,
  },
} as const
