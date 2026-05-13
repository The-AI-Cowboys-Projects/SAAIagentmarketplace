import { create } from 'zustand'
import type { Agent, AgentCategory, PriceTier } from './types'

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
  applyFilters: () => void
}

export const useMarketplace = create<MarketplaceState>((set, get) => ({
  agents: [],
  filteredAgents: [],
  selectedBranch: 'ALL',
  selectedTier: 'ALL',
  selectedSuite: 'ALL',
  searchQuery: '',
  sortBy: 'rating',
  isAnnual: false,

  setAgents: (agents) => {
    set({ agents })
    get().applyFilters()
  },
  setBranch: (branch) => {
    set({ selectedBranch: branch, selectedSuite: 'ALL' })
    get().applyFilters()
  },
  setTier: (tier) => {
    set({ selectedTier: tier })
    get().applyFilters()
  },
  setSuite: (suite) => {
    set({ selectedSuite: suite })
    get().applyFilters()
  },
  setSearch: (query) => {
    set({ searchQuery: query })
    get().applyFilters()
  },
  setSortBy: (sort) => {
    set({ sortBy: sort })
    get().applyFilters()
  },
  toggleBilling: () => set((s) => ({ isAnnual: !s.isAnnual })),

  applyFilters: () => {
    const { agents, selectedBranch, selectedTier, selectedSuite, searchQuery, sortBy } = get()
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

    set({ filteredAgents: filtered })
  },
}))
