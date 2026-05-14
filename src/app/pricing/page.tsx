'use client'

/**
 * Pricing page — 3-tier clean layout
 * Starter ($49/mo) | Growth ($149/mo, highlighted) | Partner ($499/mo)
 *
 * Authenticated users: clicking a plan creates a Stripe Checkout session server-side.
 * Unauthenticated users: redirected to login with plan intent preserved.
 */

import { useState, useEffect } from 'react'
import { Check, Shield, Zap, Building2, ChevronDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { clsx } from 'clsx'
import type { User } from '@supabase/supabase-js'

/* ─────────────────────────────────────────────────────────────────────────────
   PLAN DATA
───────────────────────────────────────────────────────────────────────────── */

type Plan = {
  id:           string
  name:         string
  monthlyPrice: number | null   // null = custom
  annualPrice:  number | null   // per month when billed annually
  description:  string
  features:     string[]
  cta:          string
  highlighted:  boolean
  badge?:       string
}

const PLANS: Plan[] = [
  {
    id:           'starter',
    name:         'Starter',
    monthlyPrice: 49,
    annualPrice:  39,
    description:  'For individuals and small teams getting started with AI-powered SA intelligence.',
    features: [
      'All 70 SA agents',
      '1,000 requests per month',
      'Real-time SA data connections',
      'Browser-based access',
      'Email support',
      'Privacy-first design',
    ],
    cta:         'Get Started',
    highlighted: false,
  },
  {
    id:           'growth',
    name:         'Growth',
    monthlyPrice: 149,
    annualPrice:  119,
    description:  'For growing businesses that need full agent access, team collaboration, and analytics.',
    features: [
      'All 70 SA agents unlocked',
      '10,000 requests per month',
      'Priority data refresh cadence',
      'Team seats (up to 5 users)',
      'Priority email and chat support',
      'Privacy-first design',
      'Usage analytics dashboard',
      'Custom agent configuration',
    ],
    cta:         'Get Started',
    highlighted: true,
    badge:       'Recommended',
  },
  {
    id:           'partner',
    name:         'Partner',
    monthlyPrice: 499,
    annualPrice:  399,
    description:  'For organizations that need enterprise-grade scale, security, and dedicated support.',
    features: [
      'All 70 agents, unlimited seats',
      'Unlimited requests',
      'Dedicated account manager',
      'SSO / SAML authentication',
      'Custom data integrations',
      'SLA-backed uptime guarantee',
      'On-prem deployment options',
      'Compliance reporting',
    ],
    cta:         'Contact Sales',
    highlighted: false,
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
   BILLING FAQ
───────────────────────────────────────────────────────────────────────────── */

const BILLING_FAQS = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. You can upgrade, downgrade, or cancel at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, Amex) via Stripe. Partner customers may pay by invoice.',
  },
  {
    q: 'Is there a free trial?',
    a: 'The Starter plan is a low-cost way to evaluate the platform at $49/mo. Contact us if you need a trial of the Growth plan.',
  },
  {
    q: 'How does annual billing work?',
    a: 'You are billed once per year at the discounted rate. Annual plans save approximately 20% compared to monthly billing — Starter drops from $49 to $39/mo, Growth from $149 to $119/mo, and Partner from $499 to $399/mo. You can switch to monthly at the end of your annual term.',
  },
]

function BillingFAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2 mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Billing questions</h2>
      {BILLING_FAQS.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors duration-150"
            aria-expanded={open === i}
          >
            <span className="text-sm font-medium text-gray-900 pr-4">{faq.q}</span>
            <ChevronDown
              className={clsx('w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200', open === i && 'rotate-180')}
              aria-hidden="true"
            />
          </button>
          <div className={clsx('overflow-hidden transition-all duration-200', open === i ? 'max-h-40' : 'max-h-0')}>
            <p className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

const PLAN_ICONS = { starter: Shield, growth: Zap, partner: Building2 }

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [checkoutError, setCheckoutError] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  // Auto-trigger checkout if returning from login with plan intent
  useEffect(() => {
    const plan = searchParams.get('plan') as string | null
    const checkout = searchParams.get('checkout')
    if (user && plan && !checkout && ['starter', 'growth'].includes(plan)) {
      handleCheckout(plan)
    }
  }, [user, searchParams])

  async function handleCheckout(planId: string) {
    if (planId === 'partner') {
      window.location.href = 'mailto:enterprise@aicowboys.com'
      return
    }

    if (!user) {
      // Redirect to login with plan intent — callback will return here
      window.location.href = `/auth/login?plan=${planId}`
      return
    }

    setLoadingPlan(planId)
    setCheckoutError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, billing: annual ? 'annual' : 'monthly' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      if (data.url) window.location.href = data.url
    } catch (err: any) {
      setCheckoutError(err.message)
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">Pricing</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Deploy AI agents built for San Antonio. Start at $49/mo, no hidden fees.
          </p>

          {/* Checkout feedback */}
          {searchParams.get('checkout') === 'success' && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
              <Check className="w-4 h-4" /> Subscription activated! Head to your <Link href="/dashboard" className="font-semibold underline">dashboard</Link>.
            </div>
          )}
          {searchParams.get('checkout') === 'cancelled' && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
              Checkout cancelled. Choose a plan below to try again.
            </div>
          )}
          {checkoutError && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {checkoutError}
            </div>
          )}

          {/* Billing toggle */}
          <div className="inline-flex items-center p-1 rounded-lg bg-gray-100 border border-gray-200">
            <button
              onClick={() => setAnnual(false)}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-150',
                !annual
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              aria-pressed={!annual}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={clsx(
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-2',
                annual
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              aria-pressed={annual}
            >
              Annual
              <span className="text-[11px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {PLANS.map((plan) => {
            const Icon  = PLAN_ICONS[plan.id as keyof typeof PLAN_ICONS] ?? Shield
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            const annualSavings = plan.monthlyPrice && plan.annualPrice
              ? (plan.monthlyPrice - plan.annualPrice) * 12
              : null
            const isLoading = loadingPlan === plan.id

            return (
              <div
                key={plan.id}
                className={clsx(
                  'relative rounded-2xl border p-8 flex flex-col',
                  plan.highlighted
                    ? 'border-navy-950 bg-navy-950 text-white shadow-xl'
                    : 'border-gray-200 bg-white'
                )}
              >
                {/* Recommended badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-brand-500 text-navy-950 text-xs font-bold whitespace-nowrap shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={clsx(
                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                    plan.highlighted ? 'bg-white/10' : 'bg-navy-50 border border-navy-100'
                  )}>
                    <Icon className={clsx('w-4 h-4', plan.highlighted ? 'text-white' : 'text-navy-700')} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className={clsx('text-base font-bold', plan.highlighted ? 'text-white' : 'text-gray-900')}>
                      {plan.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className={clsx('text-sm leading-relaxed mb-6', plan.highlighted ? 'text-navy-200' : 'text-gray-500')}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  {price !== null ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className={clsx('text-4xl font-extrabold tabular-nums', plan.highlighted ? 'text-white' : 'text-gray-900')}>
                          ${price}
                        </span>
                        <span className={clsx('text-sm', plan.highlighted ? 'text-navy-300' : 'text-gray-400')}>
                          /mo{annual ? ' billed annually' : ''}
                        </span>
                      </div>
                      {annual && annualSavings !== null && (
                        <p className="text-xs text-green-400 mt-1 font-medium">
                          You save ${annualSavings}/year
                        </p>
                      )}
                    </>
                  ) : (
                    <div className={clsx('text-3xl font-extrabold', plan.highlighted ? 'text-white' : 'text-gray-900')}>
                      Custom
                    </div>
                  )}
                </div>

                {/* CTA — creates Stripe checkout for authenticated users */}
                <button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isLoading}
                  className={clsx(
                    'w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-colors duration-150 mb-7 disabled:opacity-60',
                    plan.highlighted
                      ? 'bg-white text-navy-950 hover:bg-gray-100'
                      : 'bg-navy-950 text-white hover:bg-navy-800'
                  )}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {plan.cta}
                </button>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <Check
                        className={clsx('w-4 h-4 mt-0.5 shrink-0', plan.highlighted ? 'text-brand-400' : 'text-green-600')}
                        aria-hidden="true"
                      />
                      <span className={clsx('text-sm', plan.highlighted ? 'text-navy-100' : 'text-gray-600')}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Universal inclusions note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400">
            All plans include end-to-end encryption, 24/7 availability, and browser-based access.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Need enterprise-grade scale?{' '}
            <a href="mailto:enterprise@aicowboys.com" className="text-navy-700 hover:text-navy-950 font-medium underline underline-offset-2">
              Contact us
            </a>
            {' '}for the Partner plan and custom pricing.
          </p>
        </div>

        {/* Billing FAQ */}
        <BillingFAQ />

      </div>
    </div>
  )
}
