'use client'
import { Hero } from '@/components/home/Hero'
import { BranchShowcase } from '@/components/home/BranchShowcase'
import { Features } from '@/components/home/Features'
import { Testimonials } from '@/components/home/Testimonials'
import { FAQ } from '@/components/home/FAQ'
import { CTA } from '@/components/home/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BranchShowcase />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  )
}
