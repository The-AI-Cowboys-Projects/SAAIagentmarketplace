/**
 * Client-side API helper that automatically includes CSRF protection headers.
 *
 * All client-side fetch calls to /api/* POST/PUT/DELETE endpoints MUST use
 * this helper (or manually include the X-Requested-With header) to pass the
 * CSRF check in middleware.ts.
 */

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers as Record<string, string> || {}),
  }

  return fetch(path, {
    ...options,
    headers,
  })
}
