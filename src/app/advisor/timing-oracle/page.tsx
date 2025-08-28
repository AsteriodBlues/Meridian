'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import { 
  Clock, ArrowLeft, Play, Pause, RotateCcw, TrendingUp, 
  TrendingDown, DollarSign, Calendar, Zap, Target, 
  TreePine, Sparkles, Eye, Gem, Hourglass,
  ArrowRight, ArrowUp, ArrowDown, AlertTriangle,
  CheckCircle, Award, Lightbulb, Timer, MapPin,
  Telescope, Compass, Star, Moon, Sun
} from 'lucide-react';

// Investment scenario interfaces
interface InvestmentScenario {
  id: string;
  name: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  expectedReturn: number; // annual %
  volatility: number; // standard deviation
  category: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon: number; // years
}

interface TimelineEvent {
  month: number;
  type: 'market_up' | 'market_down' | 'economic_event' | 'milestone';
  description: string;
  impact: number; // -1 to 1
  severity: 'low' | 'medium' | 'high';
}

interface TimeMachineStep {
  month: number;
  year: number;
  investNowValue: number;
  waitValue: number; // if waited and invested later
  opportunityCost: number;
  marketCondition: 'bull' | 'bear' | 'volatile' | 'stable';
  economicPhase: 'expansion' | 'peak' | 'contraction' | 'trough';
  events: TimelineEvent[];
  seasonalFactor: number;
  compoundGrowth: number;
}

const mockInvestmentScenario: InvestmentScenario = {
  id: 'balanced-portfolio',
  name: 'Balanced Investment Portfolio',
  description: 'Diversified mix of stocks and bonds with moderate growth potential',
  initialAmount: 10000,
  monthlyContribution: 500,
  expectedReturn: 7.5, // 7.5% annual return
  volatility: 0.15, // 15% volatility
  category: 'moderate',
  timeHorizon: 20
};

// Generate market simulation with realistic cycles
const generateTimeMachineData = (scenario: InvestmentScenario): TimeMachineStep[] => {
  const steps: TimeMachineStep[] = [];
  const totalMonths = scenario.timeHorizon * 12;
  
  let investNowValue = scenario.initialAmount;
  let delayedStart = false;
  let delayedValue = 0;
  const delayMonths = 12; // Wait 1 year before investing
  
  for (let month = 0; month < totalMonths; month++) {
    const year = Math.floor(month / 12);
    
    // Economic cycles (8-year cycle)
    const cyclePosition = (month / 12) % 8;
    let economicPhase: TimeMachineStep['economicPhase'] = 'expansion';
    
    if (cyclePosition < 2) economicPhase = 'expansion';
    else if (cyclePosition < 3) economicPhase = 'peak';
    else if (cyclePosition < 5) economicPhase = 'contraction';
    else economicPhase = 'trough';
    
    // Market conditions based on economic phase
    let marketCondition: TimeMachineStep['marketCondition'] = 'stable';
    if (economicPhase === 'expansion') marketCondition = 'bull';
    else if (economicPhase === 'contraction') marketCondition = 'bear';
    else if (economicPhase === 'peak' || economicPhase === 'trough') marketCondition = 'volatile';
    
    // Seasonal factors
    const seasonalFactor = 1 + 0.05 * Math.sin((month % 12) * Math.PI / 6); // Slight seasonal variation
    
    // Market return calculation with volatility
    let monthlyReturn = (scenario.expectedReturn / 100) / 12;
    
    // Add volatility based on market conditions
    const volatilityMultiplier = {
      bull: 0.8,
      stable: 1.0,
      volatile: 1.5,
      bear: 1.2
    }[marketCondition];
    
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    const volatility = scenario.volatility * volatilityMultiplier * randomFactor;
    monthlyReturn += volatility / 12;
    
    // Apply seasonal factor
    monthlyReturn *= seasonalFactor;
    
    // Calculate investment values
    // Invest now scenario
    investNowValue = (investNowValue + scenario.monthlyContribution) * (1 + monthlyReturn);
    
    // Wait scenario
    if (month >= delayMonths) {
      if (!delayedStart) {
        delayedValue = scenario.initialAmount;
        delayedStart = true;
      }
      delayedValue = (delayedValue + scenario.monthlyContribution) * (1 + monthlyReturn);
    }
    
    const opportunityCost = investNowValue - delayedValue;
    const compoundGrowth = investNowValue / (scenario.initialAmount + scenario.monthlyContribution * (month + 1));
    
    // Generate events
    const events: TimelineEvent[] = [];
    
    // Major market events
    if (month === 18) {
      events.push({
        month,
        type: 'economic_event',
        description: 'Federal Reserve raises interest rates',
        impact: -0.1,
        severity: 'medium'
      });
    }
    
    if (month === 36) {
      events.push({
        month,
        type: 'market_down',
        description: 'Market correction (-15%)',
        impact: -0.15,
        severity: 'high'
      });
    }
    
    if (month === 60) {
      events.push({
        month,
        type: 'market_up',
        description: 'Technology sector rally',
        impact: 0.12,
        severity: 'medium'
      });
    }
    
    if (month === 84) {
      events.push({
        month,
        type: 'economic_event',
        description: 'Trade tensions escalate',
        impact: -0.08,
        severity: 'medium'
      });
    }
    
    if (month === 120) {
      events.push({
        month,
        type: 'milestone',
        description: '10-year investment anniversary',
        impact: 0,
        severity: 'low'
      });
    }
    
    // Random smaller events
    if (Math.random() > 0.95) {
      const eventTypes = ['market_up', 'market_down'] as const;
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const impact = (Math.random() * 0.06 - 0.03) * (eventType === 'market_up' ? 1 : -1);
      
      events.push({
        month,
        type: eventType,
        description: eventType === 'market_up' ? 'Market rally' : 'Market dip',
        impact,
        severity: Math.abs(impact) > 0.02 ? 'medium' : 'low'
      });
    }
    
    steps.push({
      month,
      year: year + 1,
      investNowValue,
      waitValue: delayedValue,
      opportunityCost,
      marketCondition,
      economicPhase,
      events,
      seasonalFactor,
      compoundGrowth
    });
  }
  
  return steps;
};

