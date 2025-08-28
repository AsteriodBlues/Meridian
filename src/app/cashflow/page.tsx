'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import IncomeVolatilityAnalysis from '@/components/cashflow/IncomeVolatilityAnalysis';
import { dataIntegrationService, type RealCashFlowData } from '@/services/dataIntegration';
import { getRealTransactionData } from '@/utils/transactionConverter';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Shield, Zap, Target,
  Brain, Heart, Baby, Home, Briefcase, GraduationCap,
  AlertCircle, CheckCircle, XCircle, Clock, DollarSign,
  PieChart, BarChart3, LineChart, Activity, Sparkles,
  Cloud, CloudRain, Sun, Snowflake, Calendar, Users,
  CreditCard, Coins, Banknote, Wallet, Calculator,
  Globe, MapPin, Phone, Mail, Settings, Play, Pause,
  ChevronRight, ChevronDown, Eye, EyeOff, RefreshCw,
  Layers, Filter, Search, Bell, Info, HelpCircle
} from 'lucide-react';

// Advanced Cash Flow Forecasting Types
interface CashFlowForecast {
  month: string;
  income: number;
  expenses: number;
  netFlow: number;
  confidence: number;
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
}

interface LifeEvent {
  id: string;
  name: string;
  type: 'baby' | 'marriage' | 'divorce' | 'house' | 'business' | 'school' | 'retirement' | 'medical' | 'disability';
  icon: any;
  impactMonths: number;
  financialImpact: {
    oneTime: number;
    monthlyChange: number;
    description: string;
  };
  probability: number;
  isActive: boolean;
}

interface StressTest {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  scenarios: Array<{
    name: string;
    impact: number;
    duration: number;
  }>;
  survivalMonths: number;
  recoveryMonths: number;
}

interface EmergencyFundMetrics {
  current: number;
  recommended: number;
  survivalMonths: number;
  qualityLevels: {
    comfort: number;
    basic: number;
    survival: number;
    critical: number;
  };
  personalizedFactors: {
    jobStability: number;
    healthRisk: number;
    incomeReplacement: number;
    fixedExpenseRatio: number;
  };
}

// Mock Data
const mockForecast: CashFlowForecast[] = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' });
  const baseIncome = 8500 + Math.random() * 1000;
  const baseExpenses = 6200 + Math.random() * 800;
  const seasonalMultiplier = Math.sin((i / 12) * Math.PI * 2) * 0.1 + 1;
  
  return {
    month,
    income: baseIncome * seasonalMultiplier,
    expenses: baseExpenses * seasonalMultiplier,
    netFlow: (baseIncome - baseExpenses) * seasonalMultiplier,
    confidence: 85 + Math.random() * 10,
    scenarios: {
      optimistic: (baseIncome - baseExpenses) * seasonalMultiplier * 1.2,
      realistic: (baseIncome - baseExpenses) * seasonalMultiplier,
      pessimistic: (baseIncome - baseExpenses) * seasonalMultiplier * 0.7,
    }
  };
});

const mockLifeEvents: LifeEvent[] = [
  {
    id: 'baby',
    name: 'Having a Baby',
    type: 'baby',
    icon: Baby,
    impactMonths: 60,
    financialImpact: {
      oneTime: 15000,
      monthlyChange: -2200,
      description: 'Medical costs, childcare, reduced income potential'
    },
    probability: 0.15,
    isActive: false
  },
  {
    id: 'house',
    name: 'Buying a House',
    type: 'house',
    icon: Home,
    impactMonths: 360,
    financialImpact: {
      oneTime: 80000,
      monthlyChange: 800,
      description: 'Down payment, moving costs, higher monthly payments'
    },
    probability: 0.25,
    isActive: false
  },
  {
    id: 'business',
    name: 'Starting a Business',
    type: 'business',
    icon: Briefcase,
    impactMonths: 36,
    financialImpact: {
      oneTime: 25000,
      monthlyChange: -1500,
      description: 'Initial investment, irregular income during startup'
    },
    probability: 0.08,
    isActive: false
  },
  {
    id: 'education',
    name: 'Going Back to School',
    type: 'school',
    icon: GraduationCap,
    impactMonths: 24,
    financialImpact: {
      oneTime: 5000,
      monthlyChange: -3200,
      description: 'Tuition costs, reduced work hours'
    },
    probability: 0.12,
    isActive: false
  }
];

