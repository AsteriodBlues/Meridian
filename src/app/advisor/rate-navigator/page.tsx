'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import { 
  TrendingUp, TrendingDown, Anchor, Waves, CloudRain, 
  Sun, Snowflake, Zap, ArrowLeft, Play, Pause, 
  RotateCcw, Shield, Target, DollarSign, Calendar,
  ThermometerSun, Wind, Compass, Navigation, Map,
  AlertTriangle, CheckCircle, Info, Lightbulb, Brain
} from 'lucide-react';

// Enhanced Rate data interfaces
interface RateScenario {
  id: string;
  name: string;
  type: 'fixed' | 'variable' | 'adjustable' | 'hybrid';
  initialRate: number;
  adjustmentPeriod?: number; // months
  capRate?: number; // maximum rate for adjustable
  floorRate?: number; // minimum rate for adjustable
  description: string;
  pros: string[];
  cons: string[];
  riskLevel: 'low' | 'medium' | 'high';
  marketShare: number; // percentage of borrowers choosing this option
  color: string;
  icon: any;
  historicalPerformance: HistoricalData[];
}

interface HistoricalData {
  year: number;
  averageRate: number;
  volatility: number;
  marketCondition: string;
}

interface EconomicWeather {
  condition: 'calm' | 'windy' | 'stormy' | 'hurricane';
  temperature: 'hot' | 'warm' | 'cool' | 'cold';
  forecast: 'rising' | 'falling' | 'stable' | 'volatile';
  description: string;
  impact: string;
  icon: any;
  severity: number; // 0-100
  confidence: number; // 0-100 forecast confidence
  economicIndicators: EconomicIndicator[];
  centralBankPolicy: CentralBankPolicy;
}

interface EconomicIndicator {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  impact: 'positive' | 'negative' | 'neutral';
  weight: number; // influence on rates
}

interface CentralBankPolicy {
  currentRate: number;
  nextMeetingDate: string;
  stance: 'hawkish' | 'dovish' | 'neutral';
  probability: {
    raise: number;
    hold: number;
    cut: number;
  };
}

interface RateTimelineStep {
  month: number;
  fixedRate: number;
  variableRate: number;
  economicWeather: EconomicWeather;
  marketEvents: string[];
  totalInterestFixed: number;
  totalInterestVariable: number;
  monthlySavings: number; // positive = variable saves money
  cumulativeSavings: number;
}

interface LoanDetails {
  principal: number;
  termYears: number;
  loanType: 'mortgage' | 'auto' | 'personal' | 'business';
  downPayment?: number;
  creditScore: number;
  debtToIncome: number;
  purpose: string;
  propertyType?: 'primary' | 'investment' | 'vacation';
  loanToValue?: number;
}

interface PersonalizedFactors {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  paymentStability: 'stable' | 'variable' | 'growing';
  timeHorizon: number; // years planning to keep loan
  financialGoals: string[];
  marketOutlook: 'optimistic' | 'pessimistic' | 'neutral';
}

interface RiskAssessment {
  paymentShock: number; // worst case payment increase
  probabilityOfRegret: number; // chance of wishing chose differently
  stressTestResults: StressTestResult[];
  scenarioAnalysis: ScenarioResult[];
}

interface StressTestResult {
  scenario: string;
  maxRate: number;
  maxPayment: number;
  affordabilityRisk: 'low' | 'medium' | 'high';
}

interface ScenarioResult {
  name: string;
  probability: number;
  outcomeFixed: number;
  outcomeVariable: number;
  difference: number;
}

const mockLoanDetails: LoanDetails = {
  principal: 350000,
  termYears: 30,
  loanType: 'mortgage',
  downPayment: 70000,
  creditScore: 750,
  debtToIncome: 0.28,
  purpose: 'Primary residence purchase',
  propertyType: 'primary',
  loanToValue: 0.8
};

const mockPersonalFactors: PersonalizedFactors = {
  riskTolerance: 'moderate',
  paymentStability: 'stable',
  timeHorizon: 7,
  financialGoals: ['Build equity', 'Minimize total interest', 'Payment predictability'],
  marketOutlook: 'neutral'
};

