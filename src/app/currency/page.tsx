'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import StickyNav from '@/components/dashboard/StickyNav';
import MagneticCursor from '@/components/ui/MagneticCursor';
import ParticleBackground from '@/components/budget/ParticleBackground';
import { FadeUpReveal, ScaleReveal, BlurReveal, MagneticReveal } from '@/components/budget/ScrollReveal';

// Currency Components
import FlowingRates from '@/components/currency/FlowingRates';
import MorphingConverter from '@/components/currency/MorphingConverter';
import FeeCalculator from '@/components/currency/FeeCalculator';
import TimeMachine from '@/components/currency/TimeMachine';
import TravelMode from '@/components/currency/TravelMode';
import CurrencySwitch from '@/components/currency/CurrencySwitch';
import LiveConverter from '@/components/currency/LiveConverter';
import TripSummary from '@/components/currency/TripSummary';

import { 
  Globe, TrendingUp, Calculator, Clock, MapPin, 
  ArrowLeftRight, Zap, Map, DollarSign, BarChart3
} from 'lucide-react';

export default function CurrencyPage() {
  const [activeView, setActiveView] = useState<'hub' | 'rates' | 'converter' | 'fees' | 'history' | 'travel' | 'switch' | 'live' | 'summary'>('hub');
  const [selectedCurrency, setSelectedCurrency] = useState({ from: 'USD', to: 'EUR' });

  const views = [
    { key: 'hub', label: 'Currency Hub', icon: DollarSign, description: 'Overview of all currency features' },
    { key: 'rates', label: 'Flowing Rates', icon: TrendingUp, description: 'Live exchange rates as flowing rivers' },
    { key: 'converter', label: 'Morphing Converter', icon: Calculator, description: 'Currency conversion with morphing animations' },
    { key: 'fees', label: 'Fee Calculator', icon: DollarSign, description: 'Compare transfer fees across providers' },
    { key: 'history', label: 'Time Machine', icon: Clock, description: 'Historical rates with time travel interface' },
    { key: 'travel', label: 'Travel Mode', icon: MapPin, description: 'Location detection and expense tracking' },
    { key: 'switch', label: 'Currency Switch', icon: ArrowLeftRight, description: 'Beautiful currency switching animations' },
    { key: 'live', label: 'Live Converter', icon: Zap, description: 'Real-time conversion with live updates' },
    { key: 'summary', label: 'Trip Summary', icon: Map, description: 'Comprehensive trip analysis with parallax' }
  ];

  const featuredFeatures = [
    {
      id: 'rates',
      title: 'Flowing Exchange Rates',
      description: 'Watch exchange rates flow like rivers with beautiful particle effects and real-time updates.',
      icon: TrendingUp,
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'converter',
      title: 'Morphing Converter',
      description: 'Experience seamless currency conversion with morphing number animations and instant calculations.',
      icon: Calculator,
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'travel',
      title: 'Smart Travel Mode',
      description: 'Auto-detect your location and manage travel expenses with intelligent currency conversion.',
      icon: MapPin,
      color: '#f59e0b',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <TimeBasedBackground>
      <ParticleBackground 
        particleCount={80}
        interactive={true}
        colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']}
      />
      <MagneticCursor />
      <StickyNav />
      
      <div className="min-h-screen pt-20">
        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeView === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <FadeUpReveal>
                <div className="max-w-7xl mx-auto px-6 py-12">
                  <div className="text-center mb-16">
                    <ScaleReveal delay={0.2}>
                      <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
                        Multi-Currency
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-500">
                          World Hub
                        </span>
                      </h1>
                    </ScaleReveal>
                    <BlurReveal delay={0.4}>
                      <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
                        Experience the future of currency management with flowing exchange rates, 
                        morphing conversions, and intelligent travel features.
                      </p>
                    </BlurReveal>
                  </div>

                  {/* Featured Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {featuredFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <MagneticReveal key={feature.id} delay={0.1 * index}>
                          <motion.div
                            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl cursor-pointer group hover:border-white/20 transition-all"
                            onClick={() => setActiveView(feature.id as any)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                          </motion.div>
                        </MagneticReveal>
                      );
                    })}
                  </div>

                  {/* Quick Access Grid */}
                  <BlurReveal delay={0.8}>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
                      {views.slice(1).map((view) => {
                        const Icon = view.icon;
                        return (
                          <motion.button
                            key={view.key}
                            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center hover:border-white/20 hover:bg-white/10 transition-all"
                            onClick={() => setActiveView(view.key as any)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon className="w-6 h-6 text-white mx-auto mb-2" />
                            <div className="text-white text-sm font-medium">{view.label}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </BlurReveal>

                  {/* Demo Sections */}
                  <div className="space-y-16">
                    {/* Flowing Rates Preview */}
                    <BlurReveal delay={1.2}>
                      <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2">Live Exchange Rate Rivers</h2>
                          <p className="text-gray-400">Watch currencies flow in real-time</p>
                        </div>
                        <FlowingRates 
                          onRateClick={(rate) => console.log('Rate clicked:', rate)}
                          className="rounded-xl overflow-hidden"
                        />
                      </div>
                    </BlurReveal>

                    {/* Converter Preview */}
                    <FadeUpReveal delay={1.4}>
                      <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2">Morphing Currency Converter</h2>
                          <p className="text-gray-400">Beautiful animations for seamless conversion</p>
                        </div>
                        <MorphingConverter 
                          onConversionComplete={(result) => console.log('Conversion:', result)}
                          className="rounded-xl overflow-hidden"
                        />
                      </div>
                    </FadeUpReveal>
                  </div>
                </div>
              </FadeUpReveal>
            </motion.div>
          )}

          {activeView === 'rates' && (
            <motion.div
              key="rates"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Flowing Exchange Rates</h1>
                <p className="text-gray-400">Real-time currency flows with interactive visualization</p>
              </div>
              <FlowingRates onRateClick={(rate) => console.log('Rate:', rate)} />
            </motion.div>
          )}

          {activeView === 'converter' && (
            <motion.div
              key="converter"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <MorphingConverter onConversionComplete={(result) => console.log('Conversion:', result)} />
            </motion.div>
          )}

          {activeView === 'fees' && (
            <motion.div
              key="fees"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <FeeCalculator 
                amount={1000}
                fromCurrency={selectedCurrency.from}
                toCurrency={selectedCurrency.to}
              />
            </motion.div>
          )}

          {activeView === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <TimeMachine 
                fromCurrency={selectedCurrency.from}
                toCurrency={selectedCurrency.to}
              />
            </motion.div>
          )}

          {activeView === 'travel' && (
            <motion.div
              key="travel"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <TravelMode 
                onLocationChange={(location) => console.log('Location:', location)}
                onExpenseAdd={(expense) => console.log('Expense:', expense)}
              />
            </motion.div>
          )}

          {activeView === 'switch' && (
            <motion.div
              key="switch"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <CurrencySwitch 
                onSwitch={(from, to) => setSelectedCurrency({ from: from.code, to: to.code })}
              />
            </motion.div>
          )}

          {activeView === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <LiveConverter 
                baseCurrency={selectedCurrency.from}
                targetCurrencies={['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']}
                onConversion={(item) => console.log('Live conversion:', item)}
              />
            </motion.div>
          )}

          {activeView === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <TripSummary />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Bar */}
        {activeView !== 'hub' && (
          <motion.div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex gap-2 p-3 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl">
              <motion.button
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                onClick={() => setActiveView('hub')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-5 h-5" />
              </motion.button>
              
              {views.slice(1).map((view) => {
                const Icon = view.icon;
                const isActive = activeView === view.key;
                
                return (
                  <motion.button
                    key={view.key}
                    className={`p-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveView(view.key as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={view.description}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </TimeBasedBackground>
  );
}