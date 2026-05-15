import { NextResponse } from 'next/server'
import { isBackendAvailable } from '@/lib/backend'

export async function GET() {
  const backendUp = await isBackendAvailable()

  return NextResponse.json({
    status: 'ok',
    frontend: 'ok',
    backend: backendUp ? 'ok' : 'unavailable',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
  })
}
