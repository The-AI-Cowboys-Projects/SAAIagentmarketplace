/**
 * CTA.tsx — Clean navy call-to-action section
 *
 * Usage:
 *   import { CTA } from '@/components/home/CTA'
 *   <CTA />
 */

import Link from 'next/link'
import { ArrowRight, Shield, CheckCircle2, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const TRUST_BADGES = [
  { icon: Shield,       label: 'Zero Data Retention' },
  { icon: CheckCircle2, label: 'SA Built'             },
  { icon: Users,        label: '10,000+ Users'        },
  { icon: CheckCircle2, label: 'Texas Trusted'        },
]

export function CTA() {
  return (
    <section className="py-20 lg:py-28 bg-navy-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Eyebrow */}
        <p className="text-xs font-semibold text-navy-300 uppercase tracking-widest mb-6">
          Get Started
        </p>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
          Ready to deploy your AI agent?
        </h2>

        {/* Subhead */}
        <p className="text-lg text-navy-300 max-w-xl mx-auto mb-10 leading-relaxed">
          Save hours on permits, claims, bookings, and more. Join 10,000+ San Antonians
          who already use these agents every day.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link href="/auth/login">
            <Button
              variant="primary"
              size="xl"
              className="group"
              aria-label="Get started with SA AI Agent Marketplace"
            >
              Get Started
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-150"
                aria-hidden="true"
              />
            </Button>
          </Link>

          <Link href="/agents">
            <Button
              variant="outline"
              size="xl"
              className="border-navy-700 text-navy-200 hover:border-navy-500 hover:text-white"
            >
              Browse 60 Agents
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="border-t border-navy-800 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon
              return (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-800"
                >
                  <Icon className="w-3.5 h-3.5 text-navy-400" aria-hidden="true" />
                  <span className="text-xs font-medium text-navy-300">{badge.label}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
