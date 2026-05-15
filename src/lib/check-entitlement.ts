/**
 * Entitlement enforcement utility.
 * Checks whether a user's plan allows a given agent request
 * based on monthly usage limits and agent minimum plan requirements.
 */

import { createServiceRoleClient } from '@/lib/supabase/server'
import { getRequestLimit } from '@/lib/entitlements'

/** Plan tier ordering for min_plan comparisons. */
const PLAN_RANK: Record<string, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  partner: 3,
}

export interface EntitlementResult {
  allowed: boolean
  reason?: string
  usage: number
  limit: number
}

/**
 * Check whether a user is entitled to make an agent request.
 *
 * @param userId  - Authenticated user's UUID
 * @param agentSlug - Optional agent slug to verify min_plan gate from agent_catalog
 */
export async function checkEntitlement(
  userId: string,
  agentSlug?: string
): Promise<EntitlementResult> {
  const supabase = createServiceRoleClient()

  // 1. Look up user's plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()

  const userPlan: string = profile?.plan || 'free'
  const monthlyLimit = getRequestLimit(userPlan)

  // 2. Get current monthly usage
  let currentUsage = 0
  if (monthlyLimit !== Infinity) {
    const { data: usage } = await supabase.rpc('monthly_agent_usage', {
      p_user_id: userId,
    })
    currentUsage = usage?.[0]?.request_count ?? 0
  }

  // 3. Check monthly quota
  if (monthlyLimit !== Infinity && currentUsage >= monthlyLimit) {
    return {
      allowed: false,
      reason: `Monthly request limit (${monthlyLimit}) reached. Upgrade your plan at /pricing.`,
      usage: currentUsage,
      limit: monthlyLimit,
    }
  }

  // 4. If an agent slug is provided, check min_plan gate from agent_catalog
  if (agentSlug) {
    const { data: agent } = await supabase
      .from('agent_catalog')
      .select('min_plan')
      .eq('slug', agentSlug)
      .single()

    if (agent?.min_plan) {
      const userRank = PLAN_RANK[userPlan] ?? 0
      const requiredRank = PLAN_RANK[agent.min_plan] ?? 0

      if (userRank < requiredRank) {
        return {
          allowed: false,
          reason: `This agent requires a ${agent.min_plan} plan or higher. Upgrade at /pricing.`,
          usage: currentUsage,
          limit: monthlyLimit === Infinity ? -1 : monthlyLimit,
        }
      }
    }
  }

  return {
    allowed: true,
    usage: currentUsage,
    limit: monthlyLimit === Infinity ? -1 : monthlyLimit,
  }
}
