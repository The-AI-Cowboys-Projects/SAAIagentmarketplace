export type AgentCategory = 'Civic' | 'Business' | 'Military' | 'Healthcare' | 'Tourism'
export type PriceTier = 'FREE' | 'PRO' | 'ENTERPRISE'

export interface Agent {
  id: string
  slug: string
  name: string
  category: AgentCategory
  tier: PriceTier
  description: string
  longDescription?: string
  icon: string
  capabilities: string[]
  rating: number
  deployCount: number
  // kept for backward compatibility with existing components
  short_name: string
  tagline: string | null
  active: boolean
  monthly_price: number
  annual_price: number
  one_time_price: number
  review_count: number
  usage_count: number
  featured: boolean
  demo_available: boolean
  created_at: string
  // Legacy alias
  branch: AgentCategory
  suite: string
}

export interface Plan {
  id: string
  name: string
  price: string
  priceNote?: string
  tagline: string
  features: string[]
  agentCount: number | 'unlimited'
  highlight?: boolean
  badge?: string
  description: string | null
  monthly_price: number
  annual_price: number
  agent_tier: string
  max_agents: number
  tokens_per_month: number
  highlighted: boolean
}

export interface Review {
  id: string
  user_id: string
  agent_id: string
  rating: number
  title: string | null
  body: string | null
  helpful_count: number
  created_at: string
  profiles?: { full_name: string; avatar_url: string }
}

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  plan: string
  stripe_customer_id: string | null
}

export const CATEGORY_CONFIG: Record<AgentCategory, { label: string; color: string; bgColor: string; icon: string }> = {
  Civic: { label: 'Civic', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/20', icon: '🏛️' },
  Business: { label: 'Business', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20', icon: '💼' },
  Military: { label: 'Military', color: 'text-amber-400', bgColor: 'bg-amber-500/10 border-amber-500/20', icon: '🎖️' },
  Healthcare: { label: 'Healthcare', color: 'text-rose-400', bgColor: 'bg-rose-500/10 border-rose-500/20', icon: '🏥' },
  Tourism: { label: 'Tourism', color: 'text-violet-400', bgColor: 'bg-violet-500/10 border-violet-500/20', icon: '🗺️' },
}

// Keep BRANCH_CONFIG as alias for backward compatibility
export const BRANCH_CONFIG = CATEGORY_CONFIG

export const TIER_CONFIG: Record<PriceTier, { label: string; color: string; bgColor: string }> = {
  FREE: { label: 'Free', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20' },
  PRO: { label: 'Pro', color: 'text-brand-400', bgColor: 'bg-brand-500/10 border-brand-500/20' },
  ENTERPRISE: { label: 'Enterprise', color: 'text-violet-400', bgColor: 'bg-violet-500/10 border-violet-500/20' },
}

// Keep MilitaryBranch as type alias for backward compat
export type MilitaryBranch = AgentCategory
