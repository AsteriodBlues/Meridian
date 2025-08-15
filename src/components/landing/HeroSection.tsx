'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { FloatingParticles } from '@/components/animations/FloatingParticles'
import { MagneticButton } from '@/components/ui/MagneticButton'

interface HeroSectionProps {
  onOpenAuth: () => void
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  const { scrollY } = useScroll()
  const y2 = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-950 via-luxury-900 to-luxury-950">
        <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
      </div>

      {/* Floating Particles */}
      <FloatingParticles count={60} color="rgba(168, 85, 247, 0.2)" />

      {/* Parallax Layers */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ y: y2 }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-wisdom-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-trust-500/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Content Container */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        style={{ opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-growth-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-growth-500"></span>
          </span>
          <span className="text-sm text-gray-300">Your Complete Financial Life OS</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-display font-bold mb-6"
        >
          <span className="block text-white mb-2">Every Penny</span>
          <span className="block bg-gradient-to-r from-wisdom-400 via-trust-400 to-growth-400 bg-clip-text text-transparent">
            Beautifully Tracked
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
        >
          Track expenses, manage investments, optimize taxes, and build wealth with the most beautiful financial platform ever created.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <MagneticButton size="lg" onClick={onOpenAuth}>
            Start Your Journey
          </MagneticButton>
          <MagneticButton size="lg" variant="secondary">
            Watch Demo
          </MagneticButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
        >
          {[
            { value: '$2.4M+', label: 'Tracked Daily' },
            { value: '50K+', label: 'Active Users' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1, type: 'spring' }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-wisdom-400 to-trust-400 bg-clip-text text-transparent"
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}