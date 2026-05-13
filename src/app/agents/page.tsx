'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMarketplace } from '@/lib/store'
import { AgentCard } from '@/components/agents/AgentCard'
import { AgentFilters } from '@/components/agents/AgentFilters'
import { SA_AGENTS } from '@/lib/agents-data'
import type { AgentCategory } from '@/lib/types'

function AgentsContent() {
  const searchParams = useSearchParams()
  const { filteredAgents, setAgents, setBranch } = useMarketplace()

  useEffect(() => {
    setAgents(SA_AGENTS)
  }, [])

  useEffect(() => {
    const branch = searchParams.get('branch')
    if (branch) setBranch(branch as AgentCategory)
  }, [searchParams])

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Agent <span className="gradient-text">Marketplace</span>
          </h1>
          <p className="text-midnight-400">
            50 specialized AI agents built for San Antonio
          </p>
        </div>

        <AgentFilters />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-midnight-400">No agents match your filters.</p>
            <button
              onClick={() => {
                useMarketplace.getState().setBranch('ALL')
                useMarketplace.getState().setTier('ALL')
                useMarketplace.getState().setSearch('')
              }}
              className="mt-4 text-brand-400 hover:text-brand-300 text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AgentsContent />
    </Suspense>
  )
}
