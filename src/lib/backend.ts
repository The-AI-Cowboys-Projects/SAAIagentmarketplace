/**
 * Backend API client — proxies requests from Next.js API routes to the FastAPI backend.
 *
 * The backend runs as a separate service (default: http://localhost:8000).
 * All calls include the BACKEND_API_KEY header for service-to-service auth.
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''

/** Default timeout for backend requests (10 seconds). */
const DEFAULT_TIMEOUT_MS = 10_000

export async function backendFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${BACKEND_URL}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(BACKEND_API_KEY ? { 'x-api-key': BACKEND_API_KEY } : {}),
    ...(options.headers as Record<string, string> || {}),
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    return await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

export async function backendJSON<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await backendFetch(path, options)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Backend ${res.status}: ${body}`)
  }
  return res.json()
}

// ── Cached backend availability check ────────────────────────────────────
// Avoids making a health check on every single API request. Caches the
// result for CACHE_TTL_MS before re-checking.
const CACHE_TTL_MS = 30_000 // 30 seconds
let _cachedAvailable: boolean | null = null
let _cacheExpiry = 0

export async function isBackendAvailable(): Promise<boolean> {
  const now = Date.now()
  if (_cachedAvailable !== null && now < _cacheExpiry) {
    return _cachedAvailable
  }

  try {
    const res = await backendFetch('/health', { method: 'GET' })
    _cachedAvailable = res.ok
  } catch {
    _cachedAvailable = false
  }

  _cacheExpiry = now + CACHE_TTL_MS
  return _cachedAvailable
}
