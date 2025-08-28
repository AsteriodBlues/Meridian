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
  AlertTriangle, CheckCircle, Info, Lightbulb
} from 'lucide-react';

// Rate data interfaces
interface RateScenario {
  id: string;
  name: string;
  type: 'fixed' | 'variable';
  initialRate: number;
  description: string;
  pros: string[];
  cons: string[];
  color: string;
  icon: any;
}

interface EconomicWeather {
  condition: 'calm' | 'windy' | 'stormy' | 'hurricane';
  temperature: 'hot' | 'warm' | 'cool' | 'cold';
  forecast: 'rising' | 'falling' | 'stable' | 'volatile';
  description: string;
  impact: string;
  icon: any;
  severity: number; // 0-100
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
  loanType: string;
}

const mockLoanDetails: LoanDetails = {
  principal: 350000,
  termYears: 30,
  loanType: 'Mortgage'
};

const rateScenarios: RateScenario[] = [
  {
    id: 'fixed',
    name: 'Fixed Rate',
    type: 'fixed',
    initialRate: 6.75,
    description: 'Predictable payments that never change, like a sturdy anchor in choppy waters',
    pros: ['Payment stability', 'Protection from rate increases', 'Easy budgeting', 'Peace of mind'],
    cons: ['Higher initial rate', 'No benefit from rate decreases', 'Harder to qualify'],
    color: '#3B82F6',
    icon: Anchor
  },
  {
    id: 'variable',
    name: 'Variable Rate',
    type: 'variable',
    initialRate: 6.25,
    description: 'Rates that flow with market currents, offering thrills and potential savings',
    pros: ['Lower initial rate', 'Benefit from rate decreases', 'Easier qualification', 'Potential savings'],
    cons: ['Payment uncertainty', 'Risk of rate increases', 'Budgeting challenges'],
    color: '#10B981',
    icon: Waves
  }
];

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
    
    const economicWeather: EconomicWeather = {
      condition: weatherCondition,
      temperature,
      forecast,
      description: weatherDescription || 'Steady economic conditions',
      impact: weatherImpact || 'Minimal rate volatility expected',
      icon: weatherIcon,
      severity
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

// Rate River Visualization
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
        
        {/* Rate boats */}
        <div className="absolute inset-0 flex items-center justify-around px-12">
          {/* Fixed Rate Boat */}
          <motion.div
            className="relative"
            animate={isPlaying ? {
              y: [0, -8, 0],
              rotateZ: [-2, 2, -2]
            } : {}}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div className="w-24 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center relative overflow-hidden">
              <Anchor className="w-8 h-8 text-white" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
              
              {/* Stability indicator */}
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-blue-500/80 rounded-full text-xs text-white font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentStep.fixedRate.toFixed(2)}%
              </motion.div>
            </div>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-xs text-blue-400 font-medium">Fixed</div>
              <div className="text-xs text-gray-400">Steady sailing</div>
            </div>
          </motion.div>
          
          {/* Variable Rate Boat */}
          <motion.div
            className="relative"
            animate={isPlaying ? {
              y: [0, -12 * weatherIntensity, 0],
              rotateZ: [-5 * weatherIntensity, 5 * weatherIntensity, -5 * weatherIntensity],
              x: [-3 * weatherIntensity, 3 * weatherIntensity, -3 * weatherIntensity]
            } : {}}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <div className="w-24 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center relative overflow-hidden">
              <Waves className="w-8 h-8 text-white" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
              
              {/* Rate indicator with volatility */}
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-green-500/80 rounded-full text-xs text-white font-medium"
                animate={{
                  scale: [1, 1.1 + weatherIntensity * 0.2, 1],
                  y: [-2 * weatherIntensity, 2 * weatherIntensity, -2 * weatherIntensity]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {currentStep.variableRate.toFixed(2)}%
              </motion.div>
            </div>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-xs text-green-400 font-medium">Variable</div>
              <div className="text-xs text-gray-400">Riding the waves</div>
            </div>
          </motion.div>
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

export default function RateNavigatorPage() {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timelineData] = useState(() => generateRateTimeline(mockLoanDetails));
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

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