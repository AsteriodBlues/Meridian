'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Award, Star, Target, Crown, Medal,
  TrendingUp, DollarSign, Calendar, CheckCircle,
  Zap, Shield, Sparkles, Gift, Lock, Unlock
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  category: 'credit-score' | 'debt-reduction' | 'payment-history' | 'financial-health';
  requirement: {
    type: 'score' | 'debt-paid' | 'payments' | 'utilization' | 'time';
    target: number;
    current: number;
  };
  reward: {
    type: 'badge' | 'title' | 'feature' | 'discount';
    value: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: string;
  tier: number;
}

interface MilestoneSystemProps {
  userProgress: {
    creditScore: number;
    debtPaid: number;
    onTimePayments: number;
    creditUtilization: number;
    accountAge: number;
  };
  className?: string;
  onMilestoneUnlock?: (milestone: Milestone) => void;
}

// Deterministic pseudo-random function for SSR compatibility
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 1000) / 1000;
};

export default function MilestoneSystem({ 
  userProgress,
  className = '',
  onMilestoneUnlock 
}: MilestoneSystemProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAnimation, setShowAnimation] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  const milestoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default user progress if none provided
  const defaultProgress = {
    creditScore: 720,
    debtPaid: 15000,
    onTimePayments: 24,
    creditUtilization: 25,
    accountAge: 36,
    ...userProgress
  };

  // Milestone definitions
  const milestones: Milestone[] = [
    // Credit Score Milestones
    {
      id: 'first-steps',
      title: 'Credit Journey Begins',
      description: 'You\'ve started tracking your credit score',
      icon: Star,
      color: '#3b82f6',
      gradient: 'from-blue-500 to-cyan-500',
      category: 'credit-score',
      requirement: { type: 'score', target: 300, current: defaultProgress.creditScore },
      reward: { type: 'badge', value: 'Credit Tracker' },
      rarity: 'common',
      isUnlocked: defaultProgress.creditScore >= 300,
      tier: 1
    },
    {
      id: 'fair-credit',
      title: 'Fair Credit Achiever',
      description: 'Reached fair credit score range (580+)',
      icon: Target,
      color: '#f59e0b',
      gradient: 'from-yellow-500 to-orange-500',
      category: 'credit-score',
      requirement: { type: 'score', target: 580, current: defaultProgress.creditScore },
      reward: { type: 'title', value: 'Credit Builder' },
      rarity: 'common',
      isUnlocked: defaultProgress.creditScore >= 580,
      tier: 2
    },
    {
      id: 'good-credit',
      title: 'Good Credit Guardian',
      description: 'Achieved good credit score (670+)',
      icon: Shield,
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-pink-500',
      category: 'credit-score',
      requirement: { type: 'score', target: 670, current: defaultProgress.creditScore },
      reward: { type: 'feature', value: 'Advanced Credit Tools' },
      rarity: 'rare',
      isUnlocked: defaultProgress.creditScore >= 670,
      tier: 3
    },
    {
      id: 'very-good-credit',
      title: 'Credit Champion',
      description: 'Reached very good credit (740+)',
      icon: Award,
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-500',
      category: 'credit-score',
      requirement: { type: 'score', target: 740, current: defaultProgress.creditScore },
      reward: { type: 'discount', value: '25% off premium features' },
      rarity: 'epic',
      isUnlocked: defaultProgress.creditScore >= 740,
      tier: 4
    },
    {
      id: 'excellent-credit',
      title: 'Credit Mastery',
      description: 'Achieved excellent credit (800+)',
      icon: Crown,
      color: '#eab308',
      gradient: 'from-yellow-400 to-yellow-600',
      category: 'credit-score',
      requirement: { type: 'score', target: 800, current: defaultProgress.creditScore },
      reward: { type: 'title', value: 'Credit Master' },
      rarity: 'legendary',
      isUnlocked: defaultProgress.creditScore >= 800,
      tier: 5
    },

    // Debt Reduction Milestones
    {
      id: 'debt-warrior',
      title: 'Debt Warrior',
      description: 'Paid off your first $1,000 in debt',
      icon: TrendingUp,
      color: '#ef4444',
      gradient: 'from-red-500 to-pink-500',
      category: 'debt-reduction',
      requirement: { type: 'debt-paid', target: 1000, current: defaultProgress.debtPaid },
      reward: { type: 'badge', value: 'Debt Fighter' },
      rarity: 'common',
      isUnlocked: defaultProgress.debtPaid >= 1000,
      tier: 1
    },
    {
      id: 'debt-slayer',
      title: 'Debt Slayer',
      description: 'Eliminated $5,000 in debt',
      icon: Zap,
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-blue-500',
      category: 'debt-reduction',
      requirement: { type: 'debt-paid', target: 5000, current: defaultProgress.debtPaid },
      reward: { type: 'feature', value: 'Debt Snowball Calculator' },
      rarity: 'rare',
      isUnlocked: defaultProgress.debtPaid >= 5000,
      tier: 2
    },
    {
      id: 'debt-destroyer',
      title: 'Debt Destroyer',
      description: 'Conquered $10,000+ in debt',
      icon: Trophy,
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-indigo-500',
      category: 'debt-reduction',
      requirement: { type: 'debt-paid', target: 10000, current: defaultProgress.debtPaid },
      reward: { type: 'title', value: 'Debt Conqueror' },
      rarity: 'epic',
      isUnlocked: defaultProgress.debtPaid >= 10000,
      tier: 3
    },

    // Payment History Milestones
    {
      id: 'payment-starter',
      title: 'Payment Reliability',
      description: 'Made 6 consecutive on-time payments',
      icon: CheckCircle,
      color: '#10b981',
      gradient: 'from-green-400 to-emerald-500',
      category: 'payment-history',
      requirement: { type: 'payments', target: 6, current: defaultProgress.onTimePayments },
      reward: { type: 'badge', value: 'Reliable Payer' },
      rarity: 'common',
      isUnlocked: defaultProgress.onTimePayments >= 6,
      tier: 1
    },
    {
      id: 'payment-champion',
      title: 'Payment Champion',
      description: 'Perfect payment record for 12 months',
      icon: Medal,
      color: '#f59e0b',
      gradient: 'from-amber-500 to-orange-500',
      category: 'payment-history',
      requirement: { type: 'payments', target: 12, current: defaultProgress.onTimePayments },
      reward: { type: 'discount', value: '15% off financial coaching' },
      rarity: 'rare',
      isUnlocked: defaultProgress.onTimePayments >= 12,
      tier: 2
    },
    {
      id: 'payment-legend',
      title: 'Payment Legend',
      description: '24+ months of perfect payments',
      icon: Crown,
      color: '#ec4899',
      gradient: 'from-pink-500 to-rose-500',
      category: 'payment-history',
      requirement: { type: 'payments', target: 24, current: defaultProgress.onTimePayments },
      reward: { type: 'title', value: 'Payment Master' },
      rarity: 'legendary',
      isUnlocked: defaultProgress.onTimePayments >= 24,
      tier: 3
    },

    // Financial Health Milestones
    {
      id: 'utilization-expert',
      title: 'Utilization Expert',
      description: 'Kept credit utilization below 30%',
      icon: Target,
      color: '#06b6d4',
      gradient: 'from-cyan-400 to-blue-500',
      category: 'financial-health',
      requirement: { type: 'utilization', target: 30, current: defaultProgress.creditUtilization },
      reward: { type: 'badge', value: 'Credit Optimizer' },
      rarity: 'common',
      isUnlocked: defaultProgress.creditUtilization <= 30,
      tier: 1
    },
    {
      id: 'utilization-master',
      title: 'Utilization Master',
      description: 'Maintained utilization below 10%',
      icon: Star,
      color: '#10b981',
      gradient: 'from-emerald-400 to-green-500',
      category: 'financial-health',
      requirement: { type: 'utilization', target: 10, current: defaultProgress.creditUtilization },
      reward: { type: 'feature', value: 'Premium Analytics' },
      rarity: 'epic',
      isUnlocked: defaultProgress.creditUtilization <= 10,
      tier: 2
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All Milestones', icon: Trophy },
    { id: 'credit-score', label: 'Credit Score', icon: TrendingUp },
    { id: 'debt-reduction', label: 'Debt Reduction', icon: DollarSign },
    { id: 'payment-history', label: 'Payment History', icon: Calendar },
    { id: 'financial-health', label: 'Financial Health', icon: Shield }
  ];

  // Filter milestones based on active category
  const filteredMilestones = activeCategory === 'all' 
    ? milestones 
    : milestones.filter(m => m.category === activeCategory);

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#eab308';
      default: return '#6b7280';
    }
  };

  // Get rarity glow
  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return '0 0 10px rgba(107, 114, 128, 0.5)';
      case 'rare': return '0 0 20px rgba(59, 130, 246, 0.6)';
      case 'epic': return '0 0 30px rgba(139, 92, 246, 0.7)';
      case 'legendary': return '0 0 40px rgba(234, 179, 8, 0.8)';
      default: return 'none';
    }
  };

  // Progress calculation
  const getProgress = (milestone: Milestone) => {
    const { requirement } = milestone;
    const { type, target, current } = requirement;
    
    if (type === 'utilization') {
      return current <= target ? 100 : (target / current) * 100;
    }
    
    return Math.min((current / target) * 100, 100);
  };

  // Check for newly unlocked milestones
  useEffect(() => {
    const newUnlocks = milestones.filter(m => 
      m.isUnlocked && !newlyUnlocked.includes(m.id)
    ).map(m => m.id);
    
    if (newUnlocks.length > 0) {
      setNewlyUnlocked(prev => [...prev, ...newUnlocks]);
      newUnlocks.forEach(id => {
        const milestone = milestones.find(m => m.id === id);
        if (milestone) {
          onMilestoneUnlock?.(milestone);
        }
      });
    }
  }, [userProgress]);

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Achievement System
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Unlock beautiful badges and rewards as you improve your financial health
        </motion.p>
      </div>

      {/* Progress Overview */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { 
            label: 'Credit Score', 
            value: defaultProgress.creditScore,
            max: 850,
            color: '#10b981'
          },
          { 
            label: 'Debt Paid', 
            value: defaultProgress.debtPaid,
            max: 25000,
            color: '#3b82f6',
            format: 'currency'
          },
          { 
            label: 'On-Time Payments', 
            value: defaultProgress.onTimePayments,
            max: 36,
            color: '#8b5cf6'
          },
          { 
            label: 'Unlocked Badges', 
            value: milestones.filter(m => m.isUnlocked).length,
            max: milestones.length,
            color: '#f59e0b'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
            <div 
              className="text-xl font-bold mb-2"
              style={{ color: stat.color }}
            >
              {stat.format === 'currency' 
                ? `$${stat.value.toLocaleString()}`
                : stat.value.toLocaleString()
              }
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">View:</span>
          {['grid', 'tree'].map((mode) => (
            <motion.button
              key={mode}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setViewMode(mode as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Milestones Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {filteredMilestones.map((milestone, index) => {
          const IconComponent = milestone.icon;
          const isSelected = selectedMilestone === milestone.id;
          const progress = getProgress(milestone);
          const isNewlyUnlocked = newlyUnlocked.includes(milestone.id);
          
          return (
            <motion.div
              key={milestone.id}
              className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                isSelected
                  ? 'border-white/30 bg-white/10 scale-105'
                  : milestone.isUnlocked
                  ? 'border-white/20 bg-white/5 hover:border-white/30'
                  : 'border-white/10 bg-white/5 hover:border-white/15 opacity-75'
              }`}
              onClick={() => setSelectedMilestone(isSelected ? null : milestone.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              style={{
                boxShadow: milestone.isUnlocked ? getRarityGlow(milestone.rarity) : 'none'
              }}
            >
              {/* Rarity Background */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${milestone.color}40 0%, transparent 70%)`
                }}
              />

              {/* Lock/Unlock Status */}
              <div className="absolute top-3 right-3">
                {milestone.isUnlocked ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Unlock className="w-5 h-5 text-green-400" />
                  </motion.div>
                ) : (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
              </div>

              {/* Newly Unlocked Animation */}
              {isNewlyUnlocked && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: 3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-white/20 to-yellow-400/20 rounded-2xl" />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      style={{
                        left: `${25 + (i % 4) * 20}%`,
                        top: `${25 + Math.floor(i / 4) * 20}%`
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        repeat: 2
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Main Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${milestone.color}20` }}
                    animate={{
                      scale: milestone.isUnlocked ? 1 : 0.9,
                      boxShadow: milestone.isUnlocked ? `0 0 20px ${milestone.color}40` : 'none'
                    }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: milestone.isUnlocked ? milestone.color : '#6b7280' }}
                    />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold ${milestone.isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                        {milestone.title}
                      </h4>
                      <div 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${getRarityColor(milestone.rarity)}20`,
                          color: getRarityColor(milestone.rarity)
                        }}
                      >
                        {milestone.rarity}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{milestone.description}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className={milestone.isUnlocked ? 'text-green-400' : 'text-white'}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: milestone.isUnlocked ? milestone.color : '#6b7280' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-400">Reward:</span>
                  <span className={milestone.isUnlocked ? 'text-purple-400' : 'text-gray-500'}>
                    {milestone.reward.value}
                  </span>
                </div>

                {/* Sparkle Effects for Unlocked */}
                {milestone.isUnlocked && milestone.rarity === 'legendary' && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-yellow-400"
                        style={{
                          left: `${20 + (i % 4) * 20}%`,
                          top: `${20 + Math.floor(i / 4) * 20}%`,
                          fontSize: '12px'
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.2,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        <Sparkles />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Achievement Summary */}
      <motion.div
        className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-center">
          <h4 className="text-white font-bold text-lg mb-4">Achievement Progress</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['common', 'rare', 'epic', 'legendary'].map((rarity) => {
              const total = milestones.filter(m => m.rarity === rarity).length;
              const unlocked = milestones.filter(m => m.rarity === rarity && m.isUnlocked).length;
              
              return (
                <div key={rarity} className="text-center">
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: getRarityColor(rarity) }}
                  >
                    {unlocked}/{total}
                  </div>
                  <div className="text-gray-400 text-sm capitalize">{rarity}</div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: getRarityColor(rarity) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(unlocked / total) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 15 }).map((_, i) => {
          const xSeed = `milestone-particle-x-${i}`;
          const ySeed = `milestone-particle-y-${i}`;
          const sizeSeed = `milestone-particle-size-${i}`;
          const delaySeed = `milestone-particle-delay-${i}`;
          const durationSeed = `milestone-particle-duration-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20"
              style={{
                width: 2 + seededRandom(sizeSeed) * 6,
                height: 2 + seededRandom(sizeSeed) * 6,
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, seededRandom(xSeed) * 50 - 25, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 8 + seededRandom(durationSeed) * 12,
                delay: seededRandom(delaySeed) * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}