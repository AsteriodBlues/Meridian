'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Calculator, 
  PiggyBank, Zap, Target, Award, Calendar, Clock
} from 'lucide-react';

interface InterestSavedCounterProps {
  originalPayoffMonths: number;
  acceleratedPayoffMonths: number;
  totalDebt: number;
  averageInterestRate: number;
  monthlyExtraPayment: number;
  className?: string;
  animated?: boolean;
}

interface SavingsBreakdown {
  category: string;
  amount: number;
  description: string;
  icon: React.ElementType;
  color: string;
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

export default function InterestSavedCounter({ 
  originalPayoffMonths = 72,
  acceleratedPayoffMonths = 42,
  totalDebt = 42200,
  averageInterestRate = 18.5,
  monthlyExtraPayment = 500,
  className = '',
  animated = true 
}: InterestSavedCounterProps) {
  const [mounted, setMounted] = useState(false);
  const [displayedAmount, setDisplayedAmount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState<string | null>(null);
  const [counterMode, setCounterMode] = useState<'total' | 'monthly' | 'daily'>('total');
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate interest savings
  const calculateSavings = () => {
    const monthlyRate = averageInterestRate / 100 / 12;
    
    // Original scenario (minimum payments only)
    const originalMonthlyPayment = totalDebt * (monthlyRate * Math.pow(1 + monthlyRate, originalPayoffMonths)) / 
                                    (Math.pow(1 + monthlyRate, originalPayoffMonths) - 1);
    const originalTotalPaid = originalMonthlyPayment * originalPayoffMonths;
    const originalInterest = originalTotalPaid - totalDebt;
    
    // Accelerated scenario (with extra payments)
    const acceleratedMonthlyPayment = originalMonthlyPayment + monthlyExtraPayment;
    const acceleratedTotalPaid = acceleratedMonthlyPayment * acceleratedPayoffMonths;
    const acceleratedInterest = acceleratedTotalPaid - totalDebt;
    
    // Savings
    const interestSaved = originalInterest - acceleratedInterest;
    const timeSaved = originalPayoffMonths - acceleratedPayoffMonths;
    
    return {
      interestSaved,
      timeSaved,
      originalInterest,
      acceleratedInterest,
      originalTotalPaid,
      acceleratedTotalPaid,
      monthlySavings: interestSaved / acceleratedPayoffMonths,
      dailySavings: interestSaved / (acceleratedPayoffMonths * 30)
    };
  };

  const savings = calculateSavings();
  
  // Savings breakdown
  const savingsBreakdown: SavingsBreakdown[] = [
    {
      category: 'Interest Savings',
      amount: savings.interestSaved,
      description: 'Total interest saved by paying extra',
      icon: PiggyBank,
      color: '#10b981'
    },
    {
      category: 'Time Savings',
      amount: savings.timeSaved,
      description: 'Months eliminated from payoff timeline',
      icon: Clock,
      color: '#3b82f6'
    },
    {
      category: 'Monthly Impact',
      amount: savings.monthlySavings,
      description: 'Average monthly interest savings',
      icon: Calendar,
      color: '#8b5cf6'
    },
    {
      category: 'Daily Benefit',
      amount: savings.dailySavings,
      description: 'Interest saved per day on average',
      icon: Zap,
      color: '#f59e0b'
    }
  ];

  // Get display amount based on mode
  const getDisplayAmount = () => {
    switch (counterMode) {
      case 'monthly': return savings.monthlySavings;
      case 'daily': return savings.dailySavings;
      default: return savings.interestSaved;
    }
  };

  // Animate counter
  useEffect(() => {
    if (!mounted || !animated) {
      setDisplayedAmount(getDisplayAmount());
      return;
    }

    setIsAnimating(true);
    const targetAmount = getDisplayAmount();
    const startAmount = displayedAmount;
    const duration = 2000;
    const startTime = Date.now();

    const animateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentAmount = startAmount + (targetAmount - startAmount) * easeOutQuart;
      
      setDisplayedAmount(currentAmount);
      
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        setIsAnimating(false);
      }
    };

    animateCounter();
  }, [counterMode, mounted, animated]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(amount);
  };

  // Create floating money symbols for animation
  const createMoneySymbols = () => {
    if (!mounted) return [];
    
    return Array.from({ length: 20 }, (_, i) => {
      const xSeed = `money-x-${i}`;
      const ySeed = `money-y-${i}`;
      const sizeSeed = `money-size-${i}`;
      const delaySeed = `money-delay-${i}`;
      const durationSeed = `money-duration-${i}`;
      
      return {
        id: i,
        x: seededRandom(xSeed) * 100,
        y: seededRandom(ySeed) * 100,
        size: 12 + seededRandom(sizeSeed) * 16,
        delay: seededRandom(delaySeed) * 4,
        duration: 3 + seededRandom(durationSeed) * 4,
        symbol: ['$', '¢', '€', '£', '¥'][Math.floor(seededRandom(`symbol-${i}`) * 5)]
      };
    });
  };

  const [moneySymbols, setMoneySymbols] = useState<any[]>([]);

  useEffect(() => {
    if (mounted) {
      setMoneySymbols(createMoneySymbols());
    }
  }, [mounted]);

