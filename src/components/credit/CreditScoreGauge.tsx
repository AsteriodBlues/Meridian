'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, Star, Award, Shield,
  AlertTriangle, CheckCircle, Info, Sparkles
} from 'lucide-react';

interface CreditScoreGaugeProps {
  score: number;
  previousScore?: number;
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

export default function CreditScoreGauge({ 
  score, 
  previousScore,
  className = '',
  animated = true 
}: CreditScoreGaugeProps) {
  const [mounted, setMounted] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const gaugeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate score counting
  useEffect(() => {
    if (!mounted || !animated) {
      setDisplayScore(score);
      return;
    }

    setIsAnimating(true);
    const startScore = displayScore;
    const duration = 2000;
    const startTime = Date.now();

    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentScore = Math.round(startScore + (score - startScore) * easeOutQuart);
      
      setDisplayScore(currentScore);
      
      if (progress < 1) {
        requestAnimationFrame(animateScore);
      } else {
        setIsAnimating(false);
      }
    };

    animateScore();
  }, [score, animated, mounted]);

  // Score categories with colors and descriptions
  const getScoreCategory = (score: number) => {
    if (score >= 800) return { 
      label: 'Excellent', 
      color: '#10b981', 
      gradient: 'from-emerald-500 to-green-500',
      description: 'Outstanding credit health',
      icon: Award
    };
    if (score >= 740) return { 
      label: 'Very Good', 
      color: '#3b82f6', 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Strong credit profile',
      icon: Star
    };
    if (score >= 670) return { 
      label: 'Good', 
      color: '#8b5cf6', 
      gradient: 'from-purple-500 to-blue-500',
      description: 'Healthy credit standing',
      icon: CheckCircle
    };
    if (score >= 580) return { 
      label: 'Fair', 
      color: '#f59e0b', 
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Room for improvement',
      icon: Info
    };
    return { 
      label: 'Poor', 
      color: '#ef4444', 
      gradient: 'from-red-500 to-pink-500',
      description: 'Needs attention',
      icon: AlertTriangle
    };
  };

  const category = getScoreCategory(displayScore);
  const IconComponent = category.icon;
  const percentage = ((displayScore - 300) / (850 - 300)) * 100;
  const change = previousScore ? displayScore - previousScore : 0;

  // Liquid fill animation values
  const liquidY = useMotionValue(100);
  const liquidScale = useSpring(1, { stiffness: 100, damping: 30 });
  const waveOffset = useMotionValue(0);

  useEffect(() => {
    if (mounted) {
      liquidY.set(100 - percentage);
      
      // Continuous wave animation
      const animateWave = () => {
        waveOffset.set(waveOffset.get() + 0.02);
        requestAnimationFrame(animateWave);
      };
      animateWave();
    }
  }, [percentage, mounted, liquidY, waveOffset]);

  // Create bubbles for liquid effect
  const createBubbles = () => {
    if (!mounted) return [];
    
    return Array.from({ length: 12 }, (_, i) => {
      const sizeSeed = `bubble-size-${i}`;
      const xSeed = `bubble-x-${i}`;
      const delaySeed = `bubble-delay-${i}`;
      const durationSeed = `bubble-duration-${i}`;
      
      return {
        id: i,
        size: 2 + seededRandom(sizeSeed) * 6,
        x: 20 + seededRandom(xSeed) * 60,
        delay: seededRandom(delaySeed) * 3,
        duration: 3 + seededRandom(durationSeed) * 4
      };
    });
  };

  const [bubbles, setBubbles] = useState<any[]>([]);

  useEffect(() => {
    if (mounted) {
      setBubbles(createBubbles());
    }
  }, [mounted]);

