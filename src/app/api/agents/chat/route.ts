import { NextRequest, NextResponse } from 'next/server'
import { backendFetch, isBackendAvailable } from '@/lib/backend'
import { SA_AGENTS } from '@/lib/agents-data'

export async function POST(request: NextRequest) {
  try {
    const { agentId, message } = await request.json()
    if (!agentId || !message) {
      return NextResponse.json({ error: 'agentId and message are required' }, { status: 400 })
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
