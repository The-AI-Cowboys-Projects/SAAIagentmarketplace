'use client'

/**
 * Hero.tsx — Premium landing hero for SA Agent Marketplace
 *
 * Usage:
 *   import { Hero } from '@/components/home/Hero'
 *   <Hero />
 *
 * Visual features:
 *  - SVG constellation / network background (animated, pure CSS)
 *  - Typewriter cycling through SA service categories
 *  - Counting-up stats with IntersectionObserver trigger
 *  - Animated trust marquee with SA callouts
 *  - Floating trust badges
 *  - Animated gradient CTA buttons
 *  - Fake terminal preview with typed output
 */

import { motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  Zap,
  Shield,
  Users,
  Bot,
  Terminal,
  CheckCircle2,
  Lock,
  Star,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useEffect, useRef, useState, useCallback } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */

const TYPEWRITER_WORDS = [
  'Permits',
  'VA Claims',
  'Restaurant Bookings',
  'Healthcare',
  'Business Licenses',
  'Transit Planning',
  'Hotel Deals',
]

const STATS = [
  { end: 60,  suffix: '',   label: 'AI Agents',   icon: Bot,    color: 'text-brand-400' },
  { end: 5,   suffix: '',   label: 'Categories',   icon: Shield, color: 'text-tactical-400' },
  { end: 10,  suffix: 'K+', label: 'Users',        icon: Users,  color: 'text-amber-400' },
  { end: 99,  suffix: '.9%', label: 'Uptime',      icon: Zap,    color: 'text-blue-400' },
]

const BADGES = [
  { label: 'San Antonio Built',     icon: Star,         delay: '0s',    top: '12%', left: '4%',   rotate: '-6deg' },
  { label: 'Texas Trusted',         icon: Shield,       delay: '1.3s',  top: '18%', right: '3%',  rotate: '4deg'  },
  { label: 'Zero Data Retention',   icon: CheckCircle2, delay: '2.1s',  bottom: '28%', left: '2%', rotate: '-3deg' },
  { label: '3-Click Deploy',        icon: Lock,         delay: '0.7s',  bottom: '22%', right: '2%', rotate: '5deg' },
]

const TERMINAL_LINES = [
  { text: '> Initializing Riverwalk Concierge agent...', delay: 0,    color: 'text-tactical-400' },
  { text: '> Loading SA restaurant database...', delay: 600,   color: 'text-midnight-400' },
  { text: '> Checking real-time availability...', delay: 1100,  color: 'text-midnight-400' },
  { text: '> Finding top-rated spots near you...', delay: 1700,  color: 'text-midnight-400' },
  { text: '> [████████████████] 100%', delay: 2400,  color: 'text-brand-400' },
  { text: '> 5 restaurants found. Reservations available tonight.', delay: 2900,  color: 'text-white' },
  { text: '> Booking confirmed at Biga on the Banks, 7:30 PM', delay: 3500,  color: 'text-tactical-400' },
]

const MARQUEE_ITEMS = [
  { label: 'Civic Services' },
  { label: 'Small Business' },
  { label: 'JBSA Military' },
  { label: 'Healthcare' },
  { label: 'Tourism & Hospitality' },
  { label: 'River Walk' },
  { label: 'The Alamo' },
  { label: 'Hill Country' },
]

/* ─────────────────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────────────────── */

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pause)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), speed / 2)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, wordIndex, words, speed, pause])

  return displayed
}

function useCountUp(end: number, duration = 1800, shouldStart: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [end, duration, shouldStart])

  return count
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

