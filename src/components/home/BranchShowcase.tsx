'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Category style config — replaces military branch styles
type CategoryKey = 'CIVIC' | 'BUSINESS' | 'MILITARY' | 'HEALTHCARE' | 'TOURISM'

const CATEGORY_STYLE: Record<
  CategoryKey,
  { gradient: string; glow: string; border: string; borderHover: string; pillBorder: string; pillBg: string; color: string; icon: string; label: string }
> = {
  CIVIC: {
    gradient: 'from-blue-500/8 via-transparent to-transparent',
    glow: 'shadow-blue-500/20',
    border: 'border-blue-500/10',
    borderHover: 'group-hover:border-blue-400/40',
    pillBorder: 'border-blue-500/30',
    pillBg: 'bg-blue-500/10 text-blue-300',
    color: 'text-blue-400',
    icon: '\u{1F3DB}\u{FE0F}',
    label: 'Civic Services',
  },
  BUSINESS: {
    gradient: 'from-amber-500/8 via-transparent to-transparent',
    glow: 'shadow-amber-500/20',
    border: 'border-amber-500/10',
    borderHover: 'group-hover:border-amber-400/40',
    pillBorder: 'border-amber-500/30',
    pillBg: 'bg-amber-500/10 text-amber-300',
    color: 'text-amber-400',
    icon: '\u{1F4BC}',
    label: 'Business',
  },
  MILITARY: {
    gradient: 'from-green-500/8 via-transparent to-transparent',
    glow: 'shadow-green-500/20',
    border: 'border-green-500/10',
    borderHover: 'group-hover:border-green-400/40',
    pillBorder: 'border-green-500/30',
    pillBg: 'bg-green-500/10 text-green-300',
    color: 'text-green-400',
    icon: '\u{1F396}\u{FE0F}',
    label: 'Military / JBSA',
  },
  HEALTHCARE: {
    gradient: 'from-rose-500/8 via-transparent to-transparent',
    glow: 'shadow-rose-500/20',
    border: 'border-rose-500/10',
    borderHover: 'group-hover:border-rose-400/40',
    pillBorder: 'border-rose-500/30',
    pillBg: 'bg-rose-500/10 text-rose-300',
    color: 'text-rose-400',
    icon: '\u{1F3E5}',
    label: 'Healthcare',
  },
  TOURISM: {
    gradient: 'from-violet-500/8 via-transparent to-transparent',
    glow: 'shadow-violet-500/20',
    border: 'border-violet-500/10',
    borderHover: 'group-hover:border-violet-400/40',
    pillBorder: 'border-violet-500/30',
    pillBg: 'bg-violet-500/10 text-violet-300',
    color: 'text-violet-400',
    icon: '\u{1F5FA}\u{FE0F}',
    label: 'Tourism',
  },
}

const categories: {
  key: CategoryKey
  agents: number
  suites: string[]
  featuredAgent: string
}[] = [
  {
    key: 'CIVIC',
    agents: 10,
    suites: ['Permits', '311 Services', 'Transit', 'Parks', 'Housing'],
    featuredAgent: 'SA Permit Navigator',
  },
  {
    key: 'BUSINESS',
    agents: 10,
    suites: ['Licensing', 'Market Intel', 'HR', 'Grants', 'Tax'],
    featuredAgent: 'SA Business License Pro',
  },
  {
    key: 'MILITARY',
    agents: 10,
    suites: ['JBSA Benefits', 'VA Claims', 'Transition', 'GI Bill', 'Housing'],
    featuredAgent: 'JBSA Benefits Navigator',
  },
  {
    key: 'HEALTHCARE',
    agents: 10,
    suites: ['Care Navigation', 'Rx', 'Mental Health', 'Insurance', 'Senior Care'],
    featuredAgent: 'SA Care Navigator',
  },
  {
    key: 'TOURISM',
    agents: 10,
    suites: ['Riverwalk', 'Alamo', 'Hotels', 'Food', 'Events'],
    featuredAgent: 'Riverwalk Concierge',
  },
]

