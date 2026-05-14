import { NextRequest, NextResponse } from 'next/server'
import { backendFetch, isBackendAvailable } from '@/lib/backend'
import { SA_AGENTS, SA_CATEGORIES } from '@/lib/agents-data'

const CATEGORIES = SA_CATEGORIES.map((c) => c.id)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  // Try backend first for live agent catalog
  const backendUp = await isBackendAvailable()
  if (backendUp) {
    try {
      const path = category ? `/api/agents?category=${encodeURIComponent(category)}` : '/api/agents'
      const res = await backendFetch(path)

      if (res.ok) {
        const agents = await res.json()
        return NextResponse.json({
          agents,
          total: agents.length,
          source: 'backend',
          categories: CATEGORIES,
        })
      }
    } catch {
      // Fall through to static data
    }
  }

  // Fallback: static agent data
  let agents = SA_AGENTS
  if (category) {
    agents = agents.filter((a) => a.category.toLowerCase() === category.toLowerCase())
  }

  return NextResponse.json({
    agents,
    total: agents.length,
    source: 'static',
    categories: CATEGORIES,
  })
}
