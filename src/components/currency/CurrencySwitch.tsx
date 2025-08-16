'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, ArrowLeftRight, Zap, Globe, Star,
  TrendingUp, TrendingDown, CheckCircle, Clock
} from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number;
  color: string;
}

interface SwitchAnimation {
  id: string;
  type: 'flip' | 'morph' | 'slide' | 'zoom' | 'liquid';
  name: string;
  description: string;
  icon: React.ElementType;
}

interface CurrencySwitchProps {
  fromCurrency?: Currency;
  toCurrency?: Currency;
  onSwitch?: (from: Currency, to: Currency) => void;
  className?: string;
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

export default function CurrencySwitch({ 
  fromCurrency,
  toCurrency,
  onSwitch,
  className = '' 
}: CurrencySwitchProps) {
  const [selectedAnimation, setSelectedAnimation] = useState<string>('liquid');
  const [isAnimating, setIsAnimating] = useState(false);
  const [swapCount, setSwapCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Default currencies
  const [currentFrom, setCurrentFrom] = useState<Currency>(fromCurrency || {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rate: 1.0,
    color: '#10b981'
  });

  const [currentTo, setCurrentTo] = useState<Currency>(toCurrency || {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rate: 0.8532,
    color: '#3b82f6'
  });

  // Animation types
  const animations: SwitchAnimation[] = [
    {
      id: 'flip',
      type: 'flip',
      name: 'Flip',
      description: '3D card flip animation',
      icon: RefreshCw
    },
    {
      id: 'morph',
      type: 'morph',
      name: 'Morph',
      description: 'Shape morphing transition',
      icon: Star
    },
    {
      id: 'slide',
      type: 'slide',
      name: 'Slide',
      description: 'Smooth sliding motion',
      icon: ArrowLeftRight
    },
    {
      id: 'zoom',
      type: 'zoom',
      name: 'Zoom',
      description: 'Scale and fade transition',
      icon: Globe
    },
    {
      id: 'liquid',
      type: 'liquid',
      name: 'Liquid',
      description: 'Fluid morphing animation',
      icon: Zap
    }
  ];

  // Animation values
  const flipRotation = useMotionValue(0);
  const morphProgress = useMotionValue(0);
  const slideX = useMotionValue(0);
  const zoomScale = useMotionValue(1);
  const liquidMorphX = useMotionValue(0);
  const liquidMorphY = useMotionValue(0);

  // Perform currency switch with animation
  const performSwitch = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwapCount(prev => prev + 1);

    switch (selectedAnimation) {
      case 'flip':
        await animateFlip();
        break;
      case 'morph':
        await animateMorph();
        break;
      case 'slide':
        await animateSlide();
        break;
      case 'zoom':
        await animateZoom();
        break;
      case 'liquid':
        await animateLiquid();
        break;
    }

    // Swap currencies
    const temp = currentFrom;
    setCurrentFrom(currentTo);
    setCurrentTo(temp);
    onSwitch?.(currentTo, temp);
    
    setIsAnimating(false);
  };

  const animateFlip = () => {
    return new Promise<void>((resolve) => {
      flipRotation.set(180);
      setTimeout(() => {
        flipRotation.set(0);
        resolve();
      }, 600);
    });
  };

  const animateMorph = () => {
    return new Promise<void>((resolve) => {
      morphProgress.set(1);
      setTimeout(() => {
        morphProgress.set(0);
        resolve();
      }, 800);
    });
  };

  const animateSlide = () => {
    return new Promise<void>((resolve) => {
      slideX.set(200);
      setTimeout(() => {
        slideX.set(-200);
        setTimeout(() => {
          slideX.set(0);
          resolve();
        }, 300);
      }, 300);
    });
  };

  const animateZoom = () => {
    return new Promise<void>((resolve) => {
      zoomScale.set(0);
      setTimeout(() => {
        zoomScale.set(1.2);
        setTimeout(() => {
          zoomScale.set(1);
          resolve();
        }, 300);
      }, 300);
    });
  };

  const animateLiquid = () => {
    return new Promise<void>((resolve) => {
      // Create liquid morphing effect
      const sequence = [
        { x: 50, y: -20, delay: 0 },
        { x: -30, y: 40, delay: 200 },
        { x: 20, y: -10, delay: 400 },
        { x: 0, y: 0, delay: 600 }
      ];

      sequence.forEach(({ x, y, delay }) => {
        setTimeout(() => {
          liquidMorphX.set(x);
          liquidMorphY.set(y);
        }, delay);
      });

      setTimeout(() => resolve(), 800);
    });
  };

  // Currency card component
  const CurrencyCard = ({ 
    currency, 
    position, 
    isActive = false 
  }: { 
    currency: Currency; 
    position: 'from' | 'to'; 
    isActive?: boolean;
  }) => {
    const getAnimationStyle = () => {
      switch (selectedAnimation) {
        case 'flip':
          return {
            rotateY: position === 'from' ? flipRotation : useTransform(flipRotation, [0, 180], [180, 0]),
            transformStyle: 'preserve-3d' as const
          };
        case 'morph':
          return {
            scale: useTransform(morphProgress, [0, 0.5, 1], [1, 0.8, 1]),
            rotateX: useTransform(morphProgress, [0, 0.5, 1], [0, 10, 0]),
            filter: useTransform(morphProgress, [0, 0.5, 1], ['blur(0px)', 'blur(5px)', 'blur(0px)'])
          };
        case 'slide':
          return {
            x: position === 'from' ? slideX : useTransform(slideX, x => -x),
            opacity: useTransform(slideX, [-200, 0, 200], [0, 1, 0])
          };
        case 'zoom':
          return {
            scale: zoomScale,
            opacity: useTransform(zoomScale, [0, 0.5, 1, 1.2], [0, 0.5, 1, 1])
          };
        case 'liquid':
          return {
            x: liquidMorphX,
            y: liquidMorphY,
            scale: useTransform(liquidMorphX, [-50, 0, 50], [0.9, 1, 0.9])
          };
        default:
          return {};
      }
    };

    return (
      <motion.div
        className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl transition-all ${
          isActive 
            ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10' 
            : 'border-white/20 bg-white/5'
        }`}
        style={getAnimationStyle()}
        whileHover={{ scale: 1.02 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${currency.color}40 0%, transparent 70%)`
            }}
          />
        </div>

        {/* Currency Info */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="text-4xl"
              animate={isAnimating ? {
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              } : {}}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              {currency.flag}
            </motion.div>
            <div className="flex-1">
              <div className="text-white text-xl font-bold">{currency.code}</div>
              <div className="text-gray-400 text-sm">{currency.name}</div>
            </div>
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currency.color }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Symbol</span>
              <span className="text-white font-mono text-lg">{currency.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rate</span>
              <span className="text-white font-mono">{currency.rate.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <motion.div
            className="absolute -top-2 -right-2 p-2 bg-green-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <CheckCircle className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Ripple Effect */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2"
              style={{ borderColor: currency.color }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ 
                scale: [1, 1.5, 2],
                opacity: [0.8, 0.4, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className={`relative p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Currency Switch Animations
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Beautiful animations for seamless currency switching
        </motion.p>
      </div>

      {/* Animation Selector */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-white font-medium mb-4">Animation Style</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {animations.map((animation) => {
            const Icon = animation.icon;
            return (
              <motion.button
                key={animation.id}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selectedAnimation === animation.id
                    ? 'border-blue-500/50 bg-blue-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-400 hover:text-white hover:border-white/30'
                }`}
                onClick={() => setSelectedAnimation(animation.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="font-medium text-sm">{animation.name}</div>
                <div className="text-xs opacity-70">{animation.description}</div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Currency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
        {/* From Currency */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-gray-400 text-sm font-medium mb-3">FROM</div>
          <CurrencyCard currency={currentFrom} position="from" isActive={!isAnimating} />
        </motion.div>

        {/* Switch Button */}
        <div className="flex justify-center">
          <motion.button
            className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            onClick={performSwitch}
            disabled={isAnimating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
          >
            <motion.div
              animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <ArrowLeftRight className="w-8 h-8" />
            </motion.div>
          </motion.button>
        </div>

        {/* To Currency */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-gray-400 text-sm font-medium mb-3">TO</div>
          <CurrencyCard currency={currentTo} position="to" isActive={!isAnimating} />
        </motion.div>
      </div>

      {/* Switch Statistics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center">
          <div className="text-2xl font-bold text-white">{swapCount}</div>
          <div className="text-gray-400 text-sm">Total Swaps</div>
        </div>

        <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-400">
            {((currentTo.rate / currentFrom.rate) * 100 - 100).toFixed(2)}%
          </div>
          <div className="text-gray-400 text-sm">Rate Difference</div>
        </div>

        <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center">
          <div className="text-2xl font-bold text-cyan-400">{animations.find(a => a.id === selectedAnimation)?.name}</div>
          <div className="text-gray-400 text-sm">Current Style</div>
        </div>
      </motion.div>

      {/* Animation Status */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="fixed top-4 right-4 p-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl z-50"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5 text-blue-400" />
              </motion.div>
              <div>
                <div className="text-white font-medium">Switching Currencies</div>
                <div className="text-gray-400 text-sm">
                  Using {animations.find(a => a.id === selectedAnimation)?.name} animation
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />

        {/* Floating particles */}
        {mounted && Array.from({ length: 15 }).map((_, i) => {
          const leftSeed = `switch-particle-left-${i}`;
          const topSeed = `switch-particle-top-${i}`;
          const durationSeed = `switch-particle-duration-${i}`;
          const delaySeed = `switch-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${seededRandom(leftSeed) * 100}%`,
                top: `${seededRandom(topSeed) * 100}%`
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + seededRandom(durationSeed) * 2,
                repeat: Infinity,
                delay: seededRandom(delaySeed) * 5,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}