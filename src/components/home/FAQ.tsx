'use client'

/**
 * FAQ.tsx — Clean accordion FAQ section
 *
 * Usage:
 *   import { FAQ } from '@/components/home/FAQ'
 *   <FAQ />
 */

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

const faqs = [
  {
    q: 'What is the SA AI Agent Marketplace?',
    a: "The SA AI Agent Marketplace is San Antonio's first local AI platform. We offer 70 specialized AI agents across 5 categories — Civic, Business, Military/JBSA, Healthcare, and Tourism — each connected to real SA data sources to help you get things done faster.",
  },
  {
    q: 'How do the agents work?',
    a: 'Each agent is a specialized AI assistant built for a specific task. Select an agent, provide your inputs, and get results in seconds. Agents are connected to local data sources like CoSA open data, Bexar County records, CPS Energy, SAWS, VIA Transit, and more.',
  },
  {
    q: 'What are the 5 categories?',
    a: 'Civic (permits, 311, transit, parks, housing), Business (licensing, market intel, HR, grants, tax), Military/JBSA (benefits, VA claims, transition, GI Bill, housing), Healthcare (care navigation, prescriptions, mental health, insurance, senior care), and Tourism (Riverwalk, Alamo, hotels, food, events).',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. We use zero-retention processing — your data is never stored, logged, or used for model training. All data is encrypted in transit with TLS 1.3. Healthcare agents are HIPAA-aware and designed with patient privacy in mind.',
  },
  {
    q: 'How much does it cost?',
    a: 'Plans start at $49/month for the Starter tier. Growth ($149/mo) and Partner ($499/mo) plans unlock all 70 agents with higher usage limits, priority support, and team features. Annual billing saves 20%.',
  },
  {
    q: 'Are military and veteran agents discounted?',
    a: 'Military and veteran agents are included in all plans starting at $49/month. We offer special pricing for active duty and veteran-owned businesses — contact us for details.',
  },
  {
    q: 'What data sources are the agents connected to?',
    a: 'Agents connect to CoSA open data, Bexar County records, CPS Energy, SAWS, VIA Transit schedules, tourism feeds, healthcare provider directories, JBSA resources, and more. All data is pulled in real-time.',
  },
  {
    q: 'How do I get started?',
    a: 'Create an account, browse the 70 agents, and deploy your first agent in under 60 seconds. No software to install, no IT department needed. Plans start at $49/month.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-navy-600 uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors duration-150"
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-sm font-medium text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown
                  className={clsx(
                    'w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200',
                    open === i && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>

              <div
                id={`faq-answer-${i}`}
                role="region"
                className={clsx(
                  'overflow-hidden transition-all duration-200',
                  open === i ? 'max-h-96' : 'max-h-0'
                )}
              >
                <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
