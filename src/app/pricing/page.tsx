'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Shield, Star, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SA_PLANS } from '@/lib/agents-data'
import type { Plan } from '@/lib/types'
import { clsx } from 'clsx'
import Link from 'next/link'

const planIcons: Record<string, typeof Shield> = { basic: Shield, pro: Zap, bundles: Star, enterprise: Building2 }
const planColors: Record<string, { ring: string; bg: string; icon: string; badge: string }> = {
  basic: { ring: 'ring-emerald-500/20', bg: 'from-emerald-500/10', icon: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  pro: { ring: 'ring-brand-500/30', bg: 'from-brand-500/10', icon: 'text-brand-400', badge: 'bg-brand-500/10 text-brand-400 border-brand-500/20' },
  bundles: { ring: 'ring-sky-500/20', bg: 'from-sky-500/10', icon: 'text-sky-400', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  enterprise: { ring: 'ring-violet-500/20', bg: 'from-violet-500/10', icon: 'text-violet-400', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
}

export default function PricingPage() {
  const plans = SA_PLANS
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Choose Your <span className="gradient-text">Plan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-midnight-400 max-w-xl mx-auto mb-8"
          >
            Start free with 9 core San Antonio agents. Upgrade for the full platform.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]"
          >
            <button
              onClick={() => setAnnual(false)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                !annual ? 'bg-brand-500/10 text-brand-400' : 'text-midnight-400 hover:text-white'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                annual ? 'bg-brand-500/10 text-brand-400' : 'text-midnight-400 hover:text-white'
              )}
            >
              Annual <span className="text-emerald-400 text-xs ml-1">Save 20%</span>
            </button>
          </motion.div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan, i) => {
            const colors = planColors[plan.id] || planColors.basic
            const Icon = planIcons[plan.id] || Shield
            const price = annual ? plan.annual_price : plan.monthly_price
            const isHighlighted = plan.highlighted

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className={clsx(
                  'relative rounded-2xl border backdrop-blur-sm',
                  isHighlighted
                    ? 'border-brand-500/30 bg-gradient-to-b from-brand-500/5 to-transparent ring-1 ring-brand-500/10 scale-105 z-10'
                    : 'border-white/[0.06] bg-white/[0.02]'
                )}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-brand-500 text-midnight-950 text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.badge} border flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-midnight-500">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        {price === 0 ? '$0' : `$${(price / 100).toFixed(0)}`}
                      </span>
                      {price > 0 && <span className="text-sm text-midnight-500">/{annual ? 'yr' : 'mo'}</span>}
                    </div>
                    {price > 0 && annual && (
                      <p className="text-xs text-emerald-400 mt-1">
                        ${((plan.monthly_price * 12 - plan.annual_price) / 100).toFixed(0)} saved annually
                      </p>
                    )}
                  </div>

                  <Link href={plan.id === 'basic' ? '/auth/login' : plan.id === 'enterprise' ? 'mailto:enterprise@aicowboys.com' : `/auth/login?plan=${plan.id}`}>
                    <Button
                      variant={isHighlighted ? 'primary' : 'outline'}
                      size="lg"
                      className="w-full mb-6"
                    >
                      {plan.id === 'basic' ? 'Get Started Free' : plan.id === 'enterprise' ? 'Contact Sales' : `Subscribe to ${plan.name}`}
                    </Button>
                  </Link>

                  <div className="space-y-3">
                    {(plan.features as string[]).map((feature, j) => (
                      <div key={j} className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${colors.icon}`} />
                        <span className="text-sm text-midnight-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Comparison detail */}
        <div className="mt-16 text-center">
          <p className="text-sm text-midnight-500">
            All plans include: End-to-end encryption, 24/7 availability, browser-based access, and mobile support.
          </p>
          <p className="text-sm text-midnight-500 mt-2">
            Enterprise customers: <a href="mailto:enterprise@aicowboys.com" className="text-brand-400 hover:text-brand-300">Contact us</a> for custom pricing, SSO, and dedicated support.
          </p>
        </div>
      </div>
    </div>
  )
}
