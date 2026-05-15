import { NextResponse } from 'next/server'
import { isBackendAvailable } from '@/lib/backend'

export async function GET() {
  const backendUp = await isBackendAvailable()
  const supabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const stripeConfigured = !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET)

  return NextResponse.json({
    status: 'ok',
    frontend: 'ok',
    backend: backendUp ? 'ok' : 'unavailable',
    supabase: supabaseConfigured ? 'configured' : 'missing',
    stripe: stripeConfigured ? 'configured' : 'missing',
    version: process.env.npm_package_version || '1.0.0',
    region: process.env.VERCEL_REGION || 'unknown',
    timestamp: new Date().toISOString(),
  })
}