const rateScenarios: RateScenario[] = [
  {
    id: 'fixed',
    name: 'Fixed Rate',
    type: 'fixed',
    initialRate: 6.75,
    description: 'Predictable payments that never change, like a sturdy anchor in choppy waters',
    pros: ['Payment stability', 'Protection from rate increases', 'Easy budgeting', 'Peace of mind', 'No rate risk'],
    cons: ['Higher initial rate', 'No benefit from rate decreases', 'Harder to qualify', 'Opportunity cost if rates fall'],
    riskLevel: 'low',
    marketShare: 85,
    color: '#3B82F6',
    icon: Anchor,
    historicalPerformance: [
      { year: 2020, averageRate: 2.65, volatility: 0.2, marketCondition: 'Pandemic lows' },
      { year: 2021, averageRate: 2.96, volatility: 0.4, marketCondition: 'Recovery begins' },
      { year: 2022, averageRate: 5.34, volatility: 1.8, marketCondition: 'Inflation surge' },
      { year: 2023, averageRate: 7.09, volatility: 0.9, marketCondition: 'Peak rates' },
      { year: 2024, averageRate: 6.75, volatility: 0.6, marketCondition: 'Stabilization' }
    ]
  },
  {
    id: 'variable',
    name: 'Variable Rate',
    type: 'variable',
    initialRate: 6.25,
    description: 'Rates that flow with market currents, offering thrills and potential savings',
    pros: ['Lower initial rate', 'Benefit from rate decreases', 'Easier qualification', 'Potential savings', 'Market flexibility'],
    cons: ['Payment uncertainty', 'Risk of rate increases', 'Budgeting challenges', 'Stress from volatility'],
    riskLevel: 'high',
    marketShare: 12,
    color: '#10B981',
    icon: Waves,
    historicalPerformance: [
      { year: 2020, averageRate: 2.15, volatility: 1.2, marketCondition: 'Historic lows' },
      { year: 2021, averageRate: 2.46, volatility: 1.8, marketCondition: 'Gradual increase' },
      { year: 2022, averageRate: 4.84, volatility: 2.4, marketCondition: 'Rapid rise' },
      { year: 2023, averageRate: 6.59, volatility: 1.6, marketCondition: 'Peak volatility' },
      { year: 2024, averageRate: 6.25, volatility: 1.1, marketCondition: 'Moderating' }
    ]
  },
  {
    id: 'adjustable',
    name: '5/1 Adjustable',
    type: 'adjustable',
    initialRate: 6.15,
    adjustmentPeriod: 60,
    capRate: 10.15,
    floorRate: 4.15,
    description: 'Fixed for 5 years, then adjusts annually. Best of both worlds for medium-term planning',
    pros: ['Lower initial rate than fixed', '5 years of payment stability', 'Rate caps protect against extreme increases', 'Good for medium-term ownership'],
    cons: ['Rate uncertainty after 5 years', 'Potential payment shock', 'Complex terms', 'Refinancing risk'],
    riskLevel: 'medium',
    marketShare: 3,
    color: '#F59E0B',
    icon: Shield,
    historicalPerformance: [
      { year: 2020, averageRate: 2.45, volatility: 0.8, marketCondition: 'ARM revival' },
      { year: 2021, averageRate: 2.76, volatility: 1.1, marketCondition: 'Growing popularity' },
      { year: 2022, averageRate: 4.19, volatility: 1.9, marketCondition: 'Market shift' },
      { year: 2023, averageRate: 5.89, volatility: 1.3, marketCondition: 'Cooling demand' },
      { year: 2024, averageRate: 6.15, volatility: 0.9, marketCondition: 'Niche product' }
    ]
  }
];

// Advanced Economic Modeling Engine
const generateAdvancedEconomicIndicators = (month: number): EconomicIndicator[] => {
  const cyclePosition = (month / 12) % 8; // 8-year economic cycle
  const indicators: EconomicIndicator[] = [
    {
      name: 'Federal Funds Rate',
      value: 5.25 + Math.sin(cyclePosition * Math.PI / 4) * 2,
      trend: cyclePosition < 2 ? 'up' : cyclePosition < 6 ? 'stable' : 'down',
      impact: cyclePosition < 3 ? 'negative' : 'positive',
      weight: 0.4
    },
    {
      name: 'Inflation (CPI)',
      value: 3.2 + Math.cos(cyclePosition * Math.PI / 3) * 1.8,
      trend: cyclePosition < 1.5 || cyclePosition > 6.5 ? 'up' : 'down',
      impact: cyclePosition > 4 ? 'negative' : 'positive',
      weight: 0.25
    },
    {
      name: 'Unemployment Rate',
      value: 4.1 + Math.sin((cyclePosition + 1) * Math.PI / 4) * 1.5,
      trend: cyclePosition > 2 && cyclePosition < 5 ? 'up' : 'down',
      impact: cyclePosition < 3 || cyclePosition > 6 ? 'positive' : 'negative',
      weight: 0.15
    },
    {
      name: 'GDP Growth',
      value: 2.1 + Math.cos(cyclePosition * Math.PI / 2) * 1.2,
      trend: cyclePosition < 4 ? 'up' : 'down',
      impact: cyclePosition < 2 || cyclePosition > 6 ? 'positive' : 'neutral',
      weight: 0.1
    },
    {
      name: '10-Year Treasury',
      value: 4.15 + Math.sin(cyclePosition * Math.PI / 3) * 1.8,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      impact: 'neutral',
      weight: 0.1
    }
  ];
  
  return indicators;
};

