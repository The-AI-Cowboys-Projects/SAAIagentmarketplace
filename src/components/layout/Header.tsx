'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Shield, User, LogOut, Zap, BookOpen, DollarSign, GitBranch, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { User as SupaUser } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/agents',    label: 'Browse Agents', badge: true  },
  { href: '/pricing',   label: 'Pricing',        badge: false },
  { href: '/#categories', label: 'Categories',     badge: false },
  { href: '/#faq',      label: 'FAQ',            badge: false },
]

const CATEGORY_QUICK_LINKS = [
  { href: '/agents?branch=Civic',      label: 'Civic',      color: 'bg-blue-500'    },
  { href: '/agents?branch=Business',   label: 'Business',   color: 'bg-emerald-500' },
  { href: '/agents?branch=Military',   label: 'Military',   color: 'bg-amber-500'   },
  { href: '/agents?branch=Healthcare', label: 'Healthcare', color: 'bg-rose-500'    },
  { href: '/agents?branch=Tourism',    label: 'Tourism',    color: 'bg-violet-500'  },
]

const MOBILE_NAV = [
  { href: '/agents',    label: 'Browse Agents', Icon: Zap        },
  { href: '/pricing',   label: 'Pricing',       Icon: DollarSign },
  { href: '/#categories', label: 'Categories',  Icon: GitBranch  },
  { href: '/#faq',      label: 'FAQ',           Icon: HelpCircle },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser]             = useState<SupaUser | null>(null)
  const [scrolled, setScrolled]     = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-midnight-950/80 backdrop-blur-2xl'
          : 'bg-transparent backdrop-blur-none'
      }`}
    >
      {/* Gradient bottom line — only visible when scrolled */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/50 group-hover:scale-105 transition-all duration-300">
              {/* Subtle inner glow ring */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Shield className="w-5 h-5 text-midnight-950 relative z-10" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-white tracking-tight">SA Agent</span>
              <span className="text-lg font-bold gradient-text ml-1">Marketplace</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                className="relative px-4 py-2 text-sm text-midnight-300 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 flex items-center gap-1.5"
              >
                {label}
                {badge && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-400" />
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop auth actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="md">Sign In</Button>
                </Link>

                {/* Get Started with animated gradient border */}
                <Link href="/auth/login?plan=pro">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-brand-500 to-amber-500 opacity-0 group-hover:opacity-80 blur-sm transition-opacity duration-300" />
                    <Button
                      variant="primary"
                      size="md"
                      className="relative transition-transform duration-200 group-hover:scale-[1.02]"
                    >
                      Get Started
                    </Button>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-midnight-300 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — animated with framer-motion */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden"
          >
            <div className="bg-midnight-950/95 backdrop-blur-2xl border-b border-white/[0.06]">
              <div className="px-4 py-6 space-y-1">
                {/* Main nav links */}
                {MOBILE_NAV.map(({ href, label, Icon }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05 }}
                  >
                    <Link
                      href={href}
                      className="flex items-center gap-3 px-4 py-3 text-midnight-200 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-brand-400" />
                      {label}
                      {label === 'Browse Agents' && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 font-medium">New</span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* Branch quick links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="pt-4"
                >
                  <p className="px-4 mb-2 text-xs font-semibold text-midnight-500 uppercase tracking-widest">Browse by Category</p>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORY_QUICK_LINKS.map(({ href, label, color }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs text-midnight-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />
                        {label}
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Auth CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 border-t border-white/[0.06]"
                >
                  {user ? (
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button variant="primary" size="lg" className="w-full">
                        <User className="w-4 h-4" />
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
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
