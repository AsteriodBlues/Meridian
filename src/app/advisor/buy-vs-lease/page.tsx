'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import { 
  Car, DollarSign, TrendingUp, TrendingDown, Calendar,
  Fuel, Wrench, Shield, Award, Clock, ArrowLeft,
  Play, Pause, RotateCcw, Settings, Zap, Star,
  Route, MapPin, CloudRain, Sun, Snowflake, CheckCircle,
  Lightbulb, AlertTriangle, Brain, Target
} from 'lucide-react';

// Enhanced Car data interface
interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  category: 'sedan' | 'suv' | 'luxury' | 'electric' | 'hybrid' | 'truck';
  msrp: number;
  residualValue: number;
  depreciationRate: number;
  maintenanceCostPerYear: number;
  insurancePerMonth: number;
  fuelEfficiency: number; // MPG
  reliabilityScore: number;
  safetyRating: number;
  techRating: number;
  features: string[];
  incentives: Incentive[];
  leaseDetails: LeaseTerms;
  financingOptions: FinancingOption[];
  environmentalImpact: EnvironmentalData;
  marketTrends: MarketTrendData;
}

interface Incentive {
  type: 'cashback' | 'apr' | 'lease_special' | 'trade_bonus';
  amount: number;
  description: string;
  endDate: string;
  conditions: string[];
}

interface LeaseTerms {
  term: number; // months
  mileageAllowance: number; // per year
  overagePenalty: number; // per mile
  dispositionFee: number;
  acquisitionFee: number;
  moneyFactor: number;
  residualPercentage: number;
}

interface FinancingOption {
  apr: number;
  term: number; // months
  downPaymentMin: number;
  description: string;
  creditScoreRequired: number;
}

interface EnvironmentalData {
  co2EmissionsPerYear: number; // tons
  fuelCostPerYear: number;
  environmentalScore: number; // 0-100
  greenIncentives: number; // tax credits/rebates
}

interface MarketTrendData {
  demandTrend: 'rising' | 'stable' | 'falling';
  priceVolatility: number; // 0-100
  resaleValueTrend: 'strong' | 'average' | 'weak';
  marketShare: number; // percentage
}

interface UserProfile {
  creditScore: number;
  annualIncome: number;
  monthlyBudget: number;
  milesDrivenPerYear: number;
  keepVehicleYears: number;
  priorities: {
    monthlyCost: number; // 1-10
    totalCost: number;
    ownership: number;
    latestTech: number;
    flexibility: number;
    environmental: number;
    reliability: number;
    safety: number;
  };
  lifestyle: {
    hasKids: boolean;
    longCommute: boolean;
    weekendAdventurer: boolean;
    cityDriving: boolean;
    carEnthusiast: boolean;
  };
}

// Enhanced Journey simulation data
interface JourneyStep {
  month: number;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  buyScenario: {
    equity: number;
    monthlyPayment: number;
    maintenance: number;
    insurance: number;
    fuel: number;
    registration: number;
    totalSpent: number;
    carValue: number;
    satisfaction: number;
    repairRisk: number;
    taxDeductions: number;
    upgradeValue: number;
  };
  leaseScenario: {
    monthlyPayment: number;
    insurance: number;
    fuel: number;
    totalSpent: number;
    carCondition: number;
    upgradeOpportunity: boolean;
    satisfaction: number;
    mileageUsed: number;
    overageCharges: number;
    wearAndTearCharges: number;
  };
  marketEvents: string[];
  weatherCondition: 'sunny' | 'rainy' | 'snowy' | 'stormy';
  economicFactors: {
    interestRates: number;
    gasPrice: number;
    inflationRate: number;
    usedCarMarket: 'hot' | 'normal' | 'cold';
  };
  lifeEvents: LifeEvent[];
}

interface LifeEvent {
  type: 'job_change' | 'family_growth' | 'move' | 'income_change' | 'accident';
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  financialImpact: number;
  month: number;
}

interface ComparisonAnalysis {
  recommendation: 'buy' | 'lease';
  confidence: number;
  totalSavings: number;
  breakEvenPoint: number; // months
  riskAssessment: {
    buyRisks: string[];
    leaseRisks: string[];
    overallRisk: 'low' | 'medium' | 'high';
  };
  scenarios: {
    bestCase: ScenarioOutcome;
    worstCase: ScenarioOutcome;
    mostLikely: ScenarioOutcome;
  };
  personalizedFactors: string[];
  keyInsights: string[];
}

