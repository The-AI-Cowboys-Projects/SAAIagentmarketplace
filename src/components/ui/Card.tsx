/**
 * Card.tsx — Light-mode card component
 *
 * Usage:
 *   <Card hover>Content</Card>
 *   <Card className="p-6">Custom padding</Card>
 */

import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover = false, glow = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl border border-gray-200 bg-white',
        hover && 'cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all duration-200',
        glow && 'shadow-sm',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