/** Animated SVG constellation background */
function ConstellationBg() {
  // Static node positions (deterministic — no random at render time)
  const nodes = [
    { cx: 8,  cy: 15 }, { cx: 22, cy: 8  }, { cx: 38, cy: 22 }, { cx: 55, cy: 10 },
    { cx: 70, cy: 18 }, { cx: 85, cy: 8  }, { cx: 92, cy: 30 }, { cx: 78, cy: 38 },
    { cx: 62, cy: 45 }, { cx: 45, cy: 40 }, { cx: 30, cy: 50 }, { cx: 15, cy: 42 },
    { cx: 5,  cy: 58 }, { cx: 20, cy: 68 }, { cx: 35, cy: 62 }, { cx: 50, cy: 72 },
    { cx: 65, cy: 60 }, { cx: 80, cy: 70 }, { cx: 95, cy: 55 }, { cx: 88, cy: 82 },
    { cx: 72, cy: 88 }, { cx: 58, cy: 85 }, { cx: 42, cy: 90 }, { cx: 25, cy: 80 },
    { cx: 10, cy: 85 }, { cx: 3,  cy: 72 },
  ]

  // Edges between nearby nodes
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],
    [10,11],[11,0],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],
    [17,18],[18,19],[19,20],[20,21],[21,22],[22,23],[23,24],[24,25],
    [2,9],[3,8],[4,7],[5,18],[8,15],[9,14],[10,13],[16,21],[17,20],
    [1,10],[6,19],[7,16],
  ]

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(245,158,11,0.8)" />
          <stop offset="100%" stopColor="rgba(245,158,11,0)" />
        </radialGradient>
      </defs>

      {/* Edges */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="rgba(245,158,11,0.07)"
          strokeWidth="0.15"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.04;0.12;0.04"
            dur={`${4 + (i % 5)}s`}
            repeatCount="indefinite"
            begin={`${(i * 0.3) % 3}s`}
          />
        </line>
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          {/* Outer glow halo */}
          <circle cx={n.cx} cy={n.cy} r="0.6" fill="rgba(245,158,11,0.05)">
            <animate
              attributeName="r"
              values="0.4;0.9;0.4"
              dur={`${3 + (i % 4)}s`}
              repeatCount="indefinite"
              begin={`${(i * 0.4) % 3}s`}
            />
          </circle>
          {/* Core dot */}
          <circle cx={n.cx} cy={n.cy} r="0.22" fill="rgba(245,158,11,0.5)">
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur={`${2.5 + (i % 3)}s`}
              repeatCount="indefinite"
              begin={`${(i * 0.25) % 2}s`}
            />
          </circle>
        </g>
      ))}

      {/* Travelling pulse dots along a few edges */}
      {[[0,1],[3,8],[6,19],[10,13]].map(([a,b],i) => (
        <circle key={`pulse-${i}`} r="0.3" fill="rgba(245,158,11,0.7)">
          <animateMotion
            dur={`${5 + i * 2}s`}
            repeatCount="indefinite"
            begin={`${i * 1.5}s`}
          >
            <mpath href={`#edge-path-${i}`} />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.9;0" dur={`${5 + i * 2}s`} repeatCount="indefinite" begin={`${i * 1.5}s`} />
        </circle>
      ))}
      {/* Define paths for travelling pulses */}
      {[[0,1],[3,8],[6,19],[10,13]].map(([a,b],i) => (
        <path
          key={`ep-${i}`}
          id={`edge-path-${i}`}
          d={`M${nodes[a].cx},${nodes[a].cy} L${nodes[b].cx},${nodes[b].cy}`}
          fill="none"
          stroke="none"
        />
      ))}
    </svg>
  )
}

/** Individual counting stat card */
function StatCard({ stat, shouldCount }: { stat: typeof STATS[0]; shouldCount: boolean }) {
  const count = useCountUp(stat.end, 1600, shouldCount)
  const Icon = stat.icon

  return (
    <div className="glass-premium p-5 text-center group cursor-default">
      <div className="relative inline-flex items-center justify-center mb-3">
        <div className={`w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${stat.color}`} />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums mb-1">
        {count}{stat.suffix}
      </div>
      <div className="text-xs sm:text-sm text-midnight-400 font-medium">{stat.label}</div>
    </div>
  )
}

/** Terminal mockup with typing animation */
function TerminalPreview() {
  const [visibleLines, setVisibleLines] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (inView && !started) setStarted(true)
  }, [inView, started])

  useEffect(() => {
    if (!started) return
    const timers = TERMINAL_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [started])

  return (
    <div ref={ref} className="relative w-full max-w-lg mx-auto mt-14">
      {/* Terminal chrome */}
      <div className="glass-premium overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-tactical-500/70" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-midnight-500 font-mono">sa-agent — riverwalk-concierge-v1</span>
          </div>
          <Terminal className="w-3.5 h-3.5 text-midnight-600" />
        </div>

        {/* Terminal body */}
        <div className="p-4 font-mono text-xs leading-relaxed min-h-[180px]">
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={`${line.color} mb-1 terminal-line`}>
              {line.text}
            </div>
          ))}
          {visibleLines < TERMINAL_LINES.length && (
            <span className="inline-block w-2 h-3.5 bg-brand-400 opacity-80 animate-pulse ml-0.5 align-bottom" />
          )}
        </div>
      </div>

      {/* Glow beneath terminal */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-brand-500/10 blur-2xl rounded-full pointer-events-none" />
    </div>
  )
}

