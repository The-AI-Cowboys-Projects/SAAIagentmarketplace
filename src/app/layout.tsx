import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'SA Agent Marketplace | AI Cowboys',
  description: '50 specialized AI agents built for San Antonio — civic services, business, military, healthcare, and tourism. By AI Cowboys.',
  keywords: ['AI agents', 'San Antonio', 'AI Cowboys', 'civic', 'business', 'military', 'healthcare', 'tourism', 'JBSA', 'River Walk'],
  openGraph: {
    title: 'SA Agent Marketplace | AI Cowboys',
    description: '50 AI agents built for San Antonio across civic, business, military, healthcare, and tourism.',
    type: 'website',
    url: 'https://sanantonioaiagentmarketplace.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SA Agent Marketplace | AI Cowboys',
    description: '50 AI agents built for San Antonio across 5 categories.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
