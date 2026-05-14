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

    // Fallback: local mock response
    const agent = SA_AGENTS.find((a) => a.id === agentId)
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const response = generateMockResponse(agent.name, agent.category, agent.capabilities, message)

    return NextResponse.json({
      agent: agent.name,
      category: agent.category,
      response,
      source: 'mock',
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

function generateMockResponse(name: string, category: string, capabilities: string[], message: string): string {
  const capList = capabilities.slice(0, 3).join(', ')
  return (
    `[${name}] I've analyzed your request using San Antonio local data. ` +
    `As a specialized ${category} agent with capabilities in ${capList}, here's what I found:\n\n` +
    `Based on your query "${message.slice(0, 100)}${message.length > 100 ? '...' : ''}", ` +
    `I recommend the following actions:\n` +
    `1. Review the relevant San Antonio municipal resources\n` +
    `2. Contact the appropriate local department for verification\n` +
    `3. Follow up within 5-7 business days for status updates\n\n` +
    `This response is generated in demo mode. Full autonomous agent capabilities ` +
    `will be available when the platform connects to live LLM APIs.`
  )
}
