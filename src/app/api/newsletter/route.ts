import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { newsletterLimit, checkLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { success: newsletterAllowed } = await checkLimit(newsletterLimit, ip)
    if (!newsletterAllowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const { error } = await supabase.from('waitlist').upsert(
      { email: email.toLowerCase().trim(), name: null, branch: 'newsletter' },
      { onConflict: 'email' }
    )

    if (error) {
      console.error('[newsletter] Supabase error:', error.message)
      return NextResponse.json({ error: 'Unable to subscribe. Please try again.' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
