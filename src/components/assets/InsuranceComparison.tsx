'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Shield, DollarSign, Star, CheckCircle, XCircle, Info,
  Car, Home, Smartphone, Heart, Briefcase, Umbrella,
  TrendingUp, TrendingDown, Award, Phone, Mail, Globe,
  Calculator, Search, Filter, RefreshCw, Eye, Edit,
  Plus, Minus, Clock, AlertTriangle, Target, Zap
} from 'lucide-react';

interface InsuranceQuote {
  id: string;
  provider: string;
  logo: string;
  type: 'auto' | 'home' | 'renters' | 'life' | 'health' | 'umbrella';
  assetId?: string;
  assetName?: string;
  monthlyPremium: number;
  annualPremium: number;
  deductible: number;
  coverage: {
    liability: number;
    collision: number;
    comprehensive: number;
    personalInjury?: number;
    propertyDamage?: number;
    medicalPayments?: number;
    uninsuredMotorist?: number;
  };
  features: string[];
  discounts: Array<{
    name: string;
    amount: number;
    description: string;
  }>;
  rating: {
    overall: number;
    customerService: number;
    claimsHandling: number;
    financial: number;
  };
  contact: {
    phone: string;
    website: string;
    agent?: string;
    agentPhone?: string;
  };
  lastUpdated: string;
  validUntil: string;
}

interface InsuranceComparisonProps {
  quotes?: InsuranceQuote[];
  currentPolicies?: InsuranceQuote[];
  className?: string;
  onGetQuote?: (assetId: string, type: string) => void;
  onSelectQuote?: (quoteId: string) => void;
  onRefreshQuotes?: () => void;
  onSaveQuote?: (quoteId: string) => void;
}

