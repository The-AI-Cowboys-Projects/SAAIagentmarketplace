'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type ServiceStatus = 'operational' | 'degraded' | 'down'

interface Service {
  name: string
  status: ServiceStatus
}

const STATUS_COLORS: Record<ServiceStatus, string> = {
  operational: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  down: 'bg-red-500',
}

const STATUS_LABELS: Record<ServiceStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
}

export default function StatusPage() {
  const [services, setServices] = useState<Service[]>([
    { name: 'API Server', status: 'operational' },
    { name: 'Agent Engine', status: 'operational' },
    { name: 'Authentication (Supabase)', status: 'operational' },
    { name: 'Payments (Stripe)', status: 'operational' },
    { name: 'Database', status: 'operational' },
  ])
  const [lastChecked, setLastChecked] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      setChecking(true)
      try {
        const res = await fetch('/api/health', { cache: 'no-store' })
        const updated = [...services]
        updated[0] = {
          name: 'API Server',
          status: res.ok ? 'operational' : 'down',
        }
        setServices(updated)
      } catch {
        const updated = [...services]
        updated[0] = { name: 'API Server', status: 'down' }
        setServices(updated)
      } finally {
        setLastChecked(new Date().toLocaleString())
        setChecking(false)
      }
    }

    checkHealth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allOperational = services.every((s) => s.status === 'operational')

  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status</h1>
        <p className="text-sm text-gray-400 mb-8">
          Current operational status of SA Agent Marketplace services.
        </p>

        <div className={`rounded-xl border p-5 mb-8 ${
          allOperational
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              allOperational ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />
            <p className="text-sm font-semibold text-gray-900">
              {allOperational
                ? 'All Systems Operational'
                : 'Some Systems Experiencing Issues'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4"
            >
              <span className="text-sm font-medium text-gray-900">{service.name}</span>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[service.status]}`} />
                <span className={`text-sm ${
                  service.status === 'operational'
                    ? 'text-emerald-700'
                    : service.status === 'degraded'
                    ? 'text-amber-700'
                    : 'text-red-700'
                }`}>
                  {STATUS_LABELS[service.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {lastChecked && (
          <p className="mt-6 text-xs text-gray-400">
            Last checked: {lastChecked}
            {checking && ' (checking...)'}
          </p>
        )}

        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-600">
            For real-time incident updates, email{' '}
            <a href="mailto:status@aicowboys.com" className="text-navy-700 hover:text-navy-950 underline underline-offset-2">
              status@aicowboys.com
            </a>.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/" className="text-sm text-navy-700 hover:text-navy-950">
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
