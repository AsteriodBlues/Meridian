'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  CreditCard, Clock, TrendingUp, Users, 
  Target, DollarSign, AlertCircle, CheckCircle
} from 'lucide-react';

interface CreditFactor {
  id: string;
  name: string;
  impact: number; // 0-100
  value: string;
  icon: React.ElementType;
  color: string;
  description: string;
  weight: number; // percentage of total score
}

interface CreditFactorDNAProps {
  factors: CreditFactor[];
  className?: string;
  animated?: boolean;
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

export default function CreditFactorDNA({ 
  factors, 
  className = '',
  animated = true 
}: CreditFactorDNAProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
  const [hoveredStrand, setHoveredStrand] = useState<number | null>(null);
  const helixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default factors if none provided
  const defaultFactors: CreditFactor[] = [
    {
      id: 'payment-history',
      name: 'Payment History',
      impact: 85,
      value: 'Excellent',
      icon: Clock,
      color: '#10b981',
      description: 'Your track record of making payments on time',
      weight: 35
    },
    {
      id: 'credit-utilization',
      name: 'Credit Utilization',
      impact: 70,
      value: '25%',
      icon: CreditCard,
      color: '#3b82f6',
      description: 'How much credit you use vs. available credit',
      weight: 30
    },
    {
      id: 'credit-length',
      name: 'Credit History Length',
      impact: 78,
      value: '8 years',
      icon: TrendingUp,
      color: '#8b5cf6',
      description: 'How long you have been using credit',
      weight: 15
    },
    {
      id: 'credit-mix',
      name: 'Credit Mix',
      impact: 65,
      value: 'Good',
      icon: Target,
      color: '#f59e0b',
      description: 'Variety of credit accounts you have',
      weight: 10
    },
    {
      id: 'new-credit',
      name: 'New Credit',
      impact: 90,
      value: 'No recent inquiries',
      icon: Users,
      color: '#06b6d4',
      description: 'Recent credit applications and new accounts',
      weight: 10
    }
  ];

  const creditFactors = factors.length > 0 ? factors : defaultFactors;
  
  // Animation values
  const helixRotation = useMotionValue(0);
  const strandScale = useSpring(1, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (!mounted || !animated) return;

    const animateHelix = () => {
      helixRotation.set(helixRotation.get() + 0.5);
      requestAnimationFrame(animateHelix);
    };
    animateHelix();
  }, [mounted, animated, helixRotation]);

  // Generate DNA strand points
  const generateStrandPoints = (strandIndex: number, factorIndex: number) => {
    const points = [];
    const height = 400;
    const segments = 50;
    const radius = 80;
    const helixHeight = height / segments;
    
    for (let i = 0; i < segments; i++) {
      const y = i * helixHeight;
      const angle = (i * 0.3) + (strandIndex * Math.PI) + (factorIndex * 0.1);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      points.push({ x, y, z, i });
    }
    
    return points;
  };

