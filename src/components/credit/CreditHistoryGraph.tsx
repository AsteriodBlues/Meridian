'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, CreditCard, Home, Car,
  AlertTriangle, CheckCircle, Info, Calendar, Target
} from 'lucide-react';

interface CreditDataPoint {
  date: string;
  score: number;
  event?: {
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    icon: React.ElementType;
  };
}

interface CreditHistoryGraphProps {
  data: CreditDataPoint[];
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

export default function CreditHistoryGraph({ 
  data, 
  className = '',
  animated = true 
}: CreditHistoryGraphProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data if none provided
  const defaultData: CreditDataPoint[] = [
    {
      date: '2020-01',
      score: 650,
      event: {
        type: 'neutral',
        title: 'Started Credit Journey',
        description: 'Opened first credit card',
        icon: CreditCard
      }
    },
    {
      date: '2020-06',
      score: 680,
      event: {
        type: 'positive',
        title: 'Consistent Payments',
        description: '6 months of on-time payments',
        icon: CheckCircle
      }
    },
    {
      date: '2020-12',
      score: 720,
      event: {
        type: 'positive',
        title: 'Credit Limit Increase',
        description: 'Utilization ratio improved',
        icon: TrendingUp
      }
    },
    {
      date: '2021-03',
      score: 695,
      event: {
        type: 'negative',
        title: 'Missed Payment',
        description: 'Late payment reported',
        icon: AlertTriangle
      }
    },
    {
      date: '2021-08',
      score: 740,
      event: {
        type: 'positive',
        title: 'Recovery & Growth',
        description: 'Paid down balances',
        icon: Target
      }
    },
    {
      date: '2022-01',
      score: 765,
      event: {
        type: 'positive',
        title: 'Auto Loan',
        description: 'Diversified credit mix',
        icon: Car
      }
    },
    {
      date: '2022-09',
      score: 790,
      event: {
        type: 'positive',
        title: 'Mortgage Approval',
        description: 'Major credit milestone',
        icon: Home
      }
    },
    {
      date: '2023-12',
      score: 815,
      event: {
        type: 'positive',
        title: 'Excellent Credit',
        description: 'Reached top tier',
        icon: TrendingUp
      }
    }
  ];

  const creditData = data.length > 0 ? data : defaultData;

  // Animation progress
  useEffect(() => {
    if (!mounted || !animated) {
      setAnimationProgress(1);
      return;
    }

    const duration = 3000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      
      setAnimationProgress(eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [mounted, animated]);

  // SVG dimensions
  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const scores = creditData.map(d => d.score).filter(score => !isNaN(score) && isFinite(score));
  const minScore = scores.length > 0 ? Math.min(...scores) - 20 : 300;
  const maxScore = scores.length > 0 ? Math.max(...scores) + 20 : 850;
  
  const xScale = (index: number) => {
    if (creditData.length <= 1) return 0;
    return (index / (creditData.length - 1)) * chartWidth;
  };
  const yScale = (score: number) => {
    if (isNaN(score) || !isFinite(score)) return chartHeight / 2;
    return chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;
  };

  // Generate path data
  const generatePath = () => {
    if (creditData.length === 0) return '';
    
    const startX = padding.left + xScale(0);
    const startY = padding.top + yScale(creditData[0].score);
    
    // Validate starting point
    if (isNaN(startX) || !isFinite(startX) || isNaN(startY) || !isFinite(startY)) {
      return '';
    }
    
    let path = `M ${startX} ${startY}`;
    
    for (let i = 1; i < creditData.length; i++) {
      const animatedIndex = i * animationProgress;
      if (animatedIndex >= i) {
        const x = padding.left + xScale(i);
        const y = padding.top + yScale(creditData[i].score);
        
        // Validate coordinates before adding to path
        if (!isNaN(x) && isFinite(x) && !isNaN(y) && isFinite(y)) {
          path += ` L ${x} ${y}`;
        }
      } else if (animatedIndex > i - 1) {
        const progress = animatedIndex - (i - 1);
        const prevScore = creditData[i - 1].score;
        const currentScore = creditData[i].score;
        const interpolatedScore = prevScore + (currentScore - prevScore) * progress;
        const interpolatedX = xScale(i - 1) + (xScale(i) - xScale(i - 1)) * progress;
        
        const x = padding.left + interpolatedX;
        const y = padding.top + yScale(interpolatedScore);
        
        // Validate interpolated coordinates
        if (!isNaN(x) && isFinite(x) && !isNaN(y) && isFinite(y)) {
          path += ` L ${x} ${y}`;
        }
        break;
      }
    }
    
    return path;
  };

  // Generate gradient path for fill
  const generateFillPath = () => {
    const linePath = generatePath();
    if (!linePath) return '';
    
    const lastPoint = creditData[Math.min(Math.floor(animationProgress * creditData.length), creditData.length - 1)];
    const lastIndex = creditData.indexOf(lastPoint);
    
    return `${linePath} L ${padding.left + xScale(lastIndex)} ${padding.top + chartHeight} L ${padding.left + xScale(0)} ${padding.top + chartHeight} Z`;
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
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
      {/* Chart Container */}
      <div className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-white text-xl font-bold mb-2">Credit Score History</h3>
          <p className="text-gray-400 text-sm">
            Track your credit journey over time with key events and milestones
          </p>
        </div>

        {/* SVG Chart */}
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
          style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
            </linearGradient>
            
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="75%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid Lines */}
          <g opacity="0.2">
            {/* Horizontal grid lines */}
            {Array.from({ length: 6 }, (_, i) => {
              const score = minScore + (i * (maxScore - minScore) / 5);
              const y = padding.top + yScale(score);
              
              // Skip if values are invalid
              if (isNaN(y) || !isFinite(y) || isNaN(score) || !isFinite(score)) {
                return null;
              }
              
              return (
                <g key={`h-grid-${i}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartWidth}
                    y2={y}
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="5,5"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    fill="white"
                    fontSize="12"
                    textAnchor="end"
                  >
                    {Math.round(score)}
                  </text>
                </g>
              );
            })}

            {/* Vertical grid lines */}
            {creditData.map((point, index) => {
              const x = padding.left + xScale(index);
              
              // Skip if values are invalid
              if (isNaN(x) || !isFinite(x)) {
                return null;
              }
              
              return (
                <g key={`v-grid-${index}`}>
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + chartHeight}
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <text
                    x={x}
                    y={height - 20}
                    fill="white"
                    fontSize="10"
                    textAnchor="middle"
                    transform={`rotate(-45, ${x}, ${height - 20})`}
                  >
                    {point.date}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Area Fill */}
          <motion.path
            d={generateFillPath()}
            fill="url(#scoreGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Main Line */}
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />

          {/* Data Points */}
          {creditData.map((point, index) => {
            const shouldShow = index <= animationProgress * creditData.length;
            if (!shouldShow) return null;

            const x = padding.left + xScale(index);
            const y = padding.top + yScale(point.score);
            
            // Skip if coordinates are invalid
            if (isNaN(x) || !isFinite(x) || isNaN(y) || !isFinite(y)) {
              return null;
            }

            const isHovered = hoveredPoint === index;
            const isSelected = selectedPoint === index;
            const hasEvent = !!point.event;
            
            return (
              <g key={`point-${index}`}>
                {/* Event Indicator */}
                {hasEvent && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill={`${getEventColor(point.event!.type)}20`}
                    stroke={getEventColor(point.event!.type)}
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: isHovered ? 1.5 : 1, 
                      opacity: 0.6 
                    }}
                    transition={{ 
                      delay: index * 0.1 + 1,
                      type: 'spring',
                      stiffness: 400
                    }}
                  />
                )}

                {/* Main Point */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill={getScoreColor(point.score)}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: isSelected ? 1.5 : isHovered ? 1.3 : 1 
                  }}
                  transition={{ 
                    delay: index * 0.1 + 1,
                    type: 'spring',
                    stiffness: 400
                  }}
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setSelectedPoint(isSelected ? null : index)}
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 10px ${getScoreColor(point.score)})` : 'none'
                  }}
                />

                {/* Score Label */}
                <motion.text
                  x={x}
                  y={y - 25}
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: isHovered || isSelected ? 1 : 0.7,
                    y: 0 
                  }}
                  transition={{ delay: index * 0.1 + 1.5 }}
                >
                  {point.score}
                </motion.text>
              </g>
            );
          })}

          {/* Trend Indicators */}
          {creditData.map((point, index) => {
            if (index === 0) return null;
            
            const prevScore = creditData[index - 1].score;
            const currentScore = point.score;
            const isUpward = currentScore > prevScore;
            const shouldShow = index <= animationProgress * creditData.length;
            
            if (!shouldShow) return null;
            
            const midX = padding.left + (xScale(index - 1) + xScale(index)) / 2;
            const midY = padding.top + (yScale(prevScore) + yScale(currentScore)) / 2;
            
            // Skip if coordinates are invalid
            if (isNaN(midX) || !isFinite(midX) || isNaN(midY) || !isFinite(midY)) {
              return null;
            }
            
            return (
              <motion.g
                key={`trend-${index}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ delay: index * 0.1 + 2 }}
              >
                <circle
                  cx={midX}
                  cy={midY - 15}
                  r="8"
                  fill={isUpward ? '#10b98120' : '#ef444420'}
                  stroke={isUpward ? '#10b981' : '#ef4444'}
                  strokeWidth="1"
                />
                {isUpward ? (
                  <TrendingUp 
                    x={midX - 4} 
                    y={midY - 19} 
                    width="8" 
                    height="8" 
                    stroke="#10b981" 
                    strokeWidth="2"
                  />
                ) : (
                  <TrendingDown 
                    x={midX - 4} 
                    y={midY - 19} 
                    width="8" 
                    height="8" 
                    stroke="#ef4444" 
                    strokeWidth="2"
                  />
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Interactive Tooltip */}
        <AnimatePresence>
          {(hoveredPoint !== null || selectedPoint !== null) && (
            <motion.div
              className="absolute bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 pointer-events-none z-10"
              style={{
                left: `${((selectedPoint ?? hoveredPoint)! / (creditData.length - 1)) * 100}%`,
                top: '20px'
              }}
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {(() => {
                const point = creditData[selectedPoint ?? hoveredPoint!];
                const IconComponent = point.event?.icon || Info;
                
                return (
                  <div className="min-w-48">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${getScoreColor(point.score)}20` }}
                      >
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: getScoreColor(point.score) }}
                        >
                          {point.score}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{point.date}</div>
                        <div className="text-gray-400 text-sm">Credit Score</div>
                      </div>
                    </div>
                    
                    {point.event && (
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent 
                            className="w-4 h-4" 
                            style={{ color: getEventColor(point.event.type) }}
                          />
                          <span 
                            className="font-medium text-sm"
                            style={{ color: getEventColor(point.event.type) }}
                          >
                            {point.event.title}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {point.event.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Score Ranges Indicator */}
        <div className="absolute top-6 right-6">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-3">
            <div className="text-white text-xs font-medium mb-2">Score Ranges</div>
            <div className="space-y-1">
              {[
                { range: '800+', label: 'Excellent', color: '#10b981' },
                { range: '740-799', label: 'Very Good', color: '#3b82f6' },
                { range: '670-739', label: 'Good', color: '#8b5cf6' },
                { range: '580-669', label: 'Fair', color: '#f59e0b' },
                { range: '<580', label: 'Poor', color: '#ef4444' }
              ].map((item) => (
                <div key={item.range} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-400">{item.range}</span>
                  <span className="text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {mounted && Array.from({ length: 12 }).map((_, i) => {
            const xSeed = `bg-particle-x-${i}`;
            const ySeed = `bg-particle-y-${i}`;
            const sizeSeed = `bg-particle-size-${i}`;
            const delaySeed = `bg-particle-delay-${i}`;
            const durationSeed = `bg-particle-duration-${i}`;
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: 1 + seededRandom(sizeSeed) * 4,
                  height: 1 + seededRandom(sizeSeed) * 4,
                  left: `${seededRandom(xSeed) * 100}%`,
                  top: `${seededRandom(ySeed) * 100}%`
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 4 + seededRandom(durationSeed) * 6,
                  delay: seededRandom(delaySeed) * 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {[
          {
            label: 'Current Score',
            value: creditData[creditData.length - 1]?.score || 0,
            change: creditData.length > 1 ? creditData[creditData.length - 1].score - creditData[creditData.length - 2].score : 0,
            color: getScoreColor(creditData[creditData.length - 1]?.score || 0)
          },
          {
            label: 'Highest Score',
            value: Math.max(...creditData.map(d => d.score)),
            change: null,
            color: '#10b981'
          },
          {
            label: 'Total Improvement',
            value: creditData.length > 0 ? creditData[creditData.length - 1].score - creditData[0].score : 0,
            change: null,
            color: '#3b82f6'
          },
          {
            label: 'Major Events',
            value: creditData.filter(d => d.event).length,
            change: null,
            color: '#8b5cf6'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 3 }}
          >
            <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
            <div className="flex items-center gap-2">
              <span 
                className="text-2xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              {stat.change !== null && stat.change !== 0 && (
                <div className={`flex items-center gap-1 text-sm ${
                  stat.change > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(stat.change)}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}