'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Lightbulb, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle,
  Target, Star, Zap, Brain, Sparkles, Crown, Shield, Award,
  Home, Car, GraduationCap, Heart, Building, Calculator,
  ArrowRight, Plus, BookOpen, FileText, ExternalLink, Bookmark
} from 'lucide-react';

interface TaxOpportunity {
  id: string;
  title: string;
  description: string;
  category: 'deduction' | 'credit' | 'strategy' | 'timing' | 'investment';
  potentialSavings: number;
  effort: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  requirements: string[];
  steps: string[];
  resources: Array<{
    title: string;
    type: 'article' | 'form' | 'calculator' | 'guide';
    url: string;
  }>;
  progress: number;
  status: 'available' | 'in_progress' | 'completed' | 'missed';
  icon: React.ElementType;
  color: string;
  riskLevel: 'low' | 'medium' | 'high';
  applicableIncome: {
    min?: number;
    max?: number;
  };
}

interface TaxOpportunitiesProps {
  opportunities: TaxOpportunity[];
  userIncome: number;
  className?: string;
  onStartOpportunity?: (opportunityId: string) => void;
  onCompleteOpportunity?: (opportunityId: string) => void;
  onLearnMore?: (opportunityId: string) => void;
  onSaveForLater?: (opportunityId: string) => void;
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

export default function TaxOpportunities({ 
  opportunities, 
  userIncome,
  className = '',
  onStartOpportunity,
  onCompleteOpportunity,
  onLearnMore,
  onSaveForLater 
}: TaxOpportunitiesProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'high_impact' | 'quick_wins'>('all');
  const [sortBy, setSortBy] = useState<'savings' | 'urgency' | 'effort'>('savings');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data if none provided
  const defaultOpportunities: TaxOpportunity[] = [
    {
      id: 'home-office-deduction',
      title: 'Home Office Deduction',
      description: 'Deduct expenses for the business use of your home, including utilities, rent, and office supplies.',
      category: 'deduction',
      potentialSavings: 3600,
      effort: 'medium',
      urgency: 'medium',
      deadline: '2024-12-31',
      requirements: [
        'Use part of home exclusively for business',
        'Regular and exclusive business use',
        'Principal place of business'
      ],
      steps: [
        'Measure your home office space',
        'Calculate percentage of home used for business',
        'Gather utility bills and home expenses',
        'Choose simplified or actual expense method',
        'Complete Form 8829'
      ],
      resources: [
        { title: 'Home Office Deduction Guide', type: 'guide', url: '/guides/home-office' },
        { title: 'Form 8829', type: 'form', url: '/forms/8829' },
        { title: 'Home Office Calculator', type: 'calculator', url: '/calc/home-office' }
      ],
      progress: 60,
      status: 'in_progress',
      icon: Home,
      color: '#3b82f6',
      riskLevel: 'low',
      applicableIncome: { min: 30000 }
    },
    {
      id: 'vehicle-deduction',
      title: 'Vehicle Business Deduction',
      description: 'Deduct vehicle expenses for business use using either the standard mileage rate or actual expenses.',
      category: 'deduction',
      potentialSavings: 4200,
      effort: 'low',
      urgency: 'high',
      deadline: '2024-12-31',
      requirements: [
        'Use vehicle for business purposes',
        'Keep detailed mileage records',
        'Separate business and personal use'
      ],
      steps: [
        'Install mileage tracking app',
        'Log all business trips',
        'Calculate business use percentage',
        'Choose standard vs actual method',
        'Maintain receipts for repairs'
      ],
      resources: [
        { title: 'Vehicle Deduction Guide', type: 'guide', url: '/guides/vehicle' },
        { title: 'Mileage Log Template', type: 'form', url: '/forms/mileage' }
      ],
      progress: 0,
      status: 'available',
      icon: Car,
      color: '#10b981',
      riskLevel: 'low',
      applicableIncome: { min: 25000 }
    },
    {
      id: 'retirement-contribution',
      title: 'Maximize Retirement Contributions',
      description: 'Contribute to 401(k), IRA, or SEP-IRA to reduce taxable income and save for retirement.',
      category: 'strategy',
      potentialSavings: 7500,
      effort: 'low',
      urgency: 'critical',
      deadline: '2025-04-15',
      requirements: [
        'Have earned income',
        'Not exceed income limits for IRA',
        'Access to retirement accounts'
      ],
      steps: [
        'Calculate maximum contribution limits',
        'Choose between traditional and Roth',
        'Set up automatic contributions',
        'Consider catch-up contributions if 50+'
      ],
      resources: [
        { title: 'Retirement Contribution Limits', type: 'article', url: '/articles/retirement-limits' },
        { title: 'IRA vs 401k Calculator', type: 'calculator', url: '/calc/retirement' }
      ],
      progress: 25,
      status: 'in_progress',
      icon: Shield,
      color: '#8b5cf6',
      riskLevel: 'low',
      applicableIncome: { min: 20000 }
    },
    {
      id: 'education-credits',
      title: 'Education Tax Credits',
      description: 'Claim American Opportunity or Lifetime Learning credits for education expenses.',
      category: 'credit',
      potentialSavings: 2500,
      effort: 'low',
      urgency: 'medium',
      requirements: [
        'Qualified education expenses',
        'Income below certain limits',
        'Form 1098-T from school'
      ],
      steps: [
        'Gather Form 1098-T',
        'Calculate qualified expenses',
        'Determine which credit applies',
        'Complete Form 8863'
      ],
      resources: [
        { title: 'Education Credits Guide', type: 'guide', url: '/guides/education' },
        { title: 'Form 8863', type: 'form', url: '/forms/8863' }
      ],
      progress: 0,
      status: 'available',
      icon: GraduationCap,
      color: '#f59e0b',
      riskLevel: 'low',
      applicableIncome: { max: 90000 }
    },
    {
      id: 'hsa-contribution',
      title: 'Health Savings Account',
      description: 'Triple tax advantage with HSA: deductible contributions, tax-free growth, tax-free withdrawals.',
      category: 'strategy',
      potentialSavings: 1400,
      effort: 'low',
      urgency: 'medium',
      deadline: '2025-04-15',
      requirements: [
        'High-deductible health plan',
        'Not enrolled in Medicare',
        'Not covered by other health plan'
      ],
      steps: [
        'Verify HDHP eligibility',
        'Open HSA account',
        'Set up contributions',
        'Keep receipts for medical expenses'
      ],
      resources: [
        { title: 'HSA Contribution Limits', type: 'article', url: '/articles/hsa-limits' },
        { title: 'HSA Calculator', type: 'calculator', url: '/calc/hsa' }
      ],
      progress: 0,
      status: 'available',
      icon: Heart,
      color: '#ec4899',
      riskLevel: 'low',
      applicableIncome: { min: 30000 }
    },
    {
      id: 'equipment-depreciation',
      title: 'Section 179 Equipment Deduction',
      description: 'Immediately deduct the full cost of qualifying business equipment purchases.',
      category: 'deduction',
      potentialSavings: 12000,
      effort: 'high',
      urgency: 'high',
      deadline: '2024-12-31',
      requirements: [
        'Business use of equipment',
        'Equipment purchased this year',
        'Business income to offset'
      ],
      steps: [
        'Identify qualifying equipment',
        'Calculate business use percentage',
        'Complete Form 4562',
        'Maintain purchase records'
      ],
      resources: [
        { title: 'Section 179 Guide', type: 'guide', url: '/guides/section-179' },
        { title: 'Form 4562', type: 'form', url: '/forms/4562' }
      ],
      progress: 0,
      status: 'available',
      icon: Building,
      color: '#ef4444',
      riskLevel: 'medium',
      applicableIncome: { min: 100000 }
    }
  ];

  const opportunityData = opportunities.length > 0 ? opportunities : defaultOpportunities;
  
  // Filter opportunities based on income and other criteria
  const filteredOpportunities = opportunityData
    .filter(opp => {
      // Income filtering
      if (opp.applicableIncome.min && userIncome < opp.applicableIncome.min) return false;
      if (opp.applicableIncome.max && userIncome > opp.applicableIncome.max) return false;
      
      // Filter by status/type
      if (filter === 'available') return opp.status === 'available';
      if (filter === 'high_impact') return opp.potentialSavings > 5000;
      if (filter === 'quick_wins') return opp.effort === 'low' && opp.potentialSavings > 1000;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'urgency':
          const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'effort':
          const effortOrder = { low: 1, medium: 2, high: 3 };
          return effortOrder[a.effort] - effortOrder[b.effort];
        default:
          return b.potentialSavings - a.potentialSavings;
      }
    });

