'use client'

/**
 * Hero.tsx — Clean, conversion-focused hero for SA Agent Marketplace
 *
 * Usage:
 *   import { Hero } from '@/components/home/Hero'
 *   <Hero />
 *
 * Design: Light background, strong typography, two CTAs, stats strip.
 * No framer-motion, no particles, no typewriter. CSS transitions only.
 */

import Link from 'next/link'
import { ArrowRight, Bot, Shield, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const STATS = [
  { value: '70',    label: 'AI Agents',  icon: Bot    },
  { value: '5',     label: 'Categories', icon: Shield },
  { value: '10K+',  label: 'Users',      icon: Users  },
  { value: '99.9%', label: 'Uptime',     icon: Zap    },
]

export function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern-light pointer-events-none" aria-hidden="true" />

      {/* Very light navy tint at top */}
      <div
        className="absolute inset-x-0 top-0 h-[480px] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,33,69,0.03) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-20 lg:pb-28">
        <div className="max-w-3xl mx-auto text-center">

          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-navy-200 bg-navy-50 text-navy-700 text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
            Now Live — 70 Agents Across 5 Categories
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6">
            AI Agents Built for{' '}
            <span className="text-navy-950">San Antonio</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Automate permits, VA claims, bookings, and more — with agents trained on local San Antonio data.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Link href="/agents">
              <Button
                variant="primary"
                size="xl"
                className="group"
                aria-label="Browse all AI agents"
              >
                Browse Agents
                <ArrowRight
                  className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-150"
                  aria-hidden="true"
                />
              </Button>
            </Link>

            <Link href="/pricing">
              <Button variant="outline" size="xl">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Trust micro-copy */}
          <p className="text-sm text-gray-400 mb-16">
            Starting at $49/mo — deploy in under 60 seconds
          </p>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 py-5 px-4 bg-surface-50 border border-gray-200 rounded-xl"
              >
                <div className="w-9 h-9 rounded-lg bg-navy-950 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div className="text-2xl font-extrabold text-gray-900 tabular-nums leading-none">
                  {value}
                </div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gray-100" aria-hidden="true" />
    </section>
  )
}