/** Compliance badge */
function FloatingBadge({
  label,
  icon: Icon,
  delay,
  style,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  delay: string
  style: React.CSSProperties
}) {
  return (
    <div
      className="hidden xl:flex absolute items-center gap-2 px-3 py-2 rounded-full
                 bg-midnight-900/90 border border-white/[0.08] backdrop-blur-md
                 text-xs font-medium text-midnight-200 shadow-xl floating-badge
                 select-none pointer-events-none"
      style={{ '--float-delay': delay, ...style } as React.CSSProperties}
    >
      <Icon className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
      {label}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */

export function Hero() {
  const typedWord = useTypewriter(TYPEWRITER_WORDS)
  const statsRef  = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  // Stagger animation variants
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden scan-lines">

      {/* ── Layered backgrounds ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-60" />

      {/* Constellation */}
      <div className="absolute inset-0 opacity-70">
        <ConstellationBg />
      </div>

      {/* Soft orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full
                   bg-brand-500/[0.06] blur-[140px] animate-pulse-slow pointer-events-none"
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full
                   bg-amber-500/[0.05] blur-[120px] animate-pulse-slow pointer-events-none"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full
                   bg-tactical-500/[0.04] blur-[100px] animate-pulse-slow pointer-events-none"
        style={{ animationDelay: '4s' }}
      />

      {/* Floating compliance badges */}
      {BADGES.map((b) => (
        <FloatingBadge
          key={b.label}
          label={b.label}
          icon={b.icon}
          delay={b.delay}
          style={{
            top:     b.top,
            left:    b.left,
            right:   b.right,
            bottom:  b.bottom,
            transform: `rotate(${b.rotate})`,
          }}
        />
      ))}

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >

          {/* Live badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2.5 mb-8">
            <div
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-full
                         bg-brand-500/[0.08] border border-brand-500/20
                         hover:border-brand-500/40 transition-colors duration-300 cursor-default"
            >
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span className="pulse-ring" />
                <span className="relative w-2 h-2 rounded-full bg-brand-400" />
              </div>
              <span className="text-sm text-brand-300 font-medium">
                Now Live &mdash; 60 Agents Across 5 Categories
              </span>
              <span className="hidden sm:flex items-center gap-1 text-xs text-midnight-500 border-l border-white/[0.08] pl-2.5 ml-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tactical-400 inline-block" />
                99.9% uptime
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.08] mb-5"
          >
            <span className="text-white">San Antonio&apos;s AI Agent Marketplace</span>
            <br />
            <span className="gradient-text text-glow inline-flex items-baseline gap-0">
              {typedWord || '\u00A0'}
              <span className="typewriter-cursor" />
            </span>
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-midnight-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            60 specialized AI agents for SA residents, businesses, veterans, healthcare, and tourism.
            <span className="text-midnight-200"> Texas-Trusted AI, built by The AI Cowboys.</span>
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            {/* Primary CTA with animated border wrap */}
            <div className="animated-border rounded-2xl p-[1px]">
              <Link href="/agents">
                <Button
                  variant="primary"
                  size="xl"
                  className="!rounded-[14px] hover:scale-[1.03] transition-transform duration-200 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2.5">
                    Browse All Agents
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Secondary CTA */}
            <Link href="/pricing">
              <Button
                variant="outline"
                size="xl"
                className="hover:scale-[1.03] transition-transform duration-200 hover:shadow-lg hover:shadow-brand-500/10"
              >
                <ChevronRight className="w-4 h-4 opacity-50" />
                View Pricing
              </Button>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p variants={item} className="text-xs text-midnight-600 mb-14">
            Free tier available &mdash; 9 core agents, no credit card required
          </motion.p>

          {/* Stats grid */}
          <motion.div
            ref={statsRef}
            variants={item}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-12"
          >
            {STATS.map((stat) => (
              <StatCard key={stat.label} stat={stat} shouldCount={statsInView} />
            ))}
          </motion.div>

          {/* Terminal preview */}
          <motion.div variants={item}>
            <TerminalPreview />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Trust marquee ticker ─────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 py-4 border-t border-white/[0.04] bg-midnight-950/60 backdrop-blur-sm">
        <p className="text-center text-[10px] uppercase tracking-[0.18em] text-midnight-600 mb-2 font-medium">
          Trusted by San Antonians across every category
        </p>
        <div className="marquee-track">
          <div className="marquee-content">
            {/* Render the list twice so the scroll loops seamlessly */}
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-6 text-sm text-midnight-400 font-medium whitespace-nowrap"
              >
                <Shield className="w-3 h-3 text-brand-500/60 flex-shrink-0" />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to blend with next section */}
      <div className="absolute bottom-[60px] left-0 right-0 h-24 bg-gradient-to-t from-midnight-950/0 to-transparent pointer-events-none" />
    </section>
  )
}
