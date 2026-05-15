'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/**
 * Post-auth completion page.
 *
 * Supabase OAuth strips custom query params from redirectTo URLs, so the
 * login page stores plan/agent intent in localStorage before initiating OAuth.
 * This page reads that intent and either:
 *   - Creates a Stripe Checkout session and redirects to checkout.stripe.com
 *   - Redirects to /agents/X
 *   - Falls back to /dashboard
 */
export default function AuthCompletePage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'checkout' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const plan = localStorage.getItem('auth_plan_intent')
    const agent = localStorage.getItem('auth_agent_intent')

    // Clear immediately so intent is never reused
    localStorage.removeItem('auth_plan_intent')
    localStorage.removeItem('auth_agent_intent')

    if (plan) {
      setStatus('checkout')
      // Create Stripe Checkout session and redirect
      const { apiFetch } = await import('@/lib/api-client')
      apiFetch('/api/stripe/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan, billing: 'monthly' }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data.error || `Checkout failed (${res.status})`)
          }
          return res.json()
        })
        .then((data) => {
          if (data.url) {
            window.location.href = data.url
          } else {
            throw new Error('No checkout URL returned')
          }
        })
        .catch((err) => {
          setStatus('error')
          setErrorMsg(err.message || 'Failed to create checkout session')
        })
    } else if (agent) {
      router.replace(`/agents/${agent}`)
    } else {
      router.replace('/dashboard')
    }
  }, [router])

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            {errorMsg}
          </p>
          <Link
            href="/pricing"
            className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors"
          >
            Return to pricing
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-7 h-7 border-2 border-navy-950 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        {status === 'checkout' && (
          <p className="text-sm text-gray-500">Creating your checkout session...</p>
        )}
      </div>
    </div>
  )
}
