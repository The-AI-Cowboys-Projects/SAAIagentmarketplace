import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://sanantonioaiagents.com'),
  title: 'SA AI Agent Marketplace | AI Cowboys',
  description: 'Deploy AI agents built for San Antonio — automate permits, VA claims, bookings, and more. 60 specialized agents starting at $9/mo. Built by AI Cowboys.',
  keywords: ['AI agents', 'San Antonio', 'AI Cowboys', 'civic', 'business', 'military', 'healthcare', 'tourism', 'JBSA', 'River Walk'],
  openGraph: {
    title: 'SA AI Agent Marketplace | AI Cowboys',
    description: 'Deploy AI agents built for San Antonio — automate permits, VA claims, bookings, and more. Starting at $9/mo.',
    type: 'website',
    url: 'https://sanantonioaiagents.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SA AI Agent Marketplace | AI Cowboys',
    description: '60 AI agents built for San Antonio across civic, business, military, healthcare, and tourism.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