// Animated counter that counts up from 0 to target when in view
function AnimatedCount({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1200
    const stepTime = 16
    const steps = Math.ceil(duration / stepTime)
    const increment = target / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [inView, target])

  return <span>{count}</span>
}

export function BranchShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section id="branches" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/4 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium uppercase tracking-widest mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            50 Agents Total
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            5 Categories.{' '}
            <span className="gradient-text">50 Agents. One City.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-midnight-400 max-w-2xl mx-auto leading-relaxed"
          >
            10 specialized agents per category, organized into 5 service suites.
            Each agent is connected to San Antonio local data, APIs, and resources.
          </motion.p>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {categories.map((category, i) => {
            const style = CATEGORY_STYLE[category.key]

            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Link href={`/agents?category=${category.key}`} className="block h-full">
                  {/* Animated border gradient wrapper */}
                  <div className="relative h-full rounded-2xl p-px overflow-hidden transition-all duration-300">
                    {/* Border glow on hover — rendered as a pseudo-layer */}
                    <div
                      className={`
                        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                        transition-opacity duration-500
                        bg-gradient-to-br ${style.gradient.replace('/8', '/30')}
                      `}
                    />

                    {/* Card body */}
                    <div
                      className={`
                        relative h-full rounded-2xl border
                        ${style.border} ${style.borderHover}
                        bg-midnight-900/80 backdrop-blur-sm
                        bg-gradient-to-br ${style.gradient}
                        transition-all duration-300
                        p-6 flex flex-col gap-4 overflow-hidden
                      `}
                    >
                      {/* Icon with glow */}
                      <div className="relative flex-shrink-0 w-fit">
                        {/* Glow blob behind icon */}
                        <div
                          className={`
                            absolute inset-0 scale-150 blur-xl opacity-0 group-hover:opacity-60
                            transition-opacity duration-500 rounded-full
                            ${style.pillBg.split(' ')[0]}
                          `}
                        />
                        <div
                          className={`
                            relative w-14 h-14 rounded-2xl flex items-center justify-center
                            ${style.pillBg.split(' ')[0]} border ${style.pillBorder}
                            shadow-lg ${style.glow}
                            group-hover:scale-105 transition-transform duration-300
                          `}
                        >
                          <span className="text-2xl leading-none select-none">{style.icon}</span>
                        </div>
                      </div>

                      {/* Category label + animated agent count */}
                      <div>
                        <h3 className={`text-lg font-bold ${style.color} leading-tight`}>
                          {style.label}
                        </h3>
                        <p className="text-sm text-midnight-400 mt-0.5 tabular-nums">
                          <AnimatedCount target={category.agents} inView={isInView} />
                          {' '}agents available
                        </p>
                      </div>

                      {/* Featured agent pill */}
                      <div
                        className={`
                          inline-flex items-center gap-1.5 w-fit
                          px-2.5 py-1 rounded-lg
                          bg-white/5 border border-white/10
                          text-[11px] text-midnight-300 font-medium
                        `}
                      >
                        <span className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                        {category.featuredAgent}
                      </div>

                      {/* Suite tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {category.suites.map((suite) => (
                          <span
                            key={suite}
                            className={`
                              text-[10px] font-medium px-2 py-0.5 rounded-full
                              border ${style.pillBorder} ${style.pillBg}
                              tracking-wide
                            `}
                          >
                            {suite}
                          </span>
                        ))}
                      </div>

                      {/* CTA — reveals on hover */}
                      <div
                        className={`
                          flex items-center gap-1.5 mt-auto pt-2
                          text-sm font-semibold ${style.color}
                          opacity-0 group-hover:opacity-100
                          translate-y-1 group-hover:translate-y-0
                          transition-all duration-300
                        `}
                      >
                        Browse {category.agents} Agents
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom aggregate stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { label: 'Categories', value: '5' },
            { label: 'Specialized Agents', value: '50' },
            { label: 'Service Suites', value: '25' },
            { label: 'Data Sources', value: '40+' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
              <span className="text-xs text-midnight-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
