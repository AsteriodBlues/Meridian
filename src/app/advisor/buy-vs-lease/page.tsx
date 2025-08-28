'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import { 
  Car, DollarSign, TrendingUp, TrendingDown, Calendar,
  Fuel, Wrench, Shield, Award, Clock, ArrowLeft,
  Play, Pause, RotateCcw, Settings, Zap, Star,
  Route, MapPin, CloudRain, Sun, Snowflake
} from 'lucide-react';

// Car data interface
interface CarData {
  make: string;
  model: string;
  year: number;
  msrp: number;
  residualValue: number;
  depreciationRate: number;
  maintenanceCostPerYear: number;
  insurancePerMonth: number;
  fuelEfficiency: number; // MPG
  reliabilityScore: number;
  features: string[];
}

// Journey simulation data
interface JourneyStep {
  month: number;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  buyScenario: {
    equity: number;
    monthlyPayment: number;
    maintenance: number;
    insurance: number;
    totalSpent: number;
    carValue: number;
    satisfaction: number;
  };
  leaseScenario: {
    monthlyPayment: number;
    insurance: number;
    totalSpent: number;
    carCondition: number;
    upgradeOpportunity: boolean;
    satisfaction: number;
  };
  marketEvents: string[];
  weatherCondition: 'sunny' | 'rainy' | 'snowy' | 'stormy';
}

const mockCarData: CarData = {
  make: 'Tesla',
  model: 'Model 3',
  year: 2024,
  msrp: 42990,
  residualValue: 25794, // 60% after 3 years
  depreciationRate: 0.15, // 15% per year
  maintenanceCostPerYear: 800,
  insurancePerMonth: 180,
  fuelEfficiency: 130, // MPGe
  reliabilityScore: 85,
  features: ['Autopilot', 'Premium Audio', 'Glass Roof', 'Mobile Connector']
};

// Generate journey simulation data
const generateJourneyData = (carData: CarData, loanTerm: number = 60): JourneyStep[] => {
  const steps: JourneyStep[] = [];
  const downPayment = carData.msrp * 0.15; // 15% down
  const loanAmount = carData.msrp - downPayment;
  const interestRate = 0.065; // 6.5% APR
  const monthlyPayment = (loanAmount * (interestRate / 12)) / (1 - Math.pow(1 + interestRate / 12, -loanTerm));
  const leaseMonthlyPayment = (carData.msrp - carData.residualValue) / 36 + (carData.msrp * 0.02 / 12); // 2% money factor

  const seasons = ['spring', 'summer', 'fall', 'winter'] as const;
  const weatherConditions = ['sunny', 'rainy', 'snowy', 'stormy'] as const;

  for (let month = 0; month < 60; month++) {
    const season = seasons[Math.floor(month / 12) % 4];
    const currentCarValue = carData.msrp * Math.pow(1 - carData.depreciationRate, month / 12);
    const equityBuilt = Math.max(0, currentCarValue - (loanAmount * Math.pow(1 + interestRate / 12, month) - monthlyPayment * ((Math.pow(1 + interestRate / 12, month) - 1) / (interestRate / 12))));
    
    // Market events based on timing
    const marketEvents: string[] = [];
    if (month % 12 === 0) marketEvents.push('Annual model refresh announced');
    if (month === 24) marketEvents.push('Mid-cycle refresh with new features');
    if (month === 36) marketEvents.push('Next generation model teased');
    if (month % 6 === 0 && Math.random() > 0.7) marketEvents.push('Manufacturer incentive available');

    const step: JourneyStep = {
      month,
      season,
      buyScenario: {
        equity: equityBuilt,
        monthlyPayment: monthlyPayment + carData.insurancePerMonth,
        maintenance: month > 24 ? carData.maintenanceCostPerYear / 12 : 50, // Warranty coverage first 2 years
        insurance: carData.insurancePerMonth,
        totalSpent: (monthlyPayment + carData.insurancePerMonth) * (month + 1) + downPayment,
        carValue: currentCarValue,
        satisfaction: Math.max(60, 90 - (month * 0.3)) // Decreases slowly over time
      },
      leaseScenario: {
        monthlyPayment: leaseMonthlyPayment + carData.insurancePerMonth,
        insurance: carData.insurancePerMonth,
        totalSpent: (leaseMonthlyPayment + carData.insurancePerMonth) * (month + 1),
        carCondition: Math.max(80, 100 - (month * 0.2)), // Stays newer
        upgradeOpportunity: month > 0 && month % 36 === 0, // Every 3 years
        satisfaction: Math.min(95, 85 + (month % 36 < 12 ? 10 : 0)) // Boost with new car
      },
      marketEvents,
      weatherCondition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
    };
    
    steps.push(step);
  }
  
  return steps;
};

