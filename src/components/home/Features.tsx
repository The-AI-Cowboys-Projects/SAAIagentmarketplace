/**
 * Features.tsx — Clean feature grid section
 *
 * Usage:
 *   import { Features } from '@/components/home/Features'
 *   <Features />
 */

import { Database, MousePointerClick, ShieldCheck, Zap, Shield, HeartPulse, MapPin, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = {
  icon: LucideIcon
  iconBgColor: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Database,
    iconBgColor: 'bg-navy-950',
    title: 'San Antonio Local Knowledge',
    description:
      'Built with knowledge of CoSA services, Bexar County resources, CPS Energy, SAWS, and VIA Transit. Local context, not generic answers.',
  },
  {
    icon: MousePointerClick,
    iconBgColor: 'bg-sky-700',
    title: '3-Click Deploy',
    description:
      'Select an agent, bind your data sources, and go live in 60 seconds. No setup, no training, no IT department required.',
  },
  {
    icon: ShieldCheck,
    iconBgColor: 'bg-emerald-700',
    title: 'Privacy-First Design',
    description:
      'Agent conversations are not used for model training. Privacy-first architecture with encryption in transit and minimal data retention.',
  },
  {
    icon: Zap,
    iconBgColor: 'bg-amber-600',
    title: 'SA-Focused Intelligence',
    description:
      'Agents built with deep knowledge of San Antonio city services, tourism, healthcare systems, and military installations.',
  },
  {
    icon: Shield,
    iconBgColor: 'bg-green-700',
    title: 'Military and Veteran Ready',
    description:
      'JBSA benefits navigation, VA claims assistance, GI Bill optimization, and transition coaching. Built for the military city.',
  },
  {
    icon: HeartPulse,
    iconBgColor: 'bg-rose-700',
    title: 'Privacy-First Healthcare',
    description:
      'Healthcare agents designed with patient privacy in mind. Care navigation, Rx help, and insurance guidance — no PHI is stored or processed.',
  },
  {
    icon: MapPin,
    iconBgColor: 'bg-navy-700',
    title: 'Built by Texans',
    description:
      'A local team in San Antonio who knows the city inside and out. We live here, build here, and support you from right here.',
  },
  {
    icon: Globe,
    iconBgColor: 'bg-teal-700',
    title: 'Works Everywhere',
    description:
      'Desktop, tablet, mobile. Optimized for all devices with fast load times and responsive design. Use your agents anywhere.',
  },
]

export function Features() {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">
            Platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why San Antonio Trusts Us
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Not another generic AI tool. Every feature is designed for San Antonians
            who need local knowledge, privacy, and speed.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg ${feature.iconBgColor} flex items-center justify-center flex-shrink-0`}
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
