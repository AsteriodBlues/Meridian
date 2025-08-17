'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Calendar, DollarSign, TrendingUp, Clock, AlertTriangle, CheckCircle,
  Calculator, Target, Bell, Mail, CreditCard, Banknote, Wallet,
  ArrowUp, ArrowDown, Plus, Edit, Settings, Download, RefreshCw,
  ChevronLeft, ChevronRight, Zap, Star, Crown, Shield
} from 'lucide-react';

interface QuarterlyPayment {
  id: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  dueDate: string;
  estimatedAmount: number;
  paidAmount?: number;
  status: 'upcoming' | 'due' | 'paid' | 'overdue';
  adjustedAmount?: number;
  lastYearAmount?: number;
  projectedIncome: number;
  deductions: number;
  penalty?: number;
  interest?: number;
  paymentMethod?: string;
  confirmationNumber?: string;
}

interface TaxProjection {
  annualIncome: number;
  estimatedTax: number;
  federalTax: number;
  stateTax: number;
  selfEmploymentTax: number;
  totalDeductions: number;
  effectiveRate: number;
  marginalRate: number;
  adjustments: {
    reason: string;
    amount: number;
    type: 'increase' | 'decrease';
  }[];
}

interface QuarterlyEstimatesProps {
  payments: QuarterlyPayment[];
  projection: TaxProjection;
  className?: string;
  onMakePayment?: (paymentId: string) => void;
  onAdjustEstimate?: (paymentId: string, amount: number) => void;
  onScheduleReminder?: (paymentId: string) => void;
  onUpdateProjection?: (projection: Partial<TaxProjection>) => void;
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

export default function QuarterlyEstimates({ 
  payments, 
  projection,
  className = '',
  onMakePayment,
  onAdjustEstimate,
  onScheduleReminder,
  onUpdateProjection 
}: QuarterlyEstimatesProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'timeline' | 'calculator' | 'calendar'>('timeline');
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data if none provided
  const defaultPayments: QuarterlyPayment[] = [
    {
      id: 'q1-2024',
      quarter: 'Q1',
      year: 2024,
      dueDate: '2024-04-15',
      estimatedAmount: 12500,
      paidAmount: 12500,
      status: 'paid',
      lastYearAmount: 11800,
      projectedIncome: 180000,
      deductions: 25000,
      paymentMethod: 'Bank Transfer',
      confirmationNumber: 'TXN-2024-Q1-789456'
    },
    {
      id: 'q2-2024',
      quarter: 'Q2',
      year: 2024,
      dueDate: '2024-06-17',
      estimatedAmount: 13200,
      paidAmount: 13200,
      status: 'paid',
      adjustedAmount: 13200,
      lastYearAmount: 12100,
      projectedIncome: 195000,
      deductions: 28000,
      paymentMethod: 'Credit Card',
      confirmationNumber: 'TXN-2024-Q2-456123'
    },
    {
      id: 'q3-2024',
      quarter: 'Q3',
      year: 2024,
      dueDate: '2024-09-16',
      estimatedAmount: 14800,
      status: 'due',
      lastYearAmount: 13500,
      projectedIncome: 210000,
      deductions: 32000
    },
    {
      id: 'q4-2024',
      quarter: 'Q4',
      year: 2024,
      dueDate: '2025-01-15',
      estimatedAmount: 15200,
      status: 'upcoming',
      lastYearAmount: 14000,
      projectedIncome: 225000,
      deductions: 35000
    }
  ];

  const defaultProjection: TaxProjection = {
    annualIncome: 210000,
    estimatedTax: 55700,
    federalTax: 42300,
    stateTax: 8900,
    selfEmploymentTax: 4500,
    totalDeductions: 32000,
    effectiveRate: 26.5,
    marginalRate: 32,
    adjustments: [
      { reason: 'Increased business income', amount: 8500, type: 'increase' },
      { reason: 'Additional equipment deduction', amount: 3200, type: 'decrease' },
      { reason: 'Home office deduction', amount: 1800, type: 'decrease' }
    ]
  };

  const paymentData = payments.length > 0 ? payments : defaultPayments;
  const projectionData = projection || defaultProjection;

  // Calculate days until next payment
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10b981';
      case 'due': return '#f59e0b';
      case 'overdue': return '#ef4444';
      case 'upcoming': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  // Animate through steps
  useEffect(() => {
    if (mounted) {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  // Find next due payment
  const nextDuePayment = paymentData.find(p => p.status === 'due' || p.status === 'upcoming');
  const daysUntilNext = nextDuePayment ? getDaysUntilDue(nextDuePayment.dueDate) : null;

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Quarterly Tax Estimates
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Stay ahead of your tax obligations with intelligent quarterly planning
        </motion.p>
      </div>

      {/* Quick Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          {
            label: 'Next Payment Due',
            value: nextDuePayment ? `$${nextDuePayment.estimatedAmount.toLocaleString()}` : 'All Paid',
            icon: Clock,
            color: '#f59e0b',
            subtitle: daysUntilNext ? `${daysUntilNext} days` : ''
          },
          {
            label: 'Annual Projection',
            value: `$${projectionData.estimatedTax.toLocaleString()}`,
            icon: TrendingUp,
            color: '#3b82f6',
            subtitle: `${projectionData.effectiveRate}% rate`
          },
          {
            label: 'Paid This Year',
            value: `$${paymentData.filter(p => p.paidAmount).reduce((sum, p) => sum + (p.paidAmount || 0), 0).toLocaleString()}`,
            icon: CheckCircle,
            color: '#10b981',
            subtitle: `${paymentData.filter(p => p.status === 'paid').length}/4 quarters`
          },
          {
            label: 'Estimated Refund',
            value: '$2,450',
            icon: Star,
            color: '#8b5cf6',
            subtitle: 'Based on current data'
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
                {index === 0 && daysUntilNext && daysUntilNext <= 30 && (
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
              {stat.subtitle && (
                <div className="text-gray-500 text-xs mt-1">{stat.subtitle}</div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* View Selector */}
      <motion.div
        className="flex gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { key: 'timeline', label: 'Timeline View', icon: Calendar },
          { key: 'calculator', label: 'Tax Calculator', icon: Calculator },
          { key: 'calendar', label: 'Calendar View', icon: Clock }
        ].map((view) => {
          const Icon = view.icon;
          return (
            <motion.button
              key={view.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === view.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setCurrentView(view.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {view.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-16 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full" />
              
              {/* Quarter Cards */}
              <div className="space-y-8">
                {paymentData.map((payment, index) => {
                  const isSelected = selectedQuarter === payment.id;
                  const statusColor = getStatusColor(payment.status);
                  const daysUntil = getDaysUntilDue(payment.dueDate);
                  
                  return (
                    <motion.div
                      key={payment.id}
                      className={`relative pl-20 ${isSelected ? 'scale-105' : ''}`}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      {/* Timeline Node */}
                      <motion.div
                        className="absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-gray-900"
                        style={{ backgroundColor: statusColor }}
                        animate={{
                          scale: animationStep === index ? [1, 1.3, 1] : 1,
                          boxShadow: animationStep === index 
                            ? [`0 0 0px ${statusColor}`, `0 0 20px ${statusColor}60`, `0 0 0px ${statusColor}`]
                            : `0 0 10px ${statusColor}40`
                        }}
                        transition={{ duration: 2 }}
                      />

                      {/* Quarter Card */}
                      <motion.div
                        className={`p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                          isSelected
                            ? 'border-white/30 bg-white/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedQuarter(isSelected ? null : payment.id)}
                        whileHover={{ y: -5 }}
                        style={{
                          boxShadow: isSelected ? `0 0 30px ${statusColor}40` : 'none'
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-white font-bold text-xl">
                              {payment.quarter} {payment.year}
                            </h4>
                            <p className="text-gray-400">
                              Due: {new Date(payment.dueDate).toLocaleDateString()}
                            </p>
                            {daysUntil !== null && (
                              <p className={`text-sm font-medium ${
                                daysUntil < 0 ? 'text-red-400' : 
                                daysUntil <= 30 ? 'text-yellow-400' : 
                                'text-gray-400'
                              }`}>
                                {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` :
                                 daysUntil === 0 ? 'Due today!' :
                                 `${daysUntil} days remaining`}
                              </p>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div 
                            className="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1"
                            style={{ 
                              backgroundColor: `${statusColor}20`,
                              color: statusColor,
                              borderColor: statusColor
                            }}
                          >
                            {payment.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                            {payment.status === 'due' && <AlertTriangle className="w-3 h-3" />}
                            {payment.status === 'upcoming' && <Clock className="w-3 h-3" />}
                            {payment.status.toUpperCase()}
                          </div>
                        </div>

                        {/* Amount Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="p-3 bg-white/5 rounded-lg">
                            <div className="text-gray-400 text-sm mb-1">Estimated</div>
                            <div className="text-white font-bold text-lg">
                              ${payment.estimatedAmount.toLocaleString()}
                            </div>
                          </div>
                          
                          {payment.paidAmount && (
                            <div className="p-3 bg-green-500/10 rounded-lg">
                              <div className="text-gray-400 text-sm mb-1">Paid</div>
                              <div className="text-green-400 font-bold text-lg">
                                ${payment.paidAmount.toLocaleString()}
                              </div>
                            </div>
                          )}
                          
                          {payment.lastYearAmount && (
                            <div className="p-3 bg-white/5 rounded-lg">
                              <div className="text-gray-400 text-sm mb-1">Last Year</div>
                              <div className="text-white font-bold text-lg">
                                ${payment.lastYearAmount.toLocaleString()}
                              </div>
                              <div className={`text-xs ${
                                payment.estimatedAmount > payment.lastYearAmount ? 'text-red-400' : 'text-green-400'
                              }`}>
                                {payment.estimatedAmount > payment.lastYearAmount ? '+' : ''}
                                {(((payment.estimatedAmount - payment.lastYearAmount) / payment.lastYearAmount) * 100).toFixed(1)}%
                              </div>
                            </div>
                          )}

                          <div className="p-3 bg-white/5 rounded-lg">
                            <div className="text-gray-400 text-sm mb-1">Income</div>
                            <div className="text-white font-bold text-lg">
                              ${payment.projectedIncome.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          {payment.status !== 'paid' && (
                            <motion.button
                              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMakePayment?.(payment.id);
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <CreditCard className="w-4 h-4" />
                              Make Payment
                            </motion.button>
                          )}

                          <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAdjustEstimate?.(payment.id, payment.estimatedAmount);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Calculator className="w-4 h-4" />
                            Adjust
                          </motion.button>

                          <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onScheduleReminder?.(payment.id);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Bell className="w-4 h-4" />
                            Remind Me
                          </motion.button>
                        </div>

                        {/* Payment Details (if paid) */}
                        {payment.status === 'paid' && payment.confirmationNumber && (
                          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-green-400 text-sm font-medium">Payment Confirmed</div>
                                <div className="text-gray-300 text-xs">
                                  {payment.paymentMethod} • {payment.confirmationNumber}
                                </div>
                              </div>
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'calculator' && (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tax Projection Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Panel */}
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <h4 className="text-white font-bold text-lg mb-6">Tax Projection Calculator</h4>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Annual Income</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={projectionData.annualIncome}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="210,000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Total Deductions</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={projectionData.totalDeductions}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        placeholder="32,000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Filing Status</label>
                      <select className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option value="single">Single</option>
                        <option value="married_joint">Married Filing Jointly</option>
                        <option value="married_separate">Married Filing Separately</option>
                        <option value="head_household">Head of Household</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">State</label>
                      <select className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Recalculate
                  </motion.button>
                </div>
              </div>

              {/* Results Panel */}
              <div className="p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
                <h4 className="text-white font-bold text-lg mb-6">Tax Calculation Results</h4>
                
                <div className="space-y-4">
                  {[
                    { label: 'Federal Tax', value: projectionData.federalTax, color: '#3b82f6' },
                    { label: 'State Tax', value: projectionData.stateTax, color: '#8b5cf6' },
                    { label: 'Self-Employment Tax', value: projectionData.selfEmploymentTax, color: '#f59e0b' }
                  ].map((tax, index) => (
                    <div key={tax.label} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">{tax.label}</span>
                      <span className="text-white font-bold" style={{ color: tax.color }}>
                        ${tax.value.toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">Total Tax</span>
                      <span className="text-white font-bold text-xl">
                        ${projectionData.estimatedTax.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-gray-400 text-sm">Effective Rate</div>
                      <div className="text-white font-bold text-lg">{projectionData.effectiveRate}%</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-gray-400 text-sm">Marginal Rate</div>
                      <div className="text-white font-bold text-lg">{projectionData.marginalRate}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 12 }).map((_, i) => {
          const xSeed = `quarterly-particle-x-${i}`;
          const ySeed = `quarterly-particle-y-${i}`;
          const delaySeed = `quarterly-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-blue-400/20 text-xl"
              style={{
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, seededRandom(xSeed) * 25 - 12.5, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 10 + seededRandom(`quarterly-duration-${i}`) * 8,
                delay: seededRandom(delaySeed) * 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['📅', '💰', '📊', '🧾', '💳'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}