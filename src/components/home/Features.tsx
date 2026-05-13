'use client'
import { motion } from 'framer-motion'
import { Database, MousePointerClick, ShieldCheck, Zap, Shield, HeartPulse, MapPin, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = {
  icon: LucideIcon
  title: string
  description: string
  accentFrom: string
  accentTo: string
  iconBg: string
  iconColor: string
  borderAccent: string
}

const features: Feature[] = [
  {
    icon: Database,
    title: 'San Antonio Local Data',
    description:
      'Connected to CoSA open data, Bexar County records, CPS Energy, SAWS, and VIA Transit feeds. Real local data, not generic web scraping.',
    accentFrom: 'from-brand-500',
    accentTo: 'to-violet-500',
    iconBg: 'bg-brand-500/15',
    iconColor: 'text-brand-400',
    borderAccent: 'group-hover:border-brand-500/30',
  },
  {
    icon: MousePointerClick,
    title: '3-Click Deploy',
    description:
      'Select an agent, bind your data sources, deploy your workspace. Live in 60 seconds with no setup, no training, no IT department needed.',
    accentFrom: 'from-sky-500',
    accentTo: 'to-blue-500',
    iconBg: 'bg-sky-500/15',
    iconColor: 'text-sky-400',
    borderAccent: 'group-hover:border-sky-500/30',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Data Retention',
    description:
      'Your data is never stored, logged, or used for training. Period. Privacy-first architecture with full encryption in transit.',
    accentFrom: 'from-emerald-500',
    accentTo: 'to-green-400',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    borderAccent: 'group-hover:border-emerald-500/30',
  },
  {
    icon: Zap,
    title: 'Real-Time Intelligence',
    description:
      'Live data from city APIs, tourism feeds, healthcare portals, and transit schedules. Always current, always accurate.',
    accentFrom: 'from-yellow-400',
    accentTo: 'to-orange-400',
    iconBg: 'bg-yellow-500/15',
    iconColor: 'text-yellow-400',
    borderAccent: 'group-hover:border-yellow-500/30',
  },
  {
    icon: Shield,
    title: 'Military & Veteran Ready',
    description:
      'JBSA benefits navigation, VA claims assistance, GI Bill optimization, and transition coaching. Built for the military city.',
    accentFrom: 'from-green-500',
    accentTo: 'to-emerald-400',
    iconBg: 'bg-green-500/15',
    iconColor: 'text-green-400',
    borderAccent: 'group-hover:border-green-500/30',
  },
  {
    icon: HeartPulse,
    title: 'HIPAA Aware',
    description:
      'Healthcare agents designed with patient privacy in mind. Care navigation, prescription assistance, and insurance help without compromising PHI.',
    accentFrom: 'from-rose-500',
    accentTo: 'to-pink-400',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    borderAccent: 'group-hover:border-rose-500/30',
  },
  {
    icon: MapPin,
    title: 'Built by Texans',
    description:
      'A local team in San Antonio who knows the city inside and out. We live here, we build here, and we support you from right here.',
    accentFrom: 'from-amber-500',
    accentTo: 'to-yellow-400',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    borderAccent: 'group-hover:border-amber-500/30',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description:
      'Desktop, tablet, mobile. Optimized for all devices with fast load times and responsive design. Use your agents anywhere in SA.',
    accentFrom: 'from-teal-500',
    accentTo: 'to-cyan-400',
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
    borderAccent: 'group-hover:border-teal-500/30',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

export function Features() {
  return (
    <section className="relative py-24 lg:py-32 bg-midnight-950 overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Top separator gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      {/* Bottom separator gradient line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute pointer-events-none inset-0">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium uppercase tracking-widest mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Platform Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight"
          >
            Built for{' '}
            <span className="gradient-text">San Antonio</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-midnight-400 leading-relaxed"
          >
            Not another generic AI tool. Every feature is designed for San Antonians
            who need local knowledge, privacy, and speed — without compromise.
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent"
          />
        </div>

        {/* Feature cards — staggered reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className={`
                group relative rounded-2xl border border-white/[0.06] ${feature.borderAccent}
                bg-midnight-900/60 backdrop-blur-sm
                p-6 flex flex-col gap-4
                transition-all duration-300
                overflow-hidden
              `}
            >
              {/* Animated top-edge accent line */}
              <div
                className={`
                  absolute top-0 left-0 right-0 h-px
                  bg-gradient-to-r ${feature.accentFrom} ${feature.accentTo}
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-400
                `}
              />

              {/* Icon with gradient background */}
              <div className="relative w-fit">
                {/* Subtle glow behind icon on hover */}
                <div
                  className={`
                    absolute inset-0 scale-[2] blur-xl opacity-0 group-hover:opacity-40
                    transition-opacity duration-500 rounded-full ${feature.iconBg}
                  `}
                />
                <div
                  className={`
                    relative w-12 h-12 rounded-xl
                    ${feature.iconBg} border border-white/[0.06]
                    flex items-center justify-center
                    group-hover:scale-110 transition-transform duration-300
                    shadow-lg
                  `}
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                >
                  {/* Gradient overlay inside icon box */}
                  <div
                    className={`
                      absolute inset-0 rounded-xl opacity-30
                      bg-gradient-to-br ${feature.accentFrom} ${feature.accentTo}
                    `}
                  />
                  <feature.icon className={`relative w-5 h-5 ${feature.iconColor}`} />
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-white leading-snug">
                  {feature.title}
                </h3>
                <p className="text-sm text-midnight-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom-right corner geometric accent */}
              <div
                className={`
                  absolute bottom-0 right-0 w-16 h-16
                  bg-gradient-to-tl ${feature.accentFrom} ${feature.accentTo}
                  opacity-0 group-hover:opacity-5
                  rounded-tl-3xl transition-opacity duration-500
                `}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
