'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react';

interface ExchangeRate {
  id: string;
  from: string;
  to: string;
  rate: number;
  change: number;
  volume: number;
  color: string;
  path: string;
}

interface FlowingRatesProps {
  className?: string;
  onRateClick?: (rate: ExchangeRate) => void;
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

export default function FlowingRates({ 
  className = '',
  onRateClick 
}: FlowingRatesProps) {
  const [hoveredRate, setHoveredRate] = useState<string | null>(null);
  const [flowingParticles, setFlowingParticles] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample exchange rate data
  const exchangeRates: ExchangeRate[] = [
    {
      id: 'usd-eur',
      from: 'USD',
      to: 'EUR',
      rate: 0.8532,
      change: 0.12,
      volume: 2450000,
      color: '#3b82f6',
      path: 'M 50 200 Q 200 100 350 180'
    },
    {
      id: 'usd-gbp',
      from: 'USD',
      to: 'GBP',
      rate: 0.7342,
      change: -0.08,
      volume: 1890000,
      color: '#8b5cf6',
      path: 'M 50 220 Q 150 120 300 160'
    },
    {
      id: 'eur-jpy',
      from: 'EUR',
      to: 'JPY',
      rate: 174.25,
      change: 0.95,
      volume: 3200000,
      color: '#f59e0b',
      path: 'M 80 180 Q 250 80 420 140'
    },
    {
      id: 'gbp-cad',
      from: 'GBP',
      to: 'CAD',
      rate: 1.6789,
      change: -0.23,
      volume: 950000,
      color: '#ef4444',
      path: 'M 100 240 Q 220 160 380 200'
    },
    {
      id: 'usd-jpy',
      from: 'USD',
      to: 'JPY',
      rate: 148.75,
      change: 0.34,
      volume: 4100000,
      color: '#10b981',
      path: 'M 60 190 Q 280 60 450 120'
    },
    {
      id: 'eur-chf',
      from: 'EUR',
      to: 'CHF',
      rate: 1.0245,
      change: 0.15,
      volume: 1200000,
      color: '#06b6d4',
      path: 'M 90 210 Q 200 140 320 180'
    }
  ];

  // Create flowing particles along the paths
  useEffect(() => {
    if (!mounted) return;
    
    const createParticles = () => {
      const particles: any[] = [];
      
      exchangeRates.forEach((rate) => {
        const particleCount = Math.floor(rate.volume / 500000) + 2;
        
        for (let i = 0; i < particleCount; i++) {
          const sizeSeed = `${rate.id}-size-${i}`;
          const speedSeed = `${rate.id}-speed-${i}`;
          const offsetSeed = `${rate.id}-offset-${i}`;
          const opacitySeed = `${rate.id}-opacity-${i}`;
          const delaySeed = `${rate.id}-delay-${i}`;
          
          particles.push({
            id: `${rate.id}-particle-${i}`,
            rateId: rate.id,
            path: rate.path,
            color: rate.color,
            size: seededRandom(sizeSeed) * 4 + 2,
            speed: seededRandom(speedSeed) * 0.02 + 0.01,
            offset: (i / particleCount) + seededRandom(offsetSeed) * 0.1,
            opacity: seededRandom(opacitySeed) * 0.6 + 0.4,
            delay: seededRandom(delaySeed) * 5
          });
        }
      });
      
      setFlowingParticles(particles);
    };

    createParticles();
    const interval = setInterval(createParticles, 10000);
    
    return () => clearInterval(interval);
  }, [mounted]);

  // Generate SVG path points for animation
  const getPathLength = (path: string) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', path);
    svg.appendChild(pathEl);
    document.body.appendChild(svg);
    const length = pathEl.getTotalLength();
    document.body.removeChild(svg);
    return length;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    return `${(volume / 1000).toFixed(0)}K`;
  };

  const formatRate = (rate: number) => {
    if (rate > 10) {
      return rate.toFixed(2);
    }
    return rate.toFixed(4);
  };

