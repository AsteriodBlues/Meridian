'use client';

import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Leaf, Sun, Droplets, TrendingUp } from 'lucide-react';

interface SavingsPlantProps {
  savingsRate: number; // Percentage (0-100)
  targetRate: number; // Target percentage
  monthlyGrowth: number; // Monthly growth in percentage
  className?: string;
}

export default function SavingsPlant({ 
  savingsRate, 
  targetRate, 
  monthlyGrowth, 
  className = '' 
}: SavingsPlantProps) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [waterDrops, setWaterDrops] = useState<number[]>([]);

  const controls = useAnimation();

  // Calculate plant growth level based on savings rate
  const getGrowthLevel = () => {
    if (savingsRate >= targetRate) return 5; // Fully grown
    if (savingsRate >= targetRate * 0.8) return 4; // Almost there
    if (savingsRate >= targetRate * 0.6) return 3; // Good progress
    if (savingsRate >= targetRate * 0.4) return 2; // Growing
    if (savingsRate >= targetRate * 0.2) return 1; // Sprouting
    return 0; // Seed
  };

  const growthLevel = getGrowthLevel();
  const isHealthy = savingsRate >= targetRate * 0.6;
  const isFullyGrown = growthLevel === 5;

  // Animation phases for ambient effects
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Trigger growth celebration
  useEffect(() => {
    if (monthlyGrowth > 0) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 3000);
    }
  }, [monthlyGrowth]);

  // Water drop effect
  const addWaterDrop = () => {
    const dropId = Math.floor(Math.random() * 1000000); // Use random ID only for interactions
    setWaterDrops(prev => [...prev, dropId]);
    setTimeout(() => {
      setWaterDrops(prev => prev.filter(id => id !== dropId));
    }, 2000);
  };

  // Plant colors based on health
  const getPlantColors = () => {
    if (growthLevel >= 4) {
      return {
        stem: '#10b981', // Emerald
        leaves: '#059669',
        flower: '#f59e0b',
        glow: '#10b981'
      };
    } else if (growthLevel >= 2) {
      return {
        stem: '#22c55e', // Green
        leaves: '#16a34a',
        flower: '#eab308',
        glow: '#22c55e'
      };
    } else {
      return {
        stem: '#84cc16', // Lime
        leaves: '#65a30d',
        flower: '#f97316',
        glow: '#84cc16'
      };
    }
  };

  const colors = getPlantColors();

  return (
    <div className={`relative w-full h-80 ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200/20 via-green-100/10 to-green-200/20 rounded-3xl" />
      
      {/* Sun */}
      <motion.div
        className="absolute top-4 right-4 w-12 h-12"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity }
        }}
      >
        <Sun className="w-full h-full text-yellow-400" style={{
          filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.6))'
        }} />
      </motion.div>

      {/* Savings rate display */}
      <motion.div
        className="absolute top-4 left-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <motion.div
            className="text-2xl font-bold text-white mb-1"
            animate={{
              scale: isFullyGrown ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 1, repeat: isFullyGrown ? Infinity : 0 }}
          >
            {savingsRate.toFixed(1)}%
          </motion.div>
          <div className="text-xs text-gray-300">Savings Rate</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className={`w-3 h-3 ${monthlyGrowth > 0 ? 'text-green-400' : 'text-gray-400'}`} />
            <span className={`text-xs ${monthlyGrowth > 0 ? 'text-green-400' : 'text-gray-400'}`}>
              {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Target indicator */}
      <motion.div
        className="absolute top-4 right-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-xs text-gray-300 text-center">
          Target: {targetRate}%
        </div>
      </motion.div>

      {/* Soil base */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        {/* Soil texture */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-800/50 to-transparent rounded-t-full" />
      </motion.div>

      {/* Plant container */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        
        {/* Stem */}
        <AnimatePresence>
          {growthLevel >= 1 && (
            <motion.div
              className="relative"
              initial={{ height: 0 }}
              animate={{ height: 40 + (growthLevel * 20) }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{
                width: 6,
                background: `linear-gradient(to top, ${colors.stem}, ${colors.leaves})`,
                borderRadius: '3px',
                filter: `drop-shadow(0 0 10px ${colors.glow}40)`
              }}
            >
              {/* Stem segments */}
              {Array.from({ length: growthLevel }).map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ top: `${(index + 1) * 20}px` }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaves */}
        <AnimatePresence>
          {growthLevel >= 2 && (
            <div className="absolute" style={{ bottom: `${20 + (growthLevel * 15)}px` }}>
              {Array.from({ length: Math.min(growthLevel, 4) }).map((_, index) => {
                const leafAngle = (index * 90) + (index % 2 ? 45 : 0);
                const leafSize = 12 + (growthLevel * 2);
                
                return (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{
                      transform: `rotate(${leafAngle}deg) translateX(${leafSize + 5}px)`,
                    }}
                    initial={{ scale: 0, rotate: leafAngle - 90 }}
                    animate={{ 
                      scale: 1, 
                      rotate: leafAngle,
                      y: [0, -2, 0]
                    }}
                    transition={{
                      scale: { delay: index * 0.3, duration: 1 },
                      rotate: { delay: index * 0.3, duration: 1 },
                      y: { duration: 2 + index * 0.5, repeat: Infinity }
                    }}
                  >
                    <Leaf 
                      className="text-green-500" 
                      style={{
                        width: leafSize,
                        height: leafSize,
                        color: colors.leaves,
                        filter: `drop-shadow(0 0 5px ${colors.glow}30)`
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Flower/Fruit */}
        <AnimatePresence>
          {growthLevel >= 4 && (
            <motion.div
              className="absolute"
              style={{ bottom: `${40 + (growthLevel * 20)}px` }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 4, repeat: Infinity }
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${colors.flower}, ${colors.flower}dd)`,
                  boxShadow: `0 0 20px ${colors.flower}60`
                }}
              >
                <motion.div
                  className="w-3 h-3 bg-white/50 rounded-full"
                  animate={{
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Growth particles */}
        <AnimatePresence>
          {showParticles && Array.from({ length: 10 }).map((_, index) => (
            <motion.div
              key={`particle-${index}`}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              style={{
                left: `${(index * 13) % 60 - 30}px`,
                bottom: `${(index * 17) % 100}px`,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                y: [-20, -60],
                opacity: [1, 1, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                delay: index * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </AnimatePresence>

        {/* Water drops */}
        <AnimatePresence>
          {waterDrops.map(dropId => (
            <motion.div
              key={dropId}
              className="absolute"
              style={{
                left: `${(dropId % 40) - 20}px`,
                top: '-40px'
              }}
              initial={{ y: 0, scale: 0 }}
              animate={{ 
                y: 100,
                scale: [0, 1, 0.8, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                ease: 'easeIn'
              }}
            >
              <Droplets className="w-4 h-4 text-blue-400" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Growth progress bar */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Growth Progress</span>
          <span className="text-sm font-semibold text-white">
            Level {growthLevel}/5
          </span>
        </div>
        
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.stem}, ${colors.glow})`
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${(growthLevel / 5) * 100}%` }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
          
          {/* Progress shimmer */}
          <motion.div
            className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        </div>
        
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>Seed</span>
          <span>Bloom</span>
        </div>
      </motion.div>

      {/* Water button */}
      <motion.button
        className="absolute bottom-16 right-4 w-12 h-12 bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-xl flex items-center justify-center group"
        onClick={addWaterDrop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 0px rgba(59, 130, 246, 0)',
            '0 0 20px rgba(59, 130, 246, 0.5)',
            '0 0 0px rgba(59, 130, 246, 0)'
          ]
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity }
        }}
      >
        <Droplets className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
      </motion.button>

      {/* Achievement badges */}
      <AnimatePresence>
        {isFullyGrown && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            🏆 Savings Master!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}