import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full border',
        {
          'bg-midnight-800/80 text-midnight-300 border-midnight-700': variant === 'default',
          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': variant === 'success',
          'bg-brand-500/10 text-brand-400 border-brand-500/20': variant === 'warning',
          'bg-red-500/10 text-red-400 border-red-500/20': variant === 'danger',
          'bg-sky-500/10 text-sky-400 border-sky-500/20': variant === 'info',
          'bg-violet-500/10 text-violet-400 border-violet-500/20': variant === 'purple',
        },
        {
          'px-2 py-0.5 text-[10px]': size === 'sm',
          'px-2.5 py-1 text-xs': size === 'md',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
