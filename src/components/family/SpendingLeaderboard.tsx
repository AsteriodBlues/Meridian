'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Crown, Medal, Target, TrendingUp, TrendingDown,
  DollarSign, Calendar, Filter, BarChart3, PieChart,
  Star, Zap, Flame, Award, Shield, Sparkles,
  ChevronUp, ChevronDown, Eye, Settings
} from 'lucide-react';

interface SpendingCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  age: number;
  role: 'parent' | 'teen' | 'child';
  color: string;
  spending: {
    total: number;
    categories: { [key: string]: number };
    weeklyBudget: number;
    previousWeek: number;
    streak: number; // days under budget
    achievements: string[];
  };
  rank: number;
  rankChange: number; // positive = moved up, negative = moved down
  badges: string[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'budget' | 'savings' | 'category' | 'streak';
  target: number;
  current: number;
  duration: string;
  reward: string;
  participants: string[];
  isActive: boolean;
  icon: React.ElementType;
  color: string;
}

interface SpendingLeaderboardProps {
  members: FamilyMember[];
  challenges: Challenge[];
  period: 'week' | 'month' | 'year';
  className?: string;
  onMemberClick?: (member: FamilyMember) => void;
  onChallengeJoin?: (challengeId: string, memberId: string) => void;
  onPeriodChange?: (period: 'week' | 'month' | 'year') => void;
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

export default function SpendingLeaderboard({ 
  members, 
  challenges,
  period = 'week',
  className = '',
  onMemberClick,
  onChallengeJoin,
  onPeriodChange 
}: SpendingLeaderboardProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'leaderboard' | 'challenges' | 'analytics'>('leaderboard');
  const [sortBy, setSortBy] = useState<'spending' | 'savings' | 'budget'>('spending');
  const [animationStep, setAnimationStep] = useState(0);
  const leaderboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data if none provided
  const defaultMembers: FamilyMember[] = [
    {
      id: 'mom',
      name: 'Sarah',
      avatar: '👩‍💻',
      age: 39,
      role: 'parent',
      color: '#ec4899',
      spending: {
        total: 1245.67,
        categories: {
          groceries: 340.50,
          utilities: 285.30,
          entertainment: 120.80,
          shopping: 195.45,
          dining: 185.20,
          transportation: 118.42
        },
        weeklyBudget: 1500,
        previousWeek: 1380.25,
        streak: 12,
        achievements: ['Budget Master', 'Savings Champion', 'Smart Spender']
      },
      rank: 1,
      rankChange: 1,
      badges: ['💰', '🎯', '👑']
    },
    {
      id: 'dad',
      name: 'David',
      avatar: '👨‍💼',
      age: 42,
      role: 'parent',
      color: '#3b82f6',
      spending: {
        total: 1456.89,
        categories: {
          automotive: 485.60,
          home: 320.75,
          technology: 285.40,
          dining: 210.30,
          entertainment: 154.84
        },
        weeklyBudget: 1400,
        previousWeek: 1320.45,
        streak: 8,
        achievements: ['Tech Enthusiast', 'Home Improver']
      },
      rank: 2,
      rankChange: -1,
      badges: ['🔧', '💻']
    },
    {
      id: 'emma',
      name: 'Emma',
      avatar: '👧',
      age: 16,
      role: 'teen',
      color: '#8b5cf6',
      spending: {
        total: 234.56,
        categories: {
          shopping: 125.30,
          entertainment: 65.80,
          food: 43.46
        },
        weeklyBudget: 300,
        previousWeek: 185.20,
        streak: 5,
        achievements: ['Fashion Forward', 'Under Budget Pro']
      },
      rank: 3,
      rankChange: 2,
      badges: ['👗', '💝']
    },
    {
      id: 'alex',
      name: 'Alex',
      avatar: '👦',
      age: 12,
      role: 'child',
      color: '#10b981',
      spending: {
        total: 45.80,
        categories: {
          toys: 25.60,
          snacks: 12.50,
          books: 7.70
        },
        weeklyBudget: 50,
        previousWeek: 38.25,
        streak: 15,
        achievements: ['Super Saver', 'Book Lover']
      },
      rank: 4,
      rankChange: 0,
      badges: ['📚', '💎']
    },
    {
      id: 'lily',
      name: 'Lily',
      avatar: '👧',
      age: 8,
      role: 'child',
      color: '#f59e0b',
      spending: {
        total: 18.50,
        categories: {
          toys: 12.00,
          treats: 6.50
        },
        weeklyBudget: 25,
        previousWeek: 22.75,
        streak: 7,
        achievements: ['Little Saver']
      },
      rank: 5,
      rankChange: 1,
      badges: ['🌟']
    }
  ];

  const defaultChallenges: Challenge[] = [
    {
      id: 'budget-challenge',
      title: 'Weekly Budget Challenge',
      description: 'Stay under budget for 7 consecutive days',
      type: 'budget',
      target: 7,
      current: 3,
      duration: '4 days left',
      reward: 'Family movie night',
      participants: ['mom', 'dad', 'emma'],
      isActive: true,
      icon: Target,
      color: '#3b82f6'
    },
    {
      id: 'savings-streak',
      title: 'Savings Streak Master',
      description: 'Save at least $10 per day for 10 days',
      type: 'savings',
      target: 10,
      current: 6,
      duration: '4 days left',
      reward: '$50 bonus to everyone',
      participants: ['mom', 'alex', 'lily'],
      isActive: true,
      icon: Flame,
      color: '#ef4444'
    },
    {
      id: 'no-dining-out',
      title: 'Home Cooking Hero',
      description: 'No dining out for 2 weeks',
      type: 'category',
      target: 14,
      current: 8,
      duration: '6 days left',
      reward: 'Family cooking class',
      participants: ['mom', 'dad'],
      isActive: true,
      icon: Shield,
      color: '#10b981'
    }
  ];

  const familyMembers = members.length > 0 ? members : defaultMembers;
  const activeChallenges = challenges.length > 0 ? challenges : defaultChallenges;

  // Sort members based on criteria
  const sortedMembers = [...familyMembers].sort((a, b) => {
    switch (sortBy) {
      case 'savings':
        return (b.spending.weeklyBudget - b.spending.total) - (a.spending.weeklyBudget - a.spending.total);
      case 'budget':
        return (a.spending.total / a.spending.weeklyBudget) - (b.spending.total / b.spending.weeklyBudget);
      default:
        return a.spending.total - b.spending.total; // ascending for spending
    }
  });

  // Get rank icon
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-orange-400" />;
      default: return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  // Get rank change indicator
  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <ChevronDown className="w-4 h-4 text-red-400" />;
    return null;
  };

