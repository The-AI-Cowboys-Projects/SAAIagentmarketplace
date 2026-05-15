import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { recordStripePayment } from '@/lib/quickbooks'
import { logger } from '@/lib/logger'

const MAX_ATTEMPTS = 5

export async function GET(request: NextRequest) {
  // Verify cron secret — fail closed if not configured
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json(
      { error: 'Cron secret not configured' },
      { status: 503 }
    )
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Graceful degradation: if QBO is not configured, drain jobs as no-ops
  const qboConfigured = !!(process.env.QBO_CLIENT_ID && process.env.QBO_REALM_ID)

  const supabase = createServiceRoleClient()

  // Fetch pending jobs ready for retry
  const { data: jobs, error } = await supabase
    .from('qbo_sync_jobs')
    .select('*')
    .eq('status', 'pending')
    .lte('next_retry_at', new Date().toISOString())
    .lt('attempts', MAX_ATTEMPTS)
    .order('created_at', { ascending: true })
    .limit(10)

  if (error) {
    logger.error('Failed to fetch QBO sync jobs', { error: error.message })
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }

  if (!jobs?.length) {
    return NextResponse.json({ processed: 0, failed: 0, total: 0 })
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
      if (qboConfigured) {
        await recordStripePayment(job.payload)
      } else {
        logger.info('[QBO Cron] QBO not configured, marking job completed without sync', {
          jobId: job.id,
          stripeInvoiceId: job.stripe_invoice_id,
        })
      }

      await supabase.from('qbo_sync_jobs').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      }).eq('id', job.id)
      processed++
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      const nextAttempt = job.attempts + 1
      const isMaxed = nextAttempt >= MAX_ATTEMPTS

      // Exponential backoff: 1m, 5m, 15m, 1h, 6h
      const backoffMs = [60, 300, 900, 3600, 21600][Math.min(nextAttempt - 1, 4)] * 1000
      const nextRetry = new Date(Date.now() + backoffMs).toISOString()

      await supabase.from('qbo_sync_jobs').update({
        status: isMaxed ? 'failed' : 'pending',
        last_error: errMsg.slice(0, 500),
        next_retry_at: nextRetry,
      }).eq('id', job.id)

      logger.error('[QBO Cron] Job failed', {
        jobId: job.id,
        attempt: nextAttempt,
        maxed: isMaxed,
        error: errMsg,
      })
      failed++
    }
  }

  logger.info('[QBO Cron] Batch complete', { processed, failed, total: jobs.length })
  return NextResponse.json({ processed, failed, total: jobs.length })
}
