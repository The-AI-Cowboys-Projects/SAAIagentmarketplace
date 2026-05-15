import { create } from 'zustand'
import type { Agent, AgentCategory, PriceTier } from './types'
import { SA_AGENTS } from './agents-data'

interface MarketplaceState {
  agents: Agent[]
  filteredAgents: Agent[]
  selectedBranch: AgentCategory | 'ALL'
  selectedTier: PriceTier | 'ALL'
  selectedSuite: string | 'ALL'
  searchQuery: string
  sortBy: 'name' | 'rating' | 'usage' | 'price'
  isAnnual: boolean

  setAgents: (agents: Agent[]) => void
  setBranch: (branch: AgentCategory | 'ALL') => void
  setTier: (tier: PriceTier | 'ALL') => void
  setSuite: (suite: string | 'ALL') => void
  setSearch: (query: string) => void
  setSortBy: (sort: 'name' | 'rating' | 'usage' | 'price') => void
  toggleBilling: () => void
}

function computeFiltered(state: {
  agents: Agent[]
  selectedBranch: AgentCategory | 'ALL'
  selectedTier: PriceTier | 'ALL'
  selectedSuite: string | 'ALL'
  searchQuery: string
  sortBy: 'name' | 'rating' | 'usage' | 'price'
}): Agent[] {
  const { agents, selectedBranch, selectedTier, selectedSuite, searchQuery, sortBy } = state
  let filtered = [...agents]

  if (selectedBranch !== 'ALL') filtered = filtered.filter((a) => a.category === selectedBranch)
  if (selectedTier !== 'ALL') filtered = filtered.filter((a) => a.tier === selectedTier)
  if (selectedSuite !== 'ALL') filtered = filtered.filter((a) => a.suite === selectedSuite)
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.short_name.toLowerCase().includes(q) ||
        (a.tagline && a.tagline.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q))
    )
  }

  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name)
      case 'rating': return b.rating - a.rating
      case 'usage': return b.usage_count - a.usage_count
      case 'price': return a.monthly_price - b.monthly_price
      default: return 0
    }
  })

  return filtered
}

// Pre-compute initial filtered list so the store never starts empty
const initialAgents = SA_AGENTS
const initialFiltered = computeFiltered({
  agents: initialAgents,
  selectedBranch: 'ALL',
  selectedTier: 'ALL',
  selectedSuite: 'ALL',
  searchQuery: '',
  sortBy: 'rating',
})

export const useMarketplace = create<MarketplaceState>((set, get) => ({
  agents: initialAgents,
  filteredAgents: initialFiltered,
  selectedBranch: 'ALL',
  selectedTier: 'ALL',
  selectedSuite: 'ALL',
  searchQuery: '',
  sortBy: 'rating',
  isAnnual: false,

  setAgents: (agents) => {
    const state = { ...get(), agents }
    set({ agents, filteredAgents: computeFiltered(state) })
  },
  setBranch: (branch) => {
    const state = { ...get(), selectedBranch: branch, selectedSuite: 'ALL' as const }
    set({ selectedBranch: branch, selectedSuite: 'ALL', filteredAgents: computeFiltered(state) })
  },
  setTier: (tier) => {
    const state = { ...get(), selectedTier: tier }
    set({ selectedTier: tier, filteredAgents: computeFiltered(state) })
  },
  setSuite: (suite) => {
    const state = { ...get(), selectedSuite: suite }
    set({ selectedSuite: suite, filteredAgents: computeFiltered(state) })
  },
  setSearch: (query) => {
    const state = { ...get(), searchQuery: query }
    set({ searchQuery: query, filteredAgents: computeFiltered(state) })
  },
  setSortBy: (sort) => {
    const state = { ...get(), sortBy: sort }
    set({ sortBy: sort, filteredAgents: computeFiltered(state) })
  },
  toggleBilling: () => set((s) => ({ isAnnual: !s.isAnnual })),
}))