  return (
    <div className={`relative w-full h-96 overflow-hidden ${className}`}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main SVG Container */}
      <svg 
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 500 300"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient definitions for each currency pair */}
          {exchangeRates.map((rate) => (
            <React.Fragment key={`gradients-${rate.id}`}>
              <linearGradient id={`gradient-${rate.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={rate.color} stopOpacity="0.1" />
                <stop offset="50%" stopColor={rate.color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={rate.color} stopOpacity="0.1" />
              </linearGradient>
              
              <linearGradient id={`glow-${rate.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={rate.color} stopOpacity="0" />
                <stop offset="50%" stopColor={rate.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={rate.color} stopOpacity="0" />
              </linearGradient>
            </React.Fragment>
          ))}

          {/* Filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="ripple">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="glow" />
            <feBlend in="SourceGraphic" in2="glow" />
          </filter>
        </defs>

        {/* Currency Exchange Rivers */}
        {exchangeRates.map((rate) => {
          const isHovered = hoveredRate === rate.id;
          
          return (
            <g key={rate.id}>
              {/* River Glow Base */}
              <motion.path
                d={rate.path}
                stroke={`url(#glow-${rate.id})`}
                strokeWidth={isHovered ? "20" : "12"}
                fill="none"
                opacity={0.3}
                filter="url(#glow)"
                animate={{
                  strokeWidth: isHovered ? [12, 20, 12] : [8, 12, 8],
                  opacity: isHovered ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Main River Path */}
              <motion.path
                d={rate.path}
                stroke={rate.color}
                strokeWidth={isHovered ? "4" : "2"}
                fill="none"
                opacity={0.8}
                filter="url(#ripple)"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredRate(rate.id)}
                onMouseLeave={() => setHoveredRate(null)}
                onClick={() => onRateClick?.(rate)}
                animate={{
                  strokeWidth: isHovered ? [2, 4, 2] : [2, 3, 2]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Flowing Gradient Overlay */}
              <motion.path
                d={rate.path}
                stroke={`url(#gradient-${rate.id})`}
                strokeWidth="8"
                fill="none"
                opacity={0.6}
                strokeDasharray="20 10"
                animate={{
                  strokeDashoffset: [-100, 0],
                  opacity: isHovered ? [0.6, 1, 0.6] : [0.4, 0.6, 0.4]
                }}
                transition={{
                  strokeDashoffset: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  opacity: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />

              {/* Volume Indicators */}
              <motion.circle
                cx="50"
                cy={rate.path.includes('200') ? "200" : rate.path.includes('220') ? "220" : "180"}
                r={Math.log(rate.volume / 100000)}
                fill={rate.color}
                opacity={0.4}
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : [0.8, 1, 0.8],
                  opacity: isHovered ? [0.4, 0.7, 0.4] : [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>
          );
        })}

        {/* Flowing Particles */}
        {flowingParticles.map((particle) => (
          <motion.circle
            key={particle.id}
            r={particle.size}
            fill={particle.color}
            opacity={particle.opacity}
            filter="url(#glow)"
          >
            <animateMotion
              dur={`${(1 / particle.speed).toFixed(1)}s`}
              repeatCount="indefinite"
              begin={`${particle.delay}s`}
            >
              <mpath href={`#path-${particle.rateId}`} />
            </animateMotion>
          </motion.circle>
        ))}

        {/* Hidden paths for particle animation */}
        {exchangeRates.map((rate) => (
          <path
            key={`path-${rate.id}`}
            id={`path-${rate.id}`}
            d={rate.path}
            fill="none"
            stroke="none"
          />
        ))}
      </svg>

      {/* Rate Information Cards */}
      <div className="absolute inset-0 pointer-events-none">
        {exchangeRates.map((rate, index) => {
          const isHovered = hoveredRate === rate.id;
          
          return (
            <AnimatePresence key={rate.id}>
              {isHovered && (
                <motion.div
                  className="absolute bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 pointer-events-auto"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + (index % 2) * 40}%`
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: rate.color }}
                    />
                    <div className="text-white font-medium">
                      {rate.from} / {rate.to}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-400 text-sm">Rate</span>
                      <span className="text-white font-mono text-lg">
                        {formatRate(rate.rate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-400 text-sm">Change</span>
                      <div className={`flex items-center gap-1 ${rate.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {rate.change > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-mono">
                          {Math.abs(rate.change).toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-400 text-sm">Volume</span>
                      <span className="text-cyan-400 font-mono">
                        ${formatVolume(rate.volume)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-xs">Live Rate</span>
                      <motion.div
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-3">
        <div className="text-white text-sm font-medium mb-2">Live Exchange Rates</div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span>Real-time flow visualization</span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-3">
        <div className="text-white text-sm font-medium mb-2">Market Activity</div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-gray-400">Most Active</span>
            <span className="text-green-400 font-mono">USD/JPY</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-gray-400">Biggest Mover</span>
            <span className="text-blue-400 font-mono">EUR/JPY</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-gray-400">Total Volume</span>
            <span className="text-cyan-400 font-mono">$14.8M</span>
          </div>
        </div>
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}