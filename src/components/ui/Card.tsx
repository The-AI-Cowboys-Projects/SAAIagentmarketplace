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
        'rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm',
        hover && 'cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300',
        glow && 'card-glow card-glow-hover',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
