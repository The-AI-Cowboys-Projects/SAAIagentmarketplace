import { NextRequest, NextResponse } from 'next/server'
import { backendFetch, isBackendAvailable } from '@/lib/backend'
import { createServerSupabase, createServiceRoleClient } from '@/lib/supabase/server'
import { getRequestLimit } from '@/lib/entitlements'
import { SA_AGENTS } from '@/lib/agents-data'
import type { AgentStatus } from '@/lib/types'
import { logger } from '@/lib/logger'

import { chatDemoLimit, chatAuthLimit, checkLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    const { agentId, message } = await request.json()
    if (!agentId || !message) {
      return NextResponse.json({ error: 'agentId and message are required' }, { status: 400 })
    }
    if (typeof message !== 'string' || message.length > 2000) {
      return NextResponse.json({ error: 'Message must be a string under 2000 characters' }, { status: 400 })
    }

    // Auth check — allow demo for unauthed users but with stricter limits
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimitKey = user ? `user:${user.id}` : `ip:${ip}`

    const { success: chatAllowed } = await checkLimit(user ? chatAuthLimit : chatDemoLimit, rateLimitKey)
    if (!chatAllowed) {
      return NextResponse.json(
        { error: user ? 'Rate limit exceeded. Please slow down.' : 'Demo rate limit reached. Sign in for more access.' },
        { status: 429 }
      )
    }

    // Entitlement enforcement — monthly quota check for authenticated users
    const serviceClient = createServiceRoleClient()
    let userPlan = 'free'

    if (user) {
      const { data: profile } = await serviceClient
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()
      userPlan = profile?.plan || 'free'

      const monthlyLimit = getRequestLimit(userPlan)
      if (monthlyLimit !== Infinity) {
        const { data: usage } = await serviceClient.rpc('monthly_agent_usage', { p_user_id: user.id })
        const currentCount = usage?.[0]?.request_count || 0
        if (currentCount >= monthlyLimit) {
          return NextResponse.json(
            { error: `Monthly request limit (${monthlyLimit}) reached. Upgrade your plan at /pricing.` },
            { status: 429 }
          )
        }
      }
    }

    // Block chat for agents that aren't live or beta
    const localAgent = SA_AGENTS.find((a) => a.id === agentId)
    if (localAgent) {
      const blockedStatuses: AgentStatus[] = ['coming_soon']
      if (blockedStatuses.includes(localAgent.agentStatus)) {
        return NextResponse.json(
          { error: 'This agent is not yet available. Check back soon.' },
          { status: 403 }
        )
      }
    }

    // Open an agent_runs record before calling the backend
    const { data: run } = await serviceClient
      .from('agent_runs')
      .insert({
        user_id: user?.id || null,
        agent_id: agentId,
        status: 'running',
        mode: user ? 'paid' : 'demo',
      })
      .select('id')
      .single()

    // Try backend agent engine first
    const backendUp = await isBackendAvailable()
    if (backendUp) {
      try {
        const res = await backendFetch('/api/agents/chat', {
          method: 'POST',
          body: JSON.stringify({ agent_id: agentId, message }),
        })

        if (res.ok) {
          const data = await res.json()

          // Record successful run
          if (run?.id) {
            await serviceClient
              .from('agent_runs')
              .update({
                status: 'succeeded',
                latency_ms: Date.now() - startTime,
                completed_at: new Date().toISOString(),
              })
              .eq('id', run.id)
          }

          logger.info('Agent chat request', { agentId, userId: user?.id, mode: 'backend', latencyMs: Date.now() - startTime })
          return NextResponse.json({
            agent: data.agent,
            category: data.category,
            response: data.response,
            tool_results: data.tool_results || [],
            source: 'backend',
            timestamp: new Date().toISOString(),
          })
        }
      } catch {
        // Backend call failed — fall through
      }
    }

    // Backend unavailable or returned a non-ok status.
    // Paid users (starter/growth/partner) must not receive demo responses.
    const isPaidUser = user && userPlan !== 'free'
    if (isPaidUser) {
      if (run?.id) {
        await serviceClient
          .from('agent_runs')
          .update({
            status: 'failed',
            latency_ms: Date.now() - startTime,
            completed_at: new Date().toISOString(),
          })
          .eq('id', run.id)
      }
      return NextResponse.json(
        { error: 'Agent service is temporarily unavailable. Please try again shortly. Your usage was not counted.' },
        { status: 503 }
      )
    }

    // Fallback: local demo response for free/unauthenticated users
    const agent = SA_AGENTS.find((a) => a.id === agentId)
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const response = generateDemoResponse(agent.name, agent.category, agent.capabilities, message)

    // Record demo run as succeeded
    if (run?.id) {
      await serviceClient
        .from('agent_runs')
        .update({
          status: 'succeeded',
          latency_ms: Date.now() - startTime,
          completed_at: new Date().toISOString(),
        })
        .eq('id', run.id)
    }

    logger.info('Agent chat request', { agentId, userId: user?.id, mode: 'demo', latencyMs: Date.now() - startTime })
    return NextResponse.json({
      agent: agent.name,
      category: agent.category,
      response,
      mode: 'demo',
      disclaimer: 'This is a demo response. Subscribe to a plan for full AI-powered agent capabilities.',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

function generateDemoResponse(name: string, category: string, capabilities: string[], message: string): string {
  const capList = capabilities.slice(0, 3).join(', ')
  return (
    `[${name} - Demo Mode]\n\n` +
    `As a specialized ${category} agent with capabilities in ${capList}, ` +
    `here is how I can help with your query:\n\n` +
    `"${message.slice(0, 100)}${message.length > 100 ? '...' : ''}"\n\n` +
    `In production mode, I would:\n` +
    `1. Search relevant San Antonio municipal and local resources\n` +
    `2. Provide specific, actionable guidance with source citations\n` +
    `3. Coordinate follow-up steps and track progress\n\n` +
    `This is a demo response. Subscribe to a plan at /pricing for full AI-powered capabilities.\n\n` +
    `Disclaimer: AI agent responses are informational only and should not be treated as ` +
    `professional legal, medical, tax, or official government advice. Always verify with ` +
    `authoritative sources.`
  )
}
