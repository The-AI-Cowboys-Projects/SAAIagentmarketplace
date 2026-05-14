import { NextResponse } from 'next/server'
import { isBackendAvailable } from '@/lib/backend'

export async function GET() {
  const backendUp = await isBackendAvailable()

  return NextResponse.json({
    status: 'ok',
    frontend: 'ok',
    backend: backendUp ? 'ok' : 'unavailable',
    timestamp: new Date().toISOString(),
  })
}
