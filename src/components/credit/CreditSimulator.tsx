'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Calculator, TrendingUp, TrendingDown, RotateCcw, Play,
  CreditCard, DollarSign, Calendar, Target, Zap, CheckCircle
} from 'lucide-react';

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  actions: SimulationAction[];
  expectedImpact: number;
  timeframe: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface SimulationAction {
  type: 'payment' | 'utilization' | 'account' | 'inquiry';
  description: string;
  impact: number;
  delay: number; // months
}

interface CreditSimulatorProps {
  currentScore: number;
  className?: string;
  onScenarioSelect?: (scenario: SimulationScenario) => void;
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

export default function CreditSimulator({ 
  currentScore, 
  className = '',
  onScenarioSelect 
}: CreditSimulatorProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [projectedScore, setProjectedScore] = useState(currentScore);
  const [customActions, setCustomActions] = useState<SimulationAction[]>([]);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'custom'>('scenarios');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Predefined scenarios
  const scenarios: SimulationScenario[] = [
    {
      id: 'pay-down-debt',
      name: 'Pay Down Credit Cards',
      description: 'Reduce credit utilization from 30% to 10%',
      actions: [
        {
          type: 'utilization',
          description: 'Pay down $5,000 in credit card debt',
          impact: 25,
          delay: 1
        },
        {
          type: 'utilization',
          description: 'Maintain low utilization',
          impact: 15,
          delay: 3
        }
      ],
      expectedImpact: 40,
      timeframe: '3-6 months',
      difficulty: 'medium'
    },
    {
      id: 'perfect-payments',
      name: 'Perfect Payment History',
      description: 'Make all payments on time for 12 months',
      actions: [
        {
          type: 'payment',
          description: 'On-time payments for 6 months',
          impact: 20,
          delay: 6
        },
        {
          type: 'payment',
          description: 'Continue perfect payment streak',
          impact: 25,
          delay: 12
        }
      ],
      expectedImpact: 45,
      timeframe: '12 months',
      difficulty: 'easy'
    },
    {
      id: 'credit-mix',
      name: 'Diversify Credit Mix',
      description: 'Add an installment loan to improve credit mix',
      actions: [
        {
          type: 'account',
          description: 'Open personal loan account',
          impact: -5,
          delay: 1
        },
        {
          type: 'account',
          description: 'Establish payment history',
          impact: 15,
          delay: 6
        },
        {
          type: 'account',
          description: 'Long-term benefit from mix',
          impact: 20,
          delay: 12
        }
      ],
      expectedImpact: 30,
      timeframe: '12-18 months',
      difficulty: 'hard'
    },
    {
      id: 'limit-increase',
      name: 'Request Credit Limit Increases',
      description: 'Increase total available credit by $10,000',
      actions: [
        {
          type: 'utilization',
          description: 'Request credit line increases',
          impact: 15,
          delay: 1
        },
        {
          type: 'utilization',
          description: 'Improved utilization ratio',
          impact: 20,
          delay: 3
        }
      ],
      expectedImpact: 35,
      timeframe: '1-3 months',
      difficulty: 'easy'
    },
    {
      id: 'dispute-errors',
      name: 'Dispute Credit Report Errors',
      description: 'Remove incorrect negative items from credit reports',
      actions: [
        {
          type: 'payment',
          description: 'Dispute incorrect late payments',
          impact: 30,
          delay: 2
        },
        {
          type: 'utilization',
          description: 'Correct inaccurate balances',
          impact: 15,
          delay: 3
        }
      ],
      expectedImpact: 45,
      timeframe: '2-4 months',
      difficulty: 'medium'
    }
  ];

  // Run simulation
  const runSimulation = async (scenario: SimulationScenario) => {
    setIsSimulating(true);
    setSimulationProgress(0);
    setProjectedScore(currentScore);

    let currentSimScore = currentScore;
    const totalSteps = scenario.actions.length * 10;
    let step = 0;

    for (const action of scenario.actions) {
      // Simulate delay
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        step++;
        setSimulationProgress((step / totalSteps) * 100);
        
        if (i === 9) {
          // Apply impact at the end of each action
          currentSimScore = Math.min(850, Math.max(300, currentSimScore + action.impact));
          setProjectedScore(currentSimScore);
        }
      }
    }

    setIsSimulating(false);
    onScenarioSelect?.(scenario);
  };

