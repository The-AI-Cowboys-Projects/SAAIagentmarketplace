/**
 * HowItWorks.tsx — 3-step onboarding flow section
 *
 * Usage:
 *   import { HowItWorks } from '@/components/home/HowItWorks'
 *   <HowItWorks />
 */

import { Search, Database, Rocket } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Choose an Agent',
    description:
      'Browse 70 specialized agents across civic, business, military, healthcare, and tourism. Filter by category, tier, or use case.',
  },
  {
    number: '02',
    icon: Database,
    title: 'Connect Your Data',
    description:
      'Link your local data sources — CoSA records, Bexar County systems, or your own files. Agents work with what you already have.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Deploy in Seconds',
    description:
      'No IT department, no setup headaches. Your agent goes live immediately and starts saving you time from the first session.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-surface-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            From sign-up to deployed in three steps
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            No technical expertise required. Any San Antonio business owner or resident can be up and running in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">

          {/* Connector lines between steps (desktop only) */}
          <div
            className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gray-200"
            aria-hidden="true"
          />

          {STEPS.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="flex flex-col items-center text-center md:items-start md:text-left">

              {/* Number + icon */}
              <div className="relative flex items-center justify-center w-20 h-20 mb-6">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-gray-200 bg-white" aria-hidden="true" />
                {/* Icon container */}
                <div className="relative w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                {/* Step number */}
                <span
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center leading-none"
                  aria-hidden="true"
                >
                  {number.replace('0', '')}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
