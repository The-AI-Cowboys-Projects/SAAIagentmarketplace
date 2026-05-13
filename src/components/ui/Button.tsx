'use client'
import { clsx } from 'clsx'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  href?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-950',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-r from-brand-500 to-amber-500 text-midnight-950 hover:from-brand-400 hover:to-amber-400 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30': variant === 'primary',
            'bg-midnight-800 text-midnight-100 hover:bg-midnight-700 border border-midnight-700': variant === 'secondary',
            'text-midnight-300 hover:text-white hover:bg-white/5': variant === 'ghost',
            'border border-midnight-600 text-midnight-200 hover:border-brand-500/50 hover:text-brand-400': variant === 'outline',
            'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20': variant === 'danger',
          },
          {
            'h-8 px-3 text-xs gap-1.5': size === 'sm',
            'h-10 px-4 text-sm gap-2': size === 'md',
            'h-12 px-6 text-base gap-2.5': size === 'lg',
            'h-14 px-8 text-lg gap-3': size === 'xl',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