  // Create connecting bars between strands
  const generateConnectors = (factor: CreditFactor, index: number) => {
    const connectors = [];
    const numConnectors = Math.floor(factor.impact / 10);
    
    for (let i = 0; i < numConnectors; i++) {
      const y = 40 + (i * 35);
      const intensity = factor.impact / 100;
      
      connectors.push({
        id: `${factor.id}-connector-${i}`,
        y,
        intensity,
        color: factor.color
      });
    }
    
    return connectors;
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 80) return '#10b981';
    if (impact >= 60) return '#3b82f6';
    if (impact >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getImpactLabel = (impact: number) => {
    if (impact >= 80) return 'Excellent';
    if (impact >= 60) return 'Good';
    if (impact >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`relative ${className}`}>
      {/* DNA Helix Container */}
      <div className="relative h-96 overflow-hidden">
        <motion.div
          ref={helixRef}
          className="absolute inset-0 flex justify-center"
          style={{
            perspective: 1000,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* DNA Strands */}
          {creditFactors.map((factor, factorIndex) => (
            <div key={factor.id} className="absolute">
              {/* Left Strand */}
              <div className="absolute">
                {generateStrandPoints(0, factorIndex).map((point, i) => (
                  <motion.div
                    key={`left-${i}`}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: factor.color,
                      left: point.x + 150,
                      top: point.y,
                      zIndex: Math.round(point.z + 100),
                      boxShadow: `0 0 10px ${factor.color}60`
                    }}
                    animate={{
                      scale: hoveredStrand === factorIndex ? 1.5 : 1,
                      rotateY: useTransform(helixRotation, (r) => r + point.i * 2)
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    onMouseEnter={() => setHoveredStrand(factorIndex)}
                    onMouseLeave={() => setHoveredStrand(null)}
                  />
                ))}
              </div>

              {/* Right Strand */}
              <div className="absolute">
                {generateStrandPoints(1, factorIndex).map((point, i) => (
                  <motion.div
                    key={`right-${i}`}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: factor.color,
                      left: point.x + 150,
                      top: point.y,
                      zIndex: Math.round(point.z + 100),
                      boxShadow: `0 0 10px ${factor.color}60`
                    }}
                    animate={{
                      scale: hoveredStrand === factorIndex ? 1.5 : 1,
                      rotateY: useTransform(helixRotation, (r) => r + point.i * 2)
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    onMouseEnter={() => setHoveredStrand(factorIndex)}
                    onMouseLeave={() => setHoveredStrand(null)}
                  />
                ))}
              </div>

              {/* Connecting Bars */}
              {generateConnectors(factor, factorIndex).map((connector) => (
                <motion.div
                  key={connector.id}
                  className="absolute h-1 rounded-full"
                  style={{
                    backgroundColor: connector.color,
                    width: 160,
                    left: 70,
                    top: connector.y,
                    opacity: connector.intensity,
                    boxShadow: `0 0 8px ${connector.color}40`
                  }}
                  animate={{
                    scaleY: hoveredStrand === factorIndex ? 2 : 1,
                    opacity: hoveredStrand === factorIndex ? 1 : connector.intensity
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  onMouseEnter={() => setHoveredStrand(factorIndex)}
                  onMouseLeave={() => setHoveredStrand(null)}
                />
              ))}
            </div>
          ))}

          {/* Floating Particles */}
          {mounted && Array.from({ length: 20 }).map((_, i) => {
            const xSeed = `particle-x-${i}`;
            const ySeed = `particle-y-${i}`;
            const sizeSeed = `particle-size-${i}`;
            const delaySeed = `particle-delay-${i}`;
            const durationSeed = `particle-duration-${i}`;
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: 1 + seededRandom(sizeSeed) * 3,
                  height: 1 + seededRandom(sizeSeed) * 3,
                  left: 50 + seededRandom(xSeed) * 200,
                  top: seededRandom(ySeed) * 400
                }}
                animate={{
                  y: [0, -100, 0],
                  x: [0, seededRandom(xSeed) * 40 - 20, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + seededRandom(durationSeed) * 4,
                  delay: seededRandom(delaySeed) * 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Factor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {creditFactors.map((factor, index) => {
          const IconComponent = factor.icon;
          const isSelected = selectedFactor === factor.id;
          const isHovered = hoveredStrand === index;
          
          return (
            <motion.div
              key={factor.id}
              className={`p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all ${
                isSelected || isHovered
                  ? 'border-white/30 bg-white/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => setSelectedFactor(isSelected ? null : factor.id)}
              onMouseEnter={() => setHoveredStrand(index)}
              onMouseLeave={() => setHoveredStrand(null)}
              whileHover={{ y: -5 }}
              layout
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: `${factor.color}20` }}
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    boxShadow: isHovered ? `0 0 20px ${factor.color}40` : 'none'
                  }}
                >
                  <IconComponent 
                    className="w-5 h-5" 
                    style={{ color: factor.color }} 
                  />
                </motion.div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{factor.name}</div>
                  <div className="text-gray-400 text-xs">{factor.weight}% of score</div>
                </div>
                <div className="text-right">
                  <div 
                    className="text-sm font-bold"
                    style={{ color: getImpactColor(factor.impact) }}
                  >
                    {getImpactLabel(factor.impact)}
                  </div>
                  <div className="text-gray-400 text-xs">{factor.value}</div>
                </div>
              </div>

              {/* Impact Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Impact Score</span>
                  <span>{factor.impact}/100</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: factor.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.impact}%` }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                  />
                </div>
              </div>

              {/* Description */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10 pt-4"
                  >
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {factor.description}
                    </p>
                    
                    {/* Improvement Tips */}
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-medium">Improvement Tips</span>
                      </div>
                      <ul className="text-gray-400 text-xs space-y-1">
                        {factor.id === 'payment-history' && (
                          <>
                            <li>• Set up automatic payments</li>
                            <li>• Pay at least minimum on time</li>
                            <li>• Consider payment reminders</li>
                          </>
                        )}
                        {factor.id === 'credit-utilization' && (
                          <>
                            <li>• Keep utilization below 30%</li>
                            <li>• Pay down existing balances</li>
                            <li>• Request credit limit increases</li>
                          </>
                        )}
                        {factor.id === 'credit-length' && (
                          <>
                            <li>• Keep old accounts open</li>
                            <li>• Use older cards occasionally</li>
                            <li>• Avoid closing first credit card</li>
                          </>
                        )}
                        {factor.id === 'credit-mix' && (
                          <>
                            <li>• Consider different account types</li>
                            <li>• Mix of revolving and installment</li>
                            <li>• Don't rush to open new accounts</li>
                          </>
                        )}
                        {factor.id === 'new-credit' && (
                          <>
                            <li>• Limit new credit applications</li>
                            <li>• Space out credit inquiries</li>
                            <li>• Only apply when necessary</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* DNA Strand Indicator */}
              <div className="absolute -right-2 top-4">
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: factor.color }}
                  animate={{
                    scale: isHovered ? 1.5 : 1,
                    boxShadow: isHovered ? `0 0 15px ${factor.color}60` : 'none'
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall Score Impact */}
      <motion.div
        className="mt-8 p-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="text-center">
          <h3 className="text-white font-bold text-lg mb-4">Overall Credit Health</h3>
          <div className="flex justify-center items-center gap-8">
            {creditFactors.map((factor, index) => (
              <motion.div
                key={factor.id}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                onMouseEnter={() => setHoveredStrand(index)}
                onMouseLeave={() => setHoveredStrand(null)}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${factor.color}20`, border: `2px solid ${factor.color}` }}
                >
                  <span className="text-white font-bold text-sm">{factor.weight}%</span>
                </div>
                <div className="text-gray-400 text-xs">{factor.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>
    </div>
  );
}