const mockStressTests: StressTest[] = [
  {
    id: 'job-market-crash',
    name: 'Job Loss + Market Crash',
    description: 'Simultaneous unemployment and 40% portfolio decline',
    severity: 'extreme',
    scenarios: [
      { name: 'Job Loss', impact: -8500, duration: 6 },
      { name: 'Market Decline', impact: -2800, duration: 12 },
      { name: 'Reduced Benefits', impact: -450, duration: 6 }
    ],
    survivalMonths: 8,
    recoveryMonths: 18
  },
  {
    id: 'medical-partner-job',
    name: 'Medical Emergency + Partner Job Loss',
    description: 'Major health crisis with simultaneous income reduction',
    severity: 'high',
    scenarios: [
      { name: 'Medical Costs', impact: -15000, duration: 1 },
      { name: 'Partner Income Loss', impact: -3500, duration: 8 },
      { name: 'Insurance Gaps', impact: -800, duration: 12 }
    ],
    survivalMonths: 12,
    recoveryMonths: 24
  },
  {
    id: 'inflation-rates',
    name: 'Interest Rate Spike + Inflation',
    description: 'Rapid increase in borrowing costs and living expenses',
    severity: 'medium',
    scenarios: [
      { name: 'Mortgage Rate Increase', impact: -650, duration: 60 },
      { name: 'Inflation Impact', impact: -400, duration: 24 },
      { name: 'Credit Card Rates', impact: -200, duration: 36 }
    ],
    survivalMonths: 18,
    recoveryMonths: 12
  }
];

const mockEmergencyFund: EmergencyFundMetrics = {
  current: 25000,
  recommended: 42000,
  survivalMonths: 7.2,
  qualityLevels: {
    comfort: 6.8,
    basic: 4.2,
    survival: 2.1,
    critical: 0.8
  },
  personalizedFactors: {
    jobStability: 0.82,
    healthRisk: 0.15,
    incomeReplacement: 0.68,
    fixedExpenseRatio: 0.72
  }
};

