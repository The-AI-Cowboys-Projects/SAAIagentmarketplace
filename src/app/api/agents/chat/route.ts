import { NextRequest, NextResponse } from 'next/server'
import { backendFetch, isBackendAvailable } from '@/lib/backend'
import { createServerSupabase } from '@/lib/supabase/server'
import { SA_AGENTS } from '@/lib/agents-data'
import type { AgentStatus } from '@/lib/types'

// Per-session chat rate limit (simple, per-IP, 10 msgs/min for unauthed)
const chatLimitMap = new Map<string, { count: number; resetAt: number }>()
function isChatRateLimited(key: string, maxPerMin: number): boolean {
  const now = Date.now()
  const entry = chatLimitMap.get(key)
  if (!entry || now > entry.resetAt) {
    chatLimitMap.set(key, { count: 1, resetAt: now + 60_000 })
    return false
  }
  entry.count++
  return entry.count > maxPerMin
}

export async function POST(request: NextRequest) {
  try {
    const { agentId, message } = await request.json()
    if (!agentId || !message) {
      return NextResponse.json({ error: 'agentId and message are required' }, { status: 400 })
    }
    if (typeof message !== 'string' || message.length > 2000) {
      return NextResponse.json({ error: 'Message must be a string under 2000 characters' }, { status: 400 })
    }

    // Auth check — allow demo for unauthed users but with stricter limits
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimitKey = user ? `user:${user.id}` : `ip:${ip}`
    const maxPerMin = user ? 30 : 5

    if (isChatRateLimited(rateLimitKey, maxPerMin)) {
      return NextResponse.json(
        { error: user ? 'Rate limit exceeded. Please slow down.' : 'Demo rate limit reached. Sign in for more access.' },
        { status: 429 }
      )
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
        // Backend call failed — fall through to local mock
      }
    }

    // Fallback: local demo response
    const agent = SA_AGENTS.find((a) => a.id === agentId)
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const response = generateDemoResponse(agent.name, agent.category, agent.capabilities, message)

    return NextResponse.json({
      agent: agent.name,
      category: agent.category,
      response,
      mode: 'demo',
      disclaimer: 'This is a demo response. Subscribe to a plan for full AI-powered agent capabilities.',
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
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