const generateCentralBankPolicy = (month: number): CentralBankPolicy => {
  const cyclePosition = (month / 12) % 8;
  const baseRate = 5.25;
  
  let stance: CentralBankPolicy['stance'] = 'neutral';
  let probabilities = { raise: 0.2, hold: 0.6, cut: 0.2 };
  
  if (cyclePosition < 2) {
    stance = 'hawkish';
    probabilities = { raise: 0.7, hold: 0.25, cut: 0.05 };
  } else if (cyclePosition > 6) {
    stance = 'dovish';
    probabilities = { raise: 0.05, hold: 0.25, cut: 0.7 };
  }
  
  return {
    currentRate: baseRate,
    nextMeetingDate: new Date(Date.now() + (45 - (month % 45)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    stance,
    probability: probabilities
  };
};

// Advanced Risk Assessment Engine
const calculateRiskAssessment = (loanDetails: LoanDetails, personalFactors: PersonalizedFactors, timelineData: RateTimelineStep[]): RiskAssessment => {
  const maxVariableRate = Math.max(...timelineData.map(step => step.variableRate));
  const currentPayment = calculateMonthlyPayment(loanDetails.principal, 6.25 / 100, loanDetails.termYears * 12);
  const maxPayment = calculateMonthlyPayment(loanDetails.principal, maxVariableRate / 100, loanDetails.termYears * 12);
  const paymentShock = ((maxPayment - currentPayment) / currentPayment) * 100;
  
  const stressTests: StressTestResult[] = [
    {
      scenario: 'Recession + Rate Cuts',
      maxRate: 4.5,
      maxPayment: calculateMonthlyPayment(loanDetails.principal, 4.5 / 100, loanDetails.termYears * 12),
      affordabilityRisk: 'low'
    },
    {
      scenario: 'Inflation Surge',
      maxRate: 9.5,
      maxPayment: calculateMonthlyPayment(loanDetails.principal, 9.5 / 100, loanDetails.termYears * 12),
      affordabilityRisk: paymentShock > 30 ? 'high' : paymentShock > 15 ? 'medium' : 'low'
    },
    {
      scenario: 'Gradual Normalization',
      maxRate: 7.25,
      maxPayment: calculateMonthlyPayment(loanDetails.principal, 7.25 / 100, loanDetails.termYears * 12),
      affordabilityRisk: paymentShock > 20 ? 'medium' : 'low'
    }
  ];
  
  const scenarios: ScenarioResult[] = [
    {
      name: 'Rates Fall 2%',
      probability: 0.25,
      outcomeFixed: 0,
      outcomeVariable: 85000,
      difference: 85000
    },
    {
      name: 'Rates Stay Stable',
      probability: 0.4,
      outcomeFixed: 0,
      outcomeVariable: 15000,
      difference: 15000
    },
    {
      name: 'Rates Rise 2%',
      probability: 0.35,
      outcomeFixed: 0,
      outcomeVariable: -65000,
      difference: -65000
    }
  ];
  
  const probabilityOfRegret = personalFactors.riskTolerance === 'conservative' ? 0.4 : 
                              personalFactors.riskTolerance === 'moderate' ? 0.25 : 0.15;
  
  return {
    paymentShock,
    probabilityOfRegret,
    stressTestResults: stressTests,
    scenarioAnalysis: scenarios
  };
};

// Generate realistic rate timeline with economic cycles
const generateRateTimeline = (loanDetails: LoanDetails): RateTimelineStep[] => {
  const steps: RateTimelineStep[] = [];
  const totalMonths = loanDetails.termYears * 12;
  
  let fixedRate = 6.75;
  let variableRate = 6.25;
  let totalInterestFixed = 0;
  let totalInterestVariable = 0;
  let cumulativeSavings = 0;
  
  const monthlyPaymentFixed = calculateMonthlyPayment(loanDetails.principal, fixedRate / 100, totalMonths);
  
  for (let month = 0; month < Math.min(totalMonths, 120); month++) { // 10 years for simulation
    // Economic cycles: simulate realistic rate movements
    const yearProgress = (month % 12) / 12;
    const cyclePosition = (month / 12) % 8; // 8-year economic cycle
    
    // Variable rate changes based on economic conditions
    let rateChange = 0;
    let weatherCondition: EconomicWeather['condition'] = 'calm';
    let temperature: EconomicWeather['temperature'] = 'warm';
    let forecast: EconomicWeather['forecast'] = 'stable';
    let weatherDescription = '';
    let weatherImpact = '';
    let severity = 20;
    
    // Major economic events and cycles
    if (month === 18) {
      rateChange = 0.75; // Fed rate hike
      weatherCondition = 'windy';
      temperature = 'hot';
      forecast = 'rising';
      weatherDescription = 'Fed tightening monetary policy';
      weatherImpact = 'Rates rising due to inflation concerns';
      severity = 60;
    } else if (month === 36) {
      rateChange = -0.5;
      weatherCondition = 'stormy';
      temperature = 'cool';
      forecast = 'falling';
      weatherDescription = 'Economic uncertainty emerging';
      weatherImpact = 'Market volatility driving rates down';
      severity = 45;
    } else if (month === 54) {
      rateChange = -1.25;
      weatherCondition = 'hurricane';
      temperature = 'cold';
      forecast = 'falling';
      weatherDescription = 'Recession indicators flashing';
      weatherImpact = 'Emergency rate cuts to stimulate economy';
      severity = 85;
    } else if (month === 72) {
      rateChange = 0.25;
      weatherCondition = 'calm';
      temperature = 'warm';
      forecast = 'rising';
      weatherDescription = 'Recovery beginning to take hold';
      weatherImpact = 'Gradual normalization of rates';
      severity = 25;
    } else if (month === 90) {
      rateChange = 0.5;
      weatherCondition = 'windy';
      temperature = 'hot';
      forecast = 'volatile';
      weatherDescription = 'Strong economic growth phase';
      weatherImpact = 'Rates rising with economic expansion';
      severity = 55;
    } else {
      // Minor monthly fluctuations
      rateChange = (Math.random() - 0.5) * 0.15;
      const rand = Math.random();
      if (rand > 0.8) {
        weatherCondition = 'windy';
        severity = 40;
      } else if (rand > 0.95) {
        weatherCondition = 'stormy';
        severity = 70;
      }
    }
    
    variableRate = Math.max(3.0, Math.min(12.0, variableRate + rateChange));
    
    const monthlyPaymentVariable = calculateMonthlyPayment(loanDetails.principal, variableRate / 100, totalMonths);
    
    // Calculate interest portions
    const remainingBalance = loanDetails.principal; // Simplified for display
    const monthlyInterestFixed = (remainingBalance * fixedRate) / (100 * 12);
    const monthlyInterestVariable = (remainingBalance * variableRate) / (100 * 12);
    
    totalInterestFixed += monthlyInterestFixed;
    totalInterestVariable += monthlyInterestVariable;
    
    const monthlySavings = monthlyPaymentFixed - monthlyPaymentVariable;
    cumulativeSavings += monthlySavings;
    
    // Market events
    const marketEvents: string[] = [];
    if (month === 12) marketEvents.push('Fed signals rate normalization');
    if (month === 24) marketEvents.push('Inflation reaches multi-year high');
    if (month === 36) marketEvents.push('Geopolitical tensions emerge');
    if (month === 48) marketEvents.push('Employment data shows weakness');
    if (month === 60) marketEvents.push('Central bank pivots to easing');
    if (month === 72) marketEvents.push('Economic indicators improve');
    if (month === 84) marketEvents.push('Consumer spending rebounds');
    if (month === 96) marketEvents.push('Wage growth accelerates');
    
    // Weather icon selection
    let weatherIcon = Sun;
    if (weatherCondition === 'windy') weatherIcon = Wind;
    else if (weatherCondition === 'stormy') weatherIcon = CloudRain;
    else if (weatherCondition === 'hurricane') weatherIcon = Zap;
    
    const economicIndicators = generateAdvancedEconomicIndicators(month);
    const centralBankPolicy = generateCentralBankPolicy(month);
    const forecastConfidence = Math.max(60, 95 - (severity * 0.4));
    
    const economicWeather: EconomicWeather = {
      condition: weatherCondition,
      temperature,
      forecast,
      description: weatherDescription || 'Steady economic conditions',
      impact: weatherImpact || 'Minimal rate volatility expected',
      icon: weatherIcon,
      severity,
      confidence: forecastConfidence,
      economicIndicators,
      centralBankPolicy
    };
    
    steps.push({
      month,
      fixedRate,
      variableRate,
      economicWeather,
      marketEvents,
      totalInterestFixed,
      totalInterestVariable,
      monthlySavings,
      cumulativeSavings
    });
  }
  
  return steps;
};

const calculateMonthlyPayment = (principal: number, monthlyRate: number, months: number): number => {
  if (monthlyRate === 0) return principal / months;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
};

// Advanced Economic Dashboard
const EconomicDashboard = ({ 
  currentStep 
}: { 
  currentStep: RateTimelineStep | null;
}) => {
  if (!currentStep) return null;
  
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-400" />
        Economic Intelligence Dashboard
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {currentStep.economicWeather.economicIndicators.map((indicator, idx) => (
          <motion.div
            key={indicator.name}
            className="p-4 bg-white/5 rounded-2xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{indicator.name}</span>
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  indicator.trend === 'up' ? 'bg-green-400' :
                  indicator.trend === 'down' ? 'bg-red-400' : 'bg-yellow-400'
                }`}
                animate={indicator.trend !== 'stable' ? {
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {indicator.value.toFixed(1)}%
            </div>
            <div className={`text-xs ${
              indicator.impact === 'positive' ? 'text-green-400' :
              indicator.impact === 'negative' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {indicator.impact === 'positive' ? '↗ Positive' :
               indicator.impact === 'negative' ? '↘ Negative' : '→ Neutral'}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Central Bank Policy */}
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-white">Fed Policy Outlook</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            currentStep.economicWeather.centralBankPolicy.stance === 'hawkish' ? 'bg-red-500/20 text-red-400' :
            currentStep.economicWeather.centralBankPolicy.stance === 'dovish' ? 'bg-green-500/20 text-green-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {currentStep.economicWeather.centralBankPolicy.stance.toUpperCase()}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-400">Rate Hike</div>
            <div className="text-lg font-bold text-red-400">
              {Math.round(currentStep.economicWeather.centralBankPolicy.probability.raise * 100)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Hold Steady</div>
            <div className="text-lg font-bold text-yellow-400">
              {Math.round(currentStep.economicWeather.centralBankPolicy.probability.hold * 100)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Rate Cut</div>
            <div className="text-lg font-bold text-green-400">
              {Math.round(currentStep.economicWeather.centralBankPolicy.probability.cut * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Rate River Visualization
const RateRiver = ({ 
  currentStep, 
  isPlaying, 
  onStepSelect 
}: { 
  currentStep: RateTimelineStep | null;
  isPlaying: boolean;
  onStepSelect: (month: number) => void;
}) => {
  const riverRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, { damping: 20, stiffness: 100 });
  const rotateY = useSpring(mouseX, { damping: 20, stiffness: 100 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!riverRef.current) return;
    
    const rect = riverRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) * 0.1);
    mouseY.set((e.clientY - centerY) * 0.1);
  };
  
  if (!currentStep) return null;
  
  const weatherIntensity = currentStep.economicWeather.severity / 100;
  const WeatherIcon = currentStep.economicWeather.icon;
  
  return (
    <div className="relative w-full h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-green-900/20 border border-white/10">
      <div 
        ref={riverRef}
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
        style={{
          perspective: '1000px'
        }}
      >
        {/* River base */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-cyan-500/40 to-green-500/30"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d'
          }}
          animate={{
            background: [
              'linear-gradient(90deg, #2563EB50, #06B6D480, #10B98150)',
              'linear-gradient(90deg, #1D4ED850, #0891B260, #059F4650)',
              'linear-gradient(90deg, #2563EB50, #06B6D480, #10B98150)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Water flow lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                top: `${20 + i * 10}%`,
                left: '-10%',
                width: '120%',
                transform: `rotate(${-5 + Math.random() * 10}deg)`
              }}
              animate={{
                x: ['0%', '100%'],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
        
        {/* Enhanced Rate boats with more scenarios */}
        <div className="absolute inset-0 flex items-center justify-around px-8">
          {rateScenarios.map((scenario, idx) => {
            let currentRate = scenario.type === 'fixed' ? currentStep.fixedRate :
                             scenario.type === 'variable' ? currentStep.variableRate :
                             currentStep.variableRate + 0.1; // ARM slightly different
            
            const ScenarioIcon = scenario.icon;
            
            return (
              <motion.div
                key={scenario.id}
                className="relative"
                animate={isPlaying ? {
                  y: scenario.type === 'fixed' ? [0, -6, 0] : [0, -12 * weatherIntensity, 0],
                  rotateZ: scenario.type === 'fixed' ? [-1, 1, -1] : [-5 * weatherIntensity, 5 * weatherIntensity, -5 * weatherIntensity],
                  x: scenario.type === 'variable' ? [-3 * weatherIntensity, 3 * weatherIntensity, -3 * weatherIntensity] : 0
                } : {}}
                transition={{ duration: scenario.type === 'fixed' ? 3 : 1.8, repeat: Infinity }}
              >
                <div 
                  className="w-20 h-14 rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${scenario.color}, ${scenario.color}dd)` }}
                >
                  <ScenarioIcon className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                  
                  {/* Risk level indicator */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                    scenario.riskLevel === 'low' ? 'bg-green-400' :
                    scenario.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  
                  {/* Rate indicator with dynamic styling */}
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs text-white font-medium"
                    style={{ backgroundColor: `${scenario.color}cc` }}
                    animate={scenario.type !== 'fixed' ? {
                      scale: [1, 1.1 + weatherIntensity * 0.15, 1],
                      y: [-2 * weatherIntensity, 2 * weatherIntensity, -2 * weatherIntensity]
                    } : {
                      scale: [1, 1.03, 1]
                    }}
                    transition={{ duration: scenario.type === 'fixed' ? 3 : 1.5, repeat: Infinity }}
                  >
                    {currentRate.toFixed(2)}%
                  </motion.div>
                </div>
                
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                  <div className="text-xs font-medium" style={{ color: scenario.color }}>
                    {scenario.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {scenario.marketShare}% market
                  </div>
                  <div className={`text-xs mt-1 ${
                    scenario.riskLevel === 'low' ? 'text-green-400' :
                    scenario.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {scenario.riskLevel} risk
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Weather overlay */}
        <div className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <WeatherIcon className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-medium capitalize">
              {currentStep.economicWeather.condition}
            </span>
          </div>
          <div className="text-xs text-gray-300">
            {currentStep.economicWeather.description}
          </div>
        </div>
        
        {/* Wave intensity effects */}
        {weatherIntensity > 0.3 && (
          <div className="absolute inset-0">
            {Array.from({ length: Math.floor(weatherIntensity * 10) }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Timeline Navigator Component
const TimelineNavigator = ({ 
  timelineData, 
  currentMonth, 
  onMonthChange,
  isPlaying,
  onPlayToggle 
}: {
  timelineData: RateTimelineStep[];
  currentMonth: number;
  onMonthChange: (month: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Rate Timeline Navigator</h3>
        <div className="flex items-center gap-4">
          <motion.button
            className={`p-3 rounded-xl border transition-all ${
              isPlaying 
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-green-500/20 border-green-500/40 text-green-300'
            }`}
            onClick={onPlayToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </motion.button>
          
          <motion.button
            className="p-3 rounded-xl border border-white/20 bg-white/10 text-gray-300 hover:text-white transition-all"
            onClick={() => onMonthChange(0)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="relative mb-6">
        <input
          type="range"
          min="0"
          max={timelineData.length - 1}
          value={currentMonth}
          onChange={(e) => onMonthChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div 
          className="absolute top-0 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-lg pointer-events-none"
          style={{ width: `${(currentMonth / (timelineData.length - 1)) * 100}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400">Current Month</div>
          <div className="text-lg font-bold text-white">{currentMonth + 1}</div>
        </div>
        
        <div>
          <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400">Years Elapsed</div>
          <div className="text-lg font-bold text-white">{Math.floor(currentMonth / 12) + 1}</div>
        </div>
        
        <div>
          <ThermometerSun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400">Market Temp</div>
          <div className="text-lg font-bold text-white capitalize">
            {timelineData[currentMonth]?.economicWeather.temperature || 'Warm'}
          </div>
        </div>
        
        <div>
          <Compass className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-sm text-gray-400">Rate Trend</div>
          <div className="text-lg font-bold text-white capitalize">
            {timelineData[currentMonth]?.economicWeather.forecast || 'Stable'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Advanced Risk Assessment Component
const RiskAssessmentPanel = ({ 
  riskAssessment, 
  loanDetails 
}: { 
  riskAssessment: RiskAssessment;
  loanDetails: LoanDetails;
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-yellow-400" />
        Risk Assessment & Stress Testing
      </h3>
      
      {/* Payment Shock Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl border border-red-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-red-400" />
            <div>
              <h4 className="text-lg font-semibold text-white">Maximum Payment Shock</h4>
              <p className="text-sm text-gray-400">Worst-case scenario increase</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-red-400 mb-2">
            +{riskAssessment.paymentShock.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-300">
            Your payment could increase by up to ${(calculateMonthlyPayment(loanDetails.principal, 6.25 / 100, loanDetails.termYears * 12) * riskAssessment.paymentShock / 100).toLocaleString()}/month
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-purple-400" />
            <div>
              <h4 className="text-lg font-semibold text-white">Probability of Regret</h4>
              <p className="text-sm text-gray-400">Chance of wishing you chose differently</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {Math.round(riskAssessment.probabilityOfRegret * 100)}%
          </div>
          <div className="text-sm text-gray-300">
            Based on your risk profile and market volatility
          </div>
        </div>
      </div>
      
      {/* Stress Test Results */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-white mb-4">Stress Test Scenarios</h4>
        <div className="space-y-4">
          {riskAssessment.stressTestResults.map((test, idx) => (
            <motion.div
              key={test.scenario}
              className="p-4 bg-white/5 rounded-2xl border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{test.scenario}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  test.affordabilityRisk === 'low' ? 'bg-green-500/20 text-green-400' :
                  test.affordabilityRisk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {test.affordabilityRisk.toUpperCase()} RISK
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Max Rate: </span>
                  <span className="text-white font-medium">{test.maxRate.toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Max Payment: </span>
                  <span className="text-white font-medium">${test.maxPayment.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Scenario Analysis */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Future Scenarios Analysis</h4>
        <div className="space-y-3">
          {riskAssessment.scenarioAnalysis.map((scenario, idx) => (
            <motion.div
              key={scenario.name}
              className="p-4 bg-white/5 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-white">{scenario.name}</span>
                  <span className="text-xs text-gray-400">{Math.round(scenario.probability * 100)}% likely</span>
                </div>
                <div className={`text-lg font-bold ${
                  scenario.difference > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {scenario.difference > 0 ? '+' : ''}${scenario.difference.toLocaleString()}
                </div>
              </div>
              
              {/* Probability bar */}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${scenario.probability * 100}%` }}
                  transition={{ duration: 1, delay: idx * 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Personalized Recommendation Engine
const PersonalizedRecommendation = ({ 
  personalFactors, 
  riskAssessment, 
  timelineData 
}: { 
  personalFactors: PersonalizedFactors;
  riskAssessment: RiskAssessment;
  timelineData: RateTimelineStep[];
}) => {
  const finalStep = timelineData[timelineData.length - 1];
  const totalSavings = finalStep.cumulativeSavings;
  
  const getPersonalizedRecommendation = () => {
    // Weight factors based on personal preferences
    const riskWeight = personalFactors.riskTolerance === 'conservative' ? 0.6 : 
                      personalFactors.riskTolerance === 'moderate' ? 0.4 : 0.2;
    const savingsWeight = 1 - riskWeight;
    
    const riskScore = riskAssessment.paymentShock / 100 * riskWeight;
    const savingsScore = Math.max(0, totalSavings / 100000) * savingsWeight;
    
    const overallScore = savingsScore - riskScore;
    
    let recommendation: 'fixed' | 'variable' | 'adjustable' = 'fixed';
    let confidence = 0.7;
    let reasons: string[] = [];
    
    if (overallScore > 0.3) {
      recommendation = personalFactors.timeHorizon < 5 ? 'adjustable' : 'variable';
      confidence = Math.min(0.95, 0.7 + overallScore);
      reasons = [
        `Your ${personalFactors.riskTolerance} risk tolerance aligns with potential savings`,
        'Market conditions favor rate flexibility',
        `${personalFactors.timeHorizon}-year time horizon supports this choice`,
        'Stress test results show manageable payment increases'
      ];
    } else if (overallScore < -0.2) {
      recommendation = 'fixed';
      confidence = Math.min(0.95, 0.7 + Math.abs(overallScore));
      reasons = [
        'Payment stability aligns with your conservative approach',
        'Protection from potential rate increases',
        'Simplified budgeting and financial planning',
        'Lower stress from payment uncertainty'
      ];
    } else {
      recommendation = 'adjustable';
      confidence = 0.75;
      reasons = [
        'Hybrid approach balances risk and reward',
        'Initial period provides payment certainty',
        'Flexibility for future refinancing options',
        'Moderate risk profile supports this strategy'
      ];
    }
    
    return { recommendation, confidence, reasons, overallScore };
  };
  
  const personalRec = getPersonalizedRecommendation();
  const recommendedScenario = rateScenarios.find(s => s.type === personalRec.recommendation);
  
  return (
    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8">
      <div className="text-center mb-8">
        <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-4">Your Personalized Recommendation</h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          {recommendedScenario && (
            <div className="flex items-center gap-3 px-6 py-3 rounded-full border" 
                 style={{ backgroundColor: `${recommendedScenario.color}20`, borderColor: `${recommendedScenario.color}40` }}>
              <recommendedScenario.icon className="w-6 h-6" style={{ color: recommendedScenario.color }} />
              <span className="text-xl font-bold text-white">
                {recommendedScenario.name.toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-2xl font-bold text-white">
            {Math.round(personalRec.confidence * 100)}% Match
          </div>
        </div>
      </div>
      
      {/* Personal Factors Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="text-center p-4 bg-white/5 rounded-2xl">
          <div className="text-sm text-gray-400 mb-1">Risk Tolerance</div>
          <div className={`text-lg font-bold ${
            personalFactors.riskTolerance === 'conservative' ? 'text-blue-400' :
            personalFactors.riskTolerance === 'moderate' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {personalFactors.riskTolerance}
          </div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-2xl">
          <div className="text-sm text-gray-400 mb-1">Time Horizon</div>
          <div className="text-lg font-bold text-white">
            {personalFactors.timeHorizon} years
          </div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-2xl">
          <div className="text-sm text-gray-400 mb-1">Payment Style</div>
          <div className="text-lg font-bold text-white capitalize">
            {personalFactors.paymentStability}
          </div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-2xl">
          <div className="text-sm text-gray-400 mb-1">Market View</div>
          <div className="text-lg font-bold text-white capitalize">
            {personalFactors.marketOutlook}
          </div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-2xl">
          <div className="text-sm text-gray-400 mb-1">Match Score</div>
          <div className="text-lg font-bold text-green-400">
            {Math.round((personalRec.overallScore + 0.5) * 100)}/100
          </div>
        </div>
      </div>
      
      {/* Reasoning */}
      <div className="p-6 bg-white/5 rounded-2xl">
        <h4 className="text-lg font-semibold text-white mb-4">Why this recommendation?</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {personalRec.reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
            >
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{reason}</span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Financial Goals Alignment */}
      <div className="mt-6 p-4 bg-white/5 rounded-2xl">
        <h4 className="text-sm font-semibold text-white mb-3">Goals Alignment</h4>
        <div className="flex flex-wrap gap-2">
          {personalFactors.financialGoals.map((goal, idx) => (
            <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
              {goal}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function RateNavigatorPage() {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineData] = useState(() => generateRateTimeline(mockLoanDetails));
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [personalFactors] = useState(mockPersonalFactors);
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  const [riskAssessment] = useState(() => calculateRiskAssessment(mockLoanDetails, mockPersonalFactors, generateRateTimeline(mockLoanDetails)));

  const currentStep = timelineData[currentMonth];
  const maxMonths = timelineData.length;

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentMonth < maxMonths - 1) {
      interval = setInterval(() => {
        setCurrentMonth(prev => Math.min(prev + 1, maxMonths - 1));
      }, 1000);
    } else if (currentMonth >= maxMonths - 1) {
      setIsPlaying(false);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentMonth, maxMonths]);

  const calculateRecommendation = () => {
    const finalStep = timelineData[timelineData.length - 1];
    const totalSavings = finalStep.cumulativeSavings;
    const volatilityRisk = timelineData.reduce((acc, step) => 
      acc + Math.abs(step.variableRate - step.fixedRate), 0) / timelineData.length;
    
    return {
      recommendation: totalSavings > 0 ? 'variable' : 'fixed',
      confidence: Math.min(0.95, 0.6 + Math.abs(totalSavings) / 50000),
      totalSavings: Math.abs(totalSavings),
      volatilityRisk,
      reasons: totalSavings > 0 
        ? ['Lower average rates over time', 'Significant total savings', 'Manageable payment fluctuations']
        : ['Rate stability provides peace of mind', 'Protection from rate increases', 'Predictable monthly budgeting']
    };
  };

  const recommendation = calculateRecommendation();

  return (
    <PageLayout>
      <TimeBasedBackground>
        <MagneticCursor />
        
        <div className="min-h-screen">
          {/* Header */}
          <motion.div
            className="max-w-7xl mx-auto px-6 py-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.button
                className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                onClick={() => window.history.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div>
                <h1 className="text-3xl font-bold text-white">Rate Timeline Navigator</h1>
                <p className="text-gray-400">Navigate the interest rate rapids with economic forecasts</p>
              </div>
            </div>

            {/* Loan Details Panel */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {mockLoanDetails.loanType} Analysis
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Principal Amount</div>
                      <div className="text-xl font-bold text-white">
                        ${mockLoanDetails.principal.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Loan Term</div>
                      <div className="text-xl font-bold text-white">
                        {mockLoanDetails.termYears} years
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Current Spread</div>
                      <div className="text-xl font-bold text-white">
                        {(6.75 - 6.25).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Recommendation */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                      recommendation.recommendation === 'fixed'
                        ? 'bg-blue-500/20 border border-blue-500/40'
                        : 'bg-green-500/20 border border-green-500/40'
                    }`}>
                      {recommendation.recommendation === 'fixed' ? (
                        <>
                          <Anchor className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 font-semibold">Recommend: FIXED</span>
                        </>
                      ) : (
                        <>
                          <Waves className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 font-semibold">Recommend: VARIABLE</span>
                        </>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {Math.round(recommendation.confidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div className="text-xs text-green-400 mt-2">
                      ${recommendation.totalSavings.toLocaleString()} potential savings
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Economic Dashboard */}
          <EconomicDashboard currentStep={currentStep} />
          
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {/* Rate River Visualization */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Interest Rate River Rapids
              </h2>
              <RateRiver
                currentStep={currentStep}
                isPlaying={isPlaying}
                onStepSelect={setCurrentMonth}
              />
            </motion.div>

            {/* Timeline Navigator */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <TimelineNavigator
                timelineData={timelineData}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                isPlaying={isPlaying}
                onPlayToggle={() => setIsPlaying(!isPlaying)}
              />
            </motion.div>

            {/* Current Step Details */}
            {currentStep && (
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {/* Rate Comparison */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Rate Comparison</h3>
                  
                  <div className="space-y-6">
                    {/* Fixed Rate */}
                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Anchor className="w-6 h-6 text-blue-400" />
                          <span className="text-blue-300 font-semibold">Fixed Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {currentStep.fixedRate.toFixed(2)}%
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Monthly Payment: ${calculateMonthlyPayment(
                          mockLoanDetails.principal, 
                          currentStep.fixedRate / 100, 
                          mockLoanDetails.termYears * 12
                        ).toLocaleString()}
                      </div>
                    </div>

                    {/* Variable Rate */}
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Waves className="w-6 h-6 text-green-400" />
                          <span className="text-green-300 font-semibold">Variable Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {currentStep.variableRate.toFixed(2)}%
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Monthly Payment: ${calculateMonthlyPayment(
                          mockLoanDetails.principal, 
                          currentStep.variableRate / 100, 
                          mockLoanDetails.termYears * 12
                        ).toLocaleString()}
                      </div>
                    </div>

                    {/* Savings Indicator */}
                    <div className={`p-4 rounded-xl border ${
                      currentStep.monthlySavings > 0 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : 'bg-red-500/10 border-red-500/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Monthly Difference</span>
                        <span className={`font-bold ${
                          currentStep.monthlySavings > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {currentStep.monthlySavings > 0 ? '+' : ''}
                          ${currentStep.monthlySavings.toFixed(0)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Cumulative: {currentStep.cumulativeSavings > 0 ? '+' : ''}
                        ${currentStep.cumulativeSavings.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Economic Weather & Events */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Economic Weather</h3>
                  
                  <div className="space-y-6">
                    {/* Weather Status */}
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          currentStep.economicWeather.condition === 'calm' ? 'bg-blue-500/20' :
                          currentStep.economicWeather.condition === 'windy' ? 'bg-yellow-500/20' :
                          currentStep.economicWeather.condition === 'stormy' ? 'bg-orange-500/20' :
                          'bg-red-500/20'
                        }`}>
                          <currentStep.economicWeather.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white capitalize">
                            {currentStep.economicWeather.condition} Conditions
                          </h4>
                          <p className="text-sm text-gray-400">
                            {currentStep.economicWeather.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-sm text-gray-300">
                          {currentStep.economicWeather.impact}
                        </div>
                      </div>
                    </div>

                    {/* Market Events */}
                    {currentStep.marketEvents.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-white">Market Events</h4>
                        {currentStep.marketEvents.map((event, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{event}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Advanced Analysis Toggle */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAdvancedAnalysis ? 'Hide' : 'Show'} Advanced Analysis & Risk Assessment
              </motion.button>
            </motion.div>
            
            {/* Advanced Analysis Panels */}
            <AnimatePresence>
              {showAdvancedAnalysis && (
                <motion.div
                  className="space-y-8 mb-8"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Personalized Recommendation */}
                  <PersonalizedRecommendation
                    personalFactors={personalFactors}
                    riskAssessment={riskAssessment}
                    timelineData={timelineData}
                  />
                  
                  {/* Risk Assessment */}
                  <RiskAssessmentPanel
                    riskAssessment={riskAssessment}
                    loanDetails={mockLoanDetails}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Final Recommendation */}
            {currentMonth >= maxMonths - 1 && (
              <motion.div
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center mb-8">
                  <Navigation className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">Navigation Complete!</h2>
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
                    recommendation.recommendation === 'fixed'
                      ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                      : 'bg-green-500/20 border border-green-500/40 text-green-300'
                  }`}>
                    {recommendation.recommendation === 'fixed' ? 'FIXED' : 'VARIABLE'} Rate is your best choice
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                  <div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {Math.round(recommendation.confidence * 100)}%
                    </div>
                    <div className="text-gray-400">Confidence Level</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      ${recommendation.totalSavings.toLocaleString()}
                    </div>
                    <div className="text-gray-400">Potential Savings</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-yellow-400 mb-2">
                      {recommendation.volatilityRisk.toFixed(1)}%
                    </div>
                    <div className="text-gray-400">Average Rate Spread</div>
                  </div>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Why {recommendation.recommendation.toUpperCase()}?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendation.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}