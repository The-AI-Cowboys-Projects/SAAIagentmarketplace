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
    monthlyPrice: 900,
    annualPrice: 8900,
    stripePriceId: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID,
  },
  pro: {
    name: 'Operator',
    monthlyPrice: 2900,
    annualPrice: 27900,
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  },
  enterprise: {
    name: 'Commander',
    monthlyPrice: 9900,
    annualPrice: 95900,
    stripePriceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
  },
} as const
