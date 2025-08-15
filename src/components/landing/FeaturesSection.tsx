'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { CreditCard3D } from '@/components/animations/CreditCard3D'
import { TrendingUp, Shield, Zap, Globe, PieChart, Wallet } from 'lucide-react'
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard'
import { useRef } from 'react'

const features = [
  {
    icon: Wallet,
    title: 'Complete Portfolio',
    description: 'Track everything from daily expenses to real estate investments in one place.',
    gradient: 'from-wisdom-400 to-wisdom-600',
  },
  {
    icon: TrendingUp,
    title: 'Smart Investments',
    description: 'Advanced insights and real-time market data for smarter decisions.',
    gradient: 'from-growth-400 to-growth-600',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your data is encrypted with military-grade security protocols.',
    gradient: 'from-trust-400 to-trust-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built for speed with edge computing and optimized performance.',
    gradient: 'from-caution-400 to-caution-600',
  },
  {
    icon: PieChart,
    title: 'Advanced Analytics',
    description: 'Beautiful visualizations that make complex data easy to understand.',
    gradient: 'from-wisdom-400 to-trust-400',
  },
  {
    icon: Globe,
    title: 'Multi-Currency',
    description: 'Support for 150+ currencies with real-time exchange rates.',
    gradient: 'from-growth-400 to-trust-400',
  },
]

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-950 via-luxury-900 to-luxury-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-wisdom-500/10 border border-wisdom-500/20 text-wisdom-400 text-sm font-medium mb-4">
            Premium Features
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A complete financial operating system designed for the modern world
          </p>
        </motion.div>

        {/* 3D Card Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="flex justify-center mb-24"
        >
          <CreditCard3D />
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ y }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassmorphicCard className="h-full group">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}