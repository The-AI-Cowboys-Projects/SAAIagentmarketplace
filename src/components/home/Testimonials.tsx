'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

type Testimonial = {
  quote: string
  name: string
  role: string
  category: string
  categoryIcon: string
  accentColor: string
  accentBg: string
  accentBorder: string
  stars: number
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Got my food truck permit approved in two days instead of two weeks. The Business License Pro agent walked me through every form, every requirement, every fee. Game changer for small business owners.",
    name: 'Maria G.',
    role: 'Small Business Owner',
    category: 'Business',
    categoryIcon: '\u{1F4BC}',
    accentColor: 'text-amber-400',
    accentBg: 'bg-amber-500/10',
    accentBorder: 'border-amber-500/25',
    stars: 5,
  },
  {
    quote:
      "After 20 years at Fort Sam, the transition was overwhelming. The JBSA Benefits Navigator helped me file my VA claim, optimize my GI Bill, and find housing assistance. Rated at 90% on first attempt.",
    name: 'SFC (Ret.) Kevin P.',
    role: 'Veteran, Fort Sam Houston',
    category: 'Military',
    categoryIcon: '\u{1F396}\u{FE0F}',
    accentColor: 'text-green-400',
    accentBg: 'bg-green-500/10',
    accentBorder: 'border-green-500/25',
    stars: 5,
  },
  {
    quote:
      "Planned our entire San Antonio trip with the Riverwalk Concierge. Restaurant reservations, Alamo tickets, Hill Country wineries — all booked in 10 minutes. Better than any travel agent.",
    name: 'Jason & Emily T.',
    role: 'Tourists from Austin',
    category: 'Tourism',
    categoryIcon: '\u{1F5FA}\u{FE0F}',
    accentColor: 'text-violet-400',
    accentBg: 'bg-violet-500/10',
    accentBorder: 'border-violet-500/25',
    stars: 5,
  },
  {
    quote:
      "Finding in-network specialists for my patients used to take hours of phone calls. The Care Navigator pulls real-time availability, checks insurance, and books appointments. My staff loves it.",
    name: 'Dr. Patricia S.',
    role: 'Healthcare Administrator',
    category: 'Healthcare',
    categoryIcon: '\u{1F3E5}',
    accentColor: 'text-rose-400',
    accentBg: 'bg-rose-500/10',
    accentBorder: 'border-rose-500/25',
    stars: 5,
  },
  {
    quote:
      "Called 311 three times about a pothole on my street. Nothing happened. Used the SA 311 Dispatcher agent and had a work order filed, tracked, and completed in 4 days. Should have started here.",
    name: 'Robert M.',
    role: 'SA Resident, Southtown',
    category: 'Civic',
    categoryIcon: '\u{1F3DB}\u{FE0F}',
    accentColor: 'text-blue-400',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/25',
    stars: 5,
  },
  {
    quote:
      "My husband deployed and I needed to find a job, childcare, and sort out Tricare — all at once. The Military Spouse Career Agent connected me to resources I didn't even know existed at JBSA.",
    name: 'Amanda L.',
    role: 'Military Spouse, Lackland AFB',
    category: 'Military',
    categoryIcon: '\u{1F396}\u{FE0F}',
    accentColor: 'text-green-400',
    accentBg: 'bg-green-500/10',
    accentBorder: 'border-green-500/25',
    stars: 5,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Top separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/4 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium uppercase tracking-widest mb-4"
          >
            <Star className="w-3 h-3 fill-amber-400" />
            Real San Antonio Users
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight"
          >
            Trusted by{' '}
            <span className="gradient-text">San Antonians</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-midnight-400 max-w-2xl mx-auto leading-relaxed"
          >
            From business owners to veterans, tourists to healthcare providers. Real feedback
            from people who use these agents every day in San Antonio.
          </motion.p>

          {/* Aggregate rating strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-midnight-900/80 border border-white/[0.08]"
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white font-semibold text-sm">4.9 / 5.0</span>
            <span className="text-midnight-500 text-xs">from 10,000+ users</span>
          </motion.div>
        </div>

        {/* Testimonial cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className={`
                group relative rounded-2xl border ${t.accentBorder}
                bg-midnight-900/60 backdrop-blur-sm
                p-6 flex flex-col gap-5
                transition-all duration-300
                overflow-hidden
              `}
            >
              {/* Left edge accent bar */}
              <div
                className={`
                  absolute left-0 top-6 bottom-6 w-0.5 rounded-full
                  ${t.accentBg.replace('/10', '/60')}
                  opacity-50 group-hover:opacity-100
                  transition-opacity duration-300
                `}
              />

              {/* Corner glow */}
              <div
                className={`
                  absolute top-0 right-0 w-32 h-32
                  ${t.accentBg}
                  blur-2xl rounded-bl-full opacity-0 group-hover:opacity-70
                  transition-opacity duration-500
                `}
              />

              {/* Stars */}
              <StarRating count={t.stars} />

              {/* Quote */}
              <blockquote className="text-sm text-midnight-300 leading-relaxed flex-1">
                <span className={`text-2xl leading-none font-serif ${t.accentColor} mr-0.5`}>&ldquo;</span>
                {t.quote}
                <span className={`text-2xl leading-none font-serif ${t.accentColor} ml-0.5`}>&rdquo;</span>
              </blockquote>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar placeholder with category icon */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${t.accentBg} border ${t.accentBorder}
                    text-lg
                  `}
                >
                  {t.categoryIcon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                  <p className={`text-xs ${t.accentColor} font-medium`}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-14 flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: '\u{1F512}', label: 'Zero Data Retention' },
            { icon: '\u{1F3DB}\u{FE0F}', label: 'SA Built' },
            { icon: '\u{2B50}', label: 'Texas Trusted' },
            { icon: '\u{1F91D}', label: '10,000+ Users' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-midnight-900/60 border border-white/[0.07] text-midnight-400 text-xs font-medium"
            >
              <span>{badge.icon}</span>
              {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
