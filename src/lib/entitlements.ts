/**
 * Server-side entitlement checks.
 * Validates that a user's plan grants access to the requested resource.
 */

export type PlanId = 'free' | 'starter' | 'growth' | 'partner'

interface PlanLimits {
  maxRequestsPerMonth: number
  maxTeamSeats: number
  customConfig: boolean
  ssoEnabled: boolean
}

const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    maxRequestsPerMonth: 10,
    maxTeamSeats: 1,
    customConfig: false,
    ssoEnabled: false,
  },
  starter: {
    maxRequestsPerMonth: 1000,
    maxTeamSeats: 1,
    customConfig: false,
    ssoEnabled: false,
  },
  growth: {
    maxRequestsPerMonth: 10000,
    maxTeamSeats: 5,
    customConfig: true,
    ssoEnabled: false,
  },
  partner: {
    maxRequestsPerMonth: Infinity,
    maxTeamSeats: Infinity,
    customConfig: true,
    ssoEnabled: true,
  },
}

export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[(plan as PlanId)] ?? PLAN_LIMITS.free
}

export function canAccessFeature(plan: string, feature: 'customConfig' | 'ssoEnabled'): boolean {
  const limits = getPlanLimits(plan)
  return limits[feature]
}

export function getRequestLimit(plan: string): number {
  return getPlanLimits(plan).maxRequestsPerMonth
}

export function getTeamSeatLimit(plan: string): number {
  return getPlanLimits(plan).maxTeamSeats
}
