'use client';

import React from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar, DollarSign, TrendingUp, TrendingDown,
  Plane, Camera, Receipt, CreditCard, Globe, Star,
  BarChart3, PieChart, Clock, Target, Award, Sparkles
} from 'lucide-react';

interface TripExpense {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  convertedAmount: number;
  category: string;
  location: string;
  icon: React.ElementType;
  color: string;
}

interface TripLocation {
  city: string;
  country: string;
  flag: string;
  currency: string;
  exchangeRate: number;
  daysSpent: number;
  totalSpent: number;
  coordinates: { lat: number; lng: number };
}

interface TripSummaryProps {
  tripName?: string;
  startDate?: string;
  endDate?: string;
  totalBudget?: number;
  className?: string;
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

export default function TripSummary({ 
  tripName = 'European Adventure 2024',
  startDate = '2024-01-15',
  endDate = '2024-01-28',
  totalBudget = 5000,
  className = '' 
}: TripSummaryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Parallax scroll values
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

  // Sample trip data
  const locations: TripLocation[] = [
    {
      city: 'Paris',
      country: 'France',
      flag: '🇫🇷',
      currency: 'EUR',
      exchangeRate: 0.8532,
      daysSpent: 4,
      totalSpent: 1200,
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    {
      city: 'Rome',
      country: 'Italy',
      flag: '🇮🇹',
      currency: 'EUR',
      exchangeRate: 0.8532,
      daysSpent: 3,
      totalSpent: 950,
      coordinates: { lat: 41.9028, lng: 12.4964 }
    },
    {
      city: 'Barcelona',
      country: 'Spain',
      flag: '🇪🇸',
      currency: 'EUR',
      exchangeRate: 0.8532,
      daysSpent: 3,
      totalSpent: 800,
      coordinates: { lat: 41.3851, lng: 2.1734 }
    },
    {
      city: 'Amsterdam',
      country: 'Netherlands',
      flag: '🇳🇱',
      currency: 'EUR',
      exchangeRate: 0.8532,
      daysSpent: 3,
      totalSpent: 1100,
      coordinates: { lat: 52.3676, lng: 4.9041 }
    }
  ];

  const expenses: TripExpense[] = [
    {
      id: '1',
      date: '2024-01-16',
      description: 'Flight to Paris',
      amount: 650,
      currency: 'USD',
      convertedAmount: 650,
      category: 'transport',
      location: 'Paris, France',
      icon: Plane,
      color: '#3b82f6'
    },
    {
      id: '2',
      date: '2024-01-17',
      description: 'Hotel Louvre',
      amount: 180,
      currency: 'EUR',
      convertedAmount: 211,
      category: 'accommodation',
      location: 'Paris, France',
      icon: Calendar,
      color: '#8b5cf6'
    },
    {
      id: '3',
      date: '2024-01-17',
      description: 'Dinner at Le Comptoir',
      amount: 85,
      currency: 'EUR',
      convertedAmount: 99,
      category: 'dining',
      location: 'Paris, France',
      icon: Receipt,
      color: '#f59e0b'
    },
    {
      id: '4',
      date: '2024-01-18',
      description: 'Louvre Museum',
      amount: 17,
      currency: 'EUR',
      convertedAmount: 20,
      category: 'entertainment',
      location: 'Paris, France',
      icon: Star,
      color: '#ef4444'
    },
    {
      id: '5',
      date: '2024-01-20',
      description: 'Train to Rome',
      amount: 95,
      currency: 'EUR',
      convertedAmount: 111,
      category: 'transport',
      location: 'Rome, Italy',
      icon: Plane,
      color: '#3b82f6'
    },
    {
      id: '6',
      date: '2024-01-21',
      description: 'Roman Colosseum Tour',
      amount: 45,
      currency: 'EUR',
      convertedAmount: 53,
      category: 'entertainment',
      location: 'Rome, Italy',
      icon: Star,
      color: '#ef4444'
    }
  ];

  const categories = [
    { id: 'transport', name: 'Transportation', icon: Plane, color: '#3b82f6' },
    { id: 'accommodation', name: 'Accommodation', icon: Calendar, color: '#8b5cf6' },
    { id: 'dining', name: 'Food & Dining', icon: Receipt, color: '#f59e0b' },
    { id: 'entertainment', name: 'Entertainment', icon: Star, color: '#ef4444' },
    { id: 'shopping', name: 'Shopping', icon: CreditCard, color: '#10b981' },
    { id: 'other', name: 'Other', icon: Globe, color: '#06b6d4' }
  ];

  // Calculate totals
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.convertedAmount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsedPercentage = (totalSpent / totalBudget) * 100;
  const tripDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  const avgDailySpend = totalSpent / tripDays;

  // Category breakdown
  const categoryTotals = categories.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category === category.id);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.convertedAmount, 0);
    return {
      ...category,
      total,
      percentage: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
      count: categoryExpenses.length
    };
  }).filter(cat => cat.total > 0);

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div ref={containerRef} className={`relative min-h-screen ${className}`}>
      {/* Hero Section with Parallax */}
      <motion.div 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity }}
      >
        {/* Background Layers */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
          style={{ y: y3 }}
        />
        
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          style={{ y: y1 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          style={{ y: y2 }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          style={{ scale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {tripName}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              {formatDate(startDate)} - {formatDate(endDate)} • {tripDays} Days
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="text-3xl font-bold text-white">{formatCurrency(totalSpent)}</div>
                <div className="text-gray-400">Total Spent</div>
              </motion.div>
              
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="text-3xl font-bold text-white">{locations.length}</div>
                <div className="text-gray-400">Cities Visited</div>
              </motion.div>
              
              <motion.div
                className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="text-3xl font-bold text-white">{formatCurrency(avgDailySpend)}</div>
                <div className="text-gray-400">Daily Average</div>
              </motion.div>
            </div>
            
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              onClick={() => setShowDetails(!showDetails)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {showDetails ? 'Hide Details' : 'Explore Details'}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        {mounted && Array.from({ length: 20 }).map((_, i) => {
          const leftSeed = `trip-particle-left-${i}`;
          const topSeed = `trip-particle-top-${i}`;
          const durationSeed = `trip-particle-duration-${i}`;
          const delaySeed = `trip-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${seededRandom(leftSeed) * 100}%`,
                top: `${seededRandom(topSeed) * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 5 + seededRandom(durationSeed) * 3,
                repeat: Infinity,
                delay: seededRandom(delaySeed) * 5,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </motion.div>

      {/* Details Section */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="relative z-20 bg-black/90 backdrop-blur-xl"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="max-w-7xl mx-auto px-6 py-12">
              {/* Budget Overview */}
              <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Budget Overview</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Budget Progress */}
                  <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Budget Usage</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        budgetUsedPercentage > 90 ? 'bg-red-500/20 text-red-400' :
                        budgetUsedPercentage > 70 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {budgetUsedPercentage.toFixed(1)}% Used
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Budget</span>
                          <span className="text-white font-mono">{formatCurrency(totalBudget)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Spent</span>
                          <span className="text-white font-mono">{formatCurrency(totalSpent)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span className="text-gray-400">Remaining</span>
                          <span className={`font-mono ${remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(Math.abs(remainingBudget))}
                          </span>
                        </div>
                        
                        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              budgetUsedPercentage > 100 ? 'bg-red-500' :
                              budgetUsedPercentage > 80 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                            transition={{ duration: 2, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Breakdown */}
                  <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Daily Breakdown</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trip Duration</span>
                        <span className="text-white font-mono">{tripDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Average</span>
                        <span className="text-white font-mono">{formatCurrency(avgDailySpend)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Budget</span>
                        <span className="text-white font-mono">{formatCurrency(totalBudget / tripDays)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Variance</span>
                        <span className={`font-mono ${avgDailySpend <= totalBudget / tripDays ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(Math.abs(avgDailySpend - totalBudget / tripDays))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Locations */}
              <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Locations Visited</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {locations.map((location, index) => (
                    <motion.div
                      key={location.city}
                      className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{location.flag}</div>
                        <h3 className="text-white font-bold text-lg">{location.city}</h3>
                        <p className="text-gray-400 text-sm mb-4">{location.country}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Days</span>
                            <span className="text-white">{location.daysSpent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Spent</span>
                            <span className="text-white font-mono">{formatCurrency(location.totalSpent)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Daily Avg</span>
                            <span className="text-white font-mono">
                              {formatCurrency(location.totalSpent / location.daysSpent)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Category Breakdown */}
              <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Expense Categories</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Category List */}
                  <div className="space-y-4">
                    {categoryTotals.map((category, index) => {
                      const Icon = category.icon;
                      const isSelected = selectedCategory === category.id;
                      
                      return (
                        <motion.div
                          key={category.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500/50 bg-blue-500/10' 
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                          onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${category.color}20`, border: `1px solid ${category.color}40` }}
                              >
                                <Icon className="w-5 h-5" style={{ color: category.color }} />
                              </div>
                              <div>
                                <div className="text-white font-medium">{category.name}</div>
                                <div className="text-gray-400 text-sm">{category.count} transactions</div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-white font-mono">{formatCurrency(category.total)}</div>
                              <div className="text-gray-400 text-sm">{category.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: category.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${category.percentage}%` }}
                              transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pie Chart Visualization */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-80 h-80">
                      <svg width="320" height="320" className="transform -rotate-90">
                        {categoryTotals.map((category, index) => {
                          const radius = 120;
                          const circumference = 2 * Math.PI * radius;
                          const previousPercentages = categoryTotals.slice(0, index).reduce((sum, cat) => sum + cat.percentage, 0);
                          const strokeDasharray = `${(category.percentage / 100) * circumference} ${circumference}`;
                          const strokeDashoffset = -((previousPercentages / 100) * circumference);
                          
                          return (
                            <motion.circle
                              key={category.id}
                              cx="160"
                              cy="160"
                              r={radius}
                              fill="transparent"
                              stroke={category.color}
                              strokeWidth="20"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                              className="cursor-pointer"
                              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                              initial={{ strokeDasharray: `0 ${circumference}` }}
                              animate={{ strokeDasharray }}
                              transition={{ delay: 0.5 + index * 0.2, duration: 1.5, ease: "easeOut" }}
                              whileHover={{ strokeWidth: 25 }}
                            />
                          );
                        })}
                      </svg>
                      
                      {/* Center Text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-white text-2xl font-bold">{formatCurrency(totalSpent)}</div>
                          <div className="text-gray-400 text-sm">Total Spent</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Recent Expenses */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Recent Expenses</h2>
                
                <div className="space-y-4">
                  {expenses.slice(0, 6).map((expense, index) => {
                    const Icon = expense.icon;
                    
                    return (
                      <motion.div
                        key={expense.id}
                        className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 transition-all"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div 
                              className="p-3 rounded-xl"
                              style={{ backgroundColor: `${expense.color}20`, border: `1px solid ${expense.color}40` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: expense.color }} />
                            </div>
                            <div>
                              <div className="text-white font-medium">{expense.description}</div>
                              <div className="text-gray-400 text-sm flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                <span>{expense.location}</span>
                                <span>•</span>
                                <span>{formatDate(expense.date)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-white font-mono">
                              {expense.currency !== 'USD' && (
                                <div className="text-gray-400 text-sm">
                                  {expense.amount.toFixed(2)} {expense.currency}
                                </div>
                              )}
                              <div className="text-lg">
                                {formatCurrency(expense.convertedAmount)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}