// 3D Car Model Component (simplified representation)
const Car3DModel = ({ type, condition, isAnimating }: { 
  type: 'buy' | 'lease'; 
  condition: number;
  isAnimating: boolean;
}) => {
  const carColor = type === 'buy' ? '#3B82F6' : '#10B981';
  const shine = condition / 100;
  
  return (
    <motion.div
      className="relative w-32 h-20 mx-auto"
      animate={isAnimating ? {
        y: [0, -5, 0],
        rotateX: [0, 5, 0]
      } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Car body */}
      <motion.div
        className="relative w-full h-full rounded-2xl shadow-2xl"
        style={{ 
          background: `linear-gradient(135deg, ${carColor}, ${carColor}CC)`,
          opacity: 0.7 + (shine * 0.3)
        }}
        animate={{
          boxShadow: [
            `0 10px 30px ${carColor}40`,
            `0 15px 40px ${carColor}60`,
            `0 10px 30px ${carColor}40`
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* Windshield */}
        <div className="absolute top-2 left-4 right-4 h-6 bg-gradient-to-b from-sky-200/30 to-sky-400/50 rounded-t-lg" />
        
        {/* Wheels */}
        <div className="absolute bottom-0 left-2 w-4 h-4 bg-gray-800 rounded-full" />
        <div className="absolute bottom-0 right-2 w-4 h-4 bg-gray-800 rounded-full" />
        
        {/* Headlights */}
        <motion.div
          className="absolute top-6 left-0 w-2 h-2 bg-yellow-300 rounded-full"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-6 right-0 w-2 h-2 bg-yellow-300 rounded-full"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Condition indicator */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <span className="text-xs font-bold text-white">{Math.round(condition)}</span>
        </motion.div>
        
        {/* Sparkle effects for good condition */}
        {condition > 85 && (
          <div className="absolute inset-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`
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
      </motion.div>
    </motion.div>
  );
};

// Weather Effect Component
const WeatherEffect = ({ condition, season }: { condition: string; season: string }) => {
  const getWeatherIcon = () => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-400" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'snowy': return <Snowflake className="w-6 h-6 text-cyan-400" />;
      case 'stormy': return <Zap className="w-6 h-6 text-purple-400" />;
      default: return <Sun className="w-6 h-6 text-yellow-400" />;
    }
  };

  const getSeasonColor = () => {
    switch (season) {
      case 'spring': return 'from-green-500/20 to-yellow-500/20';
      case 'summer': return 'from-yellow-500/20 to-orange-500/20';
      case 'fall': return 'from-orange-500/20 to-red-500/20';
      case 'winter': return 'from-blue-500/20 to-cyan-500/20';
      default: return 'from-blue-500/20 to-green-500/20';
    }
  };

  return (
    <div className={`absolute top-4 left-4 p-2 rounded-lg bg-gradient-to-r ${getSeasonColor()} backdrop-blur border border-white/20`}>
      <div className="flex items-center gap-2">
        {getWeatherIcon()}
        <span className="text-white text-sm font-medium capitalize">
          {season} • {condition}
        </span>
      </div>
    </div>
  );
};

export default function BuyVsLeasePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [journeyData] = useState(() => generateJourneyData(mockCarData));
  const [selectedMetric, setSelectedMetric] = useState<'cost' | 'satisfaction' | 'equity'>('cost');
  const [userPreferences, setUserPreferences] = useState({
    monthlyBudget: 800,
    milesDrivenPerYear: 12000,
    keepCarYears: 5,
    importanceFactors: {
      monthlyCost: 8,
      ownership: 6,
      latestFeatures: 7,
      flexibility: 5
    }
  });

  const currentStepData = journeyData[currentStep];
  const maxSteps = journeyData.length;

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < maxSteps - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => Math.min(prev + 1, maxSteps - 1));
      }, 800);
    } else if (currentStep >= maxSteps - 1) {
      setIsPlaying(false);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, maxSteps]);

  const calculateRecommendation = () => {
    const finalStep = journeyData[journeyData.length - 1];
    const buyTotalCost = finalStep.buyScenario.totalSpent;
    const leaseTotalCost = finalStep.leaseScenario.totalSpent;
    const buyEquity = finalStep.buyScenario.equity;
    
    // Factor in user preferences
    const { importanceFactors } = userPreferences;
    const buyScore = (importanceFactors.monthlyCost * (leaseTotalCost > buyTotalCost ? 10 : 5)) +
                     (importanceFactors.ownership * 10) +
                     (importanceFactors.latestFeatures * 3) +
                     (importanceFactors.flexibility * 4);
    
    const leaseScore = (importanceFactors.monthlyCost * (finalStep.leaseScenario.monthlyPayment < finalStep.buyScenario.monthlyPayment ? 10 : 5)) +
                       (importanceFactors.ownership * 2) +
                       (importanceFactors.latestFeatures * 10) +
                       (importanceFactors.flexibility * 8);

    return {
      recommendation: buyScore > leaseScore ? 'buy' : 'lease',
      confidence: Math.abs(buyScore - leaseScore) / Math.max(buyScore, leaseScore),
      reasons: buyScore > leaseScore 
        ? ['Build equity over time', 'No mileage restrictions', 'Freedom to modify']
        : ['Lower monthly payments', 'Always drive latest model', 'Warranty coverage', 'No depreciation risk']
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
                <h1 className="text-3xl font-bold text-white">Car Journey Simulator</h1>
                <p className="text-gray-400">Watch your parallel financial universes unfold</p>
              </div>
            </div>

            {/* Car Info Panel */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Car Details */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {mockCarData.year} {mockCarData.make} {mockCarData.model}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">MSRP</div>
                      <div className="text-lg font-bold text-white">${mockCarData.msrp.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <Fuel className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Efficiency</div>
                      <div className="text-lg font-bold text-white">{mockCarData.fuelEfficiency} MPGe</div>
                    </div>
                    <div className="text-center">
                      <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Reliability</div>
                      <div className="text-lg font-bold text-white">{mockCarData.reliabilityScore}/100</div>
                    </div>
                    <div className="text-center">
                      <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Insurance</div>
                      <div className="text-lg font-bold text-white">${mockCarData.insurancePerMonth}/mo</div>
                    </div>
                  </div>
                </div>

                {/* Quick Recommendation */}
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                      recommendation.recommendation === 'buy'
                        ? 'bg-blue-500/20 border border-blue-500/40'
                        : 'bg-green-500/20 border border-green-500/40'
                    }`}>
                      {recommendation.recommendation === 'buy' ? (
                        <>
                          <Car className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 font-semibold">Recommend: BUY</span>
                        </>
                      ) : (
                        <>
                          <Route className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 font-semibold">Recommend: LEASE</span>
                        </>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {Math.round(recommendation.confidence * 100)}%
                    </div>
                    <div className="text-sm text-gray-400">Confidence</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Split-Screen Journey */}
          <div className="max-w-7xl mx-auto px-6 pb-12">
            {/* Timeline Controls */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.button
                    className={`p-3 rounded-xl border transition-all ${
                      isPlaying 
                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                        : 'bg-green-500/20 border-green-500/40 text-green-300'
                    }`}
                    onClick={() => setIsPlaying(!isPlaying)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </motion.button>
                  
                  <motion.button
                    className="p-3 rounded-xl border border-white/20 bg-white/10 text-gray-300 hover:text-white transition-all"
                    onClick={() => setCurrentStep(0)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.button>
                  
                  <div className="text-white">
                    <span className="font-bold">Month {currentStepData?.month + 1}</span>
                    <span className="text-gray-400 ml-2">of {maxSteps}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    Year {Math.floor((currentStepData?.month || 0) / 12) + 1}
                  </span>
                </div>
              </div>
              
              {/* Timeline slider */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={maxSteps - 1}
                  value={currentStep}
                  onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div 
                  className="absolute top-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg pointer-events-none"
                  style={{ width: `${(currentStep / (maxSteps - 1)) * 100}%` }}
                />
              </div>
            </motion.div>

            {/* Split Screen Comparison */}
            {currentStepData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Buy Scenario */}
                <motion.div
                  className="relative bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <WeatherEffect condition={currentStepData.weatherCondition} season={currentStepData.season} />
                  
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/40 mb-4">
                      <Car className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300 font-semibold">BUY Path</span>
                    </div>
                    
                    <Car3DModel 
                      type="buy" 
                      condition={Math.max(60, 100 - (currentStepData.month * 0.5))}
                      isAnimating={isPlaying}
                    />
                  </div>

                  {/* Buy Metrics */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Monthly Payment</span>
                      <span className="text-xl font-bold text-white">
                        ${Math.round(currentStepData.buyScenario.monthlyPayment).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Equity Built</span>
                      <span className="text-xl font-bold text-green-400">
                        ${Math.round(currentStepData.buyScenario.equity).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Car Value</span>
                      <span className="text-lg font-semibold text-blue-400">
                        ${Math.round(currentStepData.buyScenario.carValue).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Spent</span>
                      <span className="text-lg font-semibold text-white">
                        ${Math.round(currentStepData.buyScenario.totalSpent).toLocaleString()}
                      </span>
                    </div>
                    
                    {/* Satisfaction meter */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Owner Satisfaction</span>
                        <span className="text-sm text-blue-400">
                          {Math.round(currentStepData.buyScenario.satisfaction)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentStepData.buyScenario.satisfaction}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Market events */}
                  {currentStepData.marketEvents.length > 0 && (
                    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="text-sm font-semibold text-white mb-2">Market Update</h4>
                      {currentStepData.marketEvents.map((event, idx) => (
                        <div key={idx} className="text-xs text-gray-400 mb-1">• {event}</div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Lease Scenario */}
                <motion.div
                  className="relative bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border border-green-500/20 rounded-3xl p-8 overflow-hidden"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <WeatherEffect condition={currentStepData.weatherCondition} season={currentStepData.season} />
                  
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40 mb-4">
                      <Route className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 font-semibold">LEASE Path</span>
                    </div>
                    
                    <Car3DModel 
                      type="lease" 
                      condition={currentStepData.leaseScenario.carCondition}
                      isAnimating={isPlaying}
                    />
                    
                    {currentStepData.leaseScenario.upgradeOpportunity && (
                      <motion.div
                        className="mt-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full inline-block"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <span className="text-xs text-yellow-300 font-medium">🚗 Upgrade Available!</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Lease Metrics */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Monthly Payment</span>
                      <span className="text-xl font-bold text-white">
                        ${Math.round(currentStepData.leaseScenario.monthlyPayment).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Car Condition</span>
                      <span className="text-lg font-semibold text-green-400">
                        {Math.round(currentStepData.leaseScenario.carCondition)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Spent</span>
                      <span className="text-lg font-semibold text-white">
                        ${Math.round(currentStepData.leaseScenario.totalSpent).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Equity</span>
                      <span className="text-lg font-semibold text-gray-500">$0</span>
                    </div>
                    
                    {/* Satisfaction meter */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300 text-sm">Driver Satisfaction</span>
                        <span className="text-sm text-green-400">
                          {Math.round(currentStepData.leaseScenario.satisfaction)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${currentStepData.leaseScenario.satisfaction}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Lease benefits */}
                  <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-sm font-semibold text-white mb-2">Lease Perks</h4>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>• Full warranty coverage</div>
                      <div>• No maintenance worries</div>
                      <div>• Always latest features</div>
                      {currentStepData.leaseScenario.upgradeOpportunity && (
                        <div className="text-green-400">• New car available!</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Final Recommendation */}
            {currentStep >= maxSteps - 1 && (
              <motion.div
                className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center mb-8">
                  <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-4">Journey Complete!</h2>
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
                    recommendation.recommendation === 'buy'
                      ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                      : 'bg-green-500/20 border border-green-500/40 text-green-300'
                  }`}>
                    {recommendation.recommendation === 'buy' ? 'BUY' : 'LEASE'} is your best choice
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {Math.round(recommendation.confidence * 100)}%
                    </div>
                    <div className="text-gray-400">Confidence Level</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      ${Math.abs(journeyData[maxSteps - 1].buyScenario.totalSpent - journeyData[maxSteps - 1].leaseScenario.totalSpent).toLocaleString()}
                    </div>
                    <div className="text-gray-400">Potential Savings</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-blue-400 mb-2">
                      {recommendation.recommendation === 'buy' ? 
                        `$${Math.round(journeyData[maxSteps - 1].buyScenario.equity).toLocaleString()}` : 
                        'Latest Tech'
                      }
                    </div>
                    <div className="text-gray-400">
                      {recommendation.recommendation === 'buy' ? 'Equity Built' : 'Always Current'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-white/5 rounded-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Why {recommendation.recommendation.toUpperCase()}?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendation.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full" />
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