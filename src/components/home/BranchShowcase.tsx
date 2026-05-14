'use client'

/**
 * BranchShowcase.tsx — Category overview section
 *
 * Usage:
 *   import { BranchShowcase } from '@/components/home/BranchShowcase'
 *   <BranchShowcase />
 */

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type CategoryKey = 'CIVIC' | 'BUSINESS' | 'MILITARY' | 'HEALTHCARE' | 'TOURISM' | 'CONNECT360'

const CATEGORY_CONFIG: Record<
  CategoryKey,
  {
    label: string
    borderColor: string
    dotColor: string
    textColor: string
    bgColor: string
    href: string
  }
> = {
  CIVIC: {
    label: 'Civic Services',
    borderColor: 'border-l-blue-500',
    dotColor: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    href: '/agents?branch=Civic',
  },
  BUSINESS: {
    label: 'Business',
    borderColor: 'border-l-amber-500',
    dotColor: 'bg-amber-500',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    href: '/agents?branch=Business',
  },
  MILITARY: {
    label: 'Military / JBSA',
    borderColor: 'border-l-green-600',
    dotColor: 'bg-green-600',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    href: '/agents?branch=Military',
  },
  HEALTHCARE: {
    label: 'Healthcare',
    borderColor: 'border-l-rose-500',
    dotColor: 'bg-rose-500',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-50',
    href: '/agents?branch=Healthcare',
  },
  TOURISM: {
    label: 'Tourism',
    borderColor: 'border-l-violet-500',
    dotColor: 'bg-violet-500',
    textColor: 'text-violet-700',
    bgColor: 'bg-violet-50',
    href: '/agents?branch=Tourism',
  },
  CONNECT360: {
    label: 'Connect-360',
    borderColor: 'border-l-navy-700',
    dotColor: 'bg-navy-700',
    textColor: 'text-navy-700',
    bgColor: 'bg-navy-50',
    href: '/agents?branch=Connect360',
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
  {
    key: 'CONNECT360',
    agents: 10,
    suites: ['Relocation', 'Utilities', 'Schools', 'Neighborhoods', 'Water'],
    featuredAgent: 'Newcomer Onboarding',
  },
]

export function BranchShowcase() {
  return (
    <section id="categories" className="py-20 lg:py-28 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">
            70 Agents Total
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            6 Categories. 70 Agents. One City.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Specialized agents organized into 6 service areas — each connected to
            San Antonio local data, APIs, and resources.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const config = CATEGORY_CONFIG[category.key]

            return (
              <Link
                key={category.key}
                href={config.href}
                className={`
                  group block bg-white border border-gray-200 border-l-4 ${config.borderColor}
                  rounded-xl p-5 flex flex-col gap-4
                  hover:border-gray-300 hover:shadow-md transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2
                `}
                aria-label={`Browse ${config.label} agents`}
              >
                {/* Category label + count */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full ${config.dotColor} flex-shrink-0`}
                      aria-hidden="true"
                    />
                    <h3 className={`text-sm font-semibold ${config.textColor}`}>
                      {config.label}
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">
                    {category.agents}
                    <span className="text-sm font-medium text-gray-400 ml-1">agents</span>
                  </p>
                </div>

                {/* Featured agent */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bgColor} w-fit`}>
                  <span className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
                  <span className={`text-[11px] font-medium ${config.textColor}`}>
                    {category.featuredAgent}
                  </span>
                </div>

                {/* Suite tags */}
                <div className="flex flex-wrap gap-1.5">
                  {category.suites.slice(0, 3).map((suite) => (
                    <span
                      key={suite}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200"
                    >
                      {suite}
                    </span>
                  ))}
                  {category.suites.length > 3 && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                      +{category.suites.length - 3} more
                    </span>
                  )}
                </div>

                {/* CTA arrow */}
                <div className={`flex items-center gap-1 text-xs font-semibold ${config.textColor} mt-auto`}>
                  Browse agents
                  <ArrowRight
                    className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Aggregate stat strip */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center border-t border-gray-100 pt-10">
          {[
            { label: 'Categories',          value: '6'   },
            { label: 'Specialized Agents',  value: '70'  },
            { label: 'Service Suites',       value: '25'  },
            { label: 'Local Data Sources',   value: '40+' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-navy-950 tabular-nums">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
