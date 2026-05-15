'use client'

/**
 * Header.tsx — Light-mode fixed navigation header
 *
 * Usage:
 *   import { Header } from '@/components/layout/Header'
 *   <Header />
 */

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X, Shield, User, LogOut, Zap, DollarSign, GitBranch, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { User as SupaUser } from '@supabase/supabase-js'
import { clsx } from 'clsx'

const NAV_LINKS = [
  { href: '/agents',      label: 'Browse Agents' },
  { href: '/pricing',     label: 'Pricing'       },
  { href: '/#categories', label: 'Categories'    },
  { href: '/#faq',        label: 'FAQ'           },
]

const CATEGORY_QUICK_LINKS = [
  { href: '/agents?branch=Civic',      label: 'Civic',      dotColor: 'bg-blue-500'   },
  { href: '/agents?branch=Business',   label: 'Business',   dotColor: 'bg-amber-500'  },
  { href: '/agents?branch=Military',   label: 'Military',   dotColor: 'bg-green-600'  },
  { href: '/agents?branch=Healthcare', label: 'Healthcare', dotColor: 'bg-rose-500'   },
  { href: '/agents?branch=Tourism',    label: 'Tourism',    dotColor: 'bg-violet-500' },
]

const MOBILE_NAV = [
  { href: '/agents',      label: 'Browse Agents', Icon: Zap        },
  { href: '/pricing',     label: 'Pricing',       Icon: DollarSign },
  { href: '/#categories', label: 'Categories',    Icon: GitBranch  },
  { href: '/#faq',        label: 'FAQ',           Icon: HelpCircle },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser]             = useState<SupaUser | null>(null)
  const [scrolled, setScrolled]     = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const supabase = createClient()

  // Focus trap for mobile menu
  const handleMenuKeyDown = useCallback((e: KeyboardEvent) => {
    if (!mobileOpen) return
    if (e.key === 'Escape') {
      setMobileOpen(false)
      mobileToggleRef.current?.focus()
      return
    }
    if (e.key !== 'Tab') return
    const menu = mobileMenuRef.current
    if (!menu) return
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [mobileOpen])

  useEffect(() => {
    document.addEventListener('keydown', handleMenuKeyDown)
    return () => document.removeEventListener('keydown', handleMenuKeyDown)
  }, [handleMenuKeyDown])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white border-b border-gray-200 shadow-sm'
          : 'bg-white/80 backdrop-blur-md border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="SA Agent Marketplace home">
            <div className="w-8 h-8 rounded-lg bg-navy-950 flex items-center justify-center group-hover:bg-navy-800 transition-colors duration-200 flex-shrink-0">
              <Shield className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-bold text-navy-950 tracking-tight">SA Agent</span>
              <span className="text-base font-bold text-brand-500 ml-1">Marketplace</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3.5 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-150 font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4" aria-hidden="true" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out">
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="md">Sign In</Button>
                </Link>
                <Link href="/auth/login?plan=growth">
                  <Button variant="primary" size="md">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            ref={mobileToggleRef}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen
              ? <X className="w-5 h-5" aria-hidden="true" />
              : <Menu className="w-5 h-5" aria-hidden="true" />
            }
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="lg:hidden bg-white border-t border-gray-200"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-4 py-5 space-y-1">

            {/* Main nav */}
            {MOBILE_NAV.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="w-4 h-4 text-navy-600" aria-hidden="true" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}

            {/* Category quick links */}
            <div className="pt-3 border-t border-gray-100">
              <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Browse by Category
              </p>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORY_QUICK_LINKS.map(({ href, label, dotColor }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 font-medium"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} aria-hidden="true" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth CTA */}
            <div className="pt-3 border-t border-gray-100">
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full">
                    <User className="w-4 h-4" aria-hidden="true" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  )
}
