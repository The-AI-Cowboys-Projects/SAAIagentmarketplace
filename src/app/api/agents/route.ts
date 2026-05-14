import { NextRequest, NextResponse } from 'next/server'
import { SA_AGENTS } from '@/lib/agents-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let agents = SA_AGENTS

  if (category) {
    agents = agents.filter((a) => a.category.toLowerCase() === category.toLowerCase())
  }

  return NextResponse.json({
    agents,
    total: agents.length,
    categories: ['Civic', 'Business', 'Military', 'Healthcare', 'Tourism'],
  })
}