interface ScenarioOutcome {
  buyTotal: number;
  leaseTotal: number;
  buyEquity: number;
  probability: number;
  description: string;
}

const mockVehicleDatabase: CarData[] = [
  {
    id: 'tesla-model-3',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    category: 'electric',
    msrp: 42990,
    residualValue: 25794, // 60% after 3 years
    depreciationRate: 0.15,
    maintenanceCostPerYear: 800,
    insurancePerMonth: 180,
    fuelEfficiency: 130, // MPGe
    reliabilityScore: 85,
    safetyRating: 95,
    techRating: 98,
    features: ['Autopilot', 'Premium Audio', 'Glass Roof', 'Mobile Connector', 'Over-the-air Updates'],
    incentives: [
      { type: 'cashback', amount: 7500, description: 'Federal Tax Credit', endDate: '2024-12-31', conditions: ['First-time EV buyer'] },
      { type: 'lease_special', amount: 2000, description: 'Tesla Lease Cash', endDate: '2024-06-30', conditions: ['36-month lease'] }
    ],
    leaseDetails: {
      term: 36,
      mileageAllowance: 10000,
      overagePenalty: 0.25,
      dispositionFee: 395,
      acquisitionFee: 695,
      moneyFactor: 0.00125,
      residualPercentage: 60
    },
    financingOptions: [
      { apr: 6.99, term: 72, downPaymentMin: 4299, description: 'Standard Financing', creditScoreRequired: 650 },
      { apr: 4.99, term: 60, downPaymentMin: 8598, description: 'Premium Rate', creditScoreRequired: 750 }
    ],
    environmentalImpact: {
      co2EmissionsPerYear: 0,
      fuelCostPerYear: 800,
      environmentalScore: 95,
      greenIncentives: 7500
    },
    marketTrends: {
      demandTrend: 'rising',
      priceVolatility: 25,
      resaleValueTrend: 'strong',
      marketShare: 3.5
    }
  },
  {
    id: 'honda-accord',
    make: 'Honda',
    model: 'Accord',
    year: 2024,
    category: 'sedan',
    msrp: 28990,
    residualValue: 17394, // 60% after 3 years
    depreciationRate: 0.18,
    maintenanceCostPerYear: 1200,
    insurancePerMonth: 145,
    fuelEfficiency: 32,
    reliabilityScore: 92,
    safetyRating: 88,
    techRating: 78,
    features: ['Honda Sensing', 'Apple CarPlay', 'Android Auto', 'Wireless Charging'],
    incentives: [
      { type: 'apr', amount: 1.9, description: 'Special APR Financing', endDate: '2024-03-31', conditions: ['Qualified buyers', '60-month term'] },
      { type: 'cashback', amount: 1500, description: 'Honda Loyalty Bonus', endDate: '2024-12-31', conditions: ['Current Honda owner'] }
    ],
    leaseDetails: {
      term: 36,
      mileageAllowance: 12000,
      overagePenalty: 0.20,
      dispositionFee: 350,
      acquisitionFee: 595,
      moneyFactor: 0.0015,
      residualPercentage: 60
    },
    financingOptions: [
      { apr: 5.99, term: 72, downPaymentMin: 2899, description: 'Standard Financing', creditScoreRequired: 620 },
      { apr: 1.9, term: 60, downPaymentMin: 5798, description: 'Special APR', creditScoreRequired: 720 }
    ],
    environmentalImpact: {
      co2EmissionsPerYear: 4.2,
      fuelCostPerYear: 1800,
      environmentalScore: 65,
      greenIncentives: 0
    },
    marketTrends: {
      demandTrend: 'stable',
      priceVolatility: 15,
      resaleValueTrend: 'strong',
      marketShare: 8.2
    }
  },
  {
    id: 'bmw-x3',
    make: 'BMW',
    model: 'X3',
    year: 2024,
    category: 'luxury',
    msrp: 49990,
    residualValue: 27494, // 55% after 3 years
    depreciationRate: 0.22,
    maintenanceCostPerYear: 2200,
    insurancePerMonth: 220,
    fuelEfficiency: 26,
    reliabilityScore: 78,
    safetyRating: 92,
    techRating: 95,
    features: ['iDrive 8', 'Wireless Charging', 'Panoramic Moonroof', 'Premium Audio', 'Driver Assistance Package'],
    incentives: [
      { type: 'lease_special', amount: 3000, description: 'BMW Lease Credit', endDate: '2024-03-31', conditions: ['36-month lease'] },
      { type: 'apr', amount: 2.9, description: 'BMW Premium Select', endDate: '2024-06-30', conditions: ['Qualified credit'] }
    ],
    leaseDetails: {
      term: 36,
      mileageAllowance: 10000,
      overagePenalty: 0.30,
      dispositionFee: 450,
      acquisitionFee: 925,
      moneyFactor: 0.0018,
      residualPercentage: 55
    },
    financingOptions: [
      { apr: 7.49, term: 72, downPaymentMin: 4999, description: 'Standard Financing', creditScoreRequired: 680 },
      { apr: 2.9, term: 60, downPaymentMin: 9998, description: 'Premium Select', creditScoreRequired: 750 }
    ],
    environmentalImpact: {
      co2EmissionsPerYear: 5.8,
      fuelCostPerYear: 2400,
      environmentalScore: 45,
      greenIncentives: 0
    },
    marketTrends: {
      demandTrend: 'stable',
      priceVolatility: 30,
      resaleValueTrend: 'average',
      marketShare: 2.1
    }
  }
];

