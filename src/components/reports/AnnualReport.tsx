'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, Heart,
  TrendingUp, TrendingDown, DollarSign, Target, Award, Crown,
  Calendar, Zap, Star, Sparkles, Music, Coffee, Car, Home,
  ShoppingBag, Utensils, GraduationCap, Briefcase, Gift, 
  Share, Download, RotateCcw, ChevronLeft, ChevronRight
} from 'lucide-react';

interface AnnualData {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
    transactions: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  insights: Array<{
    type: 'fun' | 'achievement' | 'comparison' | 'prediction';
    title: string;
    description: string;
    stat?: string;
  }>;
  personality: {
    type: string;
    description: string;
    traits: string[];
  };
}

interface AnnualReportProps {
  data: AnnualData;
  className?: string;
  onShare?: (slide: number) => void;
  onExport?: () => void;
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

export default function AnnualReport({ 
  data,
  className = '',
  onShare,
  onExport 
}: AnnualReportProps) {
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data if none provided
  const defaultData: AnnualData = {
    year: 2024,
    totalIncome: 185000,
    totalExpenses: 142000,
    totalSavings: 43000,
    topCategories: [
      { category: 'Housing', amount: 45600, percentage: 32.1, transactions: 156 },
      { category: 'Food & Dining', amount: 28800, percentage: 20.3, transactions: 412 },
      { category: 'Transportation', amount: 18200, percentage: 12.8, transactions: 287 },
      { category: 'Entertainment', amount: 12400, percentage: 8.7, transactions: 189 },
      { category: 'Shopping', amount: 15800, percentage: 11.1, transactions: 234 }
    ],
    monthlyTrends: [
      { month: 'Jan', income: 15200, expenses: 11800, savings: 3400 },
      { month: 'Feb', income: 15200, expenses: 10900, savings: 4300 },
      { month: 'Mar', income: 15200, expenses: 12800, savings: 2400 },
      { month: 'Apr', income: 15200, expenses: 11200, savings: 4000 },
      { month: 'May', income: 15200, expenses: 13100, savings: 2100 },
      { month: 'Jun', income: 15200, expenses: 11900, savings: 3300 },
      { month: 'Jul', income: 15200, expenses: 12500, savings: 2700 },
      { month: 'Aug', income: 15200, expenses: 11600, savings: 3600 },
      { month: 'Sep', income: 15200, expenses: 12200, savings: 3000 },
      { month: 'Oct', income: 15200, expenses: 11800, savings: 3400 },
      { month: 'Nov', income: 15200, expenses: 13500, savings: 1700 },
      { month: 'Dec', income: 15200, expenses: 14900, savings: 300 }
    ],
    achievements: [
      {
        title: 'Savings Superstar',
        description: 'Saved over $40,000 this year',
        icon: Crown,
        color: '#fbbf24',
        rarity: 'legendary'
      },
      {
        title: 'Budget Master',
        description: 'Stayed under budget 9 out of 12 months',
        icon: Target,
        color: '#10b981',
        rarity: 'epic'
      },
      {
        title: 'Investment Guru',
        description: 'Portfolio grew by 15.2%',
        icon: TrendingUp,
        color: '#3b82f6',
        rarity: 'rare'
      }
    ],
    insights: [
      {
        type: 'fun',
        title: 'Coffee Connoisseur',
        description: 'You spent enough on coffee to buy a small car',
        stat: '$2,847 on coffee'
      },
      {
        type: 'achievement',
        title: 'Consistency King',
        description: 'You tracked expenses every single day',
        stat: '365 days streak'
      },
      {
        type: 'comparison',
        title: 'Above Average Saver',
        description: 'You saved 23% more than average Americans',
        stat: '23.2% savings rate'
      },
      {
        type: 'prediction',
        title: 'Millionaire Track',
        description: 'At this rate, you\'ll be a millionaire by 2034',
        stat: '10 years to go'
      }
    ],
    personality: {
      type: 'The Strategic Saver',
      description: 'You balance enjoying life today while building wealth for tomorrow',
      traits: ['Disciplined', 'Goal-oriented', 'Balanced', 'Future-focused']
    }
  };

  const annualData = data || defaultData;

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, isPlaying]);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ElementType } = {
      'Housing': Home,
      'Food & Dining': Utensils,
      'Transportation': Car,
      'Entertainment': Music,
      'Shopping': ShoppingBag,
      'Education': GraduationCap,
      'Business': Briefcase,
      'Gifts': Gift,
      'Coffee': Coffee
    };
    return icons[category] || DollarSign;
  };

  // Spotify-style slides
  const slides = [
    {
      id: 'intro',
      title: 'Your 2024 Financial Wrapped',
      gradient: 'from-purple-600 via-pink-600 to-red-600',
      component: () => (
        <div className="text-center text-white">
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <Calendar className="w-16 h-16" />
            </div>
          </motion.div>
          
          <motion.h1
            className="text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {annualData.year}
          </motion.h1>
          
          <motion.h2
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Your Financial Year
          </motion.h2>
          
          <motion.p
            className="text-xl opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Let's dive into your money journey
          </motion.p>
        </div>
      )
    },
    {
      id: 'total-income',
      title: 'Total Earnings',
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      component: () => (
        <div className="text-center text-white">
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            <DollarSign className="w-24 h-24 mx-auto mb-6" />
          </motion.div>
          
          <motion.h2
            className="text-2xl font-bold mb-4 opacity-80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            You earned
          </motion.h2>
          
          <motion.div
            className="text-7xl font-bold mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          >
            ${annualData.totalIncome.toLocaleString()}
          </motion.div>
          
          <motion.p
            className="text-xl opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            That's your hard work paying off! 💪
          </motion.p>
        </div>
      )
    },
    {
      id: 'savings-hero',
      title: 'Savings Champion',
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      component: () => {
        const savingsRate = (annualData.totalSavings / annualData.totalIncome) * 100;
        return (
          <div className="text-center text-white">
            <motion.div
              className="mb-8"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Crown className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
            </motion.div>
            
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Savings Champion
            </motion.h2>
            
            <motion.div
              className="text-6xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            >
              ${annualData.totalSavings.toLocaleString()}
            </motion.div>
            
            <motion.div
              className="text-2xl font-bold text-yellow-400 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {savingsRate.toFixed(1)}% savings rate
            </motion.div>
            
            <motion.p
              className="text-lg opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              You're building wealth like a pro! 🚀
            </motion.p>
          </div>
        );
      }
    },
    {
      id: 'top-category',
      title: 'Biggest Spending Category',
      gradient: 'from-orange-600 via-red-600 to-pink-600',
      component: () => {
        const topCategory = annualData.topCategories[0];
        const Icon = getCategoryIcon(topCategory.category);
        return (
          <div className="text-center text-white">
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            >
              <Icon className="w-24 h-24 mx-auto mb-6" />
            </motion.div>
            
            <motion.h2
              className="text-2xl font-bold mb-4 opacity-80"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Your biggest expense was
            </motion.h2>
            
            <motion.div
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              {topCategory.category}
            </motion.div>
            
            <motion.div
              className="text-4xl font-bold mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
            >
              ${topCategory.amount.toLocaleString()}
            </motion.div>
            
            <motion.p
              className="text-lg opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              That's {topCategory.percentage}% of your total spending
            </motion.p>
          </div>
        );
      }
    },
    {
      id: 'transaction-count',
      title: 'Transaction Master',
      gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
      component: () => {
        const totalTransactions = annualData.topCategories.reduce((sum, cat) => sum + cat.transactions, 0);
        const avgPerDay = (totalTransactions / 365).toFixed(1);
        return (
          <div className="text-center text-white">
            <motion.div
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            >
              <Zap className="w-24 h-24 mx-auto mb-6" />
            </motion.div>
            
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Transaction Master
            </motion.h2>
            
            <motion.div
              className="text-7xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            >
              {totalTransactions.toLocaleString()}
            </motion.div>
            
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              transactions this year
            </motion.p>
            
            <motion.p
              className="text-lg opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              That's {avgPerDay} transactions per day! 📊
            </motion.p>
          </div>
        );
      }
    },
    {
      id: 'personality',
      title: 'Financial Personality',
      gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
      component: () => (
        <div className="text-center text-white">
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            <Star className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
          </motion.div>
          
          <motion.h2
            className="text-2xl font-bold mb-4 opacity-80"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Your financial personality is
          </motion.h2>
          
          <motion.div
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          >
            {annualData.personality.type}
          </motion.div>
          
          <motion.p
            className="text-lg mb-8 opacity-90 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {annualData.personality.description}
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {annualData.personality.traits.map((trait, index) => (
              <motion.div
                key={trait}
                className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                {trait}
              </motion.div>
            ))}
          </motion.div>
        </div>
      )
    },
    {
      id: 'achievements',
      title: 'Achievement Unlocked',
      gradient: 'from-yellow-500 via-orange-500 to-red-500',
      component: () => (
        <div className="text-center text-white">
          <motion.div
            className="mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Award className="w-24 h-24 mx-auto mb-6 text-yellow-400" />
          </motion.div>
          
          <motion.h2
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Achievements Unlocked
          </motion.h2>
          
          <div className="space-y-6">
            {annualData.achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  className="p-4 bg-white/10 rounded-xl backdrop-blur-xl border border-white/20"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.2 }}
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-8 h-8" style={{ color: achievement.color }} />
                    <div className="text-left">
                      <div className="font-bold text-lg">{achievement.title}</div>
                      <div className="text-sm opacity-80">{achievement.description}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ml-auto ${
                      achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                      achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                      achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {achievement.rarity.toUpperCase()}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )
    },
    {
      id: 'fun-facts',
      title: 'Fun Facts',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      component: () => (
        <div className="text-center text-white">
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            <Sparkles className="w-24 h-24 mx-auto mb-6" />
          </motion.div>
          
          <motion.h2
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Fun Facts About You
          </motion.h2>
          
          <div className="space-y-6 max-w-lg mx-auto">
            {annualData.insights.slice(0, 3).map((insight, index) => (
              <motion.div
                key={insight.title}
                className="p-4 bg-white/10 rounded-xl backdrop-blur-xl border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.2 }}
              >
                <div className="font-bold text-lg mb-2">{insight.title}</div>
                <div className="text-sm opacity-80 mb-2">{insight.description}</div>
                {insight.stat && (
                  <div className="text-xl font-bold text-yellow-400">{insight.stat}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'outro',
      title: 'See You Next Year',
      gradient: 'from-rose-600 via-pink-600 to-purple-600',
      component: () => (
        <div className="text-center text-white">
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            <Heart className="w-24 h-24 mx-auto mb-6 text-pink-400" />
          </motion.div>
          
          <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Amazing Year!
          </motion.h2>
          
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            You've made incredible progress on your financial journey
          </motion.p>
          
          <motion.div
            className="text-lg opacity-80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            Keep building that bright financial future! ✨
          </motion.div>
          
          <motion.p
            className="text-sm opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            Thanks for being part of the Meridian family
          </motion.p>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setAutoPlay(!autoPlay);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h3 
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your {annualData.year} Wrapped
          </motion.h3>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Spotify-style annual financial review
          </motion.p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
            onClick={() => onShare?.(currentSlide)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share className="w-4 h-4" />
            Share
          </motion.button>

          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
            onClick={onExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Spotify-style Player */}
      <div className="relative w-full h-[600px] rounded-3xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center p-12`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {slides[currentSlide].component()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Spotify-style Controls */}
      <div className="mt-6 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center`}>
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-medium">{slides[currentSlide].title}</div>
              <div className="text-gray-400 text-sm">
                {currentSlide + 1} of {slides.length}
              </div>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-4">
            <motion.button
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipBack className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              className="p-3 bg-white hover:bg-gray-200 rounded-full transition-colors"
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-black" />
              ) : (
                <Play className="w-6 h-6 text-black ml-1" />
              )}
            </motion.button>

            <motion.button
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipForward className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <div className="w-20 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{currentSlide + 1}:00</span>
            <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span>{slides.length}:00</span>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 25 }).map((_, i) => {
          const xSeed = `wrapped-particle-x-${i}`;
          const ySeed = `wrapped-particle-y-${i}`;
          const delaySeed = `wrapped-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-white/10 text-sm"
              style={{
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, seededRandom(xSeed) * 10 - 5, 0],
                opacity: [0, 0.3, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 8 + seededRandom(`wrapped-duration-${i}`) * 6,
                delay: seededRandom(delaySeed) * 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['♪', '♫', '♬', '♩', '♭'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}