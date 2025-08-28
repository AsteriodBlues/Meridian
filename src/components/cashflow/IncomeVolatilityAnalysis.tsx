'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, DollarSign, Calendar,
  BarChart3, PieChart, Clock, Zap, Target, Users, Briefcase,
  ArrowUpDown, Activity, Percent, CheckCircle, XCircle,
  Brain, Heart, Eye, RefreshCw, Settings, Filter, Bell
} from 'lucide-react';

interface IncomeStream {
  id: string;
  name: string;
  type: 'client' | 'platform' | 'passive' | 'project';
  monthlyAverage: number;
  volatility: number;
  reliability: number;
  seasonality: number;
  growth: number;
  lastPayment: string;
  paymentDelay: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
}

interface VolatilityPattern {
  id: string;
  pattern: 'feast-famine' | 'seasonal' | 'project-based' | 'platform-dependent' | 'client-retention';
  severity: number;
  frequency: number;
  description: string;
  mitigation: string[];
  predictability: number;
}

interface ClientAnalysis {
  id: string;
  name: string;
  contractValue: number;
  renewalProbability: number;
  paymentReliability: number;
  relationshipHealth: number;
  riskFactors: string[];
  opportunities: string[];
  nextAction: string;
}

const mockIncomeStreams: IncomeStream[] = [
  {
    id: 'main-client',
    name: 'TechCorp Consulting',
    type: 'client',
    monthlyAverage: 4200,
    volatility: 0.15,
    reliability: 0.92,
    seasonality: 0.08,
    growth: 0.12,
    lastPayment: '2024-01-15',
    paymentDelay: 5,
    riskLevel: 'low'
  },
  {
    id: 'upwork',
    name: 'Upwork Projects',
    type: 'platform',
    monthlyAverage: 2800,
    volatility: 0.45,
    reliability: 0.72,
    seasonality: 0.25,
    growth: -0.05,
    lastPayment: '2024-01-12',
    paymentDelay: 12,
    riskLevel: 'medium'
  },
  {
    id: 'course-sales',
    name: 'Online Course Revenue',
    type: 'passive',
    monthlyAverage: 1200,
    volatility: 0.38,
    reliability: 0.85,
    seasonality: 0.35,
    growth: 0.08,
    lastPayment: '2024-01-01',
    paymentDelay: 0,
    riskLevel: 'low'
  },
  {
    id: 'startup-project',
    name: 'Startup MVP Development',
    type: 'project',
    monthlyAverage: 3500,
    volatility: 0.65,
    reliability: 0.68,
    seasonality: 0.12,
    growth: 0.25,
    lastPayment: '2024-01-20',
    paymentDelay: 8,
    riskLevel: 'high'
  }
];

const mockVolatilityPatterns: VolatilityPattern[] = [
  {
    id: 'feast-famine',
    pattern: 'feast-famine',
    severity: 0.7,
    frequency: 0.4,
    description: '3-month high income followed by 2-month drought',
    mitigation: ['Build 6-month emergency fund', 'Diversify client base', 'Smooth income with recurring contracts'],
    predictability: 0.8
  },
  {
    id: 'holiday-dip',
    pattern: 'seasonal',
    severity: 0.5,
    frequency: 1.0,
    description: 'December-January 40% income reduction due to client holidays',
    mitigation: ['Pre-invoice before holidays', 'Offer holiday retainers', 'Build Q4 savings buffer'],
    predictability: 0.95
  },
  {
    id: 'client-concentration',
    pattern: 'client-retention',
    severity: 0.85,
    frequency: 0.2,
    description: '65% income from single client creates major risk',
    mitigation: ['Diversify to 3+ major clients', 'Build referral network', 'Create backup income streams'],
    predictability: 0.6
  }
];

const mockClientAnalysis: ClientAnalysis[] = [
  {
    id: 'techcorp',
    name: 'TechCorp Inc.',
    contractValue: 50400,
    renewalProbability: 0.88,
    paymentReliability: 0.95,
    relationshipHealth: 0.92,
    riskFactors: ['Single point of contact', 'Budget pressures in Q1'],
    opportunities: ['Expand scope to mobile app', 'Introduce to sister company'],
    nextAction: 'Schedule Q2 planning meeting'
  },
  {
    id: 'startup',
    name: 'InnovateLabs',
    contractValue: 42000,
    renewalProbability: 0.65,
    paymentReliability: 0.72,
    relationshipHealth: 0.78,
    riskFactors: ['Funding uncertainty', 'Frequent scope changes', 'Payment delays'],
    opportunities: ['Equity participation option', 'Long-term CTO role'],
    nextAction: 'Discuss payment terms improvement'
  }
];

interface Props {
  userType: 'freelancer' | 'contractor' | 'consultant' | 'creator';
}