// Time Machine Visualization Component
const TimeMachine = ({ 
  currentStep, 
  isPlaying,
  scenario 
}: { 
  currentStep: TimeMachineStep | null;
  isPlaying: boolean;
  scenario: InvestmentScenario;
}) => {
  const machineRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const rotateY = useTransform(scrollY, [0, 1000], [0, 360]);
  
  if (!currentStep) return null;
  
  const timeProgress = currentStep.month / (scenario.timeHorizon * 12);
  const growthIntensity = Math.min(1, currentStep.compoundGrowth - 1);
  
  return (
    <div className="relative w-full h-96 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/20 via-blue-800/10 to-indigo-900/20 border border-white/10">
      <div 
        ref={machineRef}
        className="absolute inset-0"
        style={{ perspective: '1000px' }}
      >
        {/* Time machine core */}
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48"
          style={{ rotateY }}
          animate={isPlaying ? {
            rotateZ: [0, 360],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{
            rotateZ: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 4, repeat: Infinity }
          }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60">
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-900/40 via-purple-800/30 to-pink-900/40 backdrop-blur-xl" />
          </div>
          
          {/* Inner core */}
          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/40 to-purple-600/30 flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 30px rgba(59, 130, 246, 0.5)',
                '0 0 50px rgba(147, 51, 234, 0.7)',
                '0 0 30px rgba(59, 130, 246, 0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Clock className="w-12 h-12 text-white" />
          </motion.div>
          
          {/* Time markers */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-6 bg-white/40"
              style={{
                left: '50%',
                top: '0%',
                transformOrigin: '0% 96px',
                transform: `translateX(-50%) rotate(${i * 30}deg)`
              }}
              animate={{
                opacity: timeProgress * 12 > i ? 1 : 0.2,
                height: timeProgress * 12 > i ? 24 : 16
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </motion.div>
        
        {/* Split Timeline Portals */}
        <div className="absolute inset-0 flex items-center justify-around px-8">
          {/* Invest Now Portal */}
          <motion.div
            className="relative w-32 h-32"
            animate={isPlaying ? {
              y: [0, -10, 0],
              rotateY: [0, 10, 0]
            } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/30 border border-green-400/40 backdrop-blur-xl overflow-hidden">
              {/* Growth visualization */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-400/60 to-green-300/20"
                animate={{
                  height: `${Math.min(100, growthIntensity * 100)}%`
                }}
                transition={{ duration: 1 }}
              />
              
              {/* Money trees */}
              <div className="absolute inset-2 flex items-end justify-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="relative"
                    animate={{
                      height: `${20 + growthIntensity * 30 + i * 5}px`,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      height: { duration: 1 },
                      scale: { duration: 2, repeat: Infinity, delay: i * 0.2 }
                    }}
                  >
                    <TreePine className="w-4 h-4 text-green-400" />
                  </motion.div>
                ))}
              </div>
              
              {/* Sparkles */}
              {growthIntensity > 0.3 && (
                <div className="absolute inset-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + i * 10}%`
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-xs text-green-400 font-medium">Invest Now</div>
              <div className="text-xs text-white">
                ${Math.round(currentStep.investNowValue).toLocaleString()}
              </div>
            </div>
          </motion.div>
          
          {/* Wait Portal */}
          <motion.div
            className="relative w-32 h-32"
            animate={isPlaying ? {
              y: [0, -5, 0],
              rotateY: [0, -10, 0]
            } : {}}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-400/40 backdrop-blur-xl overflow-hidden">
              {/* Slower growth */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-400/60 to-amber-300/20"
                animate={{
                  height: `${Math.min(60, (currentStep.waitValue / currentStep.investNowValue) * 100)}%`
                }}
                transition={{ duration: 1 }}
              />
              
              {/* Smaller trees */}
              <div className="absolute inset-2 flex items-end justify-center">
                {Array.from({ length: 2 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="relative"
                    animate={{
                      height: `${15 + i * 3}px`,
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      scale: { duration: 2.5, repeat: Infinity, delay: i * 0.3 }
                    }}
                  >
                    <TreePine className="w-3 h-3 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              
              {/* Clock overlay */}
              <div className="absolute top-2 right-2">
                <Hourglass className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-xs text-amber-400 font-medium">Wait & Invest</div>
              <div className="text-xs text-white">
                ${Math.round(currentStep.waitValue).toLocaleString()}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Economic weather overlay */}
        <div className="absolute top-4 left-4 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            {currentStep.marketCondition === 'bull' ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : currentStep.marketCondition === 'bear' ? (
              <TrendingDown className="w-5 h-5 text-red-400" />
            ) : currentStep.marketCondition === 'volatile' ? (
              <Zap className="w-5 h-5 text-yellow-400" />
            ) : (
              <Target className="w-5 h-5 text-blue-400" />
            )}
            <span className="text-sm text-white font-medium capitalize">
              {currentStep.marketCondition} Market
            </span>
          </div>
          <div className="text-xs text-gray-300 capitalize">
            {currentStep.economicPhase} Phase
          </div>
        </div>
        
        {/* Opportunity cost indicator */}
        <div className="absolute top-4 right-4 p-3 bg-purple-500/20 backdrop-blur-xl rounded-2xl border border-purple-500/40">
          <div className="text-center">
            <div className="text-xs text-purple-300 mb-1">Opportunity Cost</div>
            <div className={`text-sm font-bold ${
              currentStep.opportunityCost > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ${Math.round(currentStep.opportunityCost).toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* Floating time particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Timeline Compass Component
const TimelineCompass = ({ 
  timelineData, 
  currentMonth, 
  onMonthChange,
  isPlaying,
  onPlayToggle 
}: {
  timelineData: TimeMachineStep[];
  currentMonth: number;
  onMonthChange: (month: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
}) => {
  const currentStep = timelineData[currentMonth];
  
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-blue-400" />
          Timeline Compass
        </h3>
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
          className="absolute top-0 h-3 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-lg pointer-events-none"
          style={{ width: `${(currentMonth / (timelineData.length - 1)) * 100}%` }}
        />
      </div>
      
      {currentStep && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Current Time</div>
            <div className="text-lg font-bold text-white">
              Year {currentStep.year}, Month {(currentStep.month % 12) + 1}
            </div>
          </div>
          
          <div>
            <Telescope className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Future Vision</div>
            <div className="text-lg font-bold text-white">
              {Math.round((currentStep.month / timelineData.length) * 100)}%
            </div>
          </div>
          
          <div>
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Compound Factor</div>
            <div className="text-lg font-bold text-white">
              {currentStep.compoundGrowth.toFixed(1)}x
            </div>
          </div>
          
          <div>
            <MapPin className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Timeline Progress</div>
            <div className="text-lg font-bold text-white">
              {currentStep.month + 1} / {timelineData.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function TimingOraclePage() {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineData] = useState(() => generateTimeMachineData(mockInvestmentScenario));
  const [selectedScenario] = useState(mockInvestmentScenario);

  const currentStep = timelineData[currentMonth];
  const maxMonths = timelineData.length;

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentMonth < maxMonths - 1) {
      interval = setInterval(() => {
        setCurrentMonth(prev => Math.min(prev + 1, maxMonths - 1));
      }, 800);
    } else if (currentMonth >= maxMonths - 1) {
      setIsPlaying(false);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentMonth, maxMonths]);

  const calculateRecommendation = () => {
    const finalStep = timelineData[timelineData.length - 1];
    const totalOpportunity = finalStep.opportunityCost;
    const compoundBenefit = finalStep.compoundGrowth;
    
    // Time in market beats timing the market
    const confidence = Math.min(0.95, 0.7 + (totalOpportunity / finalStep.investNowValue) * 0.3);
    
    return {
      recommendation: totalOpportunity > 0 ? 'invest_now' : 'wait',
      confidence,
      opportunityCost: Math.abs(totalOpportunity),
      compoundBenefit,
      timeValue: finalStep.investNowValue - (selectedScenario.initialAmount + selectedScenario.monthlyContribution * finalStep.month),
      reasons: totalOpportunity > 0 
        ? ['Time in market beats timing the market', 'Compound interest works best with time', 'Dollar-cost averaging reduces volatility risk']
        : ['Market timing can sometimes work', 'Waiting might avoid immediate losses', 'Better entry point possible']
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
                <h1 className="text-3xl font-bold text-white">Market Time Machine</h1>
                <p className="text-gray-400">Witness the power of compound time across parallel investment timelines</p>
              </div>
            </div>

            {/* Investment Details Panel */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {selectedScenario.name}
                  </h2>
                  <p className="text-gray-300 mb-6">{selectedScenario.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Initial Amount</div>
                      <div className="text-lg font-bold text-white">
                        ${selectedScenario.initialAmount.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Monthly Contribution</div>
                      <div className="text-lg font-bold text-white">
                        ${selectedScenario.monthlyContribution.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Expected Return</div>
                      <div className="text-lg font-bold text-white">
                        {selectedScenario.expectedReturn}%
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Time Horizon</div>
                      <div className="text-lg font-bold text-white">
                        {selectedScenario.timeHorizon} years
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Recommendation */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                      recommendation.recommendation === 'invest_now'
                        ? 'bg-green-500/20 border border-green-500/40'
                        : 'bg-amber-500/20 border border-amber-500/40'
                    }`}>
                      {recommendation.recommendation === 'invest_now' ? (
                        <>
                          <Zap className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 font-semibold">Recommend: INVEST NOW</span>
                        </>
                      ) : (
                        <>
                          <Timer className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-300 font-semibold">Recommend: WAIT</span>
                        </>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {Math.round(recommendation.confidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div className="text-xs text-blue-400 mt-2">
                      ${recommendation.opportunityCost.toLocaleString()} opportunity cost
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {/* Time Machine Visualization */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                <Gem className="w-8 h-8 text-blue-400" />
                Market Time Machine Portal
              </h2>
              <TimeMachine
                currentStep={currentStep}
                isPlaying={isPlaying}
                scenario={selectedScenario}
              />
            </motion.div>

            {/* Timeline Compass */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <TimelineCompass
                timelineData={timelineData}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                isPlaying={isPlaying}
                onPlayToggle={() => setIsPlaying(!isPlaying)}
              />
            </motion.div>

            {/* Current Step Analysis */}
            {currentStep && (
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {/* Investment Comparison */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Eye className="w-6 h-6 text-blue-400" />
                    Portfolio Vision
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Invest Now Scenario */}
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <TreePine className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <div className="text-green-300 font-semibold">Invest Now Timeline</div>
                            <div className="text-xs text-gray-400">Started immediately</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            ${Math.round(currentStep.investNowValue).toLocaleString()}
                          </div>
                          <div className="text-xs text-green-400">
                            {((currentStep.compoundGrowth - 1) * 100).toFixed(1)}% growth
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-500/10 rounded-lg p-3">
                        <div className="text-sm text-gray-300">
                          Compound growth forest: {currentStep.month + 1} months of continuous growth
                        </div>
                      </div>
                    </div>

                    {/* Wait Scenario */}
                    <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                            <Hourglass className="w-6 h-6 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-amber-300 font-semibold">Wait & Invest Timeline</div>
                            <div className="text-xs text-gray-400">Delayed 1 year</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            ${Math.round(currentStep.waitValue).toLocaleString()}
                          </div>
                          <div className="text-xs text-amber-400">
                            Less time to grow
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-amber-500/10 rounded-lg p-3">
                        <div className="text-sm text-gray-300">
                          Missed months: 12 months of potential compound growth
                        </div>
                      </div>
                    </div>

                    {/* Opportunity Cost */}
                    <div className={`p-4 rounded-xl border ${
                      currentStep.opportunityCost > 0 
                        ? 'bg-purple-500/10 border-purple-500/20' 
                        : 'bg-gray-500/10 border-gray-500/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Opportunity Cost
                        </span>
                        <span className={`font-bold ${
                          currentStep.opportunityCost > 0 ? 'text-purple-400' : 'text-gray-400'
                        }`}>
                          ${Math.round(currentStep.opportunityCost).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Cost of waiting to invest
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Events & Timeline */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Market Events
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Current Market Status */}
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          currentStep.marketCondition === 'bull' ? 'bg-green-500/20' :
                          currentStep.marketCondition === 'bear' ? 'bg-red-500/20' :
                          currentStep.marketCondition === 'volatile' ? 'bg-yellow-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          {currentStep.marketCondition === 'bull' ? (
                            <TrendingUp className="w-8 h-8 text-green-400" />
                          ) : currentStep.marketCondition === 'bear' ? (
                            <TrendingDown className="w-8 h-8 text-red-400" />
                          ) : currentStep.marketCondition === 'volatile' ? (
                            <Zap className="w-8 h-8 text-yellow-400" />
                          ) : (
                            <Target className="w-8 h-8 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white capitalize">
                            {currentStep.marketCondition} Market
                          </h4>
                          <p className="text-sm text-gray-400 capitalize">
                            Economic {currentStep.economicPhase}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <div className="text-sm text-gray-300">Seasonal Factor</div>
                          <div className="text-lg font-bold text-white">
                            {((currentStep.seasonalFactor - 1) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg">
                          <div className="text-sm text-gray-300">Growth Multiple</div>
                          <div className="text-lg font-bold text-white">
                            {currentStep.compoundGrowth.toFixed(2)}x
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Events */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white">Timeline Events</h4>
                      {currentStep.events.length > 0 ? (
                        currentStep.events.map((event, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                            {event.type === 'market_up' ? (
                              <ArrowUp className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            ) : event.type === 'market_down' ? (
                              <ArrowDown className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            ) : event.type === 'milestone' ? (
                              <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="text-sm text-white font-medium">{event.description}</div>
                              <div className="text-xs text-gray-400">
                                {event.severity} impact • Month {event.month + 1}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-6 text-gray-400">
                          <div className="w-12 h-12 mx-auto mb-2 bg-gray-500/20 rounded-full flex items-center justify-center">
                            <Sun className="w-6 h-6" />
                          </div>
                          <div className="text-sm">Calm market conditions</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Final Recommendation */}
            {currentMonth >= maxMonths - 1 && (
              <motion.div
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center mb-8">
                  <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">Time Travel Complete!</h2>
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
                    recommendation.recommendation === 'invest_now'
                      ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                      : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  }`}>
                    {recommendation.recommendation === 'invest_now' ? 'INVEST NOW' : 'WAIT'} was the right choice
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
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      ${recommendation.opportunityCost.toLocaleString()}
                    </div>
                    <div className="text-gray-400">Opportunity Cost</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      {recommendation.compoundBenefit.toFixed(1)}x
                    </div>
                    <div className="text-gray-400">Compound Growth</div>
                  </div>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Time Machine Wisdom
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