'use client'

/**
 * AgentCard.tsx — Light-mode agent listing card
 *
 * Usage:
 *   <AgentCard agent={agent} />
 */

import Link from 'next/link'
import { ArrowRight, Users, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { BRANCH_CONFIG, TIER_CONFIG, type Agent, type AgentStatus } from '@/lib/types'
import { useMarketplace } from '@/lib/store'

const STATUS_BADGE: Record<AgentStatus, { label: string; variant: 'success' | 'warning' | 'default' | 'purple' }> = {
  live:        { label: 'Live',        variant: 'success' },
  beta:        { label: 'Beta',        variant: 'warning' },
  demo:        { label: 'Demo',        variant: 'default' },
  coming_soon: { label: 'Coming Soon', variant: 'purple'  },
}

// Category-specific left-border accent colors
const CATEGORY_BORDER: Record<string, string> = {
  Civic:      'border-l-blue-500',
  Business:   'border-l-amber-500',
  Military:   'border-l-green-600',
  Healthcare: 'border-l-rose-500',
  Tourism:    'border-l-violet-500',
}

// Category icon background colors
const CATEGORY_ICON_BG: Record<string, string> = {
  Civic:      'bg-blue-100',
  Business:   'bg-amber-100',
  Military:   'bg-green-100',
  Healthcare: 'bg-rose-100',
  Tourism:    'bg-violet-100',
}

const TRENDING_THRESHOLD = 5000

export function AgentCard({ agent }: { agent: Agent }) {
  const isAnnual = useMarketplace((s) => s.isAnnual)
  const branch = BRANCH_CONFIG[agent.branch]
  const tier = TIER_CONFIG[agent.tier]
  const price = isAnnual ? agent.annual_price : agent.monthly_price
  const isTrending = agent.usage_count > TRENDING_THRESHOLD
  const borderAccent = CATEGORY_BORDER[agent.category] ?? 'border-l-gray-300'
  const iconBg = CATEGORY_ICON_BG[agent.category] ?? 'bg-gray-100'

  return (
    <Link
      href={`/agents/${agent.id}`}
      className={`
        block h-full group
        bg-white border border-gray-200 border-l-4 ${borderAccent}
        rounded-xl p-5 flex flex-col
        hover:border-gray-300 hover:shadow-md
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2
      `}
      aria-label={`View ${agent.short_name} agent details`}
    >
      {/* Status + trending badges */}
      <div className="flex items-center gap-2 mb-3">
        {agent.agentStatus && agent.agentStatus !== 'live' && (
          <Badge variant={STATUS_BADGE[agent.agentStatus].variant} size="sm">
            {STATUS_BADGE[agent.agentStatus].label}
          </Badge>
        )}
        {isTrending && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 w-fit">
            <TrendingUp className="w-2.5 h-2.5 text-amber-700" aria-hidden="true" />
            <span className="text-[9px] font-semibold tracking-wide text-amber-700 uppercase">
              Trending
            </span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Category icon */}
          <div
            className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center text-lg flex-shrink-0`}
            aria-hidden="true"
          >
            {/* Text-based icon — no emoji */}
            <span className="text-sm font-bold text-gray-600">
              {agent.category.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-navy-950 transition-colors duration-150 line-clamp-1 leading-tight">
              {agent.short_name}
            </h3>
            <span className={`text-[10px] font-medium tracking-wide ${branch.color}`}>
              {branch.label}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          <Badge variant={agent.tier === 'FREE' ? 'success' : agent.tier === 'PRO' ? 'warning' : 'purple'}>
            {tier.label}
          </Badge>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
        {agent.tagline || agent.description || 'Specialized San Antonio AI agent'}
      </p>

      {/* Stats row */}
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={agent.rating} count={agent.review_count} />
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <Users className="w-3 h-3" aria-hidden="true" />
          <span className="tabular-nums">{agent.usage_count.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer — price + CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Price */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-[10px] font-medium text-gray-400">$</span>
          <span className="text-base font-bold text-gray-900 tabular-nums">
            {(price / 100).toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-400 ml-0.5">
            /{isAnnual ? 'yr' : 'mo'}
          </span>
        </div>

        {/* View details */}
        <span className="flex items-center gap-1 text-[11px] font-semibold text-navy-700 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          View Details
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