export default function CashFlowForecastingPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3m' | '6m' | '12m'>('12m');
  const [activeLifeEvents, setActiveLifeEvents] = useState<string[]>([]);
  const [selectedStressTest, setSelectedStressTest] = useState<string | null>(null);
  const [forecastMode, setForecastMode] = useState<'standard' | 'monte-carlo' | 'scenario'>('standard');
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [realCashFlowData, setRealCashFlowData] = useState<RealCashFlowData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const timeframes = [
    { id: '3m', label: '3 Months', description: 'Short-term precision' },
    { id: '6m', label: '6 Months', description: 'Medium-term planning' },
    { id: '12m', label: '12 Months', description: 'Annual forecasting' }
  ];

  const forecastModes = [
    { id: 'standard', label: 'Standard', icon: LineChart, description: 'Traditional linear forecast' },
    { id: 'monte-carlo', label: 'Monte Carlo', icon: Activity, description: '10,000 scenario simulation' },
    { id: 'scenario', label: 'Scenario Planning', icon: Layers, description: 'What-if analysis' }
  ];

  // Load real financial data on component mount
  useEffect(() => {
    const loadRealData = async () => {
      try {
        setIsLoadingData(true);
        const transactions = getRealTransactionData();
        const integratedData = dataIntegrationService.integrateRealData(transactions);
        setRealCashFlowData(integratedData);
      } catch (error) {
        console.error('Failed to load real financial data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadRealData();
  }, []);

  // Generate dynamic forecast based on real data
  const generateDynamicForecast = (): CashFlowForecast[] => {
    if (!realCashFlowData) return mockForecast;

    const { monthlyIncome, monthlyExpenses, volatilityMetrics, historicalData } = realCashFlowData;
    const months = selectedTimeframe === '3m' ? 3 : selectedTimeframe === '6m' ? 6 : 12;
    
    const forecast: CashFlowForecast[] = [];
    
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i + 1);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Apply seasonal and growth adjustments
      const seasonalMultiplier = Math.sin((i / 12) * Math.PI * 2) * 0.1 + 1;
      const growthFactor = 1 + (0.02 * i); // 2% monthly growth assumption
      
      // Calculate income with volatility
      const baseIncome = monthlyIncome * seasonalMultiplier * growthFactor;
      const incomeVariance = baseIncome * volatilityMetrics.incomeVolatility * (Math.random() - 0.5);
      const income = Math.max(0, baseIncome + incomeVariance);
      
      // Calculate expenses with volatility  
      const baseExpenses = monthlyExpenses * seasonalMultiplier;
      const expenseVariance = baseExpenses * volatilityMetrics.expenseVolatility * (Math.random() - 0.5);
      const expenses = Math.max(0, baseExpenses + expenseVariance);
      
      const netFlow = income - expenses;
      const confidence = Math.round(volatilityMetrics.confidenceScore * 100);
      
      forecast.push({
        month,
        income: Math.round(income),
        expenses: Math.round(expenses),
        netFlow: Math.round(netFlow),
        confidence,
        scenarios: {
          optimistic: Math.round(netFlow * 1.2),
          realistic: Math.round(netFlow),
          pessimistic: Math.round(netFlow * 0.7)
        }
      });
    }
    
    return forecast;
  };

  const dynamicForecast = generateDynamicForecast();

  const handleLifeEventToggle = (eventId: string) => {
    setActiveLifeEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const runMonteCarloSimulation = async () => {
    setIsSimulating(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSimulating(false);
  };

  return (
    <PageLayout>
      <TimeBasedBackground>
        <MagneticCursor />
        
        <div className="min-h-screen">
          {/* Hero Header */}
          <motion.div
            className="max-w-7xl mx-auto px-6 py-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Cash Flow
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">
                  Forecasting 🔮
                </span>
              </motion.h1>
              <motion.p
                className="text-gray-400 text-xl max-w-4xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Advanced ML-powered predictions with scenario modeling, life event analysis, 
                and behavioral intelligence. Your complete financial defense system.
              </motion.p>

              {/* Quick Stats - Dynamic */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {isLoadingData ? (
                  // Loading placeholders
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <div className="animate-pulse">
                        <div className="h-4 bg-white/10 rounded mb-2"></div>
                        <div className="h-8 bg-white/20 rounded mb-1"></div>
                        <div className="h-3 bg-white/10 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-gray-300">AI Confidence</span>
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {realCashFlowData ? Math.round(realCashFlowData.volatilityMetrics.confidenceScore * 100) : 94}%
                      </div>
                      <div className="text-xs text-purple-400">
                        {realCashFlowData?.volatilityMetrics.confidenceScore > 0.8 ? 'High accuracy' : 
                         realCashFlowData?.volatilityMetrics.confidenceScore > 0.6 ? 'Good accuracy' : 'Moderate accuracy'}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-300">Safety Margin</span>
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {realCashFlowData ? 
                          `${Math.round((realCashFlowData.emergencyFund.currentAmount / realCashFlowData.emergencyFund.monthlyExpenses) * 10) / 10}m` : 
                          '7.2m'}
                      </div>
                      <div className="text-xs text-green-400">Emergency coverage</div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-300">Risk Level</span>
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {realCashFlowData ? 
                          realCashFlowData.volatilityMetrics.overallRisk.charAt(0).toUpperCase() + realCashFlowData.volatilityMetrics.overallRisk.slice(1) :
                          'Low'}
                      </div>
                      <div className="text-xs text-yellow-400">
                        {realCashFlowData?.volatilityMetrics.overallRisk === 'low' ? 'Well protected' :
                         realCashFlowData?.volatilityMetrics.overallRisk === 'medium' ? 'Manageable risk' : 'Needs attention'}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-300">Income Streams</span>
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {realCashFlowData ? realCashFlowData.incomeStreams.length : '4'}
                      </div>
                      <div className="text-xs text-blue-400">Active sources</div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>

            {/* Controls */}
            <motion.div
              className="flex flex-wrap justify-between items-center mb-8 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {/* Timeframe Selector */}
              <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                {timeframes.map(timeframe => (
                  <motion.button
                    key={timeframe.id}
                    className={`relative px-6 py-3 rounded-xl transition-all ${
                      selectedTimeframe === timeframe.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setSelectedTimeframe(timeframe.id as any)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-sm font-semibold">{timeframe.label}</div>
                    <div className="text-xs opacity-70">{timeframe.description}</div>
                  </motion.button>
                ))}
              </div>

              {/* Forecast Mode Selector */}
              <div className="flex gap-2">
                {forecastModes.map(mode => (
                  <motion.button
                    key={mode.id}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                      forecastMode === mode.id
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setForecastMode(mode.id as any)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <mode.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Additional Controls */}
              <div className="flex gap-2">
                <motion.button
                  className={`p-2 rounded-xl border transition-all ${
                    showConfidenceIntervals
                      ? 'bg-green-500/20 border-green-500/40 text-green-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setShowConfidenceIntervals(!showConfidenceIntervals)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white transition-all"
                  onClick={runMonteCarloSimulation}
                  disabled={isSimulating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSimulating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Forecast Chart */}
              <motion.div
                className="lg:col-span-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Cash Flow Forecast
                    </h3>
                    <p className="text-gray-400 text-sm">
                      ML-powered predictions with {selectedTimeframe} timeframe
                    </p>
                  </div>
                  
                  {forecastMode === 'monte-carlo' && isSimulating && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-sm text-blue-400">Simulating 10,000 scenarios...</span>
                    </div>
                  )}
                </div>

                {/* Chart Placeholder with Beautiful Visualization */}
                <div className="relative h-80 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl border border-white/5 overflow-hidden">
                  {/* Animated Grid Lines */}
                  <div className="absolute inset-0">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-full border-t border-white/5"
                        style={{ top: `${(i + 1) * 16.67}%` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 + i * 0.1 }}
                      />
                    ))}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-full border-l border-white/5"
                        style={{ left: `${(i + 1) * 8.33}%` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 + i * 0.05 }}
                      />
                    ))}
                  </div>

                  {/* Forecast Line Animation */}
                  <svg className="absolute inset-0 w-full h-full">
                    <motion.path
                      d="M 60 280 Q 120 240 180 200 T 300 180 Q 360 160 420 140 T 540 120 Q 600 100 660 80"
                      stroke="url(#forecast-gradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.5, ease: "easeInOut" }}
                    />
                    
                    {showConfidenceIntervals && (
                      <>
                        <motion.path
                          d="M 60 300 Q 120 260 180 220 T 300 200 Q 360 180 420 160 T 540 140 Q 600 120 660 100"
                          stroke="rgba(59, 130, 246, 0.3)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 1.7, ease: "easeInOut" }}
                        />
                        <motion.path
                          d="M 60 260 Q 120 220 180 180 T 300 160 Q 360 140 420 120 T 540 100 Q 600 80 660 60"
                          stroke="rgba(59, 130, 246, 0.3)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="5,5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 1.7, ease: "easeInOut" }}
                        />
                      </>
                    )}
                    
                    <defs>
                      <linearGradient id="forecast-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Confidence Interval Badge */}
                  {showConfidenceIntervals && (
                    <motion.div
                      className="absolute top-4 right-4 bg-blue-500/20 backdrop-blur border border-blue-500/40 rounded-lg px-3 py-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2 }}
                    >
                      <span className="text-xs text-blue-300 font-medium">
                        95% Confidence Interval
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Monthly Breakdown - Dynamic */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {(dynamicForecast.slice(0, 4) || mockForecast.slice(0, 4)).map((month, idx) => (
                    <motion.div
                      key={month.month}
                      className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2 + idx * 0.1 }}
                    >
                      <div className="text-sm text-gray-400 mb-1">{month.month}</div>
                      <div className={`text-lg font-bold ${
                        month.netFlow > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {month.netFlow > 0 ? '+' : ''}${Math.round(month.netFlow).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(month.confidence)}% confidence
                      </div>
                      {realCashFlowData && (
                        <div className="text-xs text-blue-400 mt-1">
                          Based on your data
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Life Events Panel */}
              <motion.div
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <h3 className="text-xl font-bold text-white">Life Events</h3>
                </div>
                
                <div className="space-y-4">
                  {mockLifeEvents.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        activeLifeEvents.includes(event.id)
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-white/5 border-white/10 hover:border-purple-500/20'
                      }`}
                      onClick={() => handleLifeEventToggle(event.id)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          event.type === 'baby' ? 'bg-pink-500/20 text-pink-400' :
                          event.type === 'house' ? 'bg-blue-500/20 text-blue-400' :
                          event.type === 'business' ? 'bg-green-500/20 text-green-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          <event.icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-semibold text-white">{event.name}</h4>
                            <span className="text-xs text-gray-400">
                              {Math.round(event.probability * 100)}%
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-400 mb-2">
                            {event.financialImpact.description}
                          </p>
                          
                          <div className="flex justify-between text-xs">
                            <span className="text-red-400">
                              ${Math.abs(event.financialImpact.oneTime).toLocaleString()} one-time
                            </span>
                            <span className="text-orange-400">
                              {event.financialImpact.monthlyChange > 0 ? '+' : ''}${event.financialImpact.monthlyChange}/mo
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Stress Testing Section */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              {/* Multi-Variable Stress Testing */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-white">Stress Testing</h3>
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                    Crisis Scenarios
                  </span>
                </div>
                
                <div className="space-y-4">
                  {mockStressTests.map((test, idx) => (
                    <motion.div
                      key={test.id}
                      className={`p-6 rounded-xl border transition-all cursor-pointer ${
                        selectedStressTest === test.id
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-white/5 border-white/10 hover:border-red-500/20'
                      }`}
                      onClick={() => setSelectedStressTest(selectedStressTest === test.id ? null : test.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.8 + idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-semibold mb-1">{test.name}</h4>
                          <p className="text-sm text-gray-400 mb-2">{test.description}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          test.severity === 'extreme' ? 'bg-red-500/20 text-red-400' :
                          test.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          test.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {test.severity.toUpperCase()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">{test.survivalMonths}m</div>
                          <div className="text-xs text-gray-400">Survival Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{test.recoveryMonths}m</div>
                          <div className="text-xs text-gray-400">Recovery Time</div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {selectedStressTest === test.id && (
                          <motion.div
                            className="space-y-3 pt-4 border-t border-white/10"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {test.scenarios.map((scenario, scenarioIdx) => (
                              <div key={scenarioIdx} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                                <span className="text-sm text-white">{scenario.name}</span>
                                <div className="text-right">
                                  <div className="text-sm font-semibold text-red-400">
                                    ${Math.abs(scenario.impact).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {scenario.duration}m duration
                                  </div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Emergency Fund Intelligence */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Emergency Fund AI</h3>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                    Personalized
                  </span>
                </div>
                
                {/* Current vs Recommended - Dynamic */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Emergency Fund Status</span>
                    <span className="text-sm text-white font-medium">
                      ${(realCashFlowData ? realCashFlowData.emergencyFund.currentAmount : mockEmergencyFund.current).toLocaleString()} / 
                      ${(realCashFlowData ? realCashFlowData.emergencyFund.targetAmount : mockEmergencyFund.recommended).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${realCashFlowData ? 
                        (realCashFlowData.emergencyFund.currentAmount / realCashFlowData.emergencyFund.targetAmount) * 100 :
                        (mockEmergencyFund.current / mockEmergencyFund.recommended) * 100}%` }}
                      transition={{ duration: 1.5, delay: 2 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Current</span>
                    <span>
                      {realCashFlowData ? 
                        Math.round((realCashFlowData.emergencyFund.currentAmount / realCashFlowData.emergencyFund.targetAmount) * 100) :
                        Math.round((mockEmergencyFund.current / mockEmergencyFund.recommended) * 100)}% of recommended
                    </span>
                  </div>
                </div>

                {/* Survival Months - Dynamic */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {realCashFlowData ? 
                        Math.round((realCashFlowData.emergencyFund.currentAmount / realCashFlowData.emergencyFund.monthlyExpenses) * 10) / 10 :
                        mockEmergencyFund.survivalMonths}
                    </div>
                    <div className="text-green-300 font-medium mb-1">Months of Coverage</div>
                    <div className="text-xs text-green-400/70">
                      {realCashFlowData ? 'Based on your actual spending patterns' : 'Based on your spending patterns and risk factors'}
                    </div>
                  </div>
                </div>

                {/* Quality of Life Levels */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Survival Timeline</h4>
                  {Object.entries(mockEmergencyFund.qualityLevels).map(([level, months], idx) => (
                    <motion.div
                      key={level}
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.2 + idx * 0.1 }}
                    >
                      <span className={`text-sm capitalize ${
                        level === 'comfort' ? 'text-green-400' :
                        level === 'basic' ? 'text-yellow-400' :
                        level === 'survival' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {level} Living
                      </span>
                      <span className="text-white font-medium">{months.toFixed(1)} months</span>
                    </motion.div>
                  ))}
                </div>

                {/* Personalization Factors */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white mb-3">Risk Factors</h4>
                  {Object.entries(mockEmergencyFund.personalizedFactors).map(([factor, score], idx) => (
                    <motion.div
                      key={factor}
                      className="space-y-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.4 + idx * 0.1 }}
                    >
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 capitalize">
                          {factor.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                        <span className={`font-medium ${
                          score > 0.7 ? 'text-green-400' :
                          score > 0.4 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {Math.round(score * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className={`h-full rounded-full ${
                            score > 0.7 ? 'bg-green-500' :
                            score > 0.4 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${score * 100}%` }}
                          transition={{ duration: 1, delay: 2.6 + idx * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Advanced Warning System */}
            <motion.div
              className="mt-8 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 backdrop-blur-2xl border border-orange-500/20 rounded-3xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-6 h-6 text-orange-400" />
                <h3 className="text-xl font-bold text-white">Advanced Warning System</h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400">All Clear</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { 
                    level: '6 Months Out', 
                    status: 'clear', 
                    message: 'Financial trajectory looks strong',
                    icon: CheckCircle,
                    color: 'green'
                  },
                  { 
                    level: '3 Months Out', 
                    status: 'watch', 
                    message: 'Monitor holiday spending patterns',
                    icon: Clock,
                    color: 'yellow'
                  },
                  { 
                    level: '1 Month Out', 
                    status: 'clear', 
                    message: 'Cash flow remains positive',
                    icon: CheckCircle,
                    color: 'green'
                  },
                  { 
                    level: 'Real-time', 
                    status: 'active', 
                    message: 'AI monitoring 24/7',
                    icon: Activity,
                    color: 'blue'
                  }
                ].map((alert, idx) => (
                  <motion.div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      alert.color === 'green' ? 'bg-green-500/10 border-green-500/20' :
                      alert.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20' :
                      alert.color === 'blue' ? 'bg-blue-500/10 border-blue-500/20' :
                      'bg-red-500/10 border-red-500/20'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 + idx * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <alert.icon className={`w-5 h-5 ${
                        alert.color === 'green' ? 'text-green-400' :
                        alert.color === 'yellow' ? 'text-yellow-400' :
                        alert.color === 'blue' ? 'text-blue-400' :
                        'text-red-400'
                      }`} />
                      <span className="text-sm font-semibold text-white">{alert.level}</span>
                    </div>
                    <p className="text-xs text-gray-400">{alert.message}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Behavioral Predictions & Scenario Gaming */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.8 }}
            >
              {/* Behavioral AI */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Behavioral AI</h3>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    Your DNA
                  </span>
                </div>
                
                <div className="space-y-6">
                  {/* Spending Personality */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Financial Personality</h4>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                      <div className="text-center mb-3">
                        <div className="text-2xl font-bold text-purple-400 mb-1">Cautious Planner</div>
                        <div className="text-xs text-purple-300">Primary archetype</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="text-center">
                          <div className="text-green-400 font-semibold">85%</div>
                          <div className="text-gray-400">Impulse Control</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-semibold">92%</div>
                          <div className="text-gray-400">Goal Adherence</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seasonal Patterns */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Seasonal Intelligence</h4>
                    <div className="space-y-2">
                      {[
                        { season: 'Holiday Season', risk: 'high', pattern: '+$800 avg overspend' },
                        { season: 'Tax Refund', opportunity: 'high', pattern: '$2,400 windfall' },
                        { season: 'Summer Travel', risk: 'medium', pattern: '+$1,200 expenses' },
                        { season: 'Back to School', risk: 'low', pattern: '+$300 expenses' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                          <span className="text-sm text-white">{item.season}</span>
                          <div className="text-right">
                            <div className={`text-xs font-medium ${
                              item.risk === 'high' || item.opportunity === 'high' ? 'text-orange-400' :
                              item.risk === 'medium' ? 'text-yellow-400' :
                              'text-green-400'
                            }`}>
                              {item.pattern}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scenario Gaming */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Scenario Gaming</h3>
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                    Interactive
                  </span>
                </div>
                
                {/* Monte Carlo Results */}
                <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-xl p-6 mb-6">
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-400 mb-1">Monte Carlo Simulation</div>
                    <div className="text-3xl font-bold text-white mb-2">10,000</div>
                    <div className="text-sm text-cyan-400">Scenarios Analyzed</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-400">78%</div>
                      <div className="text-xs text-gray-400">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">$4,200</div>
                      <div className="text-xs text-gray-400">Median Outcome</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-400">±$2,800</div>
                      <div className="text-xs text-gray-400">Confidence Range</div>
                    </div>
                  </div>
                </div>

                {/* Interactive Scenarios */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white mb-3">What-If Scenarios</h4>
                  {[
                    { scenario: '💼 Job Change (+$15k salary)', impact: '+$1,250/month', probability: '68%' },
                    { scenario: '🏠 Move to cheaper city', impact: '+$800/month', probability: '23%' },
                    { scenario: '🚗 Buy reliable used car', impact: '-$400/month', probability: '45%' },
                    { scenario: '💡 Start side business', impact: '+$600/month', probability: '12%' }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex justify-between items-center bg-white/5 hover:bg-white/10 rounded-lg p-3 cursor-pointer transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-sm text-white">{item.scenario}</span>
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${
                          item.impact.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {item.impact}
                        </div>
                        <div className="text-xs text-gray-400">{item.probability} likely</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Income Volatility Analysis for Freelancers */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.8 }}
            >
              <IncomeVolatilityAnalysis userType="freelancer" />
            </motion.div>

            {/* Integration Intelligence & External Data */}
            <motion.div
              className="mt-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold text-white">Integration Intelligence</h3>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                  Real-time Data
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Economic Indicators */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white">Economic Indicators</h4>
                  {[
                    { indicator: 'Local Unemployment', value: '3.2%', trend: 'down', impact: 'Positive for freelance demand' },
                    { indicator: 'Tech Sector Growth', value: '+12.5%', trend: 'up', impact: 'High demand for tech skills' },
                    { indicator: 'Inflation Rate', value: '4.1%', trend: 'stable', impact: 'Adjust rates quarterly' },
                    { indicator: 'Interest Rates', value: '5.25%', trend: 'up', impact: 'Higher business costs' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm text-white">{item.indicator}</span>
                        <span className={`text-sm font-semibold ${
                          item.trend === 'up' ? 'text-green-400' :
                          item.trend === 'down' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {item.value}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{item.impact}</p>
                    </div>
                  ))}
                </div>

                {/* Industry Trends */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white">Industry Intelligence</h4>
                  {[
                    { trend: 'Remote Work Adoption', score: 92, description: 'Sustained high demand' },
                    { trend: 'AI/Automation Impact', score: 34, description: 'Moderate disruption risk' },
                    { trend: 'Startup Funding', score: 67, description: 'Recovering from 2023 lows' },
                    { trend: 'Corporate Budgets', score: 78, description: 'Strong Q1 2024 outlook' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-white">{item.trend}</span>
                        <span className={`text-sm font-semibold ${
                          item.score > 70 ? 'text-green-400' :
                          item.score > 40 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {item.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                        <motion.div
                          className={`h-full rounded-full ${
                            item.score > 70 ? 'bg-green-500' :
                            item.score > 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, delay: 3 + idx * 0.1 }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">{item.description}</p>
                    </div>
                  ))}
                </div>

                {/* Safety Net Mapping */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white">Safety Net Resources</h4>
                  {[
                    { resource: 'Unemployment Benefits', status: 'eligible', amount: '$1,800/month', duration: '6 months' },
                    { resource: 'Healthcare Coverage', status: 'active', amount: '$450/month', duration: 'Ongoing' },
                    { resource: 'Emergency Grants', status: 'available', amount: 'Up to $5,000', duration: 'One-time' },
                    { resource: 'Professional Network', status: 'strong', amount: '127 connections', duration: 'Active' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-white">{item.resource}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'active' || item.status === 'eligible' || item.status === 'strong' ? 'bg-green-400' :
                          item.status === 'available' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`} />
                      </div>
                      <div className="text-xs text-gray-400 mb-1">{item.amount}</div>
                      <div className="text-xs text-gray-500">{item.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Proactive Interventions & Smart Notifications */}
            <motion.div
              className="mt-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-2xl border border-purple-500/20 rounded-3xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Proactive Interventions</h3>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                  AI-Powered
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Smart Notifications */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white mb-4">Smart Notifications</h4>
                  {[
                    {
                      type: 'warning',
                      title: 'Payment Delay Alert',
                      message: 'TechCorp payment is 3 days overdue. Historical pattern suggests 7-day resolution.',
                      action: 'Send follow-up reminder',
                      priority: 'high'
                    },
                    {
                      type: 'opportunity',
                      title: 'Rate Increase Window',
                      message: 'Market rates in your area increased 8%. Consider rate adjustment for new projects.',
                      action: 'Review rate strategy',
                      priority: 'medium'
                    },
                    {
                      type: 'prediction',
                      title: 'Seasonal Adjustment',
                      message: 'Based on 3-year history, prepare for 25% income dip in December-January.',
                      action: 'Build holiday buffer',
                      priority: 'low'
                    },
                    {
                      type: 'automation',
                      title: 'Emergency Fund Trigger',
                      message: 'Income dropped below threshold. Auto-transferring $500 from savings.',
                      action: 'Completed automatically',
                      priority: 'info'
                    }
                  ].map((notification, idx) => (
                    <motion.div
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        notification.priority === 'high' ? 'bg-red-500/10 border-red-500/20' :
                        notification.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                        notification.priority === 'low' ? 'bg-blue-500/10 border-blue-500/20' :
                        'bg-green-500/10 border-green-500/20'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 3.2 + idx * 0.1 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${
                          notification.priority === 'high' ? 'bg-red-400' :
                          notification.priority === 'medium' ? 'bg-yellow-400' :
                          notification.priority === 'low' ? 'bg-blue-400' :
                          'bg-green-400'
                        } w-2 h-2 mt-2`} />
                        <div className="flex-1">
                          <h5 className="text-sm font-semibold text-white mb-1">{notification.title}</h5>
                          <p className="text-xs text-gray-400 mb-2">{notification.message}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-purple-300">{notification.action}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              notification.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                              notification.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              notification.priority === 'low' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {notification.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Automated Actions */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-white mb-4">Automated Actions</h4>
                  <div className="bg-white/5 rounded-xl p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-green-400 mb-2">12</div>
                      <div className="text-sm text-green-300">Actions This Month</div>
                      <div className="text-xs text-green-400/70">Saved 4.2 hours of manual work</div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { action: 'Emergency fund transfers', count: 3, saved: '$1,200 protected' },
                        { action: 'Invoice reminders sent', count: 5, saved: '2.1 days faster payment' },
                        { action: 'Rate comparisons', count: 2, saved: 'Identified $300/month opportunity' },
                        { action: 'Budget adjustments', count: 2, saved: 'Prevented $800 overspend' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                          <div>
                            <span className="text-sm text-white">{item.action}</span>
                            <div className="text-xs text-gray-400">{item.saved}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-400">{item.count}x</div>
                            <div className="text-xs text-gray-400">automated</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}