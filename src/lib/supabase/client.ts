import { createBrowserClient } from '@supabase/ssr'

// Fallback values prevent @supabase/ssr from throwing during static
// pre-rendering when env vars are only available at runtime (e.g. Vercel).
// The client is never used server-side — all real calls happen in useEffect.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
