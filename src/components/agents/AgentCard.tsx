'use client'
import Link from 'next/link'
import { ArrowRight, Users, TrendingUp, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { BRANCH_CONFIG, TIER_CONFIG, type Agent } from '@/lib/types'
import { useMarketplace } from '@/lib/store'

// Category-specific glow colors for the icon container and card accent
const CATEGORY_GLOW: Record<string, string> = {
  Civic:      'shadow-[0_0_14px_2px_rgba(96,165,250,0.25)]',
  Business:   'shadow-[0_0_14px_2px_rgba(52,211,153,0.25)]',
  Military:   'shadow-[0_0_14px_2px_rgba(251,191,36,0.25)]',
  Healthcare: 'shadow-[0_0_14px_2px_rgba(251,113,133,0.25)]',
  Tourism:    'shadow-[0_0_14px_2px_rgba(167,139,250,0.25)]',
}

// Subtle dot-matrix background texture tinted per category
const CATEGORY_TEXTURE: Record<string, string> = {
  Civic:      'bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.04)_0%,transparent_60%)]',
  Business:   'bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.04)_0%,transparent_60%)]',
  Military:   'bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.04)_0%,transparent_60%)]',
  Healthcare: 'bg-[radial-gradient(circle_at_top_right,rgba(251,113,133,0.04)_0%,transparent_60%)]',
  Tourism:    'bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.04)_0%,transparent_60%)]',
}

// Per-category gradient border color stop used in the conic-gradient ring
const CATEGORY_RING_COLOR: Record<string, string> = {
  Civic:      '#60a5fa',
  Business:   '#34d399',
  Military:   '#fbbf24',
  Healthcare: '#fb7185',
  Tourism:    '#a78bfa',
}

const TRENDING_THRESHOLD = 5000

/*
 * Usage:
 *   <AgentCard agent={agent} />
 *
 * The animated gradient border is driven by a CSS custom property
 * (--ring-color) set via an inline style, so Tailwind's purge does
 * not need to know the exact color at build time.
 *
 * The shimmer sweep uses a ::after pseudo-element declared in
 * globals.css (.card-shimmer / .card-shimmer:hover::after).
 * If you prefer a fully self-contained component, the keyframe is
 * also injected via a <style> tag below.
 */
export function AgentCard({ agent }: { agent: Agent }) {
  const isAnnual = useMarketplace((s) => s.isAnnual)
  const branch = BRANCH_CONFIG[agent.branch]
  const tier = TIER_CONFIG[agent.tier]
  const price = isAnnual ? agent.annual_price : agent.monthly_price
  const isTrending = agent.usage_count > TRENDING_THRESHOLD
  const ringColor = CATEGORY_RING_COLOR[agent.category] ?? '#f59e0b'
  const glowClass = CATEGORY_GLOW[agent.category] ?? ''
  const textureClass = CATEGORY_TEXTURE[agent.category] ?? ''

  return (
    <>
      {/* Scoped keyframes — injected once per mount; harmless duplicates on multi-card pages */}
      <style>{`
        @keyframes ring-spin {
          from { --ring-angle: 0deg; }
          to   { --ring-angle: 360deg; }
        }
        @keyframes shimmer-sweep {
          0%   { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        @property --ring-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
        .agent-card-ring {
          position: relative;
          border-radius: 1rem;
        }
        .agent-card-ring::before {
          content: '';
          position: absolute;
          inset: -1.5px;
          border-radius: inherit;
          padding: 1.5px;
          background: conic-gradient(
            from var(--ring-angle),
            transparent 0deg,
            transparent 200deg,
            var(--ring-color) 280deg,
            transparent 360deg
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .agent-card-ring:hover::before {
          opacity: 1;
          animation: ring-spin 2.8s linear infinite;
        }
        .agent-card-shimmer {
          overflow: hidden;
        }
        .agent-card-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 35%;
          height: 100%;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255,255,255,0.045) 50%,
            transparent 80%
          );
          transform: translateX(-100%) skewX(-20deg);
          pointer-events: none;
        }
        .agent-card-shimmer:hover::after {
          animation: shimmer-sweep 0.65s ease forwards;
        }
      `}</style>

      <Link href={`/agents/${agent.id}`} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 rounded-2xl">
        <div
          className={[
            /* base glass surface */
            'glass rounded-2xl p-5 h-full flex flex-col',
            /* branch tint texture */
            textureClass,
            /* hover lift + scale */
            'transition-all duration-300 ease-out',
            'hover:scale-[1.025] hover:-translate-y-[3px]',
            /* layered depth shadows */
            'shadow-[0_2px_8px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.4)]',
            'hover:shadow-[0_8px_32px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.4)]',
            /* ring + shimmer wrappers */
            'agent-card-ring agent-card-shimmer',
            /* relative so shimmer pseudo-el is positioned correctly */
            'relative',
          ].join(' ')}
          style={{ '--ring-color': ringColor } as React.CSSProperties}
        >
          {/* Trending / Popular badge */}
          {isTrending && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/15 border border-brand-500/25 backdrop-blur-sm z-10">
              <TrendingUp className="w-2.5 h-2.5 text-brand-400" />
              <span className="text-[9px] font-semibold tracking-wide text-brand-300 uppercase">
                Trending
              </span>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Branch icon with colored glow */}
              <div
                className={[
                  'w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
                  branch.bgColor,
                  'border transition-all duration-300',
                  `group-hover:${glowClass}`,
                  glowClass,
                ].join(' ')}
              >
                {branch.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white hover:text-brand-300 transition-colors line-clamp-1 leading-tight">
                  {agent.short_name}
                </h3>
                <span className={`text-[10px] font-medium tracking-wide ${branch.color}`}>
                  {branch.label}
                </span>
              </div>
            </div>
            {/* Tier badge — only show when trending badge is absent to prevent overlap, otherwise shift left */}
            <div className={isTrending ? 'mt-7' : ''}>
              <Badge variant={agent.tier === 'FREE' ? 'success' : agent.tier === 'PRO' ? 'warning' : 'purple'}>
                {tier.label}
              </Badge>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xs text-midnight-400 leading-relaxed mb-4 line-clamp-2 flex-1">
            {agent.tagline || agent.description || 'Specialized San Antonio AI agent'}
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-between mb-4">
            <StarRating rating={agent.rating} count={agent.review_count} />
            <div className="flex items-center gap-1.5 text-[10px] text-midnight-500">
              <Users className="w-3 h-3" />
              <span className="tabular-nums">{agent.usage_count.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer — price + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
            {/* Price block */}
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-medium text-midnight-500">$</span>
              <span className="text-base font-bold text-white tracking-tight tabular-nums">
                {(price / 100).toFixed(2)}
              </span>
              <span className="text-[10px] text-midnight-500 ml-0.5">
                /{isAnnual ? 'yr' : 'mo'}
              </span>
            </div>

            {/* View details CTA */}
            <span className="flex items-center gap-1 text-[11px] font-medium text-brand-400 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
              View Details <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </>
  )
}
