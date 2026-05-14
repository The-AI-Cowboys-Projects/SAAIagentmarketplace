'use client'
import { motion, useAnimationFrame } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, CheckCircle2, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRef, useState } from 'react'

// Floating particle dot
function Particle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-brand-400/20"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{
        y: [0, -24, 0],
        opacity: [0.15, 0.5, 0.15],
        scale: [1, 1.4, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

const PARTICLES = [
  { x: 5,  y: 20, delay: 0,   size: 4 },
  { x: 12, y: 70, delay: 0.6, size: 6 },
  { x: 22, y: 40, delay: 1.2, size: 3 },
  { x: 35, y: 85, delay: 0.3, size: 5 },
  { x: 50, y: 10, delay: 1.8, size: 4 },
  { x: 62, y: 60, delay: 0.9, size: 7 },
  { x: 75, y: 30, delay: 0.4, size: 3 },
  { x: 85, y: 75, delay: 1.5, size: 5 },
  { x: 92, y: 45, delay: 0.7, size: 4 },
  { x: 8,  y: 55, delay: 2.1, size: 6 },
  { x: 48, y: 92, delay: 1.0, size: 3 },
  { x: 70, y: 15, delay: 1.6, size: 5 },
]

const TRUST_BADGES = [
  { label: 'SOC 2',          color: 'text-emerald-400' },
  { label: 'HIPAA Aware',    color: 'text-rose-400'    },
  { label: 'Texas Trusted',  color: 'text-brand-400'   },
  { label: 'SA Built',       color: 'text-amber-400'   },
  { label: 'Zero Trust',     color: 'text-sky-400'     },
]

// Animated rotating conic-gradient border wrapper
function GlowBorderCard({ children }: { children: React.ReactNode }) {
  const angleRef = useRef(0)
  const [angle, setAngle] = useState(0)

  useAnimationFrame((_t, delta) => {
    angleRef.current = (angleRef.current + delta * 0.04) % 360
    setAngle(angleRef.current)
  })

  return (
    <div className="relative p-[2px] rounded-3xl">
      {/* Rotating conic-gradient border */}
      <div
        className="absolute inset-0 rounded-3xl opacity-70"
        style={{
          background: `conic-gradient(from ${angle}deg at 50% 50%, #f59e0b, #f97316, #8b5cf6, #3b82f6, #10b981, #f59e0b)`,
          filter: 'blur(2px)',
        }}
      />
      {/* Inner card */}
      <div className="relative rounded-3xl bg-midnight-900 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export function CTA() {
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-500/8 rounded-full blur-[100px]" />
        <div className="absolute left-1/4 top-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px]" />
        <div className="absolute right-1/4 bottom-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <GlowBorderCard>
            {/* Particle field */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {PARTICLES.map((p, i) => (
                <Particle key={i} {...p} />
              ))}
            </div>

            {/* Grid texture overlay */}
            <div className="absolute inset-0 grid-pattern opacity-30 rounded-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-10 lg:p-16">
              {/* Urgency pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                <span className="text-xs font-semibold text-brand-300 tracking-wide uppercase">
                  Join 10,000+ San Antonians
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1] tracking-tight"
              >
                Ready to deploy your
                <br />
                <span className="gradient-text">AI agent?</span>
              </motion.h2>

              {/* Subhead */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg lg:text-xl text-midnight-400 max-w-xl mx-auto mb-10 leading-relaxed"
              >
                Save hours on permits, claims, bookings, and more.
                Trusted by 10,000+ San Antonians.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              >
                <Link href="/auth/login">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative group"
                  >
                    {/* Glow ring on hover */}
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300" />
                    <Button variant="primary" size="xl" className="relative shadow-xl shadow-brand-500/25 hover:shadow-brand-500/50 transition-shadow duration-300">
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/agents">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button variant="outline" size="xl" className="hover:border-brand-400/60 hover:text-white transition-all duration-300">
                      Browse 60 Agents
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Divider */}
              <div className="border-t border-white/[0.06] mb-8" />

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-3 sm:gap-5"
              >
                {TRUST_BADGES.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                  >
                    <Shield className={`w-3.5 h-3.5 ${badge.color}`} />
                    <span className="text-xs font-medium text-midnight-300">{badge.label}</span>
                  </div>
                ))}

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <Users className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-xs font-medium text-midnight-300">10,000+ Users</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-midnight-300">San Antonio Built</span>
                </div>
              </motion.div>
            </div>
          </GlowBorderCard>
        </motion.div>
      </div>
    </section>
  )
}
