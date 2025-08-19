'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import ParticleBackground from '@/components/budget/ParticleBackground';
import { FadeUpReveal, ScaleReveal, BlurReveal, MagneticReveal } from '@/components/budget/ScrollReveal';

// Credit Components
import CreditScoreGauge from '@/components/credit/CreditScoreGauge';
import CreditFactorDNA from '@/components/credit/CreditFactorDNA';
import CreditHistoryGraph from '@/components/credit/CreditHistoryGraph';
import CreditSimulator from '@/components/credit/CreditSimulator';
import CreditTips from '@/components/credit/CreditTips';
import DebtJourneyMap from '@/components/credit/DebtJourneyMap';
import InterestSavedCounter from '@/components/credit/InterestSavedCounter';
import SnowballAnimation from '@/components/credit/SnowballAnimation';
import MilestoneSystem from '@/components/credit/MilestoneSystem';

import { 
  CreditCard, TrendingUp, Calculator, Shield, Target,
  PiggyBank, Snowflake, Award, BarChart3, Zap, 
  Brain, MapPin, Settings, User
} from 'lucide-react';

export default function CreditPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'score' | 'factors' | 'history' | 'simulator' | 'tips' | 'debt-journey' | 'interest-saved' | 'snowball' | 'milestones'>('dashboard');
  const [userProgress, setUserProgress] = useState({
    creditScore: 720,
    previousScore: 695,
    debtPaid: 15000,
    onTimePayments: 24,
    creditUtilization: 25,
    accountAge: 36
  });

  const views = [
    { 
      key: 'dashboard', 
      label: 'Credit Dashboard', 
      icon: BarChart3, 
      description: 'Complete overview of your credit health',
      color: '#3b82f6',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      key: 'score', 
      label: 'Credit Score Gauge', 
      icon: Target, 
      description: 'Liquid-fill animated credit score display',
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      key: 'factors', 
      label: 'Factor DNA', 
      icon: Shield, 
      description: 'Credit factors as interactive DNA helix',
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      key: 'history', 
      label: 'Credit History', 
      icon: TrendingUp, 
      description: 'Interactive timeline with annotations',
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-blue-500'
    },
    { 
      key: 'simulator', 
      label: 'What-If Simulator', 
      icon: Calculator, 
      description: 'Test scenarios and see projected impact',
      color: '#f59e0b',
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      key: 'tips', 
      label: 'Smart Tips', 
      icon: Brain, 
      description: 'Self-typing personalized credit advice',
      color: '#ec4899',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      key: 'debt-journey', 
      label: 'Debt Journey', 
      icon: MapPin, 
      description: 'Interactive payoff timeline map',
      color: '#84cc16',
      gradient: 'from-lime-500 to-green-500'
    },
    { 
      key: 'interest-saved', 
      label: 'Interest Saved', 
      icon: PiggyBank, 
      description: 'Animated counter with visual feedback',
      color: '#10b981',
      gradient: 'from-emerald-500 to-green-500'
    },
    { 
      key: 'snowball', 
      label: 'Debt Snowball', 
      icon: Snowflake, 
      description: 'Physics-based debt elimination animation',
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-teal-500'
    },
    { 
      key: 'milestones', 
      label: 'Achievements', 
      icon: Award, 
      description: 'Modern badge system with rewards',
      color: '#eab308',
      gradient: 'from-yellow-400 to-yellow-600'
    }
  ];

  const featuredViews = [
    {
      id: 'score',
      title: 'Credit Score Gauge',
      description: 'Beautiful liquid-fill animation shows your credit score with real-time updates and category breakdown.',
      icon: Target,
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'factors',
      title: 'DNA Factor Analysis',
      description: 'Visualize credit factors as an interactive DNA helix with detailed improvement recommendations.',
      icon: Shield,
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'debt-journey',
      title: 'Debt Freedom Map',
      description: 'Interactive journey showing your path to debt freedom with milestones and celebration moments.',
      icon: MapPin,
      color: '#84cc16',
      gradient: 'from-lime-500 to-green-500'
    },
    {
      id: 'snowball',
      title: 'Physics Snowball',
      description: 'Watch your debts literally roll away with realistic physics and satisfying animations.',
      icon: Snowflake,
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-teal-500'
    }
  ];

  // Sample data for components
  const creditFactors = [
    {
      id: 'payment-history',
      name: 'Payment History',
      impact: 85,
      value: 'Excellent',
      icon: CreditCard,
      color: '#10b981',
      description: 'Your track record of making payments on time',
      weight: 35
    },
    // Add more factors as needed
  ];

  const creditHistoryData = [
    {
      date: '2020-01',
      score: 650,
      event: {
        type: 'neutral' as const,
        title: 'Started Credit Journey',
        description: 'Opened first credit card',
        icon: CreditCard
      }
    },
    // Add more history data as needed
  ];

  const debtAccounts = [
    {
      id: 'cc1',
      name: 'Chase Freedom',
      balance: 3500,
      originalBalance: 5000,
      minPayment: 105,
      interestRate: 24.99,
      type: 'credit-card' as const,
      priority: 1
    },
    // Add more debt accounts as needed
  ];

  return (
    <PageLayout>
      <TimeBasedBackground>
        <ParticleBackground 
          particleCount={100}
          interactive={true}
          colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899']}
        />
        <MagneticCursor />
        
        <div className="min-h-screen">
        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
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
                        Credit & Debt
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                          Visualizer
                        </span>
                      </h1>
                    </ScaleReveal>
                    <BlurReveal delay={0.4}>
                      <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
                        Transform your financial journey with beautiful visualizations, interactive simulations, 
                        and gamified progress tracking. Make credit improvement engaging and debt elimination fun.
                      </p>
                    </BlurReveal>
                  </div>

                  {/* Featured Tools */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {featuredViews.map((view, index) => {
                      const Icon = view.icon;
                      return (
                        <MagneticReveal key={view.id} delay={0.1 * index}>
                          <motion.div
                            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl cursor-pointer group hover:border-white/20 transition-all"
                            onClick={() => setActiveView(view.id as any)}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${view.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{view.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{view.description}</p>
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
                            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center hover:border-white/20 hover:bg-white/10 transition-all group"
                            onClick={() => setActiveView(view.key as any)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div 
                              className="w-8 h-8 mx-auto mb-2 rounded-lg p-1.5 group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: `${view.color}20` }}
                            >
                              <Icon className="w-full h-full" style={{ color: view.color }} />
                            </div>
                            <div className="text-white text-sm font-medium">{view.label}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </BlurReveal>

                  {/* Demo Sections */}
                  <div className="space-y-16">
                    {/* Credit Score Preview */}
                    <ScaleReveal delay={1.0}>
                      <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2">Your Credit Score</h2>
                          <p className="text-gray-400">Beautiful liquid-fill animation with real-time updates</p>
                        </div>
                        <div className="flex justify-center">
                          <CreditScoreGauge 
                            score={userProgress.creditScore}
                            previousScore={userProgress.previousScore}
                            className="max-w-md"
                          />
                        </div>
                      </div>
                    </ScaleReveal>

                    {/* Interactive Features Preview */}
                    <BlurReveal delay={1.2}>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* DNA Factors */}
                        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                          <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Factor Analysis</h3>
                            <p className="text-gray-400 text-sm">Credit factors as interactive DNA helix</p>
                          </div>
                          <div className="h-64 flex items-center justify-center">
                            <div className="text-center">
                              <motion.div
                                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center"
                                animate={{
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 360]
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
                              >
                                <Shield className="w-8 h-8 text-white" />
                              </motion.div>
                              <p className="text-gray-400 text-sm">Interactive DNA visualization</p>
                            </div>
                          </div>
                        </div>

                        {/* Interest Saved */}
                        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                          <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">Interest Savings</h3>
                            <p className="text-gray-400 text-sm">Animated counter with visual feedback</p>
                          </div>
                          <div className="h-64 flex items-center justify-center">
                            <div className="text-center">
                              <motion.div
                                className="text-4xl font-bold text-green-400 mb-4"
                                animate={{
                                  scale: [1, 1.05, 1],
                                  textShadow: [
                                    '0 0 0px rgba(16, 185, 129, 0)',
                                    '0 0 20px rgba(16, 185, 129, 0.8)',
                                    '0 0 0px rgba(16, 185, 129, 0)'
                                  ]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                $8,450
                              </motion.div>
                              <p className="text-gray-400 text-sm">Total interest saved</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </BlurReveal>

                    {/* Milestones Preview */}
                    <FadeUpReveal delay={1.4}>
                      <div className="p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2">Achievement System</h2>
                          <p className="text-gray-400">Unlock beautiful badges and rewards</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { icon: Award, label: 'Credit Builder', unlocked: true, rarity: 'common' },
                            { icon: Target, label: 'Payment Master', unlocked: true, rarity: 'rare' },
                            { icon: Shield, label: 'Debt Slayer', unlocked: false, rarity: 'epic' },
                            { icon: CreditCard, label: 'Credit Legend', unlocked: false, rarity: 'legendary' }
                          ].map((badge, index) => {
                            const Icon = badge.icon;
                            const colors = {
                              common: '#6b7280',
                              rare: '#3b82f6',
                              epic: '#8b5cf6',
                              legendary: '#eab308'
                            };
                            
                            return (
                              <motion.div
                                key={badge.label}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${
                                  badge.unlocked 
                                    ? 'border-white/20 bg-white/10' 
                                    : 'border-white/10 bg-white/5 opacity-50'
                                }`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 1.5 }}
                                style={{
                                  boxShadow: badge.unlocked ? `0 0 20px ${colors[badge.rarity]}40` : 'none'
                                }}
                              >
                                <div 
                                  className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: `${colors[badge.rarity]}20` }}
                                >
                                  <Icon 
                                    className="w-6 h-6" 
                                    style={{ color: badge.unlocked ? colors[badge.rarity] : '#6b7280' }}
                                  />
                                </div>
                                <div className={`text-sm font-medium ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>
                                  {badge.label}
                                </div>
                                <div 
                                  className="text-xs mt-1 capitalize"
                                  style={{ color: colors[badge.rarity] }}
                                >
                                  {badge.rarity}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </FadeUpReveal>
                  </div>
                </div>
              </FadeUpReveal>
            </motion.div>
          )}

          {activeView === 'score' && (
            <motion.div
              key="score"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Credit Score Gauge</h1>
                <p className="text-gray-400">Beautiful liquid-fill animation with real-time updates</p>
              </div>
              <div className="flex justify-center">
                <CreditScoreGauge 
                  score={userProgress.creditScore}
                  previousScore={userProgress.previousScore}
                />
              </div>
            </motion.div>
          )}

          {activeView === 'factors' && (
            <motion.div
              key="factors"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Credit Factor DNA</h1>
                <p className="text-gray-400">Interactive helix visualization of credit factors</p>
              </div>
              <CreditFactorDNA factors={creditFactors} />
            </motion.div>
          )}

          {activeView === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Credit History Graph</h1>
                <p className="text-gray-400">Interactive timeline with annotations and events</p>
              </div>
              <CreditHistoryGraph data={creditHistoryData} />
            </motion.div>
          )}

          {activeView === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Credit Score Simulator</h1>
                <p className="text-gray-400">Test what-if scenarios and see projected impact</p>
              </div>
              <CreditSimulator currentScore={userProgress.creditScore} />
            </motion.div>
          )}

          {activeView === 'tips' && (
            <motion.div
              key="tips"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <CreditTips />
            </motion.div>
          )}

          {activeView === 'debt-journey' && (
            <motion.div
              key="debt-journey"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <DebtJourneyMap 
                debts={debtAccounts}
                strategy="snowball"
                monthlyExtra={500}
              />
            </motion.div>
          )}

          {activeView === 'interest-saved' && (
            <motion.div
              key="interest-saved"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <InterestSavedCounter 
                originalPayoffMonths={72}
                acceleratedPayoffMonths={42}
                totalDebt={42200}
                averageInterestRate={18.5}
                monthlyExtraPayment={500}
              />
            </motion.div>
          )}

          {activeView === 'snowball' && (
            <motion.div
              key="snowball"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <SnowballAnimation 
                debts={debtAccounts}
                monthlyExtra={500}
              />
            </motion.div>
          )}

          {activeView === 'milestones' && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <MilestoneSystem userProgress={userProgress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Bar */}
        {activeView !== 'dashboard' && (
          <motion.div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex gap-2 p-3 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl overflow-x-auto">
              <motion.button
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors flex-shrink-0"
                onClick={() => setActiveView('dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>
              
              {views.slice(1).map((view) => {
                const Icon = view.icon;
                const isActive = activeView === view.key;
                
                return (
                  <motion.button
                    key={view.key}
                    className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                      isActive 
                        ? 'text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: isActive ? view.color : undefined
                    }}
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
    </PageLayout>
  );
}