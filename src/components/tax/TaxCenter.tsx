'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Receipt, FileText, Calculator, TrendingUp, DollarSign, Calendar,
  Plus, Upload, Search, Filter, Download, Printer, Share,
  CheckCircle, AlertCircle, Clock, Target, Award, Zap,
  Car, Home, Utensils, ShoppingBag, Briefcase, GraduationCap,
  Heart, Shield, Lightbulb, Star, Crown, Sparkles
} from 'lucide-react';

interface TaxDeduction {
  id: string;
  title: string;
  category: 'business' | 'education' | 'medical' | 'charitable' | 'vehicle' | 'home' | 'other';
  amount: number;
  date: string;
  description: string;
  receiptUrl?: string;
  status: 'pending' | 'verified' | 'flagged';
  confidence: number;
  tags: string[];
  location?: string;
  vendor?: string;
  paymentMethod?: string;
}

interface TaxCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  limit?: number;
  total: number;
  count: number;
  description: string;
  tips: string[];
}

interface TaxCenterProps {
  deductions: TaxDeduction[];
  categories: TaxCategory[];
  className?: string;
  onAddDeduction?: () => void;
  onUploadReceipt?: () => void;
  onExportPDF?: () => void;
  onViewDeduction?: (deductionId: string) => void;
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

export default function TaxCenter({ 
  deductions, 
  categories,
  className = '',
  onAddDeduction,
  onUploadReceipt,
  onExportPDF,
  onViewDeduction 
}: TaxCenterProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'flagged'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const taxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data if none provided
  const defaultCategories: TaxCategory[] = [
    {
      id: 'business',
      name: 'Business Expenses',
      icon: Briefcase,
      color: '#3b82f6',
      limit: 25000,
      total: 12450.67,
      count: 47,
      description: 'Office supplies, equipment, travel, meals',
      tips: ['Keep all receipts', 'Track mileage', 'Document business purpose']
    },
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      color: '#10b981',
      total: 3250.00,
      count: 8,
      description: 'Tuition, books, courses, certifications',
      tips: ['Form 8863 for credits', 'Lifetime learning credit', 'Student loan interest']
    },
    {
      id: 'medical',
      name: 'Medical & Health',
      icon: Heart,
      color: '#ef4444',
      total: 4875.30,
      count: 23,
      description: 'Doctor visits, prescriptions, medical equipment',
      tips: ['Must exceed 7.5% of AGI', 'Include insurance premiums', 'Keep all records']
    },
    {
      id: 'charitable',
      name: 'Charitable Donations',
      icon: Shield,
      color: '#8b5cf6',
      total: 2180.00,
      count: 12,
      description: 'Cash donations, goods, volunteer expenses',
      tips: ['Get receipts for $250+', 'Fair market value', 'Qualified organizations only']
    },
    {
      id: 'vehicle',
      name: 'Vehicle Expenses',
      icon: Car,
      color: '#f59e0b',
      total: 8920.45,
      count: 156,
      description: 'Gas, maintenance, insurance, registration',
      tips: ['Standard vs actual method', 'Track business miles', 'Keep detailed logs']
    },
    {
      id: 'home',
      name: 'Home Office',
      icon: Home,
      color: '#ec4899',
      total: 3640.80,
      count: 18,
      description: 'Utilities, rent, mortgage interest, repairs',
      tips: ['Exclusive business use', 'Simplified vs actual method', 'Document workspace']
    }
  ];

  const defaultDeductions: TaxDeduction[] = [
    {
      id: 'ded-001',
      title: 'Office Supplies - Staples',
      category: 'business',
      amount: 247.85,
      date: '2024-08-15',
      description: 'Printer paper, ink cartridges, pens, folders',
      status: 'verified',
      confidence: 95,
      tags: ['office', 'supplies', 'recurring'],
      vendor: 'Staples',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ded-002',
      title: 'Professional Development Course',
      category: 'education',
      amount: 299.00,
      date: '2024-08-14',
      description: 'React Advanced Patterns Online Course',
      status: 'verified',
      confidence: 100,
      tags: ['education', 'professional', 'online'],
      vendor: 'Udemy',
      paymentMethod: 'PayPal'
    },
    {
      id: 'ded-003',
      title: 'Medical Consultation',
      category: 'medical',
      amount: 185.00,
      date: '2024-08-13',
      description: 'Annual physical exam and blood work',
      status: 'pending',
      confidence: 88,
      tags: ['medical', 'annual', 'preventive'],
      vendor: 'City Medical Center',
      paymentMethod: 'Insurance + Cash'
    },
    {
      id: 'ded-004',
      title: 'Charity Donation - Red Cross',
      category: 'charitable',
      amount: 500.00,
      date: '2024-08-12',
      description: 'Emergency disaster relief fund donation',
      status: 'verified',
      confidence: 100,
      tags: ['charity', 'disaster', 'relief'],
      vendor: 'American Red Cross',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'ded-005',
      title: 'Gas - Business Trip',
      category: 'vehicle',
      amount: 67.45,
      date: '2024-08-11',
      description: 'Fuel for client meeting in Sacramento',
      status: 'flagged',
      confidence: 72,
      tags: ['gas', 'business', 'travel'],
      location: 'Sacramento, CA',
      vendor: 'Shell',
      paymentMethod: 'Credit Card'
    }
  ];

  const categoryData = categories.length > 0 ? categories : defaultCategories;
  const deductionData = deductions.length > 0 ? deductions : defaultDeductions;