export default function InsuranceComparison({ 
  quotes = [],
  currentPolicies = [],
  className = '',
  onGetQuote,
  onSelectQuote,
  onRefreshQuotes,
  onSaveQuote 
}: InsuranceComparisonProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'quotes' | 'current' | 'compare' | 'calculator'>('quotes');
  const [filterType, setFilterType] = useState<'all' | 'auto' | 'home' | 'renters' | 'life' | 'health' | 'umbrella'>('all');
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'premium' | 'rating' | 'coverage'>('premium');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Insurance provider logos (simplified SVG representations)
  const providerLogos = {
    'State Farm': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" rx="10" fill="#c41e3a" stroke="#fff" stroke-width="2"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">SF</text>
    </svg>`,
    'GEICO': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#0066cc" stroke="#fff" stroke-width="2"/>
      <ellipse cx="40" cy="45" rx="8" ry="12" fill="#fff"/>
      <ellipse cx="60" cy="45" rx="8" ry="12" fill="#fff"/>
      <path d="M30 65 Q50 75 70 65" stroke="#fff" stroke-width="3" fill="none"/>
    </svg>`,
    'Progressive': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" rx="5" fill="#0066ff" stroke="#fff" stroke-width="2"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">PROG</text>
    </svg>`,
    'Allstate': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#003399" stroke="#fff" stroke-width="2"/>
      <path d="M30 35 L70 35 L60 50 L70 65 L30 65 L40 50 Z" fill="#fff"/>
    </svg>`,
    'Liberty Mutual': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="70" height="70" rx="8" fill="#ffcc00" stroke="#333" stroke-width="2"/>
      <path d="M35 35 L50 25 L65 35 L65 65 L35 65 Z" fill="#333"/>
    </svg>`,
    'Farmers': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#006633" stroke="#fff" stroke-width="2"/>
      <text x="50" y="60" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">F</text>
    </svg>`
  };

  // Default insurance quotes
  const defaultQuotes: InsuranceQuote[] = [
    {
      id: 'quote-001',
      provider: 'State Farm',
      logo: providerLogos['State Farm'],
      type: 'auto',
      assetId: 'vehicle-001',
      assetName: '2022 Tesla Model 3',
      monthlyPremium: 142,
      annualPremium: 1704,
      deductible: 500,
      coverage: {
        liability: 300000,
        collision: 50000,
        comprehensive: 50000,
        personalInjury: 300000,
        propertyDamage: 100000,
        medicalPayments: 5000,
        uninsuredMotorist: 300000
      },
      features: [
        'Accident Forgiveness',
        '24/7 Claims Service',
        'Drive Safe & Save®',
        'Good Student Discount',
        'Multi-Policy Discount'
      ],
      discounts: [
        { name: 'Multi-Policy', amount: 156, description: 'Bundle with home insurance' },
        { name: 'Good Driver', amount: 89, description: 'Clean driving record' },
        { name: 'Electric Vehicle', amount: 67, description: 'Eco-friendly vehicle discount' }
      ],
      rating: {
        overall: 4.2,
        customerService: 4.0,
        claimsHandling: 4.3,
        financial: 4.5
      },
      contact: {
        phone: '1-800-STATE-FARM',
        website: 'statefarm.com',
        agent: 'John Smith',
        agentPhone: '(555) 123-4567'
      },
      lastUpdated: '2024-08-15T10:30:00Z',
      validUntil: '2024-09-15T10:30:00Z'
    },
    {
      id: 'quote-002',
      provider: 'GEICO',
      logo: providerLogos['GEICO'],
      type: 'auto',
      assetId: 'vehicle-001',
      assetName: '2022 Tesla Model 3',
      monthlyPremium: 128,
      annualPremium: 1536,
      deductible: 500,
      coverage: {
        liability: 250000,
        collision: 50000,
        comprehensive: 50000,
        personalInjury: 250000,
        propertyDamage: 100000,
        medicalPayments: 5000,
        uninsuredMotorist: 250000
      },
      features: [
        'GEICO Mobile App',
        '24/7 Customer Service',
        'Emergency Roadside Service',
        'Rate Comparison Tool',
        'Digital Claims Process'
      ],
      discounts: [
        { name: 'Federal Employee', amount: 134, description: 'Government employee discount' },
        { name: 'Good Driver', amount: 98, description: 'Safe driving record' },
        { name: 'Multi-Vehicle', amount: 78, description: 'Multiple vehicles insured' }
      ],
      rating: {
        overall: 4.1,
        customerService: 3.9,
        claimsHandling: 4.2,
        financial: 4.3
      },
      contact: {
        phone: '1-800-GEICO',
        website: 'geico.com'
      },
      lastUpdated: '2024-08-15T11:45:00Z',
      validUntil: '2024-09-15T11:45:00Z'
    },
    {
      id: 'quote-003',
      provider: 'Progressive',
      logo: providerLogos['Progressive'],
      type: 'auto',
      assetId: 'vehicle-001',
      assetName: '2022 Tesla Model 3',
      monthlyPremium: 135,
      annualPremium: 1620,
      deductible: 250,
      coverage: {
        liability: 300000,
        collision: 50000,
        comprehensive: 50000,
        personalInjury: 300000,
        propertyDamage: 100000,
        medicalPayments: 10000,
        uninsuredMotorist: 300000
      },
      features: [
        'Snapshot® Usage-Based Insurance',
        'Name Your Price® Tool',
        'Concierge Claim Service',
        'Pet Injury Coverage',
        'Custom Parts & Equipment'
      ],
      discounts: [
        { name: 'Snapshot', amount: 145, description: 'Safe driving monitoring' },
        { name: 'Homeowner', amount: 67, description: 'Own your home' },
        { name: 'Continuous Coverage', amount: 45, description: 'No coverage gaps' }
      ],
      rating: {
        overall: 4.0,
        customerService: 3.8,
        claimsHandling: 4.1,
        financial: 4.2
      },
      contact: {
        phone: '1-800-PROGRESSIVE',
        website: 'progressive.com'
      },
      lastUpdated: '2024-08-15T09:15:00Z',
      validUntil: '2024-09-15T09:15:00Z'
    },
    {
      id: 'quote-004',
      provider: 'Allstate',
      logo: providerLogos['Allstate'],
      type: 'home',
      assetId: 'asset-003',
      assetName: 'Investment Property',
      monthlyPremium: 95,
      annualPremium: 1140,
      deductible: 1000,
      coverage: {
        liability: 300000,
        collision: 0,
        comprehensive: 385000,
        personalInjury: 300000,
        propertyDamage: 100000
      },
      features: [
        'Claim RateGuard®',
        'Allstate Digital Locker®',
        'HostAdvantage® Rental Coverage',
        'Green Improvement Reimbursement',
        'Identity Theft Protection'
      ],
      discounts: [
        { name: 'Multi-Policy', amount: 228, description: 'Bundle with auto insurance' },
        { name: 'Protective Device', amount: 114, description: 'Security system installed' },
        { name: 'New Home', amount: 57, description: 'Recently built property' }
      ],
      rating: {
        overall: 4.1,
        customerService: 4.0,
        claimsHandling: 4.2,
        financial: 4.3
      },
      contact: {
        phone: '1-800-ALLSTATE',
        website: 'allstate.com',
        agent: 'Sarah Johnson',
        agentPhone: '(555) 987-6543'
      },
      lastUpdated: '2024-08-15T14:20:00Z',
      validUntil: '2024-09-15T14:20:00Z'
    }
  ];

  const quoteData = quotes.length > 0 ? quotes : defaultQuotes;

  // Filter and sort quotes
  const filteredQuotes = quoteData.filter(quote => {
    if (filterType === 'all') return true;
    return quote.type === filterType;
  });

  const sortedQuotes = [...filteredQuotes].sort((a, b) => {
    switch (sortBy) {
      case 'premium':
        return a.monthlyPremium - b.monthlyPremium;
      case 'rating':
        return b.rating.overall - a.rating.overall;
      case 'coverage':
        return b.coverage.liability - a.coverage.liability;
      default:
        return 0;
    }
  });

  // Calculate potential savings
  const calculateSavings = (quote: InsuranceQuote) => {
    const currentPremium = 180; // Mock current premium
    return currentPremium - quote.monthlyPremium;
  };

  // Get insurance type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'auto': return Car;
      case 'home': return Home;
      case 'renters': return Home;
      case 'life': return Heart;
      case 'health': return Heart;
      case 'umbrella': return Umbrella;
      default: return Shield;
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
          Insurance Comparison
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Find the best insurance coverage at competitive rates for all your assets
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
            label: 'Lowest Quote',
            value: `$${Math.min(...quoteData.map(q => q.monthlyPremium))}/mo`,
            icon: TrendingDown,
            color: '#10b981',
            change: 'Best deal'
          },
          {
            label: 'Avg. Premium',
            value: `$${Math.round(quoteData.reduce((sum, q) => sum + q.monthlyPremium, 0) / quoteData.length)}/mo`,
            icon: Calculator,
            color: '#3b82f6',
            change: 'Market rate'
          },
          {
            label: 'Potential Savings',
            value: `$${Math.max(0, Math.max(...quoteData.map(q => calculateSavings(q))))}/mo`,
            icon: DollarSign,
            color: '#f59e0b',
            change: 'vs current'
          },
          {
            label: 'Top Rated',
            value: `${Math.max(...quoteData.map(q => q.rating.overall)).toFixed(1)} ★`,
            icon: Star,
            color: '#ef4444',
            change: 'Provider rating'
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

      {/* Tabs */}
      <motion.div
        className="flex gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { key: 'quotes', label: 'Get Quotes', icon: Search },
          { key: 'current', label: 'Current Policies', icon: Shield },
          { key: 'compare', label: 'Compare', icon: Eye },
          { key: 'calculator', label: 'Calculator', icon: Calculator }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'quotes' && (
          <motion.div
            key="quotes"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filters & Sort */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Type:</span>
                {[
                  { key: 'all', label: 'All' },
                  { key: 'auto', label: 'Auto' },
                  { key: 'home', label: 'Home' },
                  { key: 'renters', label: 'Renters' },
                  { key: 'life', label: 'Life' },
                  { key: 'health', label: 'Health' }
                ].map((filter) => (
                  <motion.button
                    key={filter.key}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterType === filter.key
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setFilterType(filter.key as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <select 
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="premium">Premium</option>
                  <option value="rating">Rating</option>
                  <option value="coverage">Coverage</option>
                </select>
              </div>

              <motion.button
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
                onClick={onRefreshQuotes}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Quotes
              </motion.button>
            </div>

            {/* Quotes Grid */}
            <div className="space-y-6">
              {sortedQuotes.map((quote, index) => {
                const Icon = getTypeIcon(quote.type);
                const savings = calculateSavings(quote);
                const isExpanded = showDetails === quote.id;
                
                return (
                  <motion.div
                    key={quote.id}
                    className={`p-6 bg-white/5 backdrop-blur-xl border rounded-2xl transition-all ${
                      isExpanded ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start gap-6">
                      {/* Provider Logo */}
                      <div className="relative">
                        <div 
                          className="w-16 h-16 bg-white rounded-xl p-2"
                          dangerouslySetInnerHTML={{ __html: quote.logo }}
                        />
                        {/* Best Deal Badge */}
                        {index === 0 && sortBy === 'premium' && (
                          <div className="absolute -top-2 -right-2">
                            <motion.div
                              className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full"
                              animate={{
                                boxShadow: ['0 0 0px #10b981', '0 0 20px #10b98160', '0 0 0px #10b981']
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              BEST
                            </motion.div>
                          </div>
                        )}
                      </div>

                      {/* Quote Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-white font-bold text-xl">{quote.provider}</h4>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-400 font-medium">{quote.rating.overall}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-400 text-sm capitalize">{quote.type}</span>
                              </div>
                            </div>
                            <p className="text-gray-400">{quote.assetName}</p>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-bold text-white mb-1">
                              ${quote.monthlyPremium}<span className="text-lg text-gray-400">/mo</span>
                            </div>
                            <div className="text-gray-400 text-sm mb-2">
                              ${quote.annualPremium} annually
                            </div>
                            {savings > 0 && (
                              <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
                                Save ${savings}/mo
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Coverage Summary */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-white font-bold text-sm">
                              ${(quote.coverage.liability / 1000).toFixed(0)}K
                            </div>
                            <div className="text-gray-400 text-xs">Liability</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-bold text-sm">
                              ${(quote.coverage.collision / 1000).toFixed(0)}K
                            </div>
                            <div className="text-gray-400 text-xs">Collision</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-bold text-sm">
                              ${(quote.coverage.comprehensive / 1000).toFixed(0)}K
                            </div>
                            <div className="text-gray-400 text-xs">Comprehensive</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-bold text-sm">
                              ${quote.deductible}
                            </div>
                            <div className="text-gray-400 text-xs">Deductible</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-bold text-sm">
                              {quote.discounts.length}
                            </div>
                            <div className="text-gray-400 text-xs">Discounts</div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-400 font-bold text-sm">
                              {Math.ceil((new Date(quote.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d
                            </div>
                            <div className="text-gray-400 text-xs">Valid</div>
                          </div>
                        </div>

                        {/* Top Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {quote.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-sm">
                              {feature}
                            </div>
                          ))}
                          {quote.features.length > 3 && (
                            <div className="px-3 py-1 bg-white/10 rounded-full text-gray-400 text-sm">
                              +{quote.features.length - 3} more
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <motion.button
                            className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                            onClick={() => onSelectQuote?.(quote.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Select Quote
                          </motion.button>
                          <motion.button
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                            onClick={() => setShowDetails(isExpanded ? null : quote.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="w-4 h-4 inline mr-2" />
                            Details
                          </motion.button>
                          <motion.button
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors"
                            onClick={() => onSaveQuote?.(quote.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Save
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          className="mt-6 pt-6 border-t border-white/10"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Detailed Coverage */}
                            <div>
                              <h5 className="text-white font-medium mb-3">Coverage Details</h5>
                              <div className="space-y-2">
                                {Object.entries(quote.coverage).map(([key, value]) => (
                                  <div key={key} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                    </span>
                                    <span className="text-white font-medium">
                                      ${value.toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Discounts */}
                            <div>
                              <h5 className="text-white font-medium mb-3">Available Discounts</h5>
                              <div className="space-y-2">
                                {quote.discounts.map((discount, idx) => (
                                  <div key={idx} className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-green-400 font-medium text-sm">{discount.name}</span>
                                      <span className="text-green-400 font-bold text-sm">-${discount.amount}</span>
                                    </div>
                                    <div className="text-gray-400 text-xs">{discount.description}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Contact & Ratings */}
                            <div>
                              <h5 className="text-white font-medium mb-3">Provider Info</h5>
                              <div className="space-y-3">
                                {/* Ratings */}
                                <div className="p-3 bg-white/5 rounded-lg">
                                  <div className="text-white font-medium text-sm mb-2">Ratings</div>
                                  <div className="space-y-1">
                                    {Object.entries(quote.rating).map(([key, value]) => (
                                      <div key={key} className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400 capitalize">
                                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <Star className="w-3 h-3 text-yellow-400" />
                                          <span className="text-yellow-400">{value}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Contact */}
                                <div className="p-3 bg-white/5 rounded-lg">
                                  <div className="text-white font-medium text-sm mb-2">Contact</div>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-300">{quote.contact.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Globe className="w-3 h-3 text-gray-400" />
                                      <span className="text-gray-300">{quote.contact.website}</span>
                                    </div>
                                    {quote.contact.agent && (
                                      <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-300">{quote.contact.agent}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/10 text-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.5, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
          >
            <Shield />
          </motion.div>
        ))}
      </div>
    </div>
  );
}