'use client'

/**
 * AgentFilters.tsx — Light-mode filter bar for the agents page
 *
 * Usage:
 *   <AgentFilters />
 *
 * Reads and writes zustand store state:
 *   selectedBranch, selectedTier, searchQuery, sortBy, isAnnual, filteredAgents, agents
 *   setBranch, setTier, setSearch, setSortBy, toggleBilling
 */

import { Search, X, RotateCcw, TrendingUp, Star, DollarSign, SortAsc, Shield, Building2 } from 'lucide-react'
import { useMarketplace } from '@/lib/store'
import { CATEGORY_CONFIG, TIER_CONFIG, type AgentCategory, type PriceTier } from '@/lib/types'
import { clsx } from 'clsx'

const SORT_OPTIONS: { value: 'rating' | 'usage' | 'name' | 'price'; label: string; icon: React.ReactNode }[] = [
  { value: 'rating', label: 'Top Rated', icon: <Star className="w-3 h-3"      aria-hidden="true" /> },
  { value: 'usage',  label: 'Most Used', icon: <TrendingUp className="w-3 h-3" aria-hidden="true" /> },
  { value: 'name',   label: 'Name',      icon: <SortAsc className="w-3 h-3"    aria-hidden="true" /> },
  { value: 'price',  label: 'Price',     icon: <DollarSign className="w-3 h-3" aria-hidden="true" /> },
]

const TIER_ICONS: Record<string, React.ReactNode> = {
  PRO:        <Shield   className="w-3 h-3" aria-hidden="true" />,
  ENTERPRISE: <Building2 className="w-3 h-3" aria-hidden="true" />,
}


export function AgentFilters() {
  const {
    selectedBranch, selectedTier, searchQuery, sortBy,
    filteredAgents, agents, isAnnual,
    setBranch, setTier, setSearch, setSortBy, toggleBilling,
  } = useMarketplace()

  const branches = Object.entries(CATEGORY_CONFIG) as [AgentCategory, typeof CATEGORY_CONFIG[AgentCategory]][]
  const tiers    = Object.entries(TIER_CONFIG)    as [PriceTier,     typeof TIER_CONFIG[PriceTier]][]

  const isFiltered =
    selectedBranch !== 'ALL' ||
    selectedTier   !== 'ALL' ||
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search 70 agents..."
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search agents"
          className={clsx(
            'w-full h-10 pl-10 pr-9 rounded-lg text-sm text-gray-900',
            'bg-white border border-gray-300',
            'placeholder:text-gray-400',
            'transition-all duration-150',
            'focus:outline-none focus:border-navy-500',
            'focus:ring-2 focus:ring-navy-500/20',
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors duration-150"
          >
            <X className="w-3 h-3 text-gray-600" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2.5">
          Category
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {/* All pill */}
          <button
            onClick={() => setBranch('ALL')}
            className={clsx(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              'border transition-all duration-150 select-none',
              selectedBranch === 'ALL'
                ? 'bg-navy-950 border-navy-950 text-white'
                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
            )}
          >
            All
            <span className="text-[9px] opacity-70 tabular-nums">({agents.length})</span>
          </button>

          {branches.map(([key, config]) => {
            const count  = agents.filter((a) => a.category === key).length
            const active = selectedBranch === key
            const dot    = config.dotColor
            return (
              <button
                key={key}
                onClick={() => setBranch(key)}
                className={clsx(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                  'border transition-all duration-150 select-none',
                  active
                    ? 'bg-navy-950 border-navy-950 text-white'
                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                )}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-white/60' : dot}`} aria-hidden="true" />
                {config.label}
                <span className="text-[9px] opacity-60 tabular-nums">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tier segmented control */}
      <div>
        <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2.5">
          Tier
        </h3>
        <div className="inline-flex items-center gap-px p-1 rounded-lg bg-gray-100 border border-gray-200">
          <button
            onClick={() => setTier('ALL')}
            className={clsx(
              'px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 select-none',
              selectedTier === 'ALL'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            All
          </button>

          {tiers.map(([key, config]) => (
            <button
              key={key}
              onClick={() => setTier(key)}
              className={clsx(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium',
                'transition-all duration-150 select-none',
                selectedTier === key
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {TIER_ICONS[key]}
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort + Billing row */}
      <div className="flex items-end gap-4 flex-wrap">

        {/* Sort */}
        <div className="flex-1 min-w-[160px]">
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2.5">
            Sort by
          </h3>
          <div className="inline-flex items-center gap-px p-1 rounded-lg bg-gray-100 border border-gray-200 w-full">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className={clsx(
                  'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium flex-1 justify-center',
                  'transition-all duration-150 select-none',
                  sortBy === opt.value
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
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
          <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2.5">
            Billing
          </h3>
          <button
            onClick={toggleBilling}
            aria-pressed={isAnnual}
            className={clsx(
              'relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium',
              'border transition-all duration-150 select-none',
              isAnnual
                ? 'bg-navy-950 border-navy-950 text-white'
                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
            )}
          >
            {/* Track */}
            <span
              className={clsx(
                'relative inline-flex w-8 h-4 rounded-full border transition-all duration-200 flex-shrink-0',
                isAnnual
                  ? 'bg-white/30 border-white/40'
                  : 'bg-gray-200 border-gray-300'
              )}
              aria-hidden="true"
            >
              {/* Thumb */}
              <span
                className={clsx(
                  'absolute top-0.5 w-3 h-3 rounded-full shadow-sm transition-all duration-200',
                  isAnnual
                    ? 'left-[17px] bg-white'
                    : 'left-0.5 bg-gray-400'
                )}
              />
            </span>

            <span>{isAnnual ? 'Annual' : 'Monthly'}</span>

            {/* Save badge */}
            <span
              className={clsx(
                'absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-wide',
                'bg-green-500 text-white',
                'transition-all duration-200',
                isAnnual ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
              )}
              aria-label={isAnnual ? 'Save 20% with annual billing' : undefined}
            >
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* Results count + Reset */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-gray-500">
          Showing{' '}
          <span className="text-gray-900 font-semibold tabular-nums">{filteredAgents.length}</span>
          {' '}of{' '}
          <span className="text-gray-700 tabular-nums">{agents.length}</span>
          {' '}agents
        </p>

        {isFiltered && (
          <button
            onClick={resetFilters}
            className={clsx(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium',
              'border border-gray-300 bg-white text-gray-500',
              'hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400',
              'transition-all duration-150'
            )}
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            Reset
          </button>
        )}
      </div>

    </div>
  )
}