  return (
    <div className={`relative ${className}`}>
      {/* Main Counter Display */}
      <div className="relative mb-8">
        <motion.div
          ref={counterRef}
          className="text-center p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl border border-green-500/20 rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Floating Money Symbols */}
            {moneySymbols.map((symbol) => (
              <motion.div
                key={symbol.id}
                className="absolute text-green-400/30 font-bold pointer-events-none"
                style={{
                  left: `${symbol.x}%`,
                  top: `${symbol.y}%`,
                  fontSize: `${symbol.size}px`
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0, 0.6, 0],
                  rotate: [0, 360],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: symbol.duration,
                  delay: symbol.delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {symbol.symbol}
              </motion.div>
            ))}
          </div>

          {/* Counter Content */}
          <div className="relative z-10">
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-white text-xl font-medium mb-2">
                {counterMode === 'total' && 'Total Interest Saved'}
                {counterMode === 'monthly' && 'Monthly Savings'}
                {counterMode === 'daily' && 'Daily Savings'}
              </h3>
              <p className="text-green-400 text-sm">
                By paying an extra ${monthlyExtraPayment.toLocaleString()} per month
              </p>
            </motion.div>

            {/* Main Amount */}
            <motion.div
              className="mb-6"
              animate={isAnimating ? {
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 0px rgba(16, 185, 129, 0)',
                  '0 0 30px rgba(16, 185, 129, 0.8)',
                  '0 0 0px rgba(16, 185, 129, 0)'
                ]
              } : {}}
              transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
            >
              <div className="text-6xl md:text-8xl font-bold text-green-400 font-mono">
                {counterMode === 'time' 
                  ? `${formatNumber(displayedAmount)}mo`
                  : formatCurrency(displayedAmount)
                }
              </div>
            </motion.div>

            {/* Mode Selector */}
            <div className="flex justify-center gap-2">
              {[
                { key: 'total', label: 'Total', icon: PiggyBank },
                { key: 'monthly', label: 'Monthly', icon: Calendar },
                { key: 'daily', label: 'Daily', icon: Zap }
              ].map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <motion.button
                    key={mode.key}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      counterMode === mode.key
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/15'
                    }`}
                    onClick={() => setCounterMode(mode.key as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Savings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {savingsBreakdown.map((item, index) => {
          const IconComponent = item.icon;
          const isSelected = selectedBreakdown === item.category;
          
          return (
            <motion.div
              key={item.category}
              className={`p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all ${
                isSelected
                  ? 'border-white/30 bg-white/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => setSelectedBreakdown(isSelected ? null : item.category)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: `${item.color}20` }}
                  animate={{
                    scale: isSelected ? 1.1 : 1,
                    boxShadow: isSelected ? `0 0 20px ${item.color}40` : 'none'
                  }}
                >
                  <IconComponent 
                    className="w-5 h-5" 
                    style={{ color: item.color }}
                  />
                </motion.div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{item.category}</div>
                </div>
              </div>

              <div className="mb-3">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: item.color }}
                >
                  {item.category === 'Time Savings' 
                    ? `${formatNumber(item.amount)} months`
                    : formatCurrency(item.amount)
                  }
                </div>
              </div>

              <p className="text-gray-400 text-sm">{item.description}</p>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Chart */}
      <motion.div
        className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className="text-white font-bold text-lg mb-6">Payment Comparison</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original Plan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span className="text-white font-medium">Minimum Payments Only</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Interest:</span>
                <span className="text-red-400 font-mono">
                  {formatCurrency(savings.originalInterest)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Paid:</span>
                <span className="text-white font-mono">
                  {formatCurrency(savings.originalTotalPaid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payoff Time:</span>
                <span className="text-white font-mono">
                  {originalPayoffMonths} months
                </span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="relative h-8 bg-gray-700 rounded-lg overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-red-500"
                style={{ width: `${(savings.originalInterest / savings.originalTotalPaid) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                Interest: {((savings.originalInterest / savings.originalTotalPaid) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Accelerated Plan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-white font-medium">With Extra Payments</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Interest:</span>
                <span className="text-green-400 font-mono">
                  {formatCurrency(savings.acceleratedInterest)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Paid:</span>
                <span className="text-white font-mono">
                  {formatCurrency(savings.acceleratedTotalPaid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payoff Time:</span>
                <span className="text-white font-mono">
                  {acceleratedPayoffMonths} months
                </span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="relative h-8 bg-gray-700 rounded-lg overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-green-500"
                style={{ width: `${(savings.acceleratedInterest / savings.acceleratedTotalPaid) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                Interest: {((savings.acceleratedInterest / savings.acceleratedTotalPaid) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold">
                {formatCurrency(savings.interestSaved)}
              </div>
              <div className="text-gray-400 text-sm">Interest Saved</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold">
                {savings.timeSaved} months
              </div>
              <div className="text-gray-400 text-sm">Time Saved</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievement Badges */}
      <motion.div
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {[
          { icon: Award, label: 'Smart Saver', color: '#10b981' },
          { icon: Target, label: 'Goal Crusher', color: '#3b82f6' },
          { icon: TrendingUp, label: 'Progress Maker', color: '#8b5cf6' },
          { icon: Calculator, label: 'Math Wizard', color: '#f59e0b' }
        ].map((badge, index) => {
          const IconComponent = badge.icon;
          
          return (
            <motion.div
              key={badge.label}
              className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${badge.color}20` }}
                animate={{
                  boxShadow: [`0 0 0px ${badge.color}00`, `0 0 20px ${badge.color}40`, `0 0 0px ${badge.color}00`]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <IconComponent 
                  className="w-6 h-6" 
                  style={{ color: badge.color }}
                />
              </motion.div>
              <div className="text-white text-sm font-medium">{badge.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}