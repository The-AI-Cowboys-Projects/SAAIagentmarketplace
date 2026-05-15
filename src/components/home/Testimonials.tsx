/**
 * Testimonials.tsx — Clean testimonial grid
 *
 * Usage:
 *   import { Testimonials } from '@/components/home/Testimonials'
 *   <Testimonials />
 */

import { Star } from 'lucide-react'

type Testimonial = {
  quote: string
  name: string
  role: string
  category: string
  initials: string
  avatarBg: string
  stars: number
}

const testimonials: Testimonial[] = [
  {
    quote:
      'The Business License Pro agent walks you through every form, requirement, and fee for San Antonio food truck permits. What used to take weeks of research takes minutes.',
    name: 'Business Scenario',
    role: 'Small Business Licensing',
    category: 'Business',
    initials: 'BL',
    avatarBg: 'bg-amber-100 text-amber-800',
    stars: 5,
  },
  {
    quote:
      'The JBSA Benefits Navigator helps military personnel navigate VA claims, GI Bill optimization, and housing — all the resources for the 250K+ JBSA community in one place.',
    name: 'Military Scenario',
    role: 'JBSA Benefits Navigation',
    category: 'Military',
    initials: 'MI',
    avatarBg: 'bg-green-100 text-green-800',
    stars: 5,
  },
  {
    quote:
      'Plan an entire San Antonio trip with the Riverwalk Concierge — restaurant recommendations, Alamo info, Hill Country day trips, and event schedules in one conversation.',
    name: 'Tourism Scenario',
    role: 'Visitor Trip Planning',
    category: 'Tourism',
    initials: 'TO',
    avatarBg: 'bg-violet-100 text-violet-800',
    stars: 5,
  },
  {
    quote:
      'The Care Navigator helps find in-network specialists across SA health systems — University Health, Baptist, Methodist, Christus — with cost estimates and referral guidance.',
    name: 'Healthcare Scenario',
    role: 'Care Navigation',
    category: 'Healthcare',
    initials: 'HC',
    avatarBg: 'bg-rose-100 text-rose-800',
    stars: 5,
  },
  {
    quote:
      'The SA 311 Dispatcher triages service requests — pothole reports, code violations, noise complaints — and routes them to the right city department automatically.',
    name: 'Civic Scenario',
    role: 'City Services',
    category: 'Civic',
    initials: 'CI',
    avatarBg: 'bg-blue-100 text-blue-800',
    stars: 5,
  },
  {
    quote:
      'The Military Spouse Career Agent connects spouses to remote jobs, license portability resources, MSEP employers, and certification programs — everything in one place.',
    name: 'Military Scenario',
    role: 'Spouse Career Support',
    category: 'Military',
    initials: 'MS',
    avatarBg: 'bg-green-100 text-green-800',
    stars: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-surface-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">
            Use Cases
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Built for San Antonio
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            From business owners to veterans, tourists to healthcare providers — see how
            AI agents can streamline your San Antonio workflows.
          </p>

          {/* Aggregate rating */}
          <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm" aria-label="4.9 out of 5 stars from early adopters">
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-gray-900 font-semibold text-sm">4.9 / 5.0</span>
            <span className="text-gray-400 text-xs">from early adopters</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              {/* Stars */}
              <StarRating count={t.stars} />

              {/* Quote */}
              <blockquote className="text-sm text-gray-600 leading-relaxed flex-1">
                {t.quote}
              </blockquote>

              {/* Divider */}
              <div className="h-px bg-gray-100" aria-hidden="true" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${t.avatarBg}`}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                  <p className="text-xs text-gray-500 truncate">{t.role}</p>
                </div>
                <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
                  {t.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            'Privacy-First Design',
            'SA Built',
            'Texas Trusted',
            'Growing Community',
          ].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
              {badge}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
