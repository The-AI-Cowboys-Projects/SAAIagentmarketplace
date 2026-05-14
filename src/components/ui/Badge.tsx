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
          'bg-gray-100 text-gray-600 border-gray-200':          variant === 'default',
          'bg-green-50 text-green-700 border-green-200':        variant === 'success',
          'bg-amber-50 text-amber-700 border-amber-200':        variant === 'warning',
          'bg-red-50 text-red-700 border-red-200':              variant === 'danger',
          'bg-sky-50 text-sky-700 border-sky-200':              variant === 'info',
          'bg-violet-50 text-violet-700 border-violet-200':     variant === 'purple',
        },
        {
          'px-2 py-0.5 text-[10px]': size === 'sm',
          'px-2.5 py-1 text-xs':     size === 'md',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