  // Calculate budget efficiency
  const getBudgetEfficiency = (member: FamilyMember) => {
    return ((member.spending.weeklyBudget - member.spending.total) / member.spending.weeklyBudget) * 100;
  };

  // Get efficiency color
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 20) return '#10b981';
    if (efficiency >= 10) return '#f59e0b';
    if (efficiency >= 0) return '#8b5cf6';
    return '#ef4444';
  };

  // Animate through steps
  useEffect(() => {
    if (mounted) {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 3);
      }, 3000);
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
          Family Spending Leaderboard
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Track spending, compete in challenges, and celebrate financial wins
        </motion.p>
      </div>

      {/* Controls */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* View Mode */}
        <div className="flex gap-2">
          {[
            { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { key: 'challenges', label: 'Challenges', icon: Target },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((mode) => {
            const Icon = mode.icon;
            return (
              <motion.button
                key={mode.key}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === mode.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
                onClick={() => setViewMode(mode.key as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                {mode.label}
              </motion.button>
            );
          })}
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          <span className="text-gray-400 text-sm self-center">Period:</span>
          {['week', 'month', 'year'].map((p) => (
            <motion.button
              key={p}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => onPeriodChange?.(p as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Sort By */}
        {viewMode === 'leaderboard' && (
          <div className="flex gap-2">
            <span className="text-gray-400 text-sm self-center">Sort by:</span>
            {[
              { key: 'spending', label: 'Spending' },
              { key: 'savings', label: 'Savings' },
              { key: 'budget', label: 'Efficiency' }
            ].map((sort) => (
              <motion.button
                key={sort.key}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === sort.key
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
                onClick={() => setSortBy(sort.key as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sort.label}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Leaderboard */}
            <div className="space-y-4 mb-8">
              {sortedMembers.map((member, index) => {
                const efficiency = getBudgetEfficiency(member);
                const savings = member.spending.weeklyBudget - member.spending.total;
                const isSelected = selectedMember === member.id;
                
                return (
                  <motion.div
                    key={member.id}
                    className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                      index === 0
                        ? 'border-yellow-400/30 bg-yellow-400/5'
                        : index === 1
                        ? 'border-gray-400/30 bg-gray-400/5'
                        : index === 2
                        ? 'border-orange-400/30 bg-orange-400/5'
                        : isSelected
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    onClick={() => {
                      setSelectedMember(isSelected ? null : member.id);
                      onMemberClick?.(member);
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    style={{
                      boxShadow: index < 3 
                        ? `0 0 30px ${index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : '#fb923c'}40` 
                        : isSelected 
                        ? `0 0 30px ${member.color}40` 
                        : 'none'
                    }}
                  >
                    {/* Background Effect */}
                    <div 
                      className="absolute inset-0 opacity-5"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${member.color}40, transparent 70%)`
                      }}
                    />

                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      {getRankIcon(index + 1)}
                      {getRankChangeIcon(member.rankChange)}
                    </div>

                    {/* Efficiency Badge */}
                    <div 
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold"
                      style={{ 
                        backgroundColor: `${getEfficiencyColor(efficiency)}20`,
                        color: getEfficiencyColor(efficiency)
                      }}
                    >
                      {efficiency >= 0 ? '+' : ''}{efficiency.toFixed(1)}%
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 pt-8">
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <motion.div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2"
                          style={{ 
                            backgroundColor: `${member.color}20`,
                            borderColor: member.color
                          }}
                          animate={{
                            scale: animationStep === index % 3 ? [1, 1.1, 1] : 1,
                            boxShadow: animationStep === index % 3 
                              ? [`0 0 0px ${member.color}`, `0 0 30px ${member.color}60`, `0 0 0px ${member.color}`]
                              : `0 0 10px ${member.color}40`
                          }}
                          transition={{ duration: 2 }}
                        >
                          {member.avatar}
                        </motion.div>
                        
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-xl">{member.name}</h4>
                          <p className="text-gray-400 capitalize">{member.role} • {member.age} years old</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400 text-sm font-medium">
                              {member.spending.streak} day streak
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                          { 
                            label: 'Spent', 
                            value: `$${member.spending.total.toFixed(2)}`, 
                            icon: DollarSign, 
                            color: '#ef4444',
                            change: member.spending.total - member.spending.previousWeek
                          },
                          { 
                            label: 'Budget', 
                            value: `$${member.spending.weeklyBudget.toFixed(2)}`, 
                            icon: Target, 
                            color: '#3b82f6' 
                          },
                          { 
                            label: 'Saved', 
                            value: `$${savings.toFixed(2)}`, 
                            icon: Star, 
                            color: '#10b981',
                            change: savings - (member.spending.weeklyBudget - member.spending.previousWeek)
                          },
                          { 
                            label: 'Efficiency', 
                            value: `${efficiency.toFixed(1)}%`, 
                            icon: TrendingUp, 
                            color: getEfficiencyColor(efficiency) 
                          }
                        ].map((stat, statIndex) => {
                          const Icon = stat.icon;
                          return (
                            <motion.div
                              key={stat.label}
                              className="p-3 bg-white/5 rounded-xl"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + statIndex * 0.05 }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-4 h-4" style={{ color: stat.color }} />
                                <span className="text-gray-400 text-sm">{stat.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold">{stat.value}</span>
                                {stat.change && (
                                  <div className={`flex items-center gap-1 text-xs ${
                                    stat.change > 0 ? 'text-red-400' : 'text-green-400'
                                  }`}>
                                    {stat.change > 0 ? (
                                      <TrendingUp className="w-3 h-3" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3" />
                                    )}
                                    <span>${Math.abs(stat.change).toFixed(2)}</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Budget Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Budget Usage</span>
                          <span className={efficiency >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {((member.spending.total / member.spending.weeklyBudget) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ 
                              backgroundColor: efficiency >= 0 ? '#10b981' : '#ef4444'
                            }}
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min((member.spending.total / member.spending.weeklyBudget) * 100, 100)}%` 
                            }}
                            transition={{ duration: 1.5, delay: index * 0.1 }}
                          />
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Badges:</span>
                        <div className="flex gap-1">
                          {member.badges.map((badge, badgeIndex) => (
                            <motion.div
                              key={badgeIndex}
                              className="text-lg"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                delay: index * 0.1 + badgeIndex * 0.1, 
                                type: "spring", 
                                stiffness: 400 
                              }}
                            >
                              {badge}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Winner Effects */}
                    {index === 0 && (
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
                              top: `${20 + Math.floor(i / 4) * 30}%`,
                              fontSize: '16px'
                            }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.5, 1, 0.5],
                              rotate: [0, 360]
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
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {viewMode === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Active Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeChallenges.map((challenge, index) => {
                const IconComponent = challenge.icon;
                const progress = (challenge.current / challenge.target) * 100;
                
                return (
                  <motion.div
                    key={challenge.id}
                    className="p-6 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${challenge.color}20` }}
                        animate={{ 
                          boxShadow: [`0 0 0px ${challenge.color}`, `0 0 20px ${challenge.color}60`, `0 0 0px ${challenge.color}`]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: challenge.color }}
                        />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-1">{challenge.title}</h4>
                        <p className="text-gray-400 text-sm">{challenge.description}</p>
                      </div>
                      {challenge.isActive && (
                        <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-bold">
                          ACTIVE
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-bold">
                          {challenge.current}/{challenge.target}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: challenge.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1.5, delay: index * 0.2 }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Duration</span>
                        <span className="text-white text-sm">{challenge.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Reward</span>
                        <span className="text-yellow-400 text-sm font-medium">{challenge.reward}</span>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Participants:</span>
                        <div className="flex -space-x-2">
                          {challenge.participants.map((participantId, idx) => {
                            const participant = familyMembers.find(m => m.id === participantId);
                            return participant ? (
                              <div
                                key={participantId}
                                className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs"
                                style={{ backgroundColor: `${participant.color}20` }}
                                title={participant.name}
                              >
                                {participant.avatar}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                      
                      <motion.button
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onChallengeJoin?.(challenge.id, 'current-user')}
                      >
                        Join
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {viewMode === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Family Spending Overview */}
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <h4 className="text-white font-bold text-lg mb-4">Family Spending Overview</h4>
                <div className="space-y-4">
                  {familyMembers.map((member, index) => {
                    const percentage = (member.spending.total / 
                      familyMembers.reduce((sum, m) => sum + m.spending.total, 0)) * 100;
                    
                    return (
                      <div key={member.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{member.name}</span>
                          <span className="text-white font-bold">
                            ${member.spending.total.toFixed(2)} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: member.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1.5, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Efficiency Metrics */}
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <h4 className="text-white font-bold text-lg mb-4">Efficiency Metrics</h4>
                <div className="space-y-4">
                  {familyMembers.map((member, index) => {
                    const efficiency = getBudgetEfficiency(member);
                    return (
                      <motion.div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                            style={{ backgroundColor: `${member.color}20` }}
                          >
                            {member.avatar}
                          </div>
                          <span className="text-white font-medium">{member.name}</span>
                        </div>
                        <div 
                          className="font-bold"
                          style={{ color: getEfficiencyColor(efficiency) }}
                        >
                          {efficiency >= 0 ? '+' : ''}{efficiency.toFixed(1)}%
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 20 }).map((_, i) => {
          const xSeed = `leaderboard-particle-x-${i}`;
          const ySeed = `leaderboard-particle-y-${i}`;
          const delaySeed = `leaderboard-particle-delay-${i}`;
          
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
                duration: 8 + seededRandom(`leaderboard-duration-${i}`) * 8,
                delay: seededRandom(delaySeed) * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['🏆', '👑', '💰', '🎯', '⭐'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}