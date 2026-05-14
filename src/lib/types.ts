export type AgentCategory = 'Civic' | 'Business' | 'Military' | 'Healthcare' | 'Tourism'
export type AgentStatus = 'live' | 'beta' | 'demo' | 'coming_soon'
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
  agentStatus: AgentStatus
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

// Text labels with color dots — no emojis
export const CATEGORY_CONFIG: Record<AgentCategory, { label: string; color: string; bgColor: string; icon: string }> = {
  Civic:      { label: 'Civic',      color: 'text-blue-600',   bgColor: 'bg-blue-50 border-blue-200',   icon: 'CI' },
  Business:   { label: 'Business',   color: 'text-amber-600',  bgColor: 'bg-amber-50 border-amber-200', icon: 'BU' },
  Military:   { label: 'Military',   color: 'text-green-700',  bgColor: 'bg-green-50 border-green-200', icon: 'MI' },
  Healthcare: { label: 'Healthcare', color: 'text-rose-600',   bgColor: 'bg-rose-50 border-rose-200',   icon: 'HC' },
  Tourism:    { label: 'Tourism',    color: 'text-violet-600', bgColor: 'bg-violet-50 border-violet-200',icon: 'TO' },
}

// Keep BRANCH_CONFIG as alias for backward compatibility
export const BRANCH_CONFIG = CATEGORY_CONFIG

export const TIER_CONFIG: Record<PriceTier, { label: string; color: string; bgColor: string }> = {
  FREE:       { label: 'Free',       color: 'text-green-700',  bgColor: 'bg-green-50 border-green-200'   },
  PRO:        { label: 'Pro',        color: 'text-navy-700',   bgColor: 'bg-navy-50 border-navy-200'     },
  ENTERPRISE: { label: 'Enterprise', color: 'text-violet-700', bgColor: 'bg-violet-50 border-violet-200' },
}

// Keep MilitaryBranch as type alias for backward compat
export type MilitaryBranch = AgentCategory
