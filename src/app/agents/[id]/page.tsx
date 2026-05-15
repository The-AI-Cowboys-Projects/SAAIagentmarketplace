'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { Card } from '@/components/ui/Card'
import { CATEGORY_CONFIG, STATUS_CONFIG, TIER_CONFIG, type Agent } from '@/lib/types'
import { SA_AGENTS } from '@/lib/agents-data'
import {
  ArrowLeft, Shield, Users, Zap, Clock, CheckCircle2,
  Star, MessageSquare, TrendingUp, Lock, Send
} from 'lucide-react'
import Link from 'next/link'

// AgentChat — light-mode chat widget embedded in the detail page
function AgentChat({ agentId, agentName }: { agentId: string; agentName: string }) {
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<{ id: string; role: 'user' | 'agent'; text: string }[]>([])
  const [sending, setSending] = useState(false)
  const [msgId, setMsgId] = useState(0)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sending) return
    const userMsg = message.trim()
    setMessage('')
    const userMsgId = `msg-${msgId}`
    setMsgId(prev => prev + 1)
    setConversation(prev => [...prev, { id: userMsgId, role: 'user', text: userMsg }])
    setSending(true)
    try {
      const { apiFetch } = await import('@/lib/api-client')
      const res = await apiFetch('/api/agents/chat', {
        method: 'POST',
        body: JSON.stringify({ agentId, message: userMsg }),
      })
      const data = await res.json()
      const replyId = `msg-${msgId + 1}`
      setMsgId(prev => prev + 1)
      if (data.error) {
        setConversation(prev => [...prev, { id: replyId, role: 'agent', text: data.error }])
      } else {
        setConversation(prev => [...prev, { id: replyId, role: 'agent', text: data.response || 'No response received.' }])
      }
    } catch {
      const errId = `msg-${msgId + 1}`
      setMsgId(prev => prev + 1)
      setConversation(prev => [...prev, { id: errId, role: 'agent', text: 'Unable to reach agent. Please try again.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Message thread */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {conversation.length === 0 && (
          <p className="text-sm text-gray-400 italic">Ask {agentName} anything...</p>
        )}
        {conversation.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-navy-950 text-white border border-navy-800'
                : 'bg-gray-50 text-gray-700 border border-gray-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input row */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Ask ${agentName}...`}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
        />
        <button
          type="submit"
          disabled={sending || !message.trim()}
          aria-label="Send message"
          className="px-4 py-2.5 rounded-xl bg-navy-950 text-white text-sm font-semibold hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}

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
      <p className="text-gray-500 text-lg">Agent not found.</p>
      <Link href="/agents" className="text-brand-500 hover:text-brand-600 text-sm mt-4 inline-block">
        Back to agents
      </Link>
    </div>
  )

  const branch = CATEGORY_CONFIG[agent.category]
  const tier = TIER_CONFIG[agent.tier]
  const suiteName = agent.suite.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="min-h-screen bg-gray-50 pt-24 lg:pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero card */}
            <Card className="p-8">
              <div className="flex items-start gap-5 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${branch.bgColor} border shrink-0`}>
                  {branch.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
                    <Badge
                      variant={agent.tier === 'PRO' ? 'warning' : 'purple'}
                      size="md"
                    >
                      {tier.label}
                    </Badge>
                    {agent.agentStatus && agent.agentStatus !== 'live' && (
                      <Badge variant={STATUS_CONFIG[agent.agentStatus].variant} size="md">
                        {STATUS_CONFIG[agent.agentStatus].label}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`text-sm ${branch.color}`}>{branch.icon} {branch.label}</span>
                    <span className="text-sm text-gray-400">{suiteName}</span>
                    <StarRating rating={agent.rating} count={agent.review_count} size="md" />
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {agent.tagline || agent.description || 'A specialized San Antonio AI agent designed to streamline your workflow.'}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                  <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{agent.rating}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">Rating</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                  <MessageSquare className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{agent.review_count}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">Reviews</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                  <Users className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">{agent.usage_count.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">Uses</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                  <TrendingUp className="w-4 h-4 text-violet-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-900">24/7</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">Available</div>
                </div>
              </div>
            </Card>

            {/* Capabilities */}
            <Card className="p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What this agent does</h2>
              <div className="space-y-3">
                {(agent.capabilities && agent.capabilities.length > 0 ? agent.capabilities : [
                  `Specialized ${branch.label} ${suiteName.toLowerCase()} processing`,
                  'Data-driven analysis and recommendations',
                  'San Antonio-specific knowledge and context',
                  'Real-time validation against current policies',
                  'Export-ready output and reporting',
                ]).map((cap, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600">{cap}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Try it out */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Try this agent</h2>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wide">
                  Demo Mode
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Demo responses show what this agent can do. Subscribe to a plan for full AI-powered capabilities.
              </p>
              <AgentChat agentId={agent.id} agentName={agent.short_name} />
            </Card>

            {/* Related agents */}
            {relatedAgents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">More from {suiteName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedAgents.map((ra) => (
                    <Link key={ra.id} href={`/agents/${ra.id}`}>
                      <Card hover className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${CATEGORY_CONFIG[ra.category].bgColor} border shrink-0`}>
                            {CATEGORY_CONFIG[ra.category].icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{ra.short_name}</h3>
                            <p className="text-[10px] text-gray-400 truncate">{ra.tagline}</p>
                          </div>
                          <Badge variant={ra.tier === 'PRO' ? 'warning' : 'purple'} size="sm">
                            {TIER_CONFIG[ra.tier].label}
                          </Badge>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar: Pricing & Actions ── */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-28">

              {/* Price block */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-gray-900">
                    ${(agent.monthly_price / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400">/mo</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  or ${(agent.annual_price / 100).toFixed(2)}/yr&nbsp;
                  (save {Math.round((1 - agent.annual_price / (agent.monthly_price * 12)) * 100)}%)
                </p>
                {agent.one_time_price > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    One-time: ${(agent.one_time_price / 100).toFixed(2)}
                  </p>
                )}
              </div>

              {/* CTAs */}
              {STATUS_CONFIG[agent.agentStatus ?? 'live'].canDeploy ? (
                <Link href={`/auth/login?agent=${agent.id}`}>
                  <Button variant="primary" size="lg" className="w-full mb-3">
                    <Lock className="w-4 h-4" /> Subscribe to Agent
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="lg" className="w-full mb-3 opacity-60 cursor-not-allowed" disabled>
                  {agent.agentStatus === 'coming_soon' ? 'Coming Soon' : 'Demo Only'}
                </Button>
              )}
              <Link href="/pricing">
                <Button variant="outline" size="md" className="w-full">
                  Or get the {agent.tier === 'PRO' ? 'Growth' : 'Partner'} plan for all agents
                </Button>
              </Link>

              {/* Trust signals */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Privacy-first design
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  Instant activation
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Zap className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  Cancel anytime
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
