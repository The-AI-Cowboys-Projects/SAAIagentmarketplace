import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { backendFetch } from '@/lib/backend'

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>()
const MAX_REQUESTS = 5
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = RATE_LIMIT.get(ip)
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_REQUESTS) return false
  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { email, name, branch } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const sanitizedName = typeof name === 'string' ? name.slice(0, 100).trim() : null
    const sanitizedBranch = typeof branch === 'string' ? branch.slice(0, 50).trim() : null

    // Store in Supabase waitlist
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from('waitlist').upsert(
      { email: email.toLowerCase().trim(), name: sanitizedName, branch: sanitizedBranch },
      { onConflict: 'email' }
    )

    if (error) {
      console.error('[waitlist] Supabase error:', error.message)
      return NextResponse.json({ error: 'Unable to join waitlist. Please try again.' }, { status: 500 })
    }

    // Also submit to backend lead scoring (fire-and-forget)
    const [firstName = '', ...rest] = (name || '').split(' ')
    backendFetch('/api/leads', {
      method: 'POST',
      body: JSON.stringify({
        first_name: firstName || 'Unknown',
        last_name: rest.join(' ') || 'Unknown',
        email,
        use_case: branch || 'waitlist',
        search_keywords: branch || '',
      }),
    }).catch(() => {}) // Non-fatal — Supabase is the primary store

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
