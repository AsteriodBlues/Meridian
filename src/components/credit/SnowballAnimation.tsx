'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Snowflake, ChevronDown, Zap, Target, TrendingUp,
  Play, Pause, RotateCcw, Settings, Award
} from 'lucide-react';

interface DebtSnowball {
  id: string;
  name: string;
  balance: number;
  originalBalance: number;
  minPayment: number;
  interestRate: number;
  size: number; // Visual size for animation
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  color: string;
}

interface SnowballAnimationProps {
  debts: any[];
  monthlyExtra: number;
  className?: string;
  onDebtPaidOff?: (debt: DebtSnowball) => void;
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

export default function SnowballAnimation({ 
  debts, 
  monthlyExtra = 500,
  className = '',
  onDebtPaidOff 
}: SnowballAnimationProps) {
  const [mounted, setMounted] = useState(false);
  const [snowballs, setSnowballs] = useState<DebtSnowball[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [selectedSnowball, setSelectedSnowball] = useState<string | null>(null);
  const [showPhysics, setShowPhysics] = useState(true);
  const [paidOffDebts, setPaidOffDebts] = useState<string[]>([]);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default debts if none provided
  const defaultDebts = [
    {
      id: 'cc1',
      name: 'Credit Card 1',
      balance: 2500,
      originalBalance: 5000,
      minPayment: 75,
      interestRate: 24.99
    },
    {
      id: 'cc2',
      name: 'Credit Card 2',
      balance: 5200,
      originalBalance: 8000,
      minPayment: 120,
      interestRate: 19.99
    },
    {
      id: 'loan1',
      name: 'Personal Loan',
      balance: 8500,
      originalBalance: 12000,
      minPayment: 250,
      interestRate: 12.50
    },
    {
      id: 'auto1',
      name: 'Auto Loan',
      balance: 15000,
      originalBalance: 25000,
      minPayment: 380,
      interestRate: 6.75
    }
  ];

  const debtData = debts.length > 0 ? debts : defaultDebts;

  // Initialize snowballs
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const initialSnowballs: DebtSnowball[] = debtData.map((debt, index) => {
      const size = Math.max(40, Math.min(120, (debt.balance / 25000) * 120));
      const xSeed = `snowball-x-${debt.id}`;
      const ySeed = `snowball-y-${debt.id}`;
      const vxSeed = `snowball-vx-${debt.id}`;
      const vySeed = `snowball-vy-${debt.id}`;
      
      return {
        id: debt.id,
        name: debt.name,
        balance: debt.balance,
        originalBalance: debt.originalBalance,
        minPayment: debt.minPayment,
        interestRate: debt.interestRate,
        size,
        x: size/2 + seededRandom(xSeed) * (containerWidth - size),
        y: size/2 + seededRandom(ySeed) * (containerHeight - size),
        velocityX: (seededRandom(vxSeed) - 0.5) * 0.5,
        velocityY: (seededRandom(vySeed) - 0.5) * 0.5,
        color: [
          '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
          '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
        ][index % 8]
      };
    });

    setSnowballs(initialSnowballs);
  }, [mounted, debtData]);