  const resetSimulation = () => {
    setProjectedScore(currentScore);
    setSimulationProgress(0);
    setIsSimulating(false);
    setSelectedScenario(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return '#10b981';
    if (score >= 740) return '#3b82f6';
    if (score >= 670) return '#8b5cf6';
    if (score >= 580) return '#f59e0b';
    return '#ef4444';
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
          Credit Score Simulator
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Explore what-if scenarios and see how different actions could impact your credit score
        </motion.p>
      </div>

      {/* Current vs Projected Score Display */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Current Score */}
        <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">Current Score</div>
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: getScoreColor(currentScore) }}
            >
              {currentScore}
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ 
                  width: `${((currentScore - 300) / 550) * 100}%`,
                  backgroundColor: getScoreColor(currentScore)
                }}
              />
            </div>
          </div>
        </div>

        {/* Projected Score */}
        <div className="p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/20 rounded-2xl">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">Projected Score</div>
            <motion.div 
              className="text-4xl font-bold mb-2"
              style={{ color: getScoreColor(projectedScore) }}
              animate={{ 
                scale: isSimulating ? [1, 1.1, 1] : 1,
                textShadow: isSimulating ? [
                  '0 0 0px rgba(255,255,255,0)',
                  `0 0 20px ${getScoreColor(projectedScore)}80`,
                  '0 0 0px rgba(255,255,255,0)'
                ] : 'none'
              }}
              transition={{ duration: 0.5, repeat: isSimulating ? Infinity : 0 }}
            >
              {Math.round(projectedScore)}
            </motion.div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full rounded-full"
                style={{ backgroundColor: getScoreColor(projectedScore) }}
                animate={{ width: `${((projectedScore - 300) / 550) * 100}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 30 }}
              />
            </div>
            
            {/* Change Indicator */}
            <AnimatePresence>
              {projectedScore !== currentScore && (
                <motion.div
                  className="mt-3 flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    projectedScore > currentScore
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {projectedScore > currentScore ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(projectedScore - currentScore)} points</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <AnimatePresence>
        {isSimulating && (
          <motion.div
            className="mb-6 p-4 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Calculator className="w-5 h-5 text-blue-400" />
              </motion.div>
              <span className="text-white font-medium">Running Simulation...</span>
              <span className="text-gray-400 text-sm">{Math.round(simulationProgress)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{ width: `${simulationProgress}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 30 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'scenarios', label: 'Pre-built Scenarios', icon: Target },
          { key: 'custom', label: 'Custom Simulation', icon: Calculator }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <motion.button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              className={`p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => setSelectedScenario(scenario.id)}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg mb-1">{scenario.name}</h4>
                  <p className="text-gray-400 text-sm">{scenario.description}</p>
                </div>
                <div 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${getDifficultyColor(scenario.difficulty)}20`,
                    color: getDifficultyColor(scenario.difficulty)
                  }}
                >
                  {scenario.difficulty}
                </div>
              </div>

              {/* Expected Impact */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Expected Impact</div>
                  <div className="text-green-400 font-bold text-lg">+{scenario.expectedImpact}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Timeframe</div>
                  <div className="text-white font-medium text-sm">{scenario.timeframe}</div>
                </div>
              </div>

              {/* Actions Preview */}
              <div className="space-y-2">
                {scenario.actions.slice(0, 2).map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      action.impact > 0 ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className="text-gray-400">{action.description}</span>
                  </div>
                ))}
                {scenario.actions.length > 2 && (
                  <div className="text-gray-500 text-xs">+{scenario.actions.length - 2} more actions</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <motion.button
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-sm font-medium transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    runSimulation(scenario);
                  }}
                  disabled={isSimulating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-4 h-4" />
                  Run Simulation
                </motion.button>
                
                {projectedScore !== currentScore && (
                  <motion.button
                    className="p-2 bg-gray-600 hover:bg-gray-700 rounded-xl text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetSimulation();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Custom Tab */}
      {activeTab === 'custom' && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <h4 className="text-white font-bold text-lg mb-4">Build Custom Scenario</h4>
            <p className="text-gray-400 text-sm mb-6">
              Create your own credit improvement plan by selecting specific actions and timeframes.
            </p>
            
            {/* Coming Soon */}
            <div className="text-center py-12">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
              <h5 className="text-white font-bold text-xl mb-2">Coming Soon</h5>
              <p className="text-gray-400 max-w-md mx-auto">
                Custom scenario builder with advanced modeling and personalized recommendations.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Panel */}
      <AnimatePresence>
        {projectedScore !== currentScore && !isSimulating && (
          <motion.div
            className="mt-8 p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-xl border border-green-500/20 rounded-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-white font-bold">Simulation Complete!</h4>
                <p className="text-gray-400 text-sm">Your projected credit score improvement</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-gray-400 text-sm">Score Change</div>
                <div className="text-green-400 font-bold text-2xl">
                  +{projectedScore - currentScore}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">New Score</div>
                <div className="text-white font-bold text-2xl">{Math.round(projectedScore)}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm">Improvement</div>
                <div className="text-cyan-400 font-bold text-2xl">
                  {(((projectedScore - currentScore) / currentScore) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 10 }).map((_, i) => {
          const xSeed = `sim-particle-x-${i}`;
          const ySeed = `sim-particle-y-${i}`;
          const sizeSeed = `sim-particle-size-${i}`;
          const delaySeed = `sim-particle-delay-${i}`;
          const durationSeed = `sim-particle-duration-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-400/10"
              style={{
                width: 2 + seededRandom(sizeSeed) * 6,
                height: 2 + seededRandom(sizeSeed) * 6,
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -200, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 5 + seededRandom(durationSeed) * 10,
                delay: seededRandom(delaySeed) * 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}