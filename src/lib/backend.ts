/**
 * Backend API client — proxies requests from Next.js API routes to the FastAPI backend.
 *
 * The backend runs as a separate service (default: http://localhost:8000).
 * All calls include the BACKEND_API_KEY header for service-to-service auth.
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''

export async function backendFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${BACKEND_URL}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(BACKEND_API_KEY ? { 'x-api-key': BACKEND_API_KEY } : {}),
    ...(options.headers as Record<string, string> || {}),
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

export async function backendJSON<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await backendFetch(path, options)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Backend ${res.status}: ${body}`)
  }
  return res.json()
}

export async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await backendFetch('/health', { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}
