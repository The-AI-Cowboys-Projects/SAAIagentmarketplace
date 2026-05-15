'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CATEGORY_CONFIG, type Agent, type Profile } from '@/lib/types'
import { SA_AGENTS } from '@/lib/agents-data'
import {
  Bot, Zap, BarChart3, ArrowRight, Shield,
  LogOut, Crown, CreditCard, Activity
} from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recentAgents, setRecentAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profileData) setProfile(profileData as Profile)

      const topAgents = [...SA_AGENTS].sort((a, b) => b.rating - a.rating).slice(0, 6)
      setRecentAgents(topAgents)

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" aria-label="Loading dashboard" />
    </div>
  )

  const plan = profile?.plan || 'free'
  const planLabel = plan === 'growth' ? 'Growth' : plan === 'partner' ? 'Partner' : plan === 'starter' ? 'Starter' : 'Free'

  const stats = [
    {
      label: 'Available Agents',
      value: String(SA_AGENTS.length),
      icon: Bot,
      iconClass: 'text-brand-500',
      bgClass: 'bg-brand-50',
    },
    {
      label: 'Token Balance',
      value: plan === 'partner' ? 'Unlimited' : plan === 'growth' ? '10K/mo' : '1K/mo',
      icon: Zap,
      iconClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50',
    },
    {
      label: 'Agents Used',
      value: '0',
      icon: Activity,
      iconClass: 'text-sky-600',
      bgClass: 'bg-sky-50',
    },
    {
      label: 'Tokens Used',
      value: '0',
      icon: BarChart3,
      iconClass: 'text-violet-600',
      bgClass: 'bg-violet-50',
    },
  ]

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('[dashboard] Sign out failed:', error.message)
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex items-start sm:items-center justify-between mb-8 border-b border-gray-100 pb-6 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-gray-500 text-base">Your agent command center</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Badge variant={plan === 'starter' || plan === 'free' ? 'default' : 'warning'} size="md">
              <Crown className="w-3 h-3 mr-1" />
              {planLabel} Plan
            </Badge>
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bgClass}`}>
                  <stat.icon className={`w-4 h-4 ${stat.iconClass}`} />
                </div>
                <span className="text-xs font-medium text-gray-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Upgrade banner — starter users only */}
        {(plan === 'starter' || plan === 'free') && (
          <div className="bg-navy-50 border border-navy-200 rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-navy-950 mb-1">Unlock all {SA_AGENTS.length} agents</h3>
                <p className="text-sm text-navy-700">
                  Upgrade to the Growth plan for $149/mo and access all {SA_AGENTS.length} agents with unlimited usage.
                </p>
              </div>
              <Link href="/pricing" className="shrink-0">
                <Button variant="primary" size="md">
                  Upgrade Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Top agents */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Agents</h2>
            <Link
              href="/agents"
              className="text-sm font-medium text-navy-700 hover:text-navy-950 flex items-center gap-1 transition-colors duration-150"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAgents.map((agent) => {
              const branch = CATEGORY_CONFIG[agent.category]
              return (
                <Link key={agent.id} href={`/agents/${agent.id}`}>
                  <Card hover className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${branch.bgColor} border border-gray-100`}>
                        {branch.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{agent.short_name}</h3>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{agent.tagline}</p>
                      </div>
                      <Badge variant="warning" size="sm">Pro</Badge>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Account section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Account</h2>
          <div className="divide-y divide-gray-100">

            <div className="flex items-center justify-between py-3 first:pt-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Email</div>
                  <div className="text-xs text-gray-500 mt-0.5">{user?.email}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Plan</div>
                  <div className="text-xs text-gray-500 mt-0.5">{planLabel}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {plan !== 'free' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const { apiFetch } = await import('@/lib/api-client')
                        const res = await apiFetch('/api/stripe/portal', { method: 'POST' })
                        const data = await res.json()
                        if (data.url) window.location.href = data.url
                      } catch {}
                    }}
                  >
                    Manage Billing
                  </Button>
                )}
                {(plan === 'starter' || plan === 'free') && (
                  <Link href="/pricing">
                    <Button variant="outline" size="sm">Upgrade</Button>
                  </Link>
                )}
              </div>
            </div>

          </div>
        </Card>

      </div>
    </div>
  )
}
