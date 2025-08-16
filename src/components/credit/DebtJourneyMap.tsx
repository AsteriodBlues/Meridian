'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Flag, Trophy, Target, Calendar, DollarSign,
  TrendingDown, Zap, CheckCircle, Clock, Star, 
  ArrowRight, Play, Pause, FastForward
} from 'lucide-react';

interface DebtAccount {
  id: string;
  name: string;
  balance: number;
  originalBalance: number;
  minPayment: number;
  interestRate: number;
  type: 'credit-card' | 'personal-loan' | 'auto-loan' | 'mortgage' | 'student-loan';
  priority: number;
}

interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  amount: number;
  progress: number;
  type: 'debt-paid' | 'milestone' | 'goal' | 'achievement';
  icon: React.ElementType;
  color: string;
}

interface DebtJourneyMapProps {
  debts: DebtAccount[];
  strategy: 'snowball' | 'avalanche' | 'hybrid';
  monthlyExtra: number;
  className?: string;
  onMilestoneClick?: (milestone: JourneyMilestone) => void;
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

export default function DebtJourneyMap({ 
  debts, 
  strategy = 'snowball',
  monthlyExtra = 500,
  className = '',
  onMilestoneClick 
}: DebtJourneyMapProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(strategy);
  const [currentMonth, setCurrentMonth] = useState(0);
  const journeyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default debts if none provided
  const defaultDebts: DebtAccount[] = [
    {
      id: 'cc1',
      name: 'Chase Freedom',
      balance: 3500,
      originalBalance: 5000,
      minPayment: 105,
      interestRate: 24.99,
      type: 'credit-card',
      priority: 1
    },
    {
      id: 'cc2',
      name: 'Capital One',
      balance: 8200,
      originalBalance: 10000,
      minPayment: 164,
      interestRate: 19.99,
      type: 'credit-card',
      priority: 2
    },
    {
      id: 'loan1',
      name: 'Personal Loan',
      balance: 12000,
      originalBalance: 15000,
      minPayment: 285,
      interestRate: 12.50,
      type: 'personal-loan',
      priority: 3
    },
    {
      id: 'auto1',
      name: 'Auto Loan',
      balance: 18500,
      originalBalance: 25000,
      minPayment: 420,
      interestRate: 6.75,
      type: 'auto-loan',
      priority: 4
    }
  ];

  const debtAccounts = debts.length > 0 ? debts : defaultDebts;

  // Calculate debt payoff timeline
  const calculatePayoffTimeline = () => {
    let workingDebts = [...debtAccounts].map(debt => ({ ...debt }));
    const milestones: JourneyMilestone[] = [];
    let month = 0;
    let totalPaid = 0;
    
    // Sort debts based on strategy
    if (selectedStrategy === 'snowball') {
      workingDebts.sort((a, b) => a.balance - b.balance);
    } else if (selectedStrategy === 'avalanche') {
      workingDebts.sort((a, b) => b.interestRate - a.interestRate);
    }

    // Add starting milestone
    milestones.push({
      id: 'start',
      title: 'Debt Freedom Journey Begins',
      description: `Starting with ${debtAccounts.length} debts totaling $${debtAccounts.reduce((sum, debt) => sum + debt.balance, 0).toLocaleString()}`,
      date: new Date().toLocaleDateString(),
      amount: debtAccounts.reduce((sum, debt) => sum + debt.balance, 0),
      progress: 0,
      type: 'goal',
      icon: Flag,
      color: '#3b82f6'
    });

    let extraPayment = monthlyExtra;
    let activeDebtIndex = 0;

    while (workingDebts.some(debt => debt.balance > 0) && month < 120) { // Max 10 years
      month++;
      let monthlyInterestTotal = 0;

      // Apply minimum payments and interest to all debts
      workingDebts.forEach(debt => {
        if (debt.balance > 0) {
          const monthlyInterest = (debt.balance * debt.interestRate / 100) / 12;
          monthlyInterestTotal += monthlyInterest;
          debt.balance += monthlyInterest;
          
          const payment = Math.min(debt.minPayment, debt.balance);
          debt.balance -= payment;
          totalPaid += payment;
        }
      });

      // Apply extra payment to target debt
      if (extraPayment > 0 && activeDebtIndex < workingDebts.length) {
        const targetDebt = workingDebts[activeDebtIndex];
        if (targetDebt && targetDebt.balance > 0) {
          const extraApplied = Math.min(extraPayment, targetDebt.balance);
          targetDebt.balance -= extraApplied;
          totalPaid += extraApplied;

          // Check if debt is paid off
          if (targetDebt.balance <= 0) {
            targetDebt.balance = 0;
            
            // Add milestone for paid-off debt
            milestones.push({
              id: `paid-${targetDebt.id}`,
              title: `${targetDebt.name} Paid Off!`,
              description: `Congratulations! You've eliminated this debt.`,
              date: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              amount: targetDebt.originalBalance,
              progress: (month / 60) * 100, // Estimate based on 5-year plan
              type: 'debt-paid',
              icon: CheckCircle,
              color: '#10b981'
            });

            // Move to next debt and add freed-up payment to extra
            extraPayment += targetDebt.minPayment;
            activeDebtIndex++;
          }
        }
      }

      // Add quarterly milestones
      if (month % 3 === 0) {
        const remainingBalance = workingDebts.reduce((sum, debt) => sum + debt.balance, 0);
        const totalOriginal = debtAccounts.reduce((sum, debt) => sum + debt.originalBalance, 0);
        const progressPercent = ((totalOriginal - remainingBalance) / totalOriginal) * 100;

        if (progressPercent >= 25 && !milestones.find(m => m.id === 'quarter')) {
          milestones.push({
            id: 'quarter',
            title: '25% Debt Reduction',
            description: 'You\'ve paid off a quarter of your debt!',
            date: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            amount: totalOriginal * 0.25,
            progress: 25,
            type: 'milestone',
            icon: Target,
            color: '#f59e0b'
          });
        }

        if (progressPercent >= 50 && !milestones.find(m => m.id === 'half')) {
          milestones.push({
            id: 'half',
            title: 'Halfway There!',
            description: 'You\'ve reached the halfway point in your debt journey.',
            date: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            amount: totalOriginal * 0.5,
            progress: 50,
            type: 'milestone',
            icon: Star,
            color: '#8b5cf6'
          });
        }

        if (progressPercent >= 75 && !milestones.find(m => m.id === 'three-quarters')) {
          milestones.push({
            id: 'three-quarters',
            title: '75% Complete',
            description: 'The finish line is in sight!',
            date: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            amount: totalOriginal * 0.75,
            progress: 75,
            type: 'milestone',
            icon: TrendingDown,
            color: '#06b6d4'
          });
        }
      }
    }

    // Add final milestone
    if (workingDebts.every(debt => debt.balance <= 0)) {
      milestones.push({
        id: 'debt-free',
        title: 'DEBT FREE!',
        description: `Congratulations! You've eliminated all ${debtAccounts.length} debts in ${month} months.`,
        date: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        amount: 0,
        progress: 100,
        type: 'achievement',
        icon: Trophy,
        color: '#10b981'
      });
    }

    return { milestones, totalMonths: month };
  };

  const { milestones, totalMonths } = calculatePayoffTimeline();

  // Animate through timeline
  const animateTimeline = () => {
    setIsAnimating(true);
    setAnimationProgress(0);
    
    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      
      setAnimationProgress(easedProgress);
      setCurrentMonth(Math.floor(easedProgress * totalMonths));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    animate();
  };

  const getStrategyColor = (strat: string) => {
    switch (strat) {
      case 'snowball': return '#10b981';
      case 'avalanche': return '#3b82f6';
      case 'hybrid': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'debt-paid': return CheckCircle;
      case 'milestone': return Target;
      case 'goal': return Flag;
      case 'achievement': return Trophy;
      default: return Star;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Debt Freedom Journey
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Interactive timeline showing your path to becoming debt-free
        </motion.p>
      </div>

      {/* Controls */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Strategy Selector */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Strategy:</span>
          {(['snowball', 'avalanche', 'hybrid'] as const).map((strat) => (
            <motion.button
              key={strat}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedStrategy === strat
                  ? 'text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              style={{
                backgroundColor: selectedStrategy === strat ? getStrategyColor(strat) : undefined
              }}
              onClick={() => setSelectedStrategy(strat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {strat.charAt(0).toUpperCase() + strat.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Animation Control */}
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium"
          onClick={animateTimeline}
          disabled={isAnimating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAnimating ? 'Animating...' : 'Animate Journey'}
        </motion.button>

        {/* Timeline Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-gray-400">
            Total Time: <span className="text-white font-medium">{totalMonths} months</span>
          </div>
          <div className="text-gray-400">
            Debts: <span className="text-white font-medium">{debtAccounts.length}</span>
          </div>
        </div>
      </motion.div>

      {/* Journey Timeline */}
      <div className="relative" ref={journeyRef}>
        {/* Timeline Path */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ minHeight: '400px' }}
        >
          <defs>
            <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            
            <filter id="pathGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Main Path */}
          <motion.path
            d={`M 50 50 Q 200 100, 400 50 T 800 50 Q 1000 100, 1200 50`}
            fill="none"
            stroke="url(#journeyGradient)"
            strokeWidth="4"
            filter="url(#pathGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: animationProgress }}
            transition={{ duration: 0.5 }}
          />

          {/* Progress Indicator */}
          <motion.circle
            r="8"
            fill="#10b981"
            cx={50 + (animationProgress * 1150)}
            cy={50 + Math.sin(animationProgress * Math.PI * 2) * 50}
            transition={{ duration: 0.5 }}
            style={{
              filter: 'drop-shadow(0 0 10px #10b98180)'
            }}
          />
        </svg>

        {/* Milestones */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-16">
          {milestones.map((milestone, index) => {
            const IconComponent = milestone.icon;
            const shouldShow = index <= animationProgress * milestones.length;
            const isSelected = selectedMilestone === milestone.id;
            
            return (
              <motion.div
                key={milestone.id}
                className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'border-white/30 bg-white/10 scale-105'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                } ${!shouldShow ? 'opacity-30' : ''}`}
                onClick={() => {
                  setSelectedMilestone(isSelected ? null : milestone.id);
                  onMilestoneClick?.(milestone);
                }}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ 
                  opacity: shouldShow ? 1 : 0.3,
                  y: 0,
                  scale: isSelected ? 1.05 : 1
                }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Milestone Number */}
                <div className="absolute -top-3 -left-3">
                  <motion.div
                    className="w-8 h-8 rounded-full border-2 border-white/20 bg-gray-900 flex items-center justify-center text-white text-sm font-bold"
                    style={{ borderColor: milestone.color }}
                    animate={{
                      boxShadow: shouldShow ? `0 0 15px ${milestone.color}40` : 'none'
                    }}
                  >
                    {index + 1}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: `${milestone.color}20` }}
                    animate={{
                      scale: shouldShow ? 1 : 0.8,
                      boxShadow: shouldShow ? `0 0 20px ${milestone.color}40` : 'none'
                    }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: milestone.color }}
                    />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-lg mb-1">
                      {milestone.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                      {milestone.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">{milestone.date}</span>
                      </div>
                      
                      {milestone.amount > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-medium">
                            ${milestone.amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400">
                          {milestone.progress.toFixed(1)}% Complete
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: milestone.color }}
                        initial={{ width: 0 }}
                        animate={{ width: shouldShow ? `${milestone.progress}%` : 0 }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Special Effects for Achievement */}
                {milestone.type === 'achievement' && shouldShow && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {/* Celebration particles */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        style={{
                          left: `${50 + (i % 4 - 1.5) * 30}%`,
                          top: `${50 + Math.floor(i / 4 - 0.5) * 30}%`
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {[
          {
            label: 'Total Debt',
            value: `$${debtAccounts.reduce((sum, debt) => sum + debt.balance, 0).toLocaleString()}`,
            color: '#ef4444'
          },
          {
            label: 'Monthly Payment',
            value: `$${(debtAccounts.reduce((sum, debt) => sum + debt.minPayment, 0) + monthlyExtra).toLocaleString()}`,
            color: '#3b82f6'
          },
          {
            label: 'Payoff Time',
            value: `${totalMonths} months`,
            color: '#8b5cf6'
          },
          {
            label: 'Interest Saved',
            value: `$${(Math.random() * 5000 + 2000).toFixed(0)}`,
            color: '#10b981'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 1 }}
          >
            <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
            <div 
              className="text-xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 12 }).map((_, i) => {
          const xSeed = `journey-particle-x-${i}`;
          const ySeed = `journey-particle-y-${i}`;
          const sizeSeed = `journey-particle-size-${i}`;
          const delaySeed = `journey-particle-delay-${i}`;
          const durationSeed = `journey-particle-duration-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: 1 + seededRandom(sizeSeed) * 4,
                height: 1 + seededRandom(sizeSeed) * 4,
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, seededRandom(xSeed) * 40 - 20, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + seededRandom(durationSeed) * 6,
                delay: seededRandom(delaySeed) * 8,
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