'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setLoading(true)
    setError('')

    try {
      const { apiFetch } = await import('@/lib/api-client')
      const res = await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message }),
      })

      if (!res.ok) throw new Error('Failed to send message')
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-sm text-gray-400 mb-8">We typically respond within one business day.</p>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Message Sent</h2>
            <p className="text-sm text-gray-600">
              Thank you for reaching out. We will get back to you as soon as possible.
            </p>
            <button
              onClick={() => { setSent(false); setName(''); setEmail(''); setSubject('General'); setMessage('') }}
              className="mt-4 text-sm text-navy-700 hover:text-navy-950 font-medium"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-12 px-4 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors appearance-none"
              >
                <option value="General">General</option>
                <option value="Billing">Billing</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Partnership">Partnership</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-navy-950 text-white text-sm font-semibold rounded-xl hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Direct Contacts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-400 mb-1">General</p>
              <a href="mailto:hello@aicowboys.com" className="text-sm text-navy-700 hover:text-navy-950 underline underline-offset-2">
                hello@aicowboys.com
              </a>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-400 mb-1">Sales</p>
              <a href="mailto:enterprise@aicowboys.com" className="text-sm text-navy-700 hover:text-navy-950 underline underline-offset-2">
                enterprise@aicowboys.com
              </a>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-400 mb-1">Support</p>
              <a href="mailto:support@aicowboys.com" className="text-sm text-navy-700 hover:text-navy-950 underline underline-offset-2">
                support@aicowboys.com
              </a>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-400 mb-1">Legal</p>
              <a href="mailto:legal@aicowboys.com" className="text-sm text-navy-700 hover:text-navy-950 underline underline-offset-2">
                legal@aicowboys.com
              </a>
            </div>
          </div>
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
