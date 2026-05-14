import { describe, it, expect } from 'vitest'
import { SA_AGENTS, SA_CATEGORIES, SA_PLANS } from '@/lib/agents-data'
import { CATEGORY_CONFIG, TIER_CONFIG } from '@/lib/types'
import type { AgentCategory } from '@/lib/types'

describe('Agent catalog', () => {
  it('contains exactly 70 agents', () => {
    expect(SA_AGENTS).toHaveLength(70)
  })

  it('has 6 categories', () => {
    expect(SA_CATEGORIES).toHaveLength(6)
  })

  it('category counts match actual agent data', () => {
    const counts: Record<string, number> = {}
    for (const agent of SA_AGENTS) {
      counts[agent.category] = (counts[agent.category] || 0) + 1
    }
    for (const cat of SA_CATEGORIES) {
      expect(counts[cat.id]).toBe(cat.count)
    }
  })

  it('every agent category is a valid AgentCategory', () => {
    const validCategories = Object.keys(CATEGORY_CONFIG)
    for (const agent of SA_AGENTS) {
      expect(validCategories).toContain(agent.category)
    }
  })

  it('no agent has FREE tier', () => {
    for (const agent of SA_AGENTS) {
      expect(agent.tier).not.toBe('FREE')
    }
  })

  it('every agent tier is in TIER_CONFIG', () => {
    const validTiers = Object.keys(TIER_CONFIG)
    for (const agent of SA_AGENTS) {
      expect(validTiers).toContain(agent.tier)
    }
  })

  it('all agent IDs are unique', () => {
    const ids = SA_AGENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all agent slugs are unique', () => {
    const slugs = SA_AGENTS.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('Connect360 category exists with 10 agents', () => {
    const c360 = SA_AGENTS.filter((a) => a.category === 'Connect360')
    expect(c360).toHaveLength(10)
  })

  it('Business category has 20 agents', () => {
    const biz = SA_AGENTS.filter((a) => a.category === 'Business')
    expect(biz).toHaveLength(20)
  })

  it('Civic category has 10 agents (not 20)', () => {
    const civic = SA_AGENTS.filter((a) => a.category === 'Civic')
    expect(civic).toHaveLength(10)
  })
})

describe('Category config', () => {
  it('CATEGORY_CONFIG has all 6 categories', () => {
    expect(Object.keys(CATEGORY_CONFIG)).toHaveLength(6)
    expect(CATEGORY_CONFIG).toHaveProperty('Connect360')
  })

  it('TIER_CONFIG has no FREE tier', () => {
    expect(TIER_CONFIG).not.toHaveProperty('FREE')
    expect(Object.keys(TIER_CONFIG)).toEqual(['PRO', 'ENTERPRISE'])
  })
})

describe('Pricing plans', () => {
  it('has 3 plans: starter, growth, partner', () => {
    expect(SA_PLANS).toHaveLength(3)
    const ids = SA_PLANS.map((p) => p.id)
    expect(ids).toEqual(['starter', 'growth', 'partner'])
  })

  it('all plans reference 70 agents', () => {
    for (const plan of SA_PLANS) {
      if (typeof plan.agentCount === 'number') {
        expect(plan.agentCount).toBe(70)
      }
    }
  })

  it('no plan mentions FREE', () => {
    for (const plan of SA_PLANS) {
      expect(plan.name.toLowerCase()).not.toBe('free')
      expect(plan.id).not.toBe('free')
    }
  })
})
