export type AgentCategory = 'Civic' | 'Business' | 'Military' | 'Healthcare' | 'Tourism' | 'Connect360'
export type AgentStatus = 'live' | 'beta' | 'demo' | 'coming_soon'
export type PriceTier = 'PRO' | 'ENTERPRISE'

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

export interface CategoryStyle {
  label: string
  color: string
  bgColor: string
  icon: string
  borderColor: string
  dotColor: string
  textColor: string
  iconBg: string
  href: string
}

export const CATEGORY_CONFIG: Record<AgentCategory, CategoryStyle> = {
  Civic:      { label: 'Civic',       color: 'text-blue-600',   bgColor: 'bg-blue-50 border-blue-200',    icon: 'CI', borderColor: 'border-l-blue-500',   dotColor: 'bg-blue-500',   textColor: 'text-blue-700',   iconBg: 'bg-blue-100',   href: '/agents?branch=Civic'      },
  Business:   { label: 'Business',    color: 'text-amber-600',  bgColor: 'bg-amber-50 border-amber-200',  icon: 'BU', borderColor: 'border-l-amber-500',  dotColor: 'bg-amber-500',  textColor: 'text-amber-700',  iconBg: 'bg-amber-100',  href: '/agents?branch=Business'   },
  Military:   { label: 'Military',    color: 'text-green-700',  bgColor: 'bg-green-50 border-green-200',  icon: 'MI', borderColor: 'border-l-green-600',  dotColor: 'bg-green-600',  textColor: 'text-green-700',  iconBg: 'bg-green-100',  href: '/agents?branch=Military'   },
  Healthcare: { label: 'Healthcare',  color: 'text-rose-600',   bgColor: 'bg-rose-50 border-rose-200',    icon: 'HC', borderColor: 'border-l-rose-500',   dotColor: 'bg-rose-500',   textColor: 'text-rose-700',   iconBg: 'bg-rose-100',   href: '/agents?branch=Healthcare' },
  Tourism:    { label: 'Tourism',     color: 'text-violet-600', bgColor: 'bg-violet-50 border-violet-200', icon: 'TO', borderColor: 'border-l-violet-500', dotColor: 'bg-violet-500', textColor: 'text-violet-700', iconBg: 'bg-violet-100', href: '/agents?branch=Tourism'    },
  Connect360: { label: 'Connect-360', color: 'text-navy-700',   bgColor: 'bg-navy-50 border-navy-200',    icon: 'C3', borderColor: 'border-l-navy-700',   dotColor: 'bg-navy-700',   textColor: 'text-navy-700',   iconBg: 'bg-navy-100',   href: '/agents?branch=Connect360' },
}

export const STATUS_CONFIG: Record<AgentStatus, { label: string; variant: 'success' | 'warning' | 'default' | 'purple'; canDeploy: boolean }> = {
  live:        { label: 'Live',        variant: 'success', canDeploy: true  },
  beta:        { label: 'Beta',        variant: 'warning', canDeploy: true  },
  demo:        { label: 'Demo',        variant: 'default', canDeploy: false },
  coming_soon: { label: 'Coming Soon', variant: 'purple',  canDeploy: false },
}

export const TIER_CONFIG: Record<PriceTier, { label: string; color: string; bgColor: string }> = {
  PRO:        { label: 'Pro',        color: 'text-navy-700',   bgColor: 'bg-navy-50 border-navy-200'     },
  ENTERPRISE: { label: 'Enterprise', color: 'text-violet-700', bgColor: 'bg-violet-50 border-violet-200' },
}

