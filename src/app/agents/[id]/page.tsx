'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { Card } from '@/components/ui/Card'
import { CATEGORY_CONFIG, TIER_CONFIG, type Agent } from '@/lib/types'
import { SA_AGENTS } from '@/lib/agents-data'
import {
  ArrowLeft, Bot, Shield, Users, Zap, Clock, CheckCircle2,
  Star, MessageSquare, TrendingUp, Lock
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AgentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [relatedAgents, setRelatedAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = SA_AGENTS.find((a) => a.id === id) ?? null
    setAgent(found)
    if (found) {
      setRelatedAgents(SA_AGENTS.filter((a) => a.suite === found.suite && a.id !== found.id).slice(0, 4))
    }
    setLoading(false)
  }, [id])

  if (loading) return (
    <div className="min-h-screen pt-28 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!agent) return (
    <div className="min-h-screen pt-28 text-center">
      <p className="text-midnight-400 text-lg">Agent not found.</p>
      <Link href="/agents" className="text-brand-400 hover:text-brand-300 text-sm mt-4 inline-block">Back to agents</Link>
    </div>
  )

  const branch = CATEGORY_CONFIG[agent.category]
  const tier = TIER_CONFIG[agent.tier]
  const suiteName = agent.suite.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-midnight-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-8">
                <div className="flex items-start gap-5 mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${branch.bgColor} border shrink-0`}>
                    {branch.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                      <Badge variant={agent.tier === 'FREE' ? 'success' : agent.tier === 'PRO' ? 'warning' : 'purple'} size="md">
                        {tier.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className={`text-sm ${branch.color}`}>{branch.icon} {branch.label}</span>
                      <span className="text-sm text-midnight-500">{suiteName}</span>
                      <StarRating rating={agent.rating} count={agent.review_count} size="md" />
                    </div>
                  </div>
                </div>

                <p className="text-midnight-300 leading-relaxed mb-6">
                  {agent.tagline || agent.description || 'A specialized San Antonio AI agent designed to streamline your workflow.'}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/[0.04]">
                    <Star className="w-4 h-4 text-brand-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{agent.rating}</div>
                    <div className="text-[10px] text-midnight-500">Rating</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/[0.04]">
                    <MessageSquare className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{agent.review_count}</div>
                    <div className="text-[10px] text-midnight-500">Reviews</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/[0.04]">
                    <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{agent.usage_count.toLocaleString()}</div>
                    <div className="text-[10px] text-midnight-500">Uses</div>
                  </div>
                  <div className="bg-white/[0.02] rounded-xl p-4 text-center border border-white/[0.04]">
                    <TrendingUp className="w-4 h-4 text-violet-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">99.9%</div>
                    <div className="text-[10px] text-midnight-500">Uptime</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Capabilities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-8">
                <h2 className="text-lg font-semibold text-white mb-4">What this agent does</h2>
                <div className="space-y-3">
                  {(agent.capabilities && agent.capabilities.length > 0 ? agent.capabilities : [
                    `Specialized ${branch.label} ${suiteName.toLowerCase()} processing`,
                    'Data-driven analysis and recommendations',
                    'San Antonio-specific knowledge and context',
                    'Real-time validation against current policies',
                    'Export-ready output and reporting',
                  ]).map((cap, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-midnight-300">{cap}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Related agents */}
            {relatedAgents.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-lg font-semibold text-white mb-4">More from {suiteName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedAgents.map((ra) => (
                    <Link key={ra.id} href={`/agents/${ra.id}`}>
                      <Card hover className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${CATEGORY_CONFIG[ra.category].bgColor} border`}>
                            {CATEGORY_CONFIG[ra.category].icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white truncate">{ra.short_name}</h3>
                            <p className="text-[10px] text-midnight-500 truncate">{ra.tagline}</p>
                          </div>
                          <Badge variant={ra.tier === 'FREE' ? 'success' : 'warning'} size="sm">{ra.tier}</Badge>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Pricing & Actions */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 sticky top-28">
                {agent.tier === 'FREE' ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-emerald-400 mb-1">Free</div>
                      <p className="text-xs text-midnight-500">No credit card required</p>
                    </div>
                    <Link href="/auth/login">
                      <Button variant="primary" size="lg" className="w-full mb-3">
                        <Zap className="w-4 h-4" /> Start Using Free
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-white">${(agent.monthly_price / 100).toFixed(2)}</span>
                        <span className="text-sm text-midnight-500">/mo</span>
                      </div>
                      <p className="text-xs text-midnight-500 mt-1">
                        or ${(agent.annual_price / 100).toFixed(2)}/yr (save {Math.round((1 - agent.annual_price / (agent.monthly_price * 12)) * 100)}%)
                      </p>
                      <p className="text-xs text-midnight-500 mt-1">
                        One-time: ${(agent.one_time_price / 100).toFixed(2)}
                      </p>
                    </div>
                    <Link href={`/auth/login?agent=${agent.id}`}>
                      <Button variant="primary" size="lg" className="w-full mb-3">
                        <Lock className="w-4 h-4" /> Subscribe to Agent
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button variant="outline" size="md" className="w-full">
                        Or get the {agent.tier === 'PRO' ? 'Texas Pro' : 'Enterprise'} plan for all {agent.tier.toLowerCase()} agents
                      </Button>
                    </Link>
                  </>
                )}

                <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center gap-2 text-xs text-midnight-400">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Zero-retention privacy
                  </div>
                  <div className="flex items-center gap-2 text-xs text-midnight-400">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    Instant activation
                  </div>
                  <div className="flex items-center gap-2 text-xs text-midnight-400">
                    <Zap className="w-3.5 h-3.5 text-brand-400" />
                    Cancel anytime
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
