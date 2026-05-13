'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CATEGORY_CONFIG, TIER_CONFIG, type Agent, type Profile } from '@/lib/types'
import {
  Bot, Zap, BarChart3, Settings, ArrowRight, Shield, Star,
  LogOut, Crown, CreditCard, Activity
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recentAgents, setRecentAgents] = useState<Agent[]>([])
  const [stats, setStats] = useState({ totalAgents: 50, freeAgents: 9, proAgents: 41, entAgents: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profileData) setProfile(profileData as Profile)

      const { data: agentData } = await supabase
        .from('agents')
        .select('*')
        .eq('tier', 'FREE')
        .order('rating', { ascending: false })
        .limit(6)
      if (agentData) setRecentAgents(agentData as Agent[])

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const plan = profile?.plan || 'free'
  const planLabel = plan === 'all-access' ? 'Pro' : plan === 'team' ? 'Enterprise' : 'Basic'

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-midnight-400">Your agent command center</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={plan === 'free' ? 'success' : 'warning'} size="md">
              <Crown className="w-3 h-3 mr-1" />
              {planLabel} Plan
            </Badge>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Available Agents', value: plan === 'free' ? '9' : plan === 'all-access' ? '50' : '50', icon: Bot, color: 'text-brand-400' },
            { label: 'Token Balance', value: plan === 'free' ? '3/day' : plan === 'all-access' ? 'Unlimited' : 'Unlimited', icon: Zap, color: 'text-emerald-400' },
            { label: 'Agents Used', value: '0', icon: Activity, color: 'text-sky-400' },
            { label: 'Tokens Used', value: '0', icon: BarChart3, color: 'text-violet-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-midnight-500">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upgrade banner (for free users) */}
        {plan === 'free' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 mb-8 bg-gradient-to-r from-brand-500/5 to-amber-500/5 border-brand-500/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Unlock 41 more agents</h3>
                  <p className="text-sm text-midnight-400">Upgrade to Texas Pro for $29/mo and access all 50 agents across every category.</p>
                </div>
                <Link href="/pricing">
                  <Button variant="primary" size="md">
                    Upgrade Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick access agents */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Top Free Agents</h2>
            <Link href="/agents" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
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
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${branch.bgColor} border`}>
                        {branch.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">{agent.short_name}</h3>
                        <p className="text-[10px] text-midnight-500 truncate">{agent.tagline}</p>
                      </div>
                      <Badge variant="success">Free</Badge>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Account settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-midnight-400" />
                <div>
                  <div className="text-sm text-white">Email</div>
                  <div className="text-xs text-midnight-500">{user?.email}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-midnight-400" />
                <div>
                  <div className="text-sm text-white">Plan</div>
                  <div className="text-xs text-midnight-500">{planLabel}</div>
                </div>
              </div>
              {plan === 'free' && (
                <Link href="/pricing">
                  <Button variant="outline" size="sm">Upgrade</Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
