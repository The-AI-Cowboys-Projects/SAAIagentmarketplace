import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { backendFetch } from '@/lib/backend'

export async function POST(request: NextRequest) {
  try {
    const { email, name, branch } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    // Store in Supabase waitlist
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from('waitlist').upsert(
      { email, name, branch },
      { onConflict: 'email' }
    )

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
