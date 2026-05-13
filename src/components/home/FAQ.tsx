'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

const faqs = [
  {
    q: 'What is the SA AI Agent Marketplace?',
    a: 'The SA AI Agent Marketplace is San Antonio\'s first local AI platform. We offer 50 specialized AI agents across 5 categories — Civic, Business, Military/JBSA, Healthcare, and Tourism — each connected to real SA data sources to help you get things done faster.',
  },
  {
    q: 'How do the 50 agents work?',
    a: 'Each agent is a specialized AI assistant trained for a specific task. Select an agent, provide your inputs, and get results in seconds. Agents are connected to local data sources like CoSA open data, Bexar County records, CPS Energy, SAWS, VIA Transit, and more.',
  },
  {
    q: 'What are the 5 categories?',
    a: 'Civic (permits, 311, transit, parks, housing), Business (licensing, market intel, HR, grants, tax), Military/JBSA (benefits, VA claims, transition, GI Bill, housing), Healthcare (care navigation, prescriptions, mental health, insurance, senior care), and Tourism (Riverwalk, Alamo, hotels, food, events). Each category has 10 agents.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. We use zero-retention processing — your data is never stored, logged, or used for model training. All data is encrypted in transit with TLS 1.3. Healthcare agents are HIPAA-aware and designed with patient privacy in mind.',
  },
  {
    q: 'How much does it cost?',
    a: 'We offer a free tier with 9 core agents — no credit card required. Pro and Enterprise plans unlock all 50 agents with higher usage limits, priority support, and team features. See our pricing page for details.',
  },
  {
    q: 'Can I use military/veteran agents for free?',
    a: 'Yes. Key veteran agents like the JBSA Benefits Navigator and VA Claims Assistant are included in the free tier. We believe veterans who served our country deserve access to these tools at no cost.',
  },
  {
    q: 'What data sources are the agents connected to?',
    a: 'Agents connect to CoSA open data, Bexar County records, CPS Energy, SAWS, VIA Transit schedules, tourism feeds, healthcare provider directories, JBSA resources, and more. All data is pulled in real-time so you always get current information.',
  },
  {
    q: 'How do I get started?',
    a: 'Create a free account, browse the 50 agents, and deploy your first agent in under 60 seconds. No software to install, no IT department needed. Works on desktop, tablet, and mobile from any browser.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown className={clsx('w-5 h-5 text-midnight-400 shrink-0 transition-transform', open === i && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-midnight-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