  return (
    <div className={`relative ${className}`}>
      {/* Main Gauge Container */}
      <div className="relative w-80 h-80 mx-auto">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl">
          {/* Score Range Indicators */}
          <div className="absolute inset-4 rounded-full">
            {/* Poor */}
            <div 
              className="absolute w-full h-full rounded-full"
              style={{
                background: `conic-gradient(from 225deg, 
                  #ef4444 0deg, 
                  #ef4444 54deg, 
                  transparent 54deg, 
                  transparent 360deg)`
              }}
            />
            {/* Fair */}
            <div 
              className="absolute w-full h-full rounded-full"
              style={{
                background: `conic-gradient(from 225deg, 
                  transparent 0deg,
                  transparent 54deg,
                  #f59e0b 54deg, 
                  #f59e0b 108deg, 
                  transparent 108deg, 
                  transparent 360deg)`
              }}
            />
            {/* Good */}
            <div 
              className="absolute w-full h-full rounded-full"
              style={{
                background: `conic-gradient(from 225deg, 
                  transparent 0deg,
                  transparent 108deg,
                  #8b5cf6 108deg, 
                  #8b5cf6 162deg, 
                  transparent 162deg, 
                  transparent 360deg)`
              }}
            />
            {/* Very Good */}
            <div 
              className="absolute w-full h-full rounded-full"
              style={{
                background: `conic-gradient(from 225deg, 
                  transparent 0deg,
                  transparent 162deg,
                  #3b82f6 162deg, 
                  #3b82f6 216deg, 
                  transparent 216deg, 
                  transparent 360deg)`
              }}
            />
            {/* Excellent */}
            <div 
              className="absolute w-full h-full rounded-full"
              style={{
                background: `conic-gradient(from 225deg, 
                  transparent 0deg,
                  transparent 216deg,
                  #10b981 216deg, 
                  #10b981 270deg, 
                  transparent 270deg, 
                  transparent 360deg)`
              }}
            />
          </div>

          {/* Inner Liquid Container */}
          <div className="absolute inset-8 rounded-full overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-white/10">
            {/* Liquid Fill */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(to top, ${category.color}40 0%, ${category.color}20 100%)`,
                y: liquidY
              }}
            >
              {/* Wave Effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-8"
                style={{
                  background: `linear-gradient(90deg, 
                    ${category.color}60 0%, 
                    ${category.color}80 25%, 
                    ${category.color}60 50%, 
                    ${category.color}80 75%, 
                    ${category.color}60 100%)`,
                  x: useTransform(waveOffset, (latest) => `${Math.sin(latest * 3) * 10}px`)
                }}
              />
              
              {/* Bubbles */}
              {bubbles.map((bubble) => (
                <motion.div
                  key={bubble.id}
                  className="absolute rounded-full opacity-60"
                  style={{
                    width: bubble.size,
                    height: bubble.size,
                    left: `${bubble.x}%`,
                    backgroundColor: category.color,
                    filter: 'blur(1px)'
                  }}
                  animate={{
                    y: [-20, -200],
                    opacity: [0, 0.8, 0]
                  }}
                  transition={{
                    duration: bubble.duration,
                    delay: bubble.delay,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Score Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  className="text-4xl font-bold text-white mb-2"
                  animate={isAnimating ? {
                    scale: [1, 1.1, 1],
                    textShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      `0 0 20px ${category.color}80`,
                      '0 0 0px rgba(255,255,255,0)'
                    ]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {displayScore}
                </motion.div>
                <motion.div
                  className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${category.gradient} text-white`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: 'spring', stiffness: 400 }}
                >
                  {category.label}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Score Markers */}
          {[300, 580, 670, 740, 800, 850].map((markerScore, index) => {
            const angle = 225 + (((markerScore - 300) / (850 - 300)) * 270);
            const isActive = displayScore >= markerScore;
            
            return (
              <div
                key={markerScore}
                className="absolute w-2 h-6 -ml-1"
                style={{
                  left: '50%',
                  top: '10px',
                  transformOrigin: '50% 140px',
                  transform: `rotate(${angle}deg)`
                }}
              >
                <motion.div
                  className={`w-full h-full rounded-full transition-colors ${
                    isActive ? 'bg-white' : 'bg-gray-600'
                  }`}
                  animate={isActive ? {
                    boxShadow: [`0 0 0px ${category.color}`, `0 0 10px ${category.color}`, `0 0 0px ${category.color}`]
                  } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            );
          })}
        </div>

        {/* Score Change Indicator */}
        <AnimatePresence>
          {change !== 0 && (
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                change > 0 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(change)} points</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Icon */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: 'spring', stiffness: 400 }}
        >
          <div className={`p-3 rounded-full bg-gradient-to-r ${category.gradient}`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      </div>

      {/* Score Details */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h3 className="text-xl font-bold text-white mb-2">{category.description}</h3>
        <p className="text-gray-400 max-w-xs mx-auto">
          {displayScore >= 800 && "You have access to the best rates and terms available."}
          {displayScore >= 740 && displayScore < 800 && "You qualify for competitive rates on most credit products."}
          {displayScore >= 670 && displayScore < 740 && "You're likely to get approved for most credit applications."}
          {displayScore >= 580 && displayScore < 670 && "Focus on improving payment history and reducing utilization."}
          {displayScore < 580 && "Consider secured credit cards and debt consolidation options."}
        </p>
      </motion.div>

      {/* Animated Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sparkle Effects */}
        {mounted && Array.from({ length: 8 }).map((_, i) => {
          const leftSeed = `sparkle-left-${i}`;
          const topSeed = `sparkle-top-${i}`;
          const delaySeed = `sparkle-delay-${i}`;
          const durationSeed = `sparkle-duration-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2"
              style={{
                left: `${seededRandom(leftSeed) * 100}%`,
                top: `${seededRandom(topSeed) * 100}%`
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2 + seededRandom(durationSeed) * 3,
                delay: seededRandom(delaySeed) * 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-full h-full text-white/30" />
            </motion.div>
          );
        })}

        {/* Glow Effects */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: category.color }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}