  // Filter and sort deductions
  const filteredDeductions = deductionData
    .filter(deduction => {
      if (filter !== 'all' && deduction.status !== filter) return false;
      if (selectedCategory && deduction.category !== selectedCategory) return false;
      if (searchQuery && !deduction.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !deduction.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // Calculate totals
  const totalDeductions = deductionData.reduce((sum, ded) => sum + ded.amount, 0);
  const verifiedDeductions = deductionData.filter(d => d.status === 'verified').reduce((sum, ded) => sum + ded.amount, 0);
  const pendingReview = deductionData.filter(d => d.status === 'pending').length;

  // Get category icon
  const getCategoryIcon = (categoryId: string) => {
    const category = categoryData.find(c => c.id === categoryId);
    return category ? category.icon : FileText;
  };

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const category = categoryData.find(c => c.id === categoryId);
    return category ? category.color : '#6b7280';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'flagged': return '#ef4444';
      default: return '#6b7280';
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
          Tax Center
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Track deductions, manage receipts, and maximize your tax savings
        </motion.p>
      </div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          {
            label: 'Total Deductions',
            value: `$${totalDeductions.toLocaleString()}`,
            icon: DollarSign,
            color: '#10b981',
            change: '+12.5%'
          },
          {
            label: 'Verified Amount',
            value: `$${verifiedDeductions.toLocaleString()}`,
            icon: CheckCircle,
            color: '#3b82f6',
            change: `${((verifiedDeductions / totalDeductions) * 100).toFixed(1)}%`
          },
          {
            label: 'Pending Review',
            value: pendingReview.toString(),
            icon: Clock,
            color: '#f59e0b',
            change: 'items'
          },
          {
            label: 'Estimated Savings',
            value: `$${(totalDeductions * 0.22).toLocaleString()}`,
            icon: Target,
            color: '#8b5cf6',
            change: '22% rate'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className="text-gray-400 text-sm">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Action Bar */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deductions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
            onClick={onAddDeduction}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Add Deduction
          </motion.button>

          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
            onClick={onUploadReceipt}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-4 h-4" />
            Upload Receipt
          </motion.button>

          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-colors"
            onClick={onExportPDF}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {categoryData.map((category, index) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          const progress = category.limit ? (category.total / category.limit) * 100 : 0;
          
          return (
            <motion.div
              key={category.id}
              className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                isSelected
                  ? 'border-white/30 bg-white/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => setSelectedCategory(isSelected ? null : category.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              whileHover={{ y: -5 }}
              style={{
                boxShadow: isSelected ? `0 0 30px ${category.color}40` : 'none'
              }}
            >
              {/* Background */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${category.color}40, transparent 70%)`
                }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${category.color}20` }}
                    animate={{
                      boxShadow: isSelected 
                        ? [`0 0 0px ${category.color}`, `0 0 20px ${category.color}60`, `0 0 0px ${category.color}`]
                        : `0 0 10px ${category.color}30`
                    }}
                    transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
                  >
                    <Icon className="w-6 h-6" style={{ color: category.color }} />
                  </motion.div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ${category.total.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">{category.count} items</div>
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-white font-bold text-lg mb-2">{category.name}</h4>
                <p className="text-gray-400 text-sm mb-4">{category.description}</p>

                {/* Progress Bar (if limit exists) */}
                {category.limit && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-bold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: category.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="space-y-1">
                  {category.tips.slice(0, 2).map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-center gap-2 text-xs text-gray-400">
                      <Lightbulb className="w-3 h-3 text-yellow-400" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Deductions List */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h4 className="text-white font-bold text-xl mb-4">Recent Deductions</h4>
        
        {filteredDeductions.map((deduction, index) => {
          const Icon = getCategoryIcon(deduction.category);
          const categoryColor = getCategoryColor(deduction.category);
          const statusColor = getStatusColor(deduction.status);
          
          return (
            <motion.div
              key={deduction.id}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
              onClick={() => onViewDeduction?.(deduction.id)}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${categoryColor}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: categoryColor }} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="text-white font-bold text-lg">{deduction.title}</h5>
                      <p className="text-gray-400 text-sm">{deduction.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-xl">
                        ${deduction.amount.toFixed(2)}
                      </div>
                      <div className="text-gray-400 text-sm">{deduction.date}</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    {deduction.vendor && (
                      <div className="text-gray-400 text-sm">
                        <span className="font-medium">Vendor:</span> {deduction.vendor}
                      </div>
                    )}
                    {deduction.paymentMethod && (
                      <div className="text-gray-400 text-sm">
                        <span className="font-medium">Payment:</span> {deduction.paymentMethod}
                      </div>
                    )}
                    {deduction.location && (
                      <div className="text-gray-400 text-sm">
                        <span className="font-medium">Location:</span> {deduction.location}
                      </div>
                    )}
                  </div>

                  {/* Tags and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {deduction.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Confidence */}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">
                          {deduction.confidence}%
                        </span>
                      </div>

                      {/* Status */}
                      <div 
                        className="px-3 py-1 rounded-full text-xs font-bold border"
                        style={{ 
                          backgroundColor: `${statusColor}20`,
                          color: statusColor,
                          borderColor: statusColor
                        }}
                      >
                        {deduction.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 15 }).map((_, i) => {
          const xSeed = `tax-particle-x-${i}`;
          const ySeed = `tax-particle-y-${i}`;
          const delaySeed = `tax-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-green-400/20 text-lg"
              style={{
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, seededRandom(xSeed) * 20 - 10, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 8 + seededRandom(`tax-duration-${i}`) * 6,
                delay: seededRandom(delaySeed) * 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['💰', '📄', '🧾', '📊', '💳'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}