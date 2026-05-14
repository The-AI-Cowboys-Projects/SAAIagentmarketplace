import { NextRequest, NextResponse } from 'next/server'
import { SA_AGENTS } from '@/lib/agents-data'

export async function POST(request: NextRequest) {
  try {
    const { agentId, message } = await request.json()
    if (!agentId || !message) {
      return NextResponse.json({ error: 'agentId and message are required' }, { status: 400 })
    }

    const agent = SA_AGENTS.find((a) => a.id === agentId)
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Generate contextual mock response
    const response = generateResponse(agent.name, agent.category, agent.capabilities, message)

    return NextResponse.json({
      agent: agent.name,
      category: agent.category,
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

function generateResponse(name: string, category: string, capabilities: string[], message: string): string {
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
