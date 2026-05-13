'use client'
import { Search, X, RotateCcw, TrendingUp, Star, DollarSign, SortAsc, Zap, Shield, Building2 } from 'lucide-react'
import { useMarketplace } from '@/lib/store'
import { BRANCH_CONFIG, TIER_CONFIG, type MilitaryBranch, type PriceTier } from '@/lib/types'
import { clsx } from 'clsx'

// Solid accent colors used for category pill active borders/backgrounds
const CATEGORY_ACTIVE_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  Civic:      { bg: 'bg-blue-500/15',    border: 'border-blue-500/40',    text: 'text-blue-300'    },
  Business:   { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-300' },
  Military:   { bg: 'bg-amber-500/15',   border: 'border-amber-500/40',   text: 'text-amber-300'   },
  Healthcare: { bg: 'bg-rose-500/15',    border: 'border-rose-500/40',    text: 'text-rose-300'    },
  Tourism:    { bg: 'bg-violet-500/15',  border: 'border-violet-500/40',  text: 'text-violet-300'  },
}

const SORT_OPTIONS: { value: 'rating' | 'usage' | 'name' | 'price'; label: string; icon: React.ReactNode }[] = [
  { value: 'rating', label: 'Top Rated',  icon: <Star className="w-3 h-3" /> },
  { value: 'usage',  label: 'Most Used',  icon: <TrendingUp className="w-3 h-3" /> },
  { value: 'name',   label: 'Name',       icon: <SortAsc className="w-3 h-3" /> },
  { value: 'price',  label: 'Price',      icon: <DollarSign className="w-3 h-3" /> },
]

const TIER_ICONS: Record<string, React.ReactNode> = {
  FREE:       <Zap className="w-3 h-3" />,
  PRO:        <Shield className="w-3 h-3" />,
  ENTERPRISE: <Building2 className="w-3 h-3" />,
}

/*
 * Usage:
 *   <AgentFilters />
 *
 * Reads and writes zustand store state:
 *   selectedBranch, selectedTier, searchQuery, sortBy, isAnnual, filteredAgents, agents
 *   setBranch, setTier, setSearch, setSortBy, toggleBilling
 */
