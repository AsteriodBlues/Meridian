'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Receipt, FileText, Calculator, TrendingUp, Calendar, Award,
  Download, Share, Settings, Filter, Search, Clock, Star,
  BarChart3, PieChart, Camera, Sparkles, Crown, Zap
} from 'lucide-react';

// Import components
import PageLayout from '@/components/layout/PageLayout';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import MagneticCursor from '@/components/ui/MagneticCursor';
import TaxCenter from '@/components/tax/TaxCenter';
import ReceiptAI from '@/components/tax/ReceiptAI';
import QuarterlyEstimates from '@/components/tax/QuarterlyEstimates';
import TaxOpportunities from '@/components/tax/TaxOpportunities';
import ExportCenter from '@/components/tax/ExportCenter';
import AdvancedFilters from '@/components/filters/AdvancedFilters';
import MonthlyReview from '@/components/reports/MonthlyReview';
import AnnualReport from '@/components/reports/AnnualReport';
import SummaryCards from '@/components/reports/SummaryCards';
import ScheduledReports from '@/components/reports/ScheduledReports';

type ViewType = 'overview' | 'tax-center' | 'receipt-ai' | 'quarterly' | 'opportunities' | 'export-center' | 'monthly-review' | 'annual-report' | 'summary-cards' | 'scheduled-reports';

interface QuickStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  change?: string;
}

