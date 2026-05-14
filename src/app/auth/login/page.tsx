'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Shield, Mail } from 'lucide-react'
import Link from 'next/link'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const supabase = createClient()

  const redirectTo = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback${plan ? `?plan=${plan}` : ''}`

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  const signInWithMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-sm text-gray-500 mb-6">
            We sent a magic link to <span className="font-medium text-gray-900">{email}</span>. Click the link to sign in.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors"
          >
            Try a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center mx-auto mb-4 shadow-md">
            <Shield className="w-6 h-6 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {plan ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-gray-500">
            {plan
              ? `Sign up to start your ${plan === 'pro' ? 'Operator' : 'Commander'} plan`
              : 'Sign in to your agent marketplace'}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => signInWithOAuth('google')}
            disabled={loading}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => signInWithOAuth('github')}
            disabled={loading}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </Button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-gray-400">or use email</span>
          </div>
        </div>

        <form onSubmit={signInWithMagicLink} className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors"
          />
          <Button variant="primary" size="lg" className="w-full" loading={loading}>
            <Mail className="w-4 h-4" /> Send Magic Link
          </Button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <p className="mt-6 text-xs text-gray-400 text-center">
          By signing in, you agree to our{' '}
          <Link href="#" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
            Terms
          </Link>
          {' '}and{' '}
          <Link href="#" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
