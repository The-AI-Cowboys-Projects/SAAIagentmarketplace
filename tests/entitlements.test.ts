import { describe, it, expect } from 'vitest'
import { getPlanLimits, canAccessFeature, getRequestLimit, getTeamSeatLimit } from '@/lib/entitlements'

describe('Entitlements', () => {
  it('starter has 1000 requests/mo', () => {
    expect(getRequestLimit('starter')).toBe(1000)
  })

  it('growth has 10000 requests/mo', () => {
    expect(getRequestLimit('growth')).toBe(10000)
  })

  it('partner has unlimited requests', () => {
    expect(getRequestLimit('partner')).toBe(Infinity)
  })

  it('unknown plan falls back to starter limits', () => {
    expect(getRequestLimit('free')).toBe(1000)
    expect(getRequestLimit('unknown')).toBe(1000)
  })

  it('only partner has SSO', () => {
    expect(canAccessFeature('starter', 'ssoEnabled')).toBe(false)
    expect(canAccessFeature('growth', 'ssoEnabled')).toBe(false)
    expect(canAccessFeature('partner', 'ssoEnabled')).toBe(true)
  })

  it('growth and partner have custom config', () => {
    expect(canAccessFeature('starter', 'customConfig')).toBe(false)
    expect(canAccessFeature('growth', 'customConfig')).toBe(true)
    expect(canAccessFeature('partner', 'customConfig')).toBe(true)
  })

  it('team seats scale with plan', () => {
    expect(getTeamSeatLimit('starter')).toBe(1)
    expect(getTeamSeatLimit('growth')).toBe(5)
    expect(getTeamSeatLimit('partner')).toBe(Infinity)
  })
})
