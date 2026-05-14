import { Star } from 'lucide-react'
import { clsx } from 'clsx'

export function StarRating({ rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={clsx(
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4',
            star <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-200 fill-gray-200'
          )}
          aria-hidden="true"
        />
      ))}
      <span className={clsx('text-gray-500 ml-1', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {rating.toFixed(1)}
        {count !== undefined && (
          <span className="text-gray-400"> ({count.toLocaleString()})</span>
        )}
      </span>
    </div>
  )
}
