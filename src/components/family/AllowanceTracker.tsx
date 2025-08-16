'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, TrendingUp, Calendar, Gift, Star,
  Coins, PiggyBank, Target, Trophy, Crown,
  Plus, Minus, Check, Clock, Zap, Sparkles,
  Award, Medal, Heart, Smile, ChevronRight
} from 'lucide-react';

interface AllowanceTransaction {
  id: string;
  type: 'allowance' | 'bonus' | 'spending' | 'saving';
  amount: number;
  description: string;
  date: string;
  category?: string;
}

interface AllowanceGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  emoji: string;
  deadline?: string;
  achieved: boolean;
}

interface Kid {
  id: string;
  name: string;
  avatar: string;
  age: number;
  weeklyAllowance: number;
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  totalSaved: number;
  level: number;
  points: number;
  badges: string[];
  goals: AllowanceGoal[];
  transactions: AllowanceTransaction[];
  color: string;
  nextPayday: string;
}

interface AllowanceTrackerProps {
  kids: Kid[];
  className?: string;
  onKidClick?: (kid: Kid) => void;
  onAddTransaction?: (kidId: string, transaction: Partial<AllowanceTransaction>) => void;
  onEditGoal?: (kidId: string, goalId: string) => void;
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

export default function AllowanceTracker({ 
  kids, 
  className = '',
  onKidClick,
  onAddTransaction,
  onEditGoal 
}: AllowanceTrackerProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedKid, setSelectedKid] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showPaydayAnimation, setShowPaydayAnimation] = useState<string | null>(null);
  const trackerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default kids data if none provided
  const defaultKids: Kid[] = [
    {
      id: 'emma',
      name: 'Emma',
      avatar: '👧',
      age: 16,
      weeklyAllowance: 50,
      currentBalance: 127.50,
      totalEarned: 850,
      totalSpent: 532.50,
      totalSaved: 190,
      level: 6,
      points: 1250,
      badges: ['First Save', 'Goal Getter', 'Smart Spender'],
      nextPayday: '2024-08-20',
      color: '#8b5cf6',
      goals: [
        {
          id: 'phone',
          title: 'New Phone',
          targetAmount: 300,
          currentAmount: 127.50,
          emoji: '📱',
          deadline: '2024-12-25',
          achieved: false
        },
        {
          id: 'clothes',
          title: 'Summer Clothes',
          targetAmount: 100,
          currentAmount: 100,
          emoji: '👕',
          achieved: true
        }
      ],
      transactions: [
        { id: '1', type: 'allowance', amount: 50, description: 'Weekly allowance', date: '2024-08-13' },
        { id: '2', type: 'bonus', amount: 25, description: 'Extra chores bonus', date: '2024-08-10' },
        { id: '3', type: 'spending', amount: -15, description: 'Movie tickets', date: '2024-08-08' },
        { id: '4', type: 'saving', amount: 30, description: 'Phone fund', date: '2024-08-05' }
      ]
    },
    {
      id: 'alex',
      name: 'Alex',
      avatar: '👦',
      age: 12,
      weeklyAllowance: 25,
      currentBalance: 67.25,
      totalEarned: 425,
      totalSpent: 187.75,
      totalSaved: 170,
      level: 4,
      points: 890,
      badges: ['Chore Champion', 'Penny Saver'],
      nextPayday: '2024-08-20',
      color: '#10b981',
      goals: [
        {
          id: 'bike',
          title: 'New Bike',
          targetAmount: 150,
          currentAmount: 67.25,
          emoji: '🚲',
          deadline: '2024-10-31',
          achieved: false
        },
        {
          id: 'game',
          title: 'Video Game',
          targetAmount: 60,
          currentAmount: 60,
          emoji: '🎮',
          achieved: true
        }
      ],
      transactions: [
        { id: '1', type: 'allowance', amount: 25, description: 'Weekly allowance', date: '2024-08-13' },
        { id: '2', type: 'bonus', amount: 10, description: 'Room cleaning bonus', date: '2024-08-11' },
        { id: '3', type: 'spending', amount: -8, description: 'Ice cream', date: '2024-08-09' },
        { id: '4', type: 'saving', amount: 20, description: 'Bike fund', date: '2024-08-06' }
      ]
    },
    {
      id: 'lily',
      name: 'Lily',
      avatar: '👧',
      age: 8,
      weeklyAllowance: 15,
      currentBalance: 23.50,
      totalEarned: 180,
      totalSpent: 96.50,
      totalSaved: 60,
      level: 2,
      points: 450,
      badges: ['First Save'],
      nextPayday: '2024-08-20',
      color: '#f59e0b',
      goals: [
        {
          id: 'toy',
          title: 'Dollhouse',
          targetAmount: 40,
          currentAmount: 23.50,
          emoji: '🏠',
          deadline: '2024-09-15',
          achieved: false
        }
      ],
      transactions: [
        { id: '1', type: 'allowance', amount: 15, description: 'Weekly allowance', date: '2024-08-13' },
        { id: '2', type: 'bonus', amount: 5, description: 'Good behavior bonus', date: '2024-08-12' },
        { id: '3', type: 'spending', amount: -3, description: 'Candy', date: '2024-08-10' },
        { id: '4', type: 'saving', amount: 10, description: 'Dollhouse fund', date: '2024-08-07' }
      ]
    }
  ];

  const kidsData = kids.length > 0 ? kids : defaultKids;

  // Get days until payday
  const getDaysUntilPayday = (payday: string) => {
    const today = new Date();
    const paydayDate = new Date(payday);
    const diffTime = paydayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  // Get badge emoji
  const getBadgeEmoji = (badge: string) => {
    const badges: { [key: string]: string } = {
      'First Save': '💰',
      'Goal Getter': '🎯',
      'Smart Spender': '🧠',
      'Chore Champion': '⭐',
      'Penny Saver': '🪙',
      'Super Saver': '💎',
      'Money Master': '👑'
    };
    return badges[badge] || '🏆';
  };

  // Calculate savings rate
  const getSavingsRate = (kid: Kid) => {
    if (kid.totalEarned === 0) return 0;
    return (kid.totalSaved / kid.totalEarned) * 100;
  };

  // Animate step by step
  useEffect(() => {
    if (mounted) {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Allowance Tracker
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Track allowances, savings goals, and spending habits for each child
        </motion.p>
      </div>

      {/* Kids Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {kidsData.map((kid, index) => {
          const daysUntilPayday = getDaysUntilPayday(kid.nextPayday);
          const savingsRate = getSavingsRate(kid);
          const isSelected = selectedKid === kid.id;
          
          return (
            <motion.div
              key={kid.id}
              className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                isSelected
                  ? 'border-white/30 bg-white/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => {
                setSelectedKid(isSelected ? null : kid.id);
                onKidClick?.(kid);
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                boxShadow: isSelected ? `0 0 30px ${kid.color}40` : 'none'
              }}
            >
              {/* Background */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${kid.color}40, transparent 70%)`
                }}
              />

              {/* Header */}
              <div className="relative z-10 flex items-center gap-4 mb-6">
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2 border-white/20"
                  style={{ backgroundColor: `${kid.color}20` }}
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [`0 0 0px ${kid.color}`, `0 0 20px ${kid.color}40`, `0 0 0px ${kid.color}`]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  {kid.avatar}
                </motion.div>
                
                <div>
                  <h4 className="text-white font-bold text-xl">{kid.name}</h4>
                  <p className="text-gray-400">{kid.age} years old • Level {kid.level}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">{kid.points} pts</span>
                  </div>
                </div>
              </div>

              {/* Balance Display */}
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Current Balance</div>
                  <motion.div
                    className="text-3xl font-bold text-white"
                    animate={{
                      color: animationStep === index % 4 ? kid.color : '#ffffff'
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    ${kid.currentBalance.toFixed(2)}
                  </motion.div>
                  
                  {/* Coins Animation */}
                  <div className="relative h-4 mt-2">
                    {Array.from({ length: Math.min(5, Math.floor(kid.currentBalance / 10)) }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute left-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-xs"
                        style={{ 
                          x: -12 + i * 6,
                          zIndex: 5 - i
                        }}
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        <Coins className="w-3 h-3 text-yellow-900" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Weekly', value: `$${kid.weeklyAllowance}`, icon: Calendar, color: '#3b82f6' },
                  { label: 'Saved', value: `${savingsRate.toFixed(0)}%`, icon: PiggyBank, color: '#10b981' },
                  { label: 'Earned', value: `$${kid.totalEarned}`, icon: TrendingUp, color: '#8b5cf6' },
                  { label: 'Goals', value: kid.goals.length.toString(), icon: Target, color: '#f59e0b' }
                ].map((stat, statIndex) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      className="p-3 bg-white/5 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + statIndex * 0.05 + 0.5 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-3 h-3" style={{ color: stat.color }} />
                        <span className="text-gray-400 text-xs">{stat.label}</span>
                      </div>
                      <span className="text-white font-bold text-sm">{stat.value}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Payday Countdown */}
              <motion.div
                className="mb-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.8 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Next Payday</span>
                  </div>
                  <div className="text-white font-bold">
                    {daysUntilPayday === 0 ? 'Today!' : `${daysUntilPayday} days`}
                  </div>
                </div>
                
                {daysUntilPayday === 0 && (
                  <motion.div
                    className="mt-2 text-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="text-green-400 text-sm font-bold">💰 Payday! 💰</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Badges */}
              <div className="mb-4">
                <div className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Badges Earned
                </div>
                <div className="flex flex-wrap gap-1">
                  {kid.badges.map((badge, badgeIndex) => (
                    <motion.div
                      key={badge}
                      className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + badgeIndex * 0.1 + 1 }}
                    >
                      <span>{getBadgeEmoji(badge)}</span>
                      <span>{badge}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Current Goals Preview */}
              {kid.goals.length > 0 && (
                <div>
                  <div className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Active Goals
                  </div>
                  <div className="space-y-2">
                    {kid.goals.slice(0, 2).map((goal, goalIndex) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      return (
                        <motion.div
                          key={goal.id}
                          className="p-2 bg-white/5 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + goalIndex * 0.1 + 1.2 }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{goal.emoji}</span>
                              <span className="text-white text-sm font-medium">{goal.title}</span>
                              {goal.achieved && (
                                <Check className="w-3 h-3 text-green-400" />
                              )}
                            </div>
                            <span className="text-gray-400 text-xs">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: goal.achieved ? '#10b981' : kid.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(progress, 100)}%` }}
                              transition={{ duration: 1.5, delay: index * 0.1 + goalIndex * 0.1 + 1.5 }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Action Buttons */}
              <div className="flex gap-2 mt-4">
                <motion.button
                  className="flex-1 p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTransaction?.(kid.id, { type: 'allowance', amount: kid.weeklyAllowance });
                  }}
                >
                  <Plus className="w-3 h-3 inline mr-1" />
                  Add Money
                </motion.button>
                
                <motion.button
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // View details
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Kid Details */}
      <AnimatePresence>
        {selectedKid && (() => {
          const kid = kidsData.find(k => k.id === selectedKid);
          if (!kid) return null;
          
          return (
            <motion.div
              className="p-6 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-bold text-xl">
                  {kid.name}'s Financial Journey
                </h4>
                <motion.button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setSelectedKid(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div>
                  <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Activity
                  </h5>
                  <div className="space-y-2">
                    {kid.transactions.slice(0, 4).map((transaction, index) => {
                      const isPositive = transaction.amount > 0;
                      return (
                        <motion.div
                          key={transaction.id}
                          className="p-3 bg-white/5 rounded-lg flex items-center justify-between"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
                              }`}
                            >
                              {transaction.type === 'allowance' && <Calendar className="w-4 h-4 text-green-400" />}
                              {transaction.type === 'bonus' && <Star className="w-4 h-4 text-yellow-400" />}
                              {transaction.type === 'spending' && <Minus className="w-4 h-4 text-red-400" />}
                              {transaction.type === 'saving' && <PiggyBank className="w-4 h-4 text-blue-400" />}
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">{transaction.description}</div>
                              <div className="text-gray-400 text-xs">{transaction.date}</div>
                            </div>
                          </div>
                          <div className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? '+' : ''}${Math.abs(transaction.amount)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Goals Detail */}
                <div>
                  <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Savings Goals
                  </h5>
                  <div className="space-y-3">
                    {kid.goals.map((goal, index) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      return (
                        <motion.div
                          key={goal.id}
                          className={`p-4 rounded-lg border-2 ${
                            goal.achieved 
                              ? 'border-green-500/30 bg-green-500/10' 
                              : 'border-white/10 bg-white/5'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{goal.emoji}</span>
                            <div className="flex-1">
                              <h6 className={`font-bold ${goal.achieved ? 'text-green-400' : 'text-white'}`}>
                                {goal.title}
                              </h6>
                              <div className="text-gray-400 text-sm">
                                ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount}
                              </div>
                            </div>
                            {goal.achieved && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <Trophy className="w-6 h-6 text-yellow-400" />
                              </motion.div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Progress</span>
                              <span className={goal.achieved ? 'text-green-400' : 'text-white'}>
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: goal.achieved ? '#10b981' : kid.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                transition={{ duration: 1.5, delay: index * 0.2 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 20 }).map((_, i) => {
          const xSeed = `allowance-particle-x-${i}`;
          const ySeed = `allowance-particle-y-${i}`;
          const delaySeed = `allowance-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-yellow-400/20 text-xl"
              style={{
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, seededRandom(xSeed) * 30 - 15, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 8 + seededRandom(`allowance-duration-${i}`) * 8,
                delay: seededRandom(delaySeed) * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['💰', '🪙', '💎', '⭐', '🎯'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}