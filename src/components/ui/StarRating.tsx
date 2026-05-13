import { Star } from 'lucide-react'
import { clsx } from 'clsx'

export function StarRating({ rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={clsx(
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
            star <= Math.round(rating) ? 'text-brand-400 fill-brand-400' : 'text-midnight-600'
          )}
        />
      ))}
      <span className={clsx('text-midnight-400 ml-1', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {rating.toFixed(1)}
        {count !== undefined && <span className="text-midnight-500"> ({count.toLocaleString()})</span>}
      </span>
    </div>
  )
}
