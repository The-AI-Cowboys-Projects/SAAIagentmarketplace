'use client'

/**
 * Button.tsx — Light-mode button component
 *
 * Usage:
 *   <Button variant="primary" size="lg">Get Started</Button>
 *   <Button variant="outline" size="md">Learn More</Button>
 */

import { clsx } from 'clsx'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'relative inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed select-none',
          {
            // Primary — navy filled
            'bg-navy-950 text-white hover:bg-navy-800 shadow-sm':
              variant === 'primary',
            // Secondary — gray filled
            'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200':
              variant === 'secondary',
            // Ghost — transparent, dark text
            'text-gray-600 hover:text-gray-900 hover:bg-gray-100':
              variant === 'ghost',
            // Outline — bordered, light text
            'border border-gray-300 text-gray-700 hover:border-navy-400 hover:text-navy-950 bg-white':
              variant === 'outline',
            // Danger
            'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200':
              variant === 'danger',
          },
          {
            'h-8 px-3 text-xs gap-1.5':  size === 'sm',
            'h-10 px-4 text-sm gap-2':   size === 'md',
            'h-12 px-5 text-sm gap-2':   size === 'lg',
            'h-14 px-6 text-base gap-2': size === 'xl',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
