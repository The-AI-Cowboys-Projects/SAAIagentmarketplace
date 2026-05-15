import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { apiGlobalLimit, checkLimit } from '@/lib/rate-limit'

// ── Single source of truth for CSP ──────────────────────────────────────
// Consolidated from middleware.ts, next.config.js, and vercel.json.
// Changes should ONLY be made here.
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https://zgmvxnghelvcnzgcrmfz.supabase.co https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
  "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ')

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Content-Security-Policy', CSP_DIRECTIVES)
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Rate limiting on API routes ────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { success } = await checkLimit(apiGlobalLimit, ip)
    if (!success) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        )
      )
    }

    // ── CSRF protection on state-changing API routes ─────────────────────
    // Require X-Requested-With header on all POST/PUT/DELETE API calls.
    // Stripe webhooks are excluded (they use signature verification instead).
    if (
      ['POST', 'PUT', 'DELETE'].includes(request.method) &&
      !pathname.startsWith('/api/stripe/webhook') &&
      !pathname.startsWith('/api/cron/')
    ) {
      const xRequestedWith = request.headers.get('x-requested-with')
      if (xRequestedWith !== 'XMLHttpRequest') {
        return addSecurityHeaders(
          NextResponse.json(
            { error: 'Missing required X-Requested-With header' },
            { status: 403 }
          )
        )
      }
    }
  }

  let response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return addSecurityHeaders(response)
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  // Refresh session + protect dashboard
  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return addSecurityHeaders(NextResponse.redirect(loginUrl))
  }

  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images.
     * This ensures security headers (CSP, HSTS) apply to all pages.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
