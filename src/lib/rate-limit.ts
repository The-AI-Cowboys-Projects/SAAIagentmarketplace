import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Graceful fallback — if Redis is not configured, allow all requests
// This prevents the app from breaking in development or if Redis is down
function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  return Redis.fromEnv()
}

const redis = getRedis()

function createLimiter(prefix: string, requests: number, window: string) {
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as any),
    analytics: true,
    prefix: `rl:${prefix}`,
  })
}

export const apiGlobalLimit = createLimiter('api:global', 60, '1m')
export const chatDemoLimit = createLimiter('chat:demo', 5, '1m')
export const chatAuthLimit = createLimiter('chat:auth', 30, '1m')
export const contactLimit = createLimiter('contact', 3, '1h')
export const newsletterLimit = createLimiter('newsletter', 5, '1h')
export const waitlistLimit = createLimiter('waitlist', 5, '1h')

export async function checkLimit(
  limiter: Ratelimit | null,
  key: string
): Promise<{ success: boolean; remaining?: number }> {
  if (!limiter) return { success: true } // Redis not configured — allow
  const result = await limiter.limit(key)
  return { success: result.success, remaining: result.remaining }
}
