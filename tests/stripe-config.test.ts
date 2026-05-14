import { describe, it, expect } from 'vitest'
import { PLANS } from '@/lib/stripe'

describe('Stripe plan config', () => {
  it('has exactly 3 plans', () => {
    expect(Object.keys(PLANS)).toHaveLength(3)
    expect(Object.keys(PLANS)).toEqual(['starter', 'growth', 'partner'])
  })

  it('no free plan exists', () => {
    expect(PLANS).not.toHaveProperty('free')
    expect(PLANS).not.toHaveProperty('FREE')
  })

  it('starter monthly is $49 (4900 cents)', () => {
    expect(PLANS.starter.monthlyPrice).toBe(4900)
  })

  it('growth monthly is $149 (14900 cents)', () => {
    expect(PLANS.growth.monthlyPrice).toBe(14900)
  })

  it('partner monthly is $499 (49900 cents)', () => {
    expect(PLANS.partner.monthlyPrice).toBe(49900)
  })

  it('all plans have monthly and annual price ID fields', () => {
    for (const plan of Object.values(PLANS)) {
      expect(plan).toHaveProperty('stripeMonthlyPriceId')
      expect(plan).toHaveProperty('stripeAnnualPriceId')
    }
  })
})