const mockUserProfile: UserProfile = {
  creditScore: 740,
  annualIncome: 85000,
  monthlyBudget: 650,
  milesDrivenPerYear: 15000,
  keepVehicleYears: 5,
  priorities: {
    monthlyCost: 8,
    totalCost: 7,
    ownership: 6,
    latestTech: 8,
    flexibility: 7,
    environmental: 6,
    reliability: 9,
    safety: 9
  },
  lifestyle: {
    hasKids: true,
    longCommute: true,
    weekendAdventurer: false,
    cityDriving: true,
    carEnthusiast: false
  }
};

// Advanced Journey Generation with Real-World Factors
const generateAdvancedJourneyData = (carData: CarData, userProfile: UserProfile, loanTerm: number = 60): JourneyStep[] => {
  const steps: JourneyStep[] = [];
  
  // Advanced financing calculations based on user profile
  const bestFinancing = carData.financingOptions
    .filter(option => userProfile.creditScore >= option.creditScoreRequired)
    .sort((a, b) => a.apr - b.apr)[0] || carData.financingOptions[0];
  
  const downPayment = Math.max(bestFinancing.downPaymentMin, carData.msrp * 0.1);
  const loanAmount = carData.msrp - downPayment;
  const interestRate = bestFinancing.apr / 100;
  const monthlyPayment = (loanAmount * (interestRate / 12)) / (1 - Math.pow(1 + interestRate / 12, -loanTerm));
  
  // Advanced lease calculations
  const residualValue = carData.msrp * (carData.leaseDetails.residualPercentage / 100);
  const depreciation = (carData.msrp - residualValue) / carData.leaseDetails.term;
  const rentCharge = (carData.msrp + residualValue) * carData.leaseDetails.moneyFactor;
  const leaseMonthlyPayment = depreciation + rentCharge;
  
  // Calculate annual fuel/energy costs based on user's driving
  const annualFuelCost = carData.environmentalImpact.fuelCostPerYear * (userProfile.milesDrivenPerYear / 12000);
  const monthlyFuelCost = annualFuelCost / 12;
  
  // Life events simulation
  const generateLifeEvents = (): LifeEvent[] => {
    const events: LifeEvent[] = [];
    
    // Simulate realistic life events
    if (Math.random() > 0.7) {
      events.push({
        type: 'job_change',
        impact: Math.random() > 0.6 ? 'positive' : 'negative',
        description: 'Career change affects income',
        financialImpact: Math.random() > 0.6 ? 5000 : -3000,
        month: Math.floor(Math.random() * 60)
      });
    }
    
    if (userProfile.lifestyle.hasKids && Math.random() > 0.8) {
      events.push({
        type: 'family_growth',
        impact: 'neutral',
        description: 'Family needs change vehicle requirements',
        financialImpact: 0,
        month: Math.floor(Math.random() * 36)
      });
    }
    
    if (Math.random() > 0.85) {
      events.push({
        type: 'accident',
        impact: 'negative',
        description: 'Minor accident requires repairs',
        financialImpact: -2500,
        month: Math.floor(Math.random() * 60)
      });
    }
    
    return events;
  };
  
  const lifeEvents = generateLifeEvents();

  const seasons = ['spring', 'summer', 'fall', 'winter'] as const;
  const weatherConditions = ['sunny', 'rainy', 'snowy', 'stormy'] as const;

  for (let month = 0; month < loanTerm; month++) {
    const season = seasons[Math.floor(month / 3) % 4];
    const yearProgress = month / 12;
    
    // Advanced depreciation curve with market factors
    const baseDepreciation = Math.pow(1 - carData.depreciationRate, yearProgress);
    const marketAdjustment = carData.marketTrends.resaleValueTrend === 'strong' ? 1.1 : 
                            carData.marketTrends.resaleValueTrend === 'weak' ? 0.9 : 1.0;
    const currentCarValue = carData.msrp * baseDepreciation * marketAdjustment;
    
    // Calculate remaining loan balance
    const remainingBalance = month === 0 ? loanAmount : 
      loanAmount * Math.pow(1 + interestRate / 12, month) - 
      monthlyPayment * ((Math.pow(1 + interestRate / 12, month) - 1) / (interestRate / 12));
    
    const equityBuilt = Math.max(0, currentCarValue - Math.max(0, remainingBalance));
    
    // Advanced maintenance costs based on age and reliability
    const baseMaintenance = carData.maintenanceCostPerYear / 12;
    const ageMultiplier = 1 + (yearProgress * 0.5); // Increases with age
    const reliabilityMultiplier = (100 - carData.reliabilityScore) / 100 + 0.5;
    const monthlyMaintenance = month > 24 ? baseMaintenance * ageMultiplier * reliabilityMultiplier : 50;
    
    // Economic factors simulation
    const economicFactors = {
      interestRates: 5.5 + Math.sin(month * 0.1) * 1.5,
      gasPrice: 3.50 + Math.sin(month * 0.08) * 0.75,
      inflationRate: 2.5 + Math.cos(month * 0.05) * 1.2,
      usedCarMarket: (Math.random() > 0.7 ? 'hot' : Math.random() > 0.4 ? 'normal' : 'cold') as 'hot' | 'normal' | 'cold'
    };
    
    // Lease calculations with overage and wear
    const monthlyMileage = userProfile.milesDrivenPerYear / 12;
    const leaseAllowedMileage = carData.leaseDetails.mileageAllowance / 12;
    const mileageUsed = Math.min(monthlyMileage * (month + 1), carData.leaseDetails.mileageAllowance * (month + 1) / carData.leaseDetails.term);
    const overageMiles = Math.max(0, mileageUsed - (leaseAllowedMileage * (month + 1)));
    const overageCharges = overageMiles * carData.leaseDetails.overagePenalty;
    
    // Wear and tear based on driving and lifestyle
    const wearMultiplier = userProfile.lifestyle.cityDriving ? 1.3 : 
                          userProfile.lifestyle.weekendAdventurer ? 1.2 : 1.0;
    const wearAndTearCharges = (month / carData.leaseDetails.term) * 1500 * wearMultiplier;
    
    // Market events with more sophistication
    const marketEvents: string[] = [];
    if (month % 12 === 0) marketEvents.push(`${carData.year + Math.floor(month / 12)} model year announced`);
    if (month === 24) marketEvents.push('Mid-cycle refresh with updated features');
    if (month === 36) marketEvents.push('Next generation model development confirmed');
    if (month % 6 === 0 && Math.random() > 0.7) {
      marketEvents.push(`${carData.make} offers $${Math.floor(Math.random() * 2000) + 500} incentive`);
    }
    if (carData.category === 'electric' && Math.random() > 0.8) {
      marketEvents.push('EV infrastructure expansion announced in your area');
    }
    
    // Life events impact
    const monthLifeEvents = lifeEvents.filter(event => event.month === month);
    monthLifeEvents.forEach(event => {
      marketEvents.push(event.description);
    });
    
    // Tax considerations
    const businessUsePercentage = 0.3; // 30% business use assumption
    const annualTaxDeduction = (monthlyPayment * 12 + monthlyMaintenance * 12) * businessUsePercentage * 0.25; // 25% tax bracket
    const monthlyTaxBenefit = annualTaxDeduction / 12;
    
    // Satisfaction calculations with more factors
    const techSatisfaction = Math.max(0, carData.techRating - (yearProgress * 15)); // Tech becomes outdated
    const reliabilitySatisfaction = Math.max(60, carData.reliabilityScore - (yearProgress * 5));
    const overallBuySatisfaction = (techSatisfaction + reliabilitySatisfaction + (equityBuilt / 1000)) / 3;
    
    const newnessSatisfaction = Math.max(80, 100 - (month % 36) * 0.8); // Resets every lease
    const flexibilitySatisfaction = 90; // Always have flexibility to upgrade
    const overallLeaseSatisfaction = (newnessSatisfaction + flexibilitySatisfaction + carData.techRating) / 3;

    const step: JourneyStep = {
      month,
      season,
      buyScenario: {
        equity: equityBuilt,
        monthlyPayment: monthlyPayment,
        maintenance: monthlyMaintenance,
        insurance: carData.insurancePerMonth,
        fuel: monthlyFuelCost,
        registration: month % 12 === 0 ? 150 : 0,
        totalSpent: (monthlyPayment + carData.insurancePerMonth + monthlyFuelCost + monthlyMaintenance) * (month + 1) + downPayment + (Math.floor(month / 12) * 150),
        carValue: currentCarValue,
        satisfaction: Math.min(100, overallBuySatisfaction),
        repairRisk: Math.min(95, (100 - carData.reliabilityScore) * (1 + yearProgress)),
        taxDeductions: monthlyTaxBenefit * (month + 1),
        upgradeValue: Math.max(0, currentCarValue - remainingBalance)
      },
      leaseScenario: {
        monthlyPayment: leaseMonthlyPayment,
        insurance: carData.insurancePerMonth,
        fuel: monthlyFuelCost,
        totalSpent: (leaseMonthlyPayment + carData.insurancePerMonth + monthlyFuelCost) * (month + 1) + carData.leaseDetails.acquisitionFee,
        carCondition: Math.max(85, 100 - (month % 36) * 0.4), // Resets every lease
        upgradeOpportunity: month > 0 && month % carData.leaseDetails.term === 0,
        satisfaction: Math.min(100, overallLeaseSatisfaction),
        mileageUsed: mileageUsed,
        overageCharges: overageCharges,
        wearAndTearCharges: wearAndTearCharges
      },
      marketEvents,
      weatherCondition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      economicFactors,
      lifeEvents: monthLifeEvents
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

// Vehicle Selection Component
const VehicleSelector = ({ 
  vehicles, 
  selectedVehicle, 
  onSelect 
}: { 
  vehicles: CarData[];
  selectedVehicle: CarData;
  onSelect: (vehicle: CarData) => void;
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6">Select Vehicle to Compare</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            className={`relative p-6 rounded-2xl border transition-all cursor-pointer ${
              selectedVehicle.id === vehicle.id
                ? 'bg-blue-500/20 border-blue-500/40'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            onClick={() => onSelect(vehicle)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center mb-4">
              <h4 className="text-lg font-bold text-white">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h4>
              <div className="text-2xl font-bold text-green-400">
                ${vehicle.msrp.toLocaleString()}
              </div>
              <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                vehicle.category === 'electric' ? 'bg-green-500/20 text-green-400' :
                vehicle.category === 'luxury' ? 'bg-purple-500/20 text-purple-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {vehicle.category.toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Fuel Efficiency:</span>
                <span className="text-white">{vehicle.fuelEfficiency} {vehicle.category === 'electric' ? 'MPGe' : 'MPG'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Reliability:</span>
                <span className="text-white">{vehicle.reliabilityScore}/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Safety:</span>
                <span className="text-white">{vehicle.safetyRating}/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tech:</span>
                <span className="text-white">{vehicle.techRating}/100</span>
              </div>
            </div>
            
            {/* Current incentives */}
            {vehicle.incentives.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="text-xs text-yellow-400 font-semibold mb-1">Active Incentives:</div>
                {vehicle.incentives.slice(0, 2).map((incentive, idx) => (
                  <div key={idx} className="text-xs text-gray-300">
                    • ${incentive.amount.toLocaleString()} {incentive.description}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Advanced Analysis Panel
const AdvancedAnalysisPanel = ({ 
  analysis, 
  vehicle, 
  userProfile 
}: { 
  analysis: ComparisonAnalysis;
  vehicle: CarData;
  userProfile: UserProfile;
}) => {
  return (
    <div className="space-y-8">
      {/* Risk Assessment */}
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-red-400" />
          Risk Assessment
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Buying Risks</h4>
            <div className="space-y-2">
              {analysis.riskAssessment.buyRisks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{risk}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Leasing Risks</h4>
            <div className="space-y-2">
              {analysis.riskAssessment.leaseRisks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            analysis.riskAssessment.overallRisk === 'low' ? 'bg-green-500/20 text-green-400' :
            analysis.riskAssessment.overallRisk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            Overall Risk: {analysis.riskAssessment.overallRisk.toUpperCase()}
          </div>
        </div>
      </div>
      
      {/* Scenario Analysis */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">Scenario Analysis</h3>
        
        <div className="space-y-6">
          {Object.entries(analysis.scenarios).map(([scenarioName, scenario]) => (
            <motion.div
              key={scenarioName}
              className="p-6 bg-white/5 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white capitalize">
                  {scenarioName.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="text-sm text-gray-400">
                  {Math.round(scenario.probability * 100)}% likely
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-400">Buy Total</div>
                  <div className="text-lg font-bold text-blue-400">
                    ${scenario.buyTotal.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Lease Total</div>
                  <div className="text-lg font-bold text-green-400">
                    ${scenario.leaseTotal.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Buy Equity</div>
                  <div className="text-lg font-bold text-purple-400">
                    ${scenario.buyEquity.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-300">{scenario.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Personal Factors */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">Personalized Analysis</h3>
        
        <div className="space-y-4">
          {analysis.personalizedFactors.map((factor, idx) => (
            <motion.div
              key={idx}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{factor}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-white mb-4">Key Insights</h4>
          <div className="space-y-2">
            {analysis.keyInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
  const [selectedMetric, setSelectedMetric] = useState<'cost' | 'satisfaction' | 'equity'>('cost');
  const [selectedVehicle, setSelectedVehicle] = useState<CarData>(mockVehicleDatabase[0]);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [comparisonVehicles, setComparisonVehicles] = useState<CarData[]>([mockVehicleDatabase[0]]);
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  
  // Initialize journey data with proper dependency management
  const [journeyData, setJourneyData] = useState<JourneyStep[]>([]);
  
  // Update journey data when vehicle or profile changes
  useEffect(() => {
    if (selectedVehicle && userProfile) {
      const newJourneyData = generateAdvancedJourneyData(selectedVehicle, userProfile);
      setJourneyData(newJourneyData);
      setCurrentStep(0);
    }
  }, [selectedVehicle, userProfile]);

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

  // Advanced Recommendation Engine
  const calculateAdvancedRecommendation = (carData: CarData, userProfile: UserProfile, journeyData: JourneyStep[]): ComparisonAnalysis => {
    const finalStep = journeyData[journeyData.length - 1];
    const buyTotalCost = finalStep.buyScenario.totalSpent;
    const leaseTotalCost = finalStep.leaseScenario.totalSpent;
    const buyEquity = finalStep.buyScenario.equity;
    
    // Multi-factor scoring system
    const priorities = userProfile.priorities;
    
    // Buy scenario scoring
    const buyFinancialScore = (
      (priorities.totalCost * (leaseTotalCost > buyTotalCost ? 10 : 5)) +
      (priorities.monthlyCost * (finalStep.leaseScenario.monthlyPayment < finalStep.buyScenario.monthlyPayment ? 3 : 8)) +
      (priorities.ownership * 10)
    ) / 3;
    
    const buyLifestyleScore = (
      (priorities.flexibility * 3) +
      (priorities.reliability * (carData.reliabilityScore / 10)) +
      (priorities.environmental * (carData.environmentalImpact.environmentalScore / 10))
    ) / 3;
    
    const buyOverallScore = (buyFinancialScore + buyLifestyleScore) / 2;
    
    // Lease scenario scoring
    const leaseFinancialScore = (
      (priorities.monthlyCost * (finalStep.leaseScenario.monthlyPayment < finalStep.buyScenario.monthlyPayment ? 10 : 5)) +
      (priorities.totalCost * 5) + // Lease never wins on total cost
      (priorities.ownership * 2)
    ) / 3;
    
    const leaseLifestyleScore = (
      (priorities.flexibility * 8) +
      (priorities.latestTech * (carData.techRating / 10)) +
      (priorities.reliability * 8) // Always under warranty
    ) / 3;
    
    const leaseOverallScore = (leaseFinancialScore + leaseLifestyleScore) / 2;
    
    // Lifestyle adjustments
    let lifestyleAdjustment = 0;
    if (userProfile.lifestyle.hasKids && carData.category === 'sedan') lifestyleAdjustment += 1;
    if (userProfile.lifestyle.longCommute && carData.fuelEfficiency > 30) lifestyleAdjustment += 1;
    if (userProfile.lifestyle.carEnthusiast) lifestyleAdjustment += 2; // Enthusiasts prefer buying
    if (userProfile.milesDrivenPerYear > carData.leaseDetails.mileageAllowance) lifestyleAdjustment += 3;
    
    const finalBuyScore = buyOverallScore + lifestyleAdjustment;
    const finalLeaseScore = leaseOverallScore;
    
    const recommendation = finalBuyScore > finalLeaseScore ? 'buy' : 'lease';
    const confidence = Math.min(0.95, Math.abs(finalBuyScore - finalLeaseScore) / 10);
    const totalSavings = Math.abs(buyTotalCost - leaseTotalCost);
    const breakEvenPoint = Math.ceil((buyTotalCost - leaseTotalCost) / ((finalStep.buyScenario.monthlyPayment - finalStep.leaseScenario.monthlyPayment) || 1));
    
    // Risk Assessment
    const buyRisks = [];
    const leaseRisks = [];
    
    if (carData.reliabilityScore < 80) buyRisks.push('Higher maintenance costs as vehicle ages');
    if (carData.depreciationRate > 0.2) buyRisks.push('Rapid depreciation reduces equity building');
    if (userProfile.milesDrivenPerYear > 20000) buyRisks.push('High mileage reduces resale value');
    
    if (userProfile.milesDrivenPerYear > carData.leaseDetails.mileageAllowance) {
      leaseRisks.push(`Mileage overage charges: $${((userProfile.milesDrivenPerYear - carData.leaseDetails.mileageAllowance) * carData.leaseDetails.overagePenalty * 3).toLocaleString()}`);
    }
    if (userProfile.lifestyle.weekendAdventurer) leaseRisks.push('Wear and tear charges for adventure use');
    leaseRisks.push('No equity building - all payments are expenses');
    
    const overallRisk = buyRisks.length + leaseRisks.length > 4 ? 'high' : 
                       buyRisks.length + leaseRisks.length > 2 ? 'medium' : 'low';
    
    // Scenario Analysis
    const scenarios = {
      bestCase: {
        buyTotal: buyTotalCost * 0.9, // 10% better than expected
        leaseTotal: leaseTotalCost * 1.05, // 5% worse due to charges
        buyEquity: buyEquity * 1.2, // Strong resale market
        probability: 0.25,
        description: 'Strong resale market, minimal maintenance issues'
      },
      worstCase: {
        buyTotal: buyTotalCost * 1.3, // Major repairs
        leaseTotal: leaseTotalCost * 1.15, // Overage and wear charges
        buyEquity: buyEquity * 0.7, // Weak resale market
        probability: 0.15,
        description: 'Major repairs needed, weak resale market'
      },
      mostLikely: {
        buyTotal: buyTotalCost,
        leaseTotal: leaseTotalCost,
        buyEquity: buyEquity,
        probability: 0.6,
        description: 'Expected scenario based on current analysis'
      }
    };
    
    // Personalized factors
    const personalizedFactors = [];
    if (userProfile.creditScore > 750) personalizedFactors.push('Excellent credit qualifies for best financing rates');
    if (userProfile.lifestyle.hasKids) personalizedFactors.push('Family needs prioritize reliability and space');
    if (userProfile.milesDrivenPerYear > 15000) personalizedFactors.push('High mileage favors buying over leasing');
    if (priorities.environmental > 7) personalizedFactors.push('Environmental priorities favor efficient vehicles');
    
    // Key insights
    const keyInsights = [];
    if (recommendation === 'buy') {
      keyInsights.push(`Building $${buyEquity.toLocaleString()} in equity over ${loanTerm} months`);
      keyInsights.push('No mileage restrictions or wear charges');
      if (carData.reliabilityScore > 85) keyInsights.push('High reliability score reduces ownership risks');
    } else {
      keyInsights.push(`Lower monthly payments by $${Math.abs(finalStep.buyScenario.monthlyPayment - finalStep.leaseScenario.monthlyPayment).toFixed(0)}`);
      keyInsights.push('Always drive latest technology and safety features');
      keyInsights.push('Warranty coverage eliminates repair risks');
    }
    
    return {
      recommendation,
      confidence,
      totalSavings,
      breakEvenPoint,
      riskAssessment: {
        buyRisks,
        leaseRisks,
        overallRisk
      },
      scenarios,
      personalizedFactors,
      keyInsights
    };
  };

  // Calculate recommendation only when we have journey data
  const recommendation = useMemo(() => {
    if (journeyData.length === 0 || !selectedVehicle || !userProfile) {
      return {
        recommendation: 'buy' as const,
        confidence: 0.5,
        totalSavings: 0,
        breakEvenPoint: 0,
        riskAssessment: {
          buyRisks: [],
          leaseRisks: [],
          overallRisk: 'low' as const
        },
        scenarios: {
          bestCase: { buyTotal: 0, leaseTotal: 0, buyEquity: 0, probability: 0, description: '' },
          worstCase: { buyTotal: 0, leaseTotal: 0, buyEquity: 0, probability: 0, description: '' },
          mostLikely: { buyTotal: 0, leaseTotal: 0, buyEquity: 0, probability: 0, description: '' }
        },
        personalizedFactors: [],
        keyInsights: []
      };
    }
    return calculateAdvancedRecommendation(selectedVehicle, userProfile, journeyData);
  }, [selectedVehicle, userProfile, journeyData]);

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

            {/* Vehicle Selection */}
            <VehicleSelector 
              vehicles={mockVehicleDatabase}
              selectedVehicle={selectedVehicle}
              onSelect={setSelectedVehicle}
            />
            
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
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">MSRP</div>
                      <div className="text-lg font-bold text-white">${selectedVehicle.msrp.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <Fuel className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Efficiency</div>
                      <div className="text-lg font-bold text-white">{selectedVehicle.fuelEfficiency} {selectedVehicle.category === 'electric' ? 'MPGe' : 'MPG'}</div>
                    </div>
                    <div className="text-center">
                      <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Reliability</div>
                      <div className="text-lg font-bold text-white">{selectedVehicle.reliabilityScore}/100</div>
                    </div>
                    <div className="text-center">
                      <Shield className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Safety</div>
                      <div className="text-lg font-bold text-white">{selectedVehicle.safetyRating}/100</div>
                    </div>
                    <div className="text-center">
                      <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-400">Tech</div>
                      <div className="text-lg font-bold text-white">{selectedVehicle.techRating}/100</div>
                    </div>
                  </div>
                  
                  {/* Environmental Impact */}
                  {selectedVehicle.environmentalImpact.environmentalScore > 70 && (
                    <div className="mt-4 p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span className="text-green-400 font-semibold text-sm">Eco-Friendly Choice</span>
                      </div>
                      <div className="text-xs text-gray-300">
                        Environmental Score: {selectedVehicle.environmentalImpact.environmentalScore}/100
                        {selectedVehicle.environmentalImpact.greenIncentives > 0 && (
                          <span className="ml-2 text-green-400">
                            • ${selectedVehicle.environmentalImpact.greenIncentives.toLocaleString()} in incentives
                          </span>
                        )}
                      </div>
                    </div>
                  )}
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
                    <div className="text-sm text-gray-400 mb-4">Confidence</div>
                    
                    <div className="text-lg font-bold text-green-400 mb-1">
                      ${recommendation.totalSavings.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Potential Savings</div>
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
            {currentStepData && journeyData.length > 0 && (
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
                  className="mb-8"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <AdvancedAnalysisPanel
                    analysis={recommendation}
                    vehicle={selectedVehicle}
                    userProfile={userProfile}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Final Recommendation */}
            {currentStep >= maxSteps - 1 && journeyData.length > 0 && (
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
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
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
                    <div className="text-gray-400">Total Savings</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-blue-400 mb-2">
                      {recommendation.breakEvenPoint} mo
                    </div>
                    <div className="text-gray-400">Break-even Point</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      {recommendation.recommendation === 'buy' ? 
                        `$${Math.round(journeyData[maxSteps - 1].buyScenario.equity).toLocaleString()}` : 
                        'Latest'
                      }
                    </div>
                    <div className="text-gray-400">
                      {recommendation.recommendation === 'buy' ? 'Equity Built' : 'Technology'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-white/5 rounded-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendation.keyInsights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{insight}</span>
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