export default function TaxReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [animationStep, setAnimationStep] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(),
    preset: 'this_year'
  });
  const [filters, setFilters] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate through steps
  useEffect(() => {
    if (mounted) {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  // Navigation items
  const navItems = [
    {
      id: 'overview' as ViewType,
      label: 'Overview',
      icon: BarChart3,
      description: 'Dashboard overview'
    },
    {
      id: 'tax-center' as ViewType,
      label: 'Tax Center',
      icon: Receipt,
      description: 'Deduction tracker'
    },
    {
      id: 'receipt-ai' as ViewType,
      label: 'Receipt AI',
      icon: Camera,
      description: 'Smart receipt scanning'
    },
    {
      id: 'quarterly' as ViewType,
      label: 'Quarterly Estimates',
      icon: Calendar,
      description: 'Tax payment planning'
    },
    {
      id: 'opportunities' as ViewType,
      label: 'Tax Opportunities',
      icon: Star,
      description: 'Savings recommendations'
    },
    {
      id: 'export-center' as ViewType,
      label: 'Export Center',
      icon: Download,
      description: 'Branded PDF exports'
    },
    {
      id: 'monthly-review' as ViewType,
      label: 'Monthly Review',
      icon: FileText,
      description: 'Magazine-style reports'
    },
    {
      id: 'annual-report' as ViewType,
      label: 'Annual Report',
      icon: Award,
      description: 'Spotify-wrapped style'
    },
    {
      id: 'summary-cards' as ViewType,
      label: 'Summary Cards',
      icon: Sparkles,
      description: 'Instagram-worthy cards'
    },
    {
      id: 'scheduled-reports' as ViewType,
      label: 'Scheduled Reports',
      icon: Clock,
      description: 'Automated email delivery'
    }
  ];

  // Quick stats
  const quickStats: QuickStat[] = [
    {
      label: 'YTD Deductions',
      value: '$35,240',
      icon: Receipt,
      color: '#10b981',
      change: '+12.5%'
    },
    {
      label: 'Receipts Processed',
      value: '247',
      icon: Camera,
      color: '#3b82f6',
      change: 'AI powered'
    },
    {
      label: 'Quarterly Due',
      value: '$14,800',
      icon: Calendar,
      color: '#f59e0b',
      change: '15 days'
    },
    {
      label: 'Potential Savings',
      value: '$8,450',
      icon: Star,
      color: '#8b5cf6',
      change: 'Available'
    }
  ];

  return (
    <PageLayout>
      <TimeBasedBackground>
        <MagneticCursor />
      {/* Header */}
      <div className="relative z-10 p-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Tax & Reports Center
              </h1>
              <p className="text-gray-400">
                Comprehensive tax management and beautiful financial reporting
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>

              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share className="w-4 h-4" />
                Share
              </motion.button>

              <motion.button
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Quick Stats */}
          {currentView === 'overview' && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      if (index === 0) setCurrentView('tax-center');
                      if (index === 1) setCurrentView('receipt-ai');
                      if (index === 2) setCurrentView('quarterly');
                      if (index === 3) setCurrentView('opportunities');
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${stat.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      {stat.change && (
                        <span className="text-gray-400 text-sm">{stat.change}</span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            className="flex items-center gap-4 mb-8 overflow-x-auto scrollbar-hide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentView === 'overview' ? 0.4 : 0.2 }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white/10 text-white border-2 border-white/20'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-2 border-transparent'
                  }`}
                  onClick={() => setCurrentView(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Search & Filters (for overview) */}
          {currentView === 'overview' && (
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tax documents, receipts, reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <AdvancedFilters
                dateRange={dateRange}
                filters={filters}
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
                onDateRangeChange={setDateRange}
                onFilterChange={(filterId, value) => {
                  setFilters(prev => prev.map(f => f.id === filterId ? { ...f, value } : f));
                }}
                onApplyFilters={() => {
                  console.log('Applying filters:', { dateRange, filters });
                  setShowFilters(false);
                }}
                onResetFilters={() => {
                  setDateRange({
                    start: new Date(new Date().getFullYear(), 0, 1),
                    end: new Date(),
                    preset: 'this_year'
                  });
                  setFilters([]);
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {navItems.slice(1).map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.id}
                        className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all cursor-pointer group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.8 }}
                        whileHover={{ y: -10 }}
                        onClick={() => setCurrentView(feature.id)}
                      >
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                          animate={{
                            boxShadow: animationStep === index % 4 
                              ? ['0 0 0px rgba(59, 130, 246, 0)', '0 0 30px rgba(59, 130, 246, 0.6)', '0 0 0px rgba(59, 130, 246, 0)']
                              : '0 0 10px rgba(59, 130, 246, 0.3)'
                          }}
                          transition={{ duration: 2 }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-white font-bold text-xl mb-3">{feature.label}</h3>
                        <p className="text-gray-400 mb-6">{feature.description}</p>
                        
                        <motion.div
                          className="flex items-center text-blue-400 font-medium group-hover:gap-3 transition-all"
                          initial={{ gap: '8px' }}
                          whileHover={{ gap: '12px' }}
                        >
                          <span>Explore</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            →
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recent Activity */}
                <motion.div
                  className="mt-12 p-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="text-white font-bold text-xl">Recent Activity</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Receipt Processed',
                        description: 'Office supplies receipt from Staples',
                        time: '2 hours ago',
                        icon: Camera,
                        color: '#3b82f6'
                      },
                      {
                        title: 'Tax Opportunity Found',
                        description: 'Home office deduction available',
                        time: '1 day ago',
                        icon: Star,
                        color: '#f59e0b'
                      },
                      {
                        title: 'Monthly Report Ready',
                        description: 'August financial review completed',
                        time: '3 days ago',
                        icon: FileText,
                        color: '#10b981'
                      }
                    ].map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={activity.title}
                          className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.7 + index * 0.1 }}
                          whileHover={{ y: -3 }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${activity.color}20` }}
                            >
                              <Icon className="w-4 h-4" style={{ color: activity.color }} />
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm">{activity.title}</div>
                              <div className="text-gray-400 text-xs mb-2">{activity.description}</div>
                              <div className="text-gray-500 text-xs">{activity.time}</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {currentView === 'tax-center' && (
              <motion.div
                key="tax-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <TaxCenter 
                  deductions={[]}
                  categories={[]}
                />
              </motion.div>
            )}

            {currentView === 'receipt-ai' && (
              <motion.div
                key="receipt-ai"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <ReceiptAI receipts={[]} />
              </motion.div>
            )}

            {currentView === 'quarterly' && (
              <motion.div
                key="quarterly"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <QuarterlyEstimates 
                  payments={[]}
                  projection={{
                    annualIncome: 210000,
                    estimatedTax: 55700,
                    federalTax: 42300,
                    stateTax: 8900,
                    selfEmploymentTax: 4500,
                    totalDeductions: 32000,
                    effectiveRate: 26.5,
                    marginalRate: 32,
                    adjustments: []
                  }}
                />
              </motion.div>
            )}

            {currentView === 'opportunities' && (
              <motion.div
                key="opportunities"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <TaxOpportunities 
                  opportunities={[]}
                  userIncome={210000}
                />
              </motion.div>
            )}

            {currentView === 'export-center' && (
              <motion.div
                key="export-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <ExportCenter />
              </motion.div>
            )}

            {currentView === 'monthly-review' && (
              <motion.div
                key="monthly-review"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <MonthlyReview 
                  data={{
                    month: 'August',
                    year: 2024,
                    income: 18500,
                    expenses: 12450,
                    savings: 6050,
                    categories: {
                      housing: { amount: 3200, change: 2.5, transactions: 12, budget: 3500 },
                      food: { amount: 1850, change: -8.2, transactions: 47, budget: 2000 }
                    },
                    achievements: [],
                    highlights: [],
                    goals: [],
                    insights: []
                  }}
                />
              </motion.div>
            )}

            {currentView === 'annual-report' && (
              <motion.div
                key="annual-report"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <AnnualReport 
                  data={{
                    year: 2024,
                    totalIncome: 185000,
                    totalExpenses: 142000,
                    totalSavings: 43000,
                    topCategories: [],
                    monthlyTrends: [],
                    achievements: [],
                    insights: [],
                    personality: {
                      type: 'The Strategic Saver',
                      description: 'You balance enjoying life today while building wealth for tomorrow',
                      traits: ['Disciplined', 'Goal-oriented', 'Balanced', 'Future-focused']
                    }
                  }}
                />
              </motion.div>
            )}

            {currentView === 'summary-cards' && (
              <motion.div
                key="summary-cards"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <SummaryCards cards={[]} />
              </motion.div>
            )}

            {currentView === 'scheduled-reports' && (
              <motion.div
                key="scheduled-reports"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <ScheduledReports />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}