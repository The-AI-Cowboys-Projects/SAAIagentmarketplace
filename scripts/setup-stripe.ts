/**
 * Run this script once to create Stripe products and prices:
 *   npx ts-node scripts/setup-stripe.ts
 *
 * Then copy the price IDs to your .env.local
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as any,
})

async function main() {
  console.log('Creating Stripe products and prices...\n')

  // Operator (Pro) plan
  const proProduct = await stripe.products.create({
    name: 'SA Agent Marketplace - Operator Plan',
    description: 'Access to all 287 PRO + FREE agents, 100K tokens/month, priority support',
    metadata: { plan: 'pro' },
  })

  const proMonthly = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 2900,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { plan: 'pro', billing: 'monthly' },
  })

  const proAnnual = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 27900,
    currency: 'usd',
    recurring: { interval: 'year' },
    metadata: { plan: 'pro', billing: 'annual' },
  })

  console.log('Operator Plan:')
  console.log(`  STRIPE_PRO_MONTHLY_PRICE_ID=${proMonthly.id}`)
  console.log(`  STRIPE_PRO_ANNUAL_PRICE_ID=${proAnnual.id}`)

  // Commander (Enterprise) plan
  const entProduct = await stripe.products.create({
    name: 'SA Agent Marketplace - Commander Plan',
    description: 'Access to all 350 agents, unlimited tokens, dedicated support, SSO',
    metadata: { plan: 'enterprise' },
  })

  const entMonthly = await stripe.prices.create({
    product: entProduct.id,
    unit_amount: 9900,
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: { plan: 'enterprise', billing: 'monthly' },
  })

  const entAnnual = await stripe.prices.create({
    product: entProduct.id,
    unit_amount: 95900,
    currency: 'usd',
    recurring: { interval: 'year' },
    metadata: { plan: 'enterprise', billing: 'annual' },
  })

  console.log('\nCommander Plan:')
  console.log(`  STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=${entMonthly.id}`)
  console.log(`  STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=${entAnnual.id}`)

  console.log('\nAdd these to your .env.local file.')
}

main().catch(console.error)
