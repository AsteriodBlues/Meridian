'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Calendar, TrendingUp, TrendingDown, DollarSign, Target, Award,
  Download, Share, Printer, ChevronLeft, ChevronRight, Eye,
  Star, Crown, Zap, Sparkles, Heart, ShoppingBag, Home, Car,
  Coffee, Utensils, Briefcase, GraduationCap, Gift, Music,
  BarChart3, PieChart, LineChart, Activity, Clock, Users
} from 'lucide-react';

interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expenses: number;
  savings: number;
  categories: {
    [key: string]: {
      amount: number;
      change: number;
      transactions: number;
      budget: number;
    };
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
  }>;
  highlights: Array<{
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    amount?: number;
  }>;
  goals: Array<{
    name: string;
    target: number;
    current: number;
    category: string;
  }>;
  insights: Array<{
    type: 'spending' | 'saving' | 'trend' | 'opportunity';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}

interface MonthlyReviewProps {
  data: MonthlyData;
  className?: string;
  onExport?: (format: 'pdf' | 'image') => void;
  onShare?: (platform: string) => void;
  onNavigateMonth?: (direction: 'prev' | 'next') => void;
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

export default function MonthlyReview({ 
  data,
  className = '',
  onExport,
  onShare,
  onNavigateMonth 
}: MonthlyReviewProps) {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data if none provided
  const defaultData: MonthlyData = {
    month: 'August',
    year: 2024,
    income: 18500,
    expenses: 12450,
    savings: 6050,
    categories: {
      housing: { amount: 3200, change: 2.5, transactions: 12, budget: 3500 },
      food: { amount: 1850, change: -8.2, transactions: 47, budget: 2000 },
      transportation: { amount: 920, change: 15.3, transactions: 23, budget: 1200 },
      entertainment: { amount: 680, change: 12.8, transactions: 18, budget: 800 },
      shopping: { amount: 1240, change: -5.4, transactions: 31, budget: 1000 },
      utilities: { amount: 450, change: 3.1, transactions: 8, budget: 500 },
      healthcare: { amount: 320, change: -12.5, transactions: 5, budget: 400 },
      education: { amount: 890, change: 22.1, transactions: 6, budget: 800 }
    },
    achievements: [
      {
        id: 'savings-goal',
        title: 'Savings Champion',
        description: 'Exceeded monthly savings goal by 25%',
        icon: Crown,
        color: '#fbbf24'
      },
      {
        id: 'budget-master',
        title: 'Budget Master',
        description: 'Stayed under budget in 6 out of 8 categories',
        icon: Target,
        color: '#10b981'
      },
      {
        id: 'streak-keeper',
        title: 'Streak Keeper',
        description: '15 days of expense tracking in a row',
        icon: Zap,
        color: '#8b5cf6'
      }
    ],
    highlights: [
      {
        type: 'positive',
        title: 'Dining Out Reduction',
        description: 'Cut restaurant spending by 18% compared to last month',
        amount: 340
      },
      {
        type: 'positive',
        title: 'Investment Growth',
        description: 'Portfolio increased by 3.2% this month',
        amount: 1250
      },
      {
        type: 'negative',
        title: 'Transportation Overspend',
        description: 'Gas and car maintenance exceeded budget',
        amount: 280
      }
    ],
    goals: [
      { name: 'Emergency Fund', target: 25000, current: 18500, category: 'savings' },
      { name: 'Vacation Fund', target: 5000, current: 3200, category: 'travel' },
      { name: 'Home Down Payment', target: 50000, current: 28000, category: 'housing' }
    ],
    insights: [
      {
        type: 'spending',
        title: 'Weekend Spending Pattern',
        description: 'You spend 40% more on weekends. Consider setting weekend budgets.',
        impact: 'medium'
      },
      {
        type: 'opportunity',
        title: 'Subscription Optimization',
        description: 'You have 3 unused streaming subscriptions costing $45/month.',
        impact: 'high'
      },
      {
        type: 'trend',
        title: 'Coffee Shop Trend',
        description: 'Daily coffee purchases increased 35% this month.',
        impact: 'low'
      }
    ]
  };

  const monthlyData = data || defaultData;

  // Calculate key metrics
  const savingsRate = (monthlyData.savings / monthlyData.income) * 100;
  const expenseRatio = (monthlyData.expenses / monthlyData.income) * 100;
  const totalBudget = Object.values(monthlyData.categories).reduce((sum, cat) => sum + cat.budget, 0);
  const budgetUtilization = (monthlyData.expenses / totalBudget) * 100;

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ElementType } = {
      housing: Home,
      food: Utensils,
      transportation: Car,
      entertainment: Music,
      shopping: ShoppingBag,
      utilities: Zap,
      healthcare: Heart,
      education: GraduationCap,
      coffee: Coffee,
      business: Briefcase,
      gifts: Gift
    };
    return icons[category] || DollarSign;
  };

  // Magazine pages
  const pages = [
    {
      id: 'cover',
      title: 'Cover Story',
      component: () => (
        <div className="relative h-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-2xl overflow-hidden">
          {/* Cover Background Effects */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${seededRandom(`cover-x-${i}`) * 100}%`,
                  top: `${seededRandom(`cover-y-${i}`) * 100}%`
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 3 + seededRandom(`cover-duration-${i}`) * 2,
                  repeat: Infinity,
                  delay: seededRandom(`cover-delay-${i}`) * 3
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-8 h-full flex flex-col justify-between">
            {/* Header */}
            <div>
              <motion.div
                className="text-white/60 text-sm font-medium mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                MERIDIAN MONTHLY
              </motion.div>
              <motion.h1
                className="text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {monthlyData.month} {monthlyData.year}
              </motion.h1>
              <motion.div
                className="text-xl text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Your Financial Journey
              </motion.div>
            </div>

            {/* Feature Stories */}
            <div className="space-y-4">
              <motion.div
                className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="text-yellow-400 text-sm font-medium">FEATURE STORY</div>
                <div className="text-white font-bold text-lg">
                  Savings Rate Hits {savingsRate.toFixed(1)}%
                </div>
                <div className="text-white/70 text-sm">
                  Your best performance this year
                </div>
              </motion.div>

              <motion.div
                className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="text-green-400 text-sm font-medium">SUCCESS STORY</div>
                <div className="text-white font-bold">
                  {monthlyData.achievements.length} New Achievements
                </div>
                <div className="text-white/70 text-sm">
                  Celebrating your financial wins
                </div>
              </motion.div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">
                Page 1 of 4
              </div>
              <div className="text-white/60 text-sm">
                ${monthlyData.savings.toLocaleString()} saved
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'overview',
      title: 'Financial Overview',
      component: () => (
        <div className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full">
          <motion.h2
            className="text-2xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Monthly Financial Overview
          </motion.h2>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              {
                label: 'Total Income',
                value: `$${monthlyData.income.toLocaleString()}`,
                icon: TrendingUp,
                color: '#10b981',
                change: '+8.5%'
              },
              {
                label: 'Total Expenses',
                value: `$${monthlyData.expenses.toLocaleString()}`,
                icon: DollarSign,
                color: '#ef4444',
                change: '-2.1%'
              },
              {
                label: 'Net Savings',
                value: `$${monthlyData.savings.toLocaleString()}`,
                icon: Star,
                color: '#8b5cf6',
                change: '+15.2%'
              }
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5" style={{ color: metric.color }} />
                    <span className="text-gray-400 text-sm">{metric.label}</span>
                  </div>
                  <div className="text-white font-bold text-2xl mb-1">
                    {metric.value}
                  </div>
                  <div className="text-green-400 text-sm">{metric.change}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Spending Breakdown */}
          <div className="mb-8">
            <h3 className="text-white font-bold text-lg mb-4">Spending by Category</h3>
            <div className="space-y-3">
              {Object.entries(monthlyData.categories)
                .sort(([,a], [,b]) => b.amount - a.amount)
                .slice(0, 6)
                .map(([category, data], index) => {
                  const Icon = getCategoryIcon(category);
                  const percentage = (data.amount / monthlyData.expenses) * 100;
                  
                  return (
                    <motion.div
                      key={category}
                      className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <Icon className="w-5 h-5 text-blue-400" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium capitalize">
                            {category.replace('_', ' ')}
                          </span>
                          <span className="text-white font-bold">
                            ${data.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-green-400 text-sm">Savings Rate</div>
              <div className="text-white font-bold text-xl">
                {savingsRate.toFixed(1)}%
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-blue-400 text-sm">Budget Usage</div>
              <div className="text-white font-bold text-xl">
                {budgetUtilization.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'achievements',
      title: 'Achievements & Goals',
      component: () => (
        <div className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full">
          <motion.h2
            className="text-2xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Achievements & Goals
          </motion.h2>

          {/* Achievements */}
          <div className="mb-8">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              This Month's Achievements
            </h3>
            <div className="space-y-4">
              {monthlyData.achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    className="p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl border border-yellow-500/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${achievement.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: achievement.color }} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Goals Progress */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Goal Progress
            </h3>
            <div className="space-y-4">
              {monthlyData.goals.map((goal, index) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <motion.div
                    key={goal.name}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">{goal.name}</h4>
                      <span className="text-gray-400 text-sm">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1.5, delay: index * 0.2 + 0.8 }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-bold">
                        {progress.toFixed(1)}% Complete
                      </span>
                      <span className="text-gray-400 text-sm capitalize">
                        {goal.category}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'insights',
      title: 'Insights & Recommendations',
      component: () => (
        <div className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full">
          <motion.h2
            className="text-2xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            AI Insights & Recommendations
          </motion.h2>

          {/* Highlights */}
          <div className="mb-8">
            <h3 className="text-white font-bold text-lg mb-4">Monthly Highlights</h3>
            <div className="space-y-3">
              {monthlyData.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    highlight.type === 'positive' 
                      ? 'bg-green-500/10 border-green-500/20' 
                      : highlight.type === 'negative'
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-blue-500/10 border-blue-500/20'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-bold mb-1 ${
                        highlight.type === 'positive' ? 'text-green-400' :
                        highlight.type === 'negative' ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {highlight.title}
                      </h4>
                      <p className="text-gray-300 text-sm">{highlight.description}</p>
                    </div>
                    {highlight.amount && (
                      <div className={`font-bold ${
                        highlight.type === 'positive' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {highlight.type === 'positive' ? '+' : '-'}${highlight.amount}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI-Powered Insights
            </h3>
            <div className="space-y-4">
              {monthlyData.insights.map((insight, index) => {
                const impactColor = {
                  high: '#ef4444',
                  medium: '#f59e0b',
                  low: '#10b981'
                };
                
                return (
                  <motion.div
                    key={index}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium">{insight.title}</h4>
                      <div 
                        className="px-2 py-1 rounded-full text-xs font-bold"
                        style={{ 
                          backgroundColor: `${impactColor[insight.impact]}20`,
                          color: impactColor[insight.impact]
                        }}
                      >
                        {insight.impact.toUpperCase()} IMPACT
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{insight.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: impactColor[insight.impact] }}
                      />
                      <span className="text-gray-500 text-xs capitalize">
                        {insight.type} insight
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )
    }
  ];

  // Handle page flip
  const flipPage = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    if (direction === 'next' && currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
    
    setTimeout(() => setIsFlipping(false), 600);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h3 
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Monthly Review Magazine
          </motion.h3>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your financial story, beautifully presented
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
            onClick={() => onShare?.('social')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share className="w-4 h-4" />
            Share
          </motion.button>

          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
            onClick={() => onExport?.('pdf')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </motion.button>
        </div>
      </div>

      {/* Magazine Container */}
      <div className="relative">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
            onClick={() => flipPage('prev')}
            disabled={currentPage === 0 || isFlipping}
            whileHover={{ scale: currentPage > 0 ? 1.05 : 1 }}
            whileTap={{ scale: currentPage > 0 ? 0.95 : 1 }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </motion.button>

          <div className="flex items-center gap-2">
            {pages.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? 'bg-blue-400' : 'bg-gray-600'
                }`}
                animate={{
                  scale: index === currentPage ? 1.2 : 1
                }}
              />
            ))}
          </div>

          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
            onClick={() => flipPage('next')}
            disabled={currentPage === pages.length - 1 || isFlipping}
            whileHover={{ scale: currentPage < pages.length - 1 ? 1.05 : 1 }}
            whileTap={{ scale: currentPage < pages.length - 1 ? 0.95 : 1 }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Magazine Pages */}
        <div className="relative w-full h-[800px] perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              className="absolute inset-0"
              initial={{ rotateY: isFlipping ? 90 : 0, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ 
                duration: 0.6, 
                type: "spring", 
                stiffness: 100 
              }}
            >
              {pages[currentPage].component()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page Info */}
        <div className="flex items-center justify-between mt-6 text-gray-400 text-sm">
          <div>
            {pages[currentPage].title}
          </div>
          <div>
            Page {currentPage + 1} of {pages.length}
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 15 }).map((_, i) => {
          const xSeed = `magazine-particle-x-${i}`;
          const ySeed = `magazine-particle-y-${i}`;
          const delaySeed = `magazine-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-blue-400/10 text-lg"
              style={{
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, seededRandom(xSeed) * 20 - 10, 0],
                opacity: [0, 0.3, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 12 + seededRandom(`magazine-duration-${i}`) * 8,
                delay: seededRandom(delaySeed) * 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['📊', '📈', '💰', '🎯', '⭐'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}