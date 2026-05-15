'use client'

/**
 * Footer.tsx — Clean light-mode footer
 *
 * Usage:
 *   import { Footer } from '@/components/layout/Footer'
 *   <Footer />
 */

import Link from 'next/link'
import { Shield, MapPin, Zap } from 'lucide-react'
import { useState } from 'react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      const { apiFetch } = await import('@/lib/api-client')
      const res = await apiFetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      if (!res.ok) return
      setSubscribed(true)
      setEmail('')
    } catch {
      // Network error — don't show success
    }
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="SA Agent Marketplace">
              <div className="w-9 h-9 rounded-lg bg-navy-950 flex items-center justify-center group-hover:bg-navy-800 transition-colors duration-200 flex-shrink-0">
                <Shield className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 leading-tight">SA Agent</div>
                <div className="text-sm font-bold text-brand-500 leading-tight">Marketplace</div>
              </div>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              AI agents built for San Antonio — civic services, business, military,
              healthcare, tourism, and Connect-360. 70 specialized agents across 6 categories.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {[
                { href: 'https://github.com/aicowboys',          label: 'GitHub',    Icon: GithubIcon   },
                { href: 'https://linkedin.com/company/aicowboys', label: 'LinkedIn',  Icon: LinkedinIcon  },
                { href: 'https://twitter.com/aicowboys',          label: 'X/Twitter', Icon: TwitterXIcon  },
              ].map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all duration-150"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/agents',      label: 'Browse Agents' },
                { href: '/pricing',     label: 'Pricing'       },
                { href: '/#categories', label: 'Categories'    },
                { href: '/dashboard',   label: 'Dashboard'     },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-navy-950 transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/agents?branch=Civic',      label: 'Civic'      },
                { href: '/agents?branch=Business',   label: 'Business'   },
                { href: '/agents?branch=Military',   label: 'Military'   },
                { href: '/agents?branch=Healthcare', label: 'Healthcare' },
                { href: '/agents?branch=Tourism',    label: 'Tourism'    },
                { href: '/agents?branch=Connect360', label: 'Connect-360' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-navy-950 transition-colors duration-150">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + newsletter */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { href: 'https://aicowboys.com', label: 'AI Cowboys',      external: true },
                  { href: '/privacy',              label: 'Privacy Policy',  external: false },
                  { href: '/terms',                label: 'Terms of Service',external: false },
                  { href: '/refund-policy',        label: 'Refund Policy',   external: false },
                  { href: '/ai-disclaimer',        label: 'AI Disclaimer',   external: false },
                  { href: '/contact',              label: 'Contact',         external: false },
                  { href: '/status',               label: 'System Status',   external: false },
                ].map(({ href, label, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-sm text-gray-500 hover:text-navy-950 transition-colors duration-150"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">Stay Updated</h4>
              {subscribed ? (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-50 border border-green-200">
                  <Zap className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-green-700">You&apos;re subscribed.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    aria-label="Email address for newsletter"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all duration-150"
                  />
                  <button
                    type="submit"
                    className="w-full px-3 py-2 rounded-lg bg-navy-950 text-white text-sm font-semibold hover:bg-navy-800 transition-colors duration-150"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-xs text-gray-400">
            <span>&copy; {new Date().getFullYear()} AI Cowboys, Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-gray-300" aria-hidden="true">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-500" aria-hidden="true" />
              Built in San Antonio, TX
            </span>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs font-medium text-green-700">70 agents online</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
