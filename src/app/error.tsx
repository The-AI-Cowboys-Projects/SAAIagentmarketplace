'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen pt-28 flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" size="md" onClick={reset}>
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline" size="md">
            Go home
          </Button>
        </Link>
      </div>
    </div>
  )
}
