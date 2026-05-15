import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const REDIS_CONFIGURED = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)

// Log once at startup if Redis is not configured
if (!REDIS_CONFIGURED) {
  console.warn(
    '[rate-limit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. ' +
    'Using in-memory fallback rate limiter.'
  )
}

function getRedis(): Redis | null {
  if (!REDIS_CONFIGURED) {
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

// ---------------------------------------------------------------------------
// In-memory fallback rate limiter for when Redis is not configured.
// Uses a simple sliding window per key to provide basic protection.
// ---------------------------------------------------------------------------
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

function parseWindow(window: string): number {
  const match = window.match(/^(\d+)([smh])$/)
  if (!match) return 60_000
  const value = parseInt(match[1], 10)
  const unit = match[2]
  if (unit === 's') return value * 1000
  if (unit === 'm') return value * 60_000
  if (unit === 'h') return value * 3600_000
  return 60_000
}

// Fallback limits mirror the Redis limits
const FALLBACK_LIMITS: Record<string, { requests: number; windowMs: number }> = {
  'api:global': { requests: 60, windowMs: parseWindow('1m') },
  'chat:demo': { requests: 5, windowMs: parseWindow('1m') },
  'chat:auth': { requests: 30, windowMs: parseWindow('1m') },
  'contact': { requests: 3, windowMs: parseWindow('1h') },
  'newsletter': { requests: 5, windowMs: parseWindow('1h') },
  'waitlist': { requests: 5, windowMs: parseWindow('1h') },
}

function checkInMemoryLimit(
  prefix: string,
  key: string
): { success: boolean; remaining: number } {
  const limit = FALLBACK_LIMITS[prefix] ?? { requests: 60, windowMs: 60_000 }
  const storeKey = `${prefix}:${key}`
  const now = Date.now()

  const entry = inMemoryStore.get(storeKey)
  if (!entry || now >= entry.resetAt) {
    inMemoryStore.set(storeKey, { count: 1, resetAt: now + limit.windowMs })
    return { success: true, remaining: limit.requests - 1 }
  }

  if (entry.count >= limit.requests) {
    return { success: false, remaining: 0 }
  }

  entry.count++
  return { success: true, remaining: limit.requests - entry.count }
}

// Periodically clean expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of inMemoryStore) {
    if (now >= entry.resetAt) {
      inMemoryStore.delete(key)
    }
  }
}, 60_000)

// ---------------------------------------------------------------------------
// Exported check function
// ---------------------------------------------------------------------------

// Map limiter instances back to their prefix for fallback lookup
const limiterPrefixMap = new WeakMap<Ratelimit, string>()
if (apiGlobalLimit) limiterPrefixMap.set(apiGlobalLimit, 'api:global')
if (chatDemoLimit) limiterPrefixMap.set(chatDemoLimit, 'chat:demo')
if (chatAuthLimit) limiterPrefixMap.set(chatAuthLimit, 'chat:auth')
if (contactLimit) limiterPrefixMap.set(contactLimit, 'contact')
if (newsletterLimit) limiterPrefixMap.set(newsletterLimit, 'newsletter')
if (waitlistLimit) limiterPrefixMap.set(waitlistLimit, 'waitlist')

export async function checkLimit(
  limiter: Ratelimit | null,
  key: string
): Promise<{ success: boolean; remaining?: number }> {
  if (!limiter) {
    // Redis not configured — use in-memory fallback instead of allowing all
    // Determine prefix from context; default to global limit
    return checkInMemoryLimit('api:global', key)
  }
  const result = await limiter.limit(key)
  return { success: result.success, remaining: result.remaining }
}

// Overload that accepts a prefix hint for accurate fallback limiting
export async function checkLimitWithPrefix(
  limiter: Ratelimit | null,
  key: string,
  prefix: string
): Promise<{ success: boolean; remaining?: number }> {
  if (!limiter) {
    return checkInMemoryLimit(prefix, key)
  }
  const result = await limiter.limit(key)
  return { success: result.success, remaining: result.remaining }
}
