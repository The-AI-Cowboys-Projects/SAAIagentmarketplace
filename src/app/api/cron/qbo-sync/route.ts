import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { recordStripePayment } from '@/lib/quickbooks'

// Protect with a cron secret — only callable by Vercel Cron or admin
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  // Verify cron secret — fail closed if not configured
  if (!CRON_SECRET) {
    return NextResponse.json(
      { error: 'Cron secret not configured' },
      { status: 503 }
    )
  }
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceRoleClient()

  // Fetch pending jobs ready for retry
  const { data: jobs, error } = await supabase
    .from('qbo_sync_jobs')
    .select('*')
    .eq('status', 'pending')
    .lte('next_retry_at', new Date().toISOString())
    .lt('attempts', 5)
    .order('created_at', { ascending: true })
    .limit(10)

  if (error || !jobs?.length) {
    return NextResponse.json({ processed: 0 })
  }

  let processed = 0
  let failed = 0

  for (const job of jobs) {
    // Mark as processing
    await supabase.from('qbo_sync_jobs').update({
      status: 'processing',
      attempts: job.attempts + 1,
    }).eq('id', job.id)

    try {
      await recordStripePayment(job.payload)

      // Mark completed
      await supabase.from('qbo_sync_jobs').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      }).eq('id', job.id)
      processed++
    } catch (err: any) {
      const nextAttempt = job.attempts + 1
      const isMaxed = nextAttempt >= job.max_attempts

      // Exponential backoff: 1m, 5m, 15m, 1h, 6h
      const backoffMs = [60, 300, 900, 3600, 21600][Math.min(nextAttempt - 1, 4)] * 1000
      const nextRetry = new Date(Date.now() + backoffMs).toISOString()

      await supabase.from('qbo_sync_jobs').update({
        status: isMaxed ? 'failed' : 'pending',
        error_message: err.message?.slice(0, 500),
        next_retry_at: nextRetry,
      }).eq('id', job.id)
      failed++
    }
  }

  return NextResponse.json({ processed, failed, total: jobs.length })
}