export default function IncomeVolatilityAnalysis({ userType = 'freelancer' }: Props) {
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'patterns' | 'clients' | 'predictions'>('overview');
  const [timeframe, setTimeframe] = useState<'3m' | '6m' | '12m'>('6m');

  const totalMonthlyAverage = mockIncomeStreams.reduce((sum, stream) => sum + stream.monthlyAverage, 0);
  const weightedVolatility = mockIncomeStreams.reduce((sum, stream) => 
    sum + (stream.volatility * stream.monthlyAverage / totalMonthlyAverage), 0);
  const averageReliability = mockIncomeStreams.reduce((sum, stream) => sum + stream.reliability, 0) / mockIncomeStreams.length;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'extreme': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'feast-famine': return ArrowUpDown;
      case 'seasonal': return Calendar;
      case 'project-based': return Briefcase;
      case 'platform-dependent': return Users;
      case 'client-retention': return Heart;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Mode Selector */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Income Volatility Analysis</h2>
          <p className="text-gray-400 text-sm">
            {userType === 'freelancer' ? 'Freelancer' : 
             userType === 'contractor' ? 'Independent Contractor' :
             userType === 'consultant' ? 'Consultant' : 'Creator'} income patterns and risk assessment
          </p>
        </div>

        <div className="flex gap-2">
          {['overview', 'patterns', 'clients', 'predictions'].map(mode => (
            <motion.button
              key={mode}
              className={`px-4 py-2 rounded-xl border transition-all text-sm ${
                viewMode === mode
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setViewMode(mode as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-300">Monthly Average</span>
          </div>
          <div className="text-3xl font-bold text-white">${totalMonthlyAverage.toLocaleString()}</div>
          <div className="text-xs text-green-400">Based on 6-month history</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-300">Volatility Index</span>
          </div>
          <div className="text-3xl font-bold text-white">{Math.round(weightedVolatility * 100)}%</div>
          <div className="text-xs text-orange-400">
            {weightedVolatility < 0.3 ? 'Low volatility' : weightedVolatility < 0.5 ? 'Moderate' : 'High volatility'}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-300">Reliability Score</span>
          </div>
          <div className="text-3xl font-bold text-white">{Math.round(averageReliability * 100)}%</div>
          <div className="text-xs text-blue-400">Payment consistency</div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-gray-300">Risk Assessment</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {averageReliability > 0.8 && weightedVolatility < 0.4 ? 'Low' :
             averageReliability > 0.6 && weightedVolatility < 0.6 ? 'Medium' : 'High'}
          </div>
          <div className="text-xs text-red-400">Overall income risk</div>
        </div>
      </motion.div>

      {/* Content based on selected view mode */}
      <AnimatePresence mode="wait">
        {viewMode === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Income Streams */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Income Streams</h3>
              </div>

              <div className="space-y-4">
                {mockIncomeStreams.map((stream, idx) => (
                  <motion.div
                    key={stream.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedStream === stream.id
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-white/5 border-white/10 hover:border-blue-500/20'
                    }`}
                    onClick={() => setSelectedStream(selectedStream === stream.id ? null : stream.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold">{stream.name}</h4>
                        <p className="text-sm text-gray-400 capitalize">{stream.type}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-lg border text-xs font-medium ${getRiskColor(stream.riskLevel)}`}>
                        {stream.riskLevel.toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-lg font-bold text-white">${stream.monthlyAverage.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Monthly Average</div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${stream.volatility > 0.4 ? 'text-red-400' : stream.volatility > 0.2 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {Math.round(stream.volatility * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Volatility</div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedStream === stream.id && (
                        <motion.div
                          className="space-y-3 pt-3 border-t border-white/10"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Reliability</span>
                              <span className="text-white">{Math.round(stream.reliability * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Seasonality</span>
                              <span className="text-white">{Math.round(stream.seasonality * 100)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Growth</span>
                              <span className={`${stream.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stream.growth > 0 ? '+' : ''}{Math.round(stream.growth * 100)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Payment Delay</span>
                              <span className="text-white">{stream.paymentDelay} days</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Survival Calculator */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Dry Spell Calculator</h3>
              </div>

              {/* Scenario Analysis */}
              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-green-400 mb-2">4.2</div>
                    <div className="text-green-300 font-medium">Months of Survival</div>
                    <div className="text-xs text-green-400/70">With current emergency fund</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white">Scenario Breakdown</h4>
                  {[
                    { scenario: 'Main client lost', survival: '2.8 months', impact: 'Critical' },
                    { scenario: 'Platform income stops', survival: '5.1 months', impact: 'Moderate' },
                    { scenario: '50% income reduction', survival: '8.4 months', impact: 'Manageable' },
                    { scenario: 'All income stops', survival: '4.2 months', impact: 'Severe' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                      <div>
                        <span className="text-sm text-white">{item.scenario}</span>
                        <div className={`text-xs ${
                          item.impact === 'Critical' ? 'text-red-400' :
                          item.impact === 'Severe' ? 'text-orange-400' :
                          item.impact === 'Moderate' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {item.impact}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">{item.survival}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === 'patterns' && (
          <motion.div
            key="patterns"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {mockVolatilityPatterns.map((pattern, idx) => {
              const PatternIcon = getPatternIcon(pattern.pattern);
              return (
                <motion.div
                  key={pattern.id}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    selectedPattern === pattern.id
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-white/5 border-white/10 hover:border-purple-500/20'
                  }`}
                  onClick={() => setSelectedPattern(selectedPattern === pattern.id ? null : pattern.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                      <PatternIcon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-semibold text-lg capitalize mb-1">
                            {pattern.pattern.replace('-', ' ')} Pattern
                          </h4>
                          <p className="text-gray-400 text-sm">{pattern.description}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            pattern.severity > 0.7 ? 'text-red-400' :
                            pattern.severity > 0.4 ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {Math.round(pattern.severity * 100)}%
                          </div>
                          <div className="text-xs text-gray-400">Severity</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-400">Frequency</span>
                          <div className="text-white font-medium">{Math.round(pattern.frequency * 100)}% likely</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Predictability</span>
                          <div className="text-white font-medium">{Math.round(pattern.predictability * 100)}%</div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedPattern === pattern.id && (
                          <motion.div
                            className="pt-4 border-t border-white/10"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <h5 className="text-sm font-semibold text-white mb-3">Mitigation Strategies</h5>
                            <div className="space-y-2">
                              {pattern.mitigation.map((strategy, strategyIdx) => (
                                <div key={strategyIdx} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                  <span className="text-sm text-gray-300">{strategy}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}