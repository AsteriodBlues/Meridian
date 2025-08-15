'use client'

import { useState } from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { AuthModal } from '@/components/auth/AuthModal'

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <HeroSection onOpenAuth={() => setAuthModalOpen(true)} />
      <FeaturesSection />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </main>
  )
}