  // Calculate total potential savings
  const totalPotentialSavings = filteredOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0);

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get effort color
  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'available': return '#8b5cf6';
      case 'missed': return '#ef4444';
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
          Tax Saving Opportunities
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          AI-powered recommendations to maximize your tax savings
        </motion.p>
      </div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          {
            label: 'Potential Savings',
            value: `$${totalPotentialSavings.toLocaleString()}`,
            icon: DollarSign,
            color: '#10b981',
            subtitle: 'Available this year'
          },
          {
            label: 'Opportunities',
            value: filteredOpportunities.length.toString(),
            icon: Lightbulb,
            color: '#f59e0b',
            subtitle: 'Personalized for you'
          },
          {
            label: 'Critical Deadlines',
            value: filteredOpportunities.filter(o => o.urgency === 'critical').length.toString(),
            icon: Clock,
            color: '#ef4444',
            subtitle: 'Require immediate action'
          },
          {
            label: 'Completed',
            value: opportunityData.filter(o => o.status === 'completed').length.toString(),
            icon: CheckCircle,
            color: '#8b5cf6',
            subtitle: 'This tax year'
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
                {index === 2 && filteredOpportunities.filter(o => o.urgency === 'critical').length > 0 && (
                  <motion.div
                    className="w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.subtitle}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters and Sort */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Opportunities' },
            { key: 'available', label: 'Available Now' },
            { key: 'high_impact', label: 'High Impact' },
            { key: 'quick_wins', label: 'Quick Wins' }
          ].map((filterOption) => (
            <motion.button
              key={filterOption.key}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setFilter(filterOption.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filterOption.label}
            </motion.button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="savings">Sort by Savings</option>
          <option value="urgency">Sort by Urgency</option>
          <option value="effort">Sort by Effort</option>
        </select>
      </motion.div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opportunity, index) => {
          const Icon = opportunity.icon;
          const isSelected = selectedOpportunity === opportunity.id;
          const urgencyColor = getUrgencyColor(opportunity.urgency);
          const effortColor = getEffortColor(opportunity.effort);
          const statusColor = getStatusColor(opportunity.status);
          
          return (
            <motion.div
              key={opportunity.id}
              className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                isSelected
                  ? 'border-white/30 bg-white/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => setSelectedOpportunity(isSelected ? null : opportunity.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                boxShadow: isSelected ? `0 0 30px ${opportunity.color}40` : 'none'
              }}
            >
              {/* Background */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${opportunity.color}40, transparent 70%)`
                }}
              />

              {/* Urgency Indicator */}
              {opportunity.urgency === 'critical' && (
                <motion.div
                  className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${opportunity.color}20` }}
                    animate={{
                      boxShadow: isSelected 
                        ? [`0 0 0px ${opportunity.color}`, `0 0 20px ${opportunity.color}60`, `0 0 0px ${opportunity.color}`]
                        : `0 0 10px ${opportunity.color}30`
                    }}
                    transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
                  >
                    <Icon className="w-6 h-6" style={{ color: opportunity.color }} />
                  </motion.div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      ${opportunity.potentialSavings.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">potential savings</div>
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-white font-bold text-lg mb-2">{opportunity.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{opportunity.description}</p>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-4">
                  <div 
                    className="px-2 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      backgroundColor: `${urgencyColor}20`,
                      color: urgencyColor
                    }}
                  >
                    {opportunity.urgency.toUpperCase()} URGENCY
                  </div>
                  <div 
                    className="px-2 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      backgroundColor: `${effortColor}20`,
                      color: effortColor
                    }}
                  >
                    {opportunity.effort.toUpperCase()} EFFORT
                  </div>
                  <div 
                    className="px-2 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      backgroundColor: `${statusColor}20`,
                      color: statusColor
                    }}
                  >
                    {opportunity.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                {/* Progress (if in progress) */}
                {opportunity.status === 'in_progress' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-bold">{opportunity.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: opportunity.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${opportunity.progress}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {isSelected && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div>
                      <h5 className="text-white font-medium mb-2">Requirements:</h5>
                      <ul className="space-y-1">
                        {opportunity.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-center gap-2 text-sm text-gray-400">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-white font-medium mb-2">Next Steps:</h5>
                      <ol className="space-y-1">
                        {opportunity.steps.slice(0, 3).map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-blue-400 font-bold">{stepIndex + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h5 className="text-white font-medium mb-2">Resources:</h5>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.resources.map((resource, resIndex) => (
                          <motion.button
                            key={resIndex}
                            className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {resource.type === 'form' && <FileText className="w-3 h-3" />}
                            {resource.type === 'calculator' && <Calculator className="w-3 h-3" />}
                            {resource.type === 'guide' && <BookOpen className="w-3 h-3" />}
                            {resource.type === 'article' && <ExternalLink className="w-3 h-3" />}
                            {resource.title}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {opportunity.status === 'available' && (
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartOpportunity?.(opportunity.id);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="w-4 h-4" />
                      Start Now
                    </motion.button>
                  )}

                  {opportunity.status === 'in_progress' && (
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompleteOpportunity?.(opportunity.id);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </motion.button>
                  )}

                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLearnMore?.(opportunity.id);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <BookOpen className="w-4 h-4" />
                    Learn More
                  </motion.button>

                  <motion.button
                    className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveForLater?.(opportunity.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bookmark className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Deadline Warning */}
                {opportunity.deadline && (
                  <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <Clock className="w-3 h-3" />
                      Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Sparkle Effects for High Value */}
              {opportunity.potentialSavings > 5000 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-400/40"
                      style={{
                        left: `${20 + (i % 3) * 30}%`,
                        top: `${20 + Math.floor(i / 3) * 30}%`,
                        fontSize: '12px'
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 4,
                        delay: i * 0.5,
                        repeat: Infinity,
                        repeatDelay: 3
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

      {/* AI Insights */}
      <motion.div
        className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <h4 className="text-white font-bold text-lg">AI Tax Insights</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <Star className="w-6 h-6 text-yellow-400 mb-2" />
            <div className="text-white font-medium mb-1">Quick Win</div>
            <div className="text-gray-400 text-sm">
              Start with vehicle deduction - easiest $4,200 savings with just mileage tracking
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
            <div className="text-white font-medium mb-1">Urgent Action</div>
            <div className="text-gray-400 text-sm">
              Retirement contributions deadline approaching - act before April 15th
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-400 mb-2" />
            <div className="text-white font-medium mb-1">Optimization</div>
            <div className="text-gray-400 text-sm">
              Your income level qualifies for most deductions - maximize while eligible
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 20 }).map((_, i) => {
          const xSeed = `opportunity-particle-x-${i}`;
          const ySeed = `opportunity-particle-y-${i}`;
          const delaySeed = `opportunity-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-yellow-400/20 text-lg"
              style={{
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, seededRandom(xSeed) * 30 - 15, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 8 + seededRandom(`opportunity-duration-${i}`) * 8,
                delay: seededRandom(delaySeed) * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['💡', '💰', '📊', '🎯', '⭐'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}