export function AgentFilters() {
  const {
    selectedBranch, selectedTier, searchQuery, sortBy,
    filteredAgents, agents, isAnnual,
    setBranch, setTier, setSearch, setSortBy, toggleBilling,
  } = useMarketplace()

  const branches = Object.entries(BRANCH_CONFIG) as [MilitaryBranch, typeof BRANCH_CONFIG[MilitaryBranch]][]
  const tiers = Object.entries(TIER_CONFIG) as [PriceTier, typeof TIER_CONFIG[PriceTier]][]

  const isFiltered =
    selectedBranch !== 'ALL' ||
    selectedTier !== 'ALL' ||
    searchQuery.trim().length > 0 ||
    sortBy !== 'rating'

  function resetFilters() {
    setBranch('ALL')
    setTier('ALL')
    setSearch('')
    setSortBy('rating')
  }

  return (
    <div className="space-y-5">

      {/* ── Search input ── */}
      <div className="relative group/search">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-500 pointer-events-none transition-colors group-focus-within/search:text-brand-400" />
        <input
          type="text"
          placeholder="Search 50 agents..."
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          className={clsx(
            'w-full h-11 pl-10 pr-9 rounded-xl text-sm text-white',
            'bg-white/[0.03] border border-white/[0.07]',
            'placeholder:text-midnight-600',
            'transition-all duration-200',
            'focus:outline-none focus:border-brand-500/50',
            'focus:ring-2 focus:ring-brand-500/15 focus:bg-white/[0.05]',
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-midnight-700 hover:bg-midnight-600 transition-colors"
          >
            <X className="w-3 h-3 text-midnight-300" />
          </button>
        )}
      </div>

      {/* ── Branch pill selectors ── */}
      <div>
        <h3 className="text-[10px] font-semibold text-midnight-500 uppercase tracking-widest mb-2.5">
          Category
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {/* "All" pill */}
          <button
            onClick={() => setBranch('ALL')}
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              'border transition-all duration-200 select-none',
              selectedBranch === 'ALL'
                ? 'bg-brand-500/15 border-brand-500/40 text-brand-300 shadow-[0_0_10px_rgba(245,158,11,0.12)]'
                : 'bg-white/[0.03] border-white/[0.08] text-midnight-400 hover:bg-white/[0.06] hover:text-white hover:border-white/[0.15]'
            )}
          >
            All
            <span className="text-[9px] opacity-60 tabular-nums">({agents.length})</span>
          </button>

          {branches.map(([key, config]) => {
            const count = agents.filter((a) => a.category === key).length
            const active = selectedBranch === key
            const s = CATEGORY_ACTIVE_STYLE[key]
            return (
              <button
                key={key}
                onClick={() => setBranch(key)}
                className={clsx(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                  'border transition-all duration-200 select-none',
                  active
                    ? `${s.bg} ${s.border} ${s.text} shadow-[0_0_10px_rgba(0,0,0,0.3)]`
                    : 'bg-white/[0.03] border-white/[0.08] text-midnight-400 hover:bg-white/[0.06] hover:text-white hover:border-white/[0.15]'
                )}
              >
                <span className="text-sm leading-none">{config.icon}</span>
                {config.label}
                <span className="text-[9px] opacity-60 tabular-nums">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tier segmented control ── */}
      <div>
        <h3 className="text-[10px] font-semibold text-midnight-500 uppercase tracking-widest mb-2.5">
          Tier
        </h3>
        <div className="inline-flex items-center gap-px p-1 rounded-xl bg-white/[0.03] border border-white/[0.07]">
          {/* All option */}
          <button
            onClick={() => setTier('ALL')}
            className={clsx(
              'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none',
              selectedTier === 'ALL'
                ? 'bg-brand-500/20 text-brand-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                : 'text-midnight-500 hover:text-midnight-300'
            )}
          >
            All
          </button>

          {tiers.map(([key, config]) => (
            <button
              key={key}
              onClick={() => setTier(key)}
              className={clsx(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium',
                'transition-all duration-200 select-none',
                selectedTier === key
                  ? `${config.bgColor} ${config.color} shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`
                  : 'text-midnight-500 hover:text-midnight-300'
              )}
            >
              {TIER_ICONS[key]}
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sort + Billing row ── */}
      <div className="flex items-end gap-4 flex-wrap">

        {/* Sort select */}
        <div className="flex-1 min-w-[160px]">
          <h3 className="text-[10px] font-semibold text-midnight-500 uppercase tracking-widest mb-2.5">
            Sort by
          </h3>
          <div className="inline-flex items-center gap-px p-1 rounded-xl bg-white/[0.03] border border-white/[0.07] w-full">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={clsx(
                  'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex-1 justify-center',
                  'transition-all duration-200 select-none',
                  sortBy === opt.value
                    ? 'bg-brand-500/20 text-brand-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                    : 'text-midnight-500 hover:text-midnight-300'
                )}
              >
                {opt.icon}
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Billing toggle */}
        <div>
          <h3 className="text-[10px] font-semibold text-midnight-500 uppercase tracking-widest mb-2.5">
            Billing
          </h3>
          <button
            onClick={toggleBilling}
            aria-pressed={isAnnual}
            className={clsx(
              'relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium',
              'border transition-all duration-200 select-none',
              isAnnual
                ? 'bg-brand-500/15 border-brand-500/35 text-brand-300'
                : 'bg-white/[0.03] border-white/[0.08] text-midnight-400 hover:text-white hover:border-white/[0.15]'
            )}
          >
            {/* Track */}
            <span
              className={clsx(
                'relative inline-flex w-8 h-4 rounded-full border transition-all duration-300 flex-shrink-0',
                isAnnual
                  ? 'bg-brand-500/40 border-brand-500/60'
                  : 'bg-white/[0.05] border-white/[0.12]'
              )}
            >
              {/* Thumb */}
              <span
                className={clsx(
                  'absolute top-0.5 w-3 h-3 rounded-full shadow-sm transition-all duration-300',
                  isAnnual
                    ? 'left-[17px] bg-brand-400'
                    : 'left-0.5 bg-midnight-400'
                )}
              />
            </span>

            <span>{isAnnual ? 'Annual' : 'Monthly'}</span>

            {/* Save badge — appears when annual is on */}
            <span
              className={clsx(
                'absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-wide',
                'bg-emerald-500 text-white shadow-[0_0_8px_rgba(34,197,94,0.4)]',
                'transition-all duration-300',
                isAnnual ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
              )}
            >
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* ── Results count + Reset ── */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-midnight-500">
          Showing{' '}
          <span className="text-white font-semibold tabular-nums">{filteredAgents.length}</span>
          {' '}of{' '}
          <span className="text-midnight-300 tabular-nums">{agents.length}</span>
          {' '}agents
        </p>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className={clsx(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium',
              'border border-white/[0.08] bg-white/[0.03] text-midnight-400',
              'hover:bg-white/[0.06] hover:text-white hover:border-white/[0.15]',
              'transition-all duration-200'
            )}
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

    </div>
  )
}