  // Physics simulation
  useEffect(() => {
    if (!isAnimating || !showPhysics || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    const animate = () => {
      setSnowballs(prevSnowballs => {
        return prevSnowballs.map(snowball => {
          if (paidOffDebts.includes(snowball.id)) return snowball;

          let { x, y, velocityX, velocityY } = snowball;
          const { size } = snowball;

          // Apply velocity
          x += velocityX * animationSpeed;
          y += velocityY * animationSpeed;

          // Bounce off walls
          if (x <= size/2 || x >= containerWidth - size/2) {
            velocityX = -velocityX * 0.8; // Damping
            x = Math.max(size/2, Math.min(containerWidth - size/2, x));
          }

          if (y <= size/2 || y >= containerHeight - size/2) {
            velocityY = -velocityY * 0.8; // Damping
            y = Math.max(size/2, Math.min(containerHeight - size/2, y));
          }

          // Apply gravity (very light)
          velocityY += 0.01 * animationSpeed;

          // Apply friction
          velocityX *= 0.999;
          velocityY *= 0.999;

          return {
            ...snowball,
            x,
            y,
            velocityX,
            velocityY
          };
        });
      });

      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, showPhysics, animationSpeed, paidOffDebts]);

  // Debt payoff simulation
  const simulatePayoff = async () => {
    setIsAnimating(true);
    
    // Sort by balance (snowball method)
    const sortedSnowballs = [...snowballs].sort((a, b) => a.balance - b.balance);
    
    for (let i = 0; i < sortedSnowballs.length; i++) {
      const snowball = sortedSnowballs[i];
      
      // Shrink animation
      await new Promise(resolve => {
        let shrinkProgress = 0;
        const shrinkDuration = 2000;
        const startTime = Date.now();
        
        const shrinkAnimation = () => {
          const elapsed = Date.now() - startTime;
          shrinkProgress = Math.min(elapsed / shrinkDuration, 1);
          
          setSnowballs(prev => prev.map(s => 
            s.id === snowball.id 
              ? { ...s, size: snowball.size * (1 - shrinkProgress) }
              : s
          ));
          
          if (shrinkProgress < 1) {
            requestAnimationFrame(shrinkAnimation);
          } else {
            resolve(void 0);
          }
        };
        
        shrinkAnimation();
      });
      
      // Mark as paid off
      setPaidOffDebts(prev => [...prev, snowball.id]);
      onDebtPaidOff?.(snowball);
      
      // Wait before next debt
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setPaidOffDebts([]);
    
    // Reset snowball sizes and positions
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      setSnowballs(prev => prev.map((snowball, index) => {
        const size = Math.max(40, Math.min(120, (snowball.originalBalance / 25000) * 120));
        const xSeed = `reset-x-${snowball.id}-${Date.now()}`;
        const ySeed = `reset-y-${snowball.id}-${Date.now()}`;
        
        return {
          ...snowball,
          balance: snowball.originalBalance,
          size,
          x: size/2 + seededRandom(xSeed) * (containerWidth - size),
          y: size/2 + seededRandom(ySeed) * (containerHeight - size),
          velocityX: (Math.random() - 0.5) * 0.5,
          velocityY: (Math.random() - 0.5) * 0.5
        };
      }));
    }
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Debt Snowball Physics
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Watch your debts literally roll away with physics-based visualization
        </motion.p>
      </div>

      {/* Controls */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium"
            onClick={simulatePayoff}
            disabled={isAnimating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAnimating ? 'Paying Off...' : 'Start Payoff'}
          </motion.button>
          
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/15 rounded-xl text-white transition-colors"
            onClick={toggleAnimation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showPhysics ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </motion.button>
          
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/15 rounded-xl text-white transition-colors"
            onClick={resetAnimation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Settings */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Speed:</span>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-white text-sm">{animationSpeed.toFixed(1)}x</span>
        </div>

        <motion.button
          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
            showPhysics
              ? 'bg-green-500/20 text-green-400'
              : 'bg-white/10 text-gray-400 hover:text-white'
          }`}
          onClick={() => setShowPhysics(!showPhysics)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-4 h-4" />
          Physics {showPhysics ? 'On' : 'Off'}
        </motion.button>
      </motion.div>

      {/* Animation Container */}
      <motion.div
        ref={containerRef}
        className="relative h-96 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
          
          {/* Snowflake Pattern */}
          {mounted && Array.from({ length: 15 }).map((_, i) => {
            const xSeed = `bg-flake-x-${i}`;
            const ySeed = `bg-flake-y-${i}`;
            const sizeSeed = `bg-flake-size-${i}`;
            const delaySeed = `bg-flake-delay-${i}`;
            
            return (
              <motion.div
                key={i}
                className="absolute text-white/20"
                style={{
                  left: `${seededRandom(xSeed) * 100}%`,
                  top: `${seededRandom(ySeed) * 100}%`,
                  fontSize: `${8 + seededRandom(sizeSeed) * 16}px`
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [0.5, 1, 0.5],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 8 + seededRandom(`duration-${i}`) * 12,
                  delay: seededRandom(delaySeed) * 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Snowflake />
              </motion.div>
            );
          })}
        </div>

        {/* Debt Snowballs */}
        <AnimatePresence>
          {snowballs.map((snowball) => {
            const isPaidOff = paidOffDebts.includes(snowball.id);
            const isSelected = selectedSnowball === snowball.id;
            
            return (
              <motion.div
                key={snowball.id}
                className="absolute cursor-pointer"
                style={{
                  left: snowball.x - snowball.size / 2,
                  top: snowball.y - snowball.size / 2,
                  width: snowball.size,
                  height: snowball.size
                }}
                onClick={() => setSelectedSnowball(isSelected ? null : snowball.id)}
                whileHover={{ scale: 1.1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Main Snowball */}
                <motion.div
                  className="relative w-full h-full rounded-full border-2 border-white/20 flex items-center justify-center overflow-hidden"
                  style={{ 
                    backgroundColor: isPaidOff ? '#10b981' : snowball.color,
                    boxShadow: `0 0 ${isSelected ? 30 : 15}px ${snowball.color}40`
                  }}
                  animate={{
                    rotate: showPhysics ? [0, 360] : 0,
                    scale: isSelected ? 1.1 : 1,
                    filter: isPaidOff ? 'brightness(1.2)' : 'brightness(1)'
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { type: 'spring', stiffness: 300 },
                    filter: { duration: 0.5 }
                  }}
                >
                  {/* Snowball Texture */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-black/30" />
                  
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute top-2 left-2 w-1/3 h-1/3 bg-white/40 rounded-full blur-sm"
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Debt Amount */}
                  <div className="relative z-10 text-center">
                    <div className="text-white font-bold text-xs">
                      ${(snowball.balance / 1000).toFixed(1)}k
                    </div>
                    {isPaidOff && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Award className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Sparkle Effect for Paid Off */}
                  {isPaidOff && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                          style={{
                            left: `${25 + (i % 3) * 25}%`,
                            top: `${25 + Math.floor(i / 3) * 25}%`
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            rotate: [0, 180]
                          }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 2
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {/* Tooltip */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl min-w-48 z-50"
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div className="text-center">
                        <div className="text-white font-bold mb-1">{snowball.name}</div>
                        <div className="text-gray-400 text-sm space-y-1">
                          <div>Balance: ${snowball.balance.toLocaleString()}</div>
                          <div>Min Payment: ${snowball.minPayment}</div>
                          <div>Interest: {snowball.interestRate}%</div>
                          {isPaidOff && (
                            <div className="text-green-400 font-medium">PAID OFF! 🎉</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Physics Indicator */}
        {showPhysics && (
          <div className="absolute top-4 right-4">
            <motion.div
              className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-xl border border-white/20 rounded-xl"
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-white text-sm">Physics Active</span>
            </motion.div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3">
            <span className="text-white text-sm">Progress:</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                animate={{
                  width: `${(paidOffDebts.length / snowballs.length) * 100}%`
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 30 }}
              />
            </div>
            <span className="text-white text-sm font-mono">
              {paidOffDebts.length}/{snowballs.length}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { 
            label: 'Total Debt', 
            value: `$${snowballs.reduce((sum, s) => sum + s.balance, 0).toLocaleString()}`,
            color: '#ef4444'
          },
          { 
            label: 'Debts Paid', 
            value: `${paidOffDebts.length}/${snowballs.length}`,
            color: '#10b981'
          },
          { 
            label: 'Monthly Extra', 
            value: `$${monthlyExtra.toLocaleString()}`,
            color: '#3b82f6'
          },
          { 
            label: 'Animation Speed', 
            value: `${animationSpeed.toFixed(1)}x`,
            color: '#8b5cf6'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.6 }}
          >
            <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
            <div 
              className="text-lg font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}