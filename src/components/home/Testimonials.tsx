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
      'Got my food truck permit approved in two days instead of two weeks. The Business License Pro agent walked me through every form, requirement, and fee.',
    name: 'Maria G.',
    role: 'Small Business Owner',
    category: 'Business',
    initials: 'MG',
    avatarBg: 'bg-amber-100 text-amber-800',
    stars: 5,
  },
  {
    quote:
      'After 20 years at Fort Sam, the transition was overwhelming. The JBSA Benefits Navigator helped me file my VA claim, optimize my GI Bill, and find housing. Rated at 90% on first attempt.',
    name: 'Kevin P.',
    role: 'Veteran, Fort Sam Houston',
    category: 'Military',
    initials: 'KP',
    avatarBg: 'bg-green-100 text-green-800',
    stars: 5,
  },
  {
    quote:
      'Planned our entire San Antonio trip with the Riverwalk Concierge. Restaurant reservations, Alamo tickets, Hill Country wineries — all booked in 10 minutes.',
    name: 'Jason T.',
    role: 'Visitor from Austin',
    category: 'Tourism',
    initials: 'JT',
    avatarBg: 'bg-violet-100 text-violet-800',
    stars: 5,
  },
  {
    quote:
      'Finding in-network specialists for my patients used to take hours of phone calls. The Care Navigator pulls real-time availability, checks insurance, and books appointments.',
    name: 'Dr. Patricia S.',
    role: 'Healthcare Administrator',
    category: 'Healthcare',
    initials: 'PS',
    avatarBg: 'bg-rose-100 text-rose-800',
    stars: 5,
  },
  {
    quote:
      'Called 311 three times about a pothole on my street. Nothing happened. Used the SA 311 Dispatcher agent and had a work order filed, tracked, and completed in 4 days.',
    name: 'Robert M.',
    role: 'SA Resident, Southtown',
    category: 'Civic',
    initials: 'RM',
    avatarBg: 'bg-blue-100 text-blue-800',
    stars: 5,
  },
  {
    quote:
      'My husband deployed and I needed to find a job, childcare, and sort out Tricare — all at once. The Military Spouse Career Agent connected me to resources I did not even know existed.',
    name: 'Amanda L.',
    role: 'Military Spouse, Lackland AFB',
    category: 'Military',
    initials: 'AL',
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
            Real Users
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by San Antonians
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            From business owners to veterans, tourists to healthcare providers — real feedback
            from people who use these agents every day.
          </p>

          {/* Aggregate rating */}
          <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-gray-900 font-semibold text-sm">4.9 / 5.0</span>
            <span className="text-gray-400 text-xs">from 10,000+ users</span>
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
            'Zero Data Retention',
            'SA Built',
            'Texas Trusted',
            '10,000+ Users',
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
