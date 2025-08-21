'use client';

import { motion, useSpring, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Target, Award, BarChart3, Zap } from 'lucide-react';

interface BarData {
  id: string;
  label: string;
  value: number;
  target?: number;
  color: string;
  icon?: React.ElementType;
  category?: string;
}

interface AnimatedBarChartProps {
  data: BarData[];
  maxValue?: number;
  showTargets?: boolean;
  showAnimation?: boolean;
  orientation?: 'vertical' | 'horizontal';
  barHeight?: number;
  spacing?: number;
  showComparison?: boolean;
  animateValues?: boolean;
  staggerDelay?: number;
  className?: string;
}

export default function AnimatedBarChart({
  data,
  maxValue,
  showTargets = true,
  showAnimation = true,
  orientation = 'vertical',
  barHeight = 40,
  spacing = 16,
  showComparison = false,
  animateValues = true,
  staggerDelay = 0.1,
  className = ''
}: AnimatedBarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'current' | 'previous' | 'target'>('current');

  const max = maxValue || Math.max(...data.map(d => Math.max(d.value, d.target || 0)));

  useEffect(() => {
    if (showAnimation) {
      setIsLoaded(true);
    }
  }, [showAnimation]);

  // Stagger animation phases
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const getBarPercentage = (value: number) => {
    return (value / max) * 100;
  };

  const getTargetPercentage = (target: number) => {
    return (target / max) * 100;
  };

  const isOverTarget = (item: BarData) => {
    return item.target && item.value > item.target;
  };

  const getStatusColor = (item: BarData) => {
    if (!item.target) return item.color;
    
    const percentage = (item.value / item.target) * 100;
    if (percentage >= 100) return '#10b981'; // Green - achieved
    if (percentage >= 80) return '#f59e0b';  // Amber - close
    if (percentage >= 60) return '#3b82f6';  // Blue - progress
    return '#ef4444'; // Red - behind
  };

  // Animated Counter Component
  const AnimatedCounter = ({ value, duration = 1000, delay = 0 }: { value: number; duration?: number; delay?: number }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));
    
    useEffect(() => {
      if (animateValues && isLoaded) {
        const timer = setTimeout(() => {
          count.set(value);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        count.set(value);
      }
    }, [value, delay, count, animateValues, isLoaded]);

    return <motion.span>{rounded}</motion.span>;
  };

  if (orientation === 'horizontal') {
    return (
      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-white mb-2">Category Performance</h3>
          <p className="text-gray-400 text-sm">Horizontal bar chart with target indicators</p>
        </motion.div>

        <div className="space-y-4">
          {data.map((item, index) => {
            const Icon = item.icon;
            const percentage = getBarPercentage(item.value);
            const targetPercentage = item.target ? getTargetPercentage(item.target) : 0;
            const statusColor = getStatusColor(item);
            const isHovered = hoveredBar === item.id;
            const overTarget = isOverTarget(item);

            return (
              <motion.div
                key={item.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100
                }}
                onMouseEnter={() => setHoveredBar(item.id)}
                onMouseLeave={() => setHoveredBar(null)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon and Label */}
                  <div className="flex items-center gap-3 w-32 flex-shrink-0">
                    {Icon && (
                      <motion.div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: statusColor }}
                        animate={{
                          boxShadow: isHovered ? [
                            `0 0 0px ${statusColor}`,
                            `0 0 20px ${statusColor}60`,
                            `0 0 0px ${statusColor}`
                          ] : `0 0 0px ${statusColor}`,
                          scale: isHovered ? [1, 1.1, 1] : 1
                        }}
                        transition={{ 
                          boxShadow: { duration: 1, repeat: isHovered ? Infinity : 0 },
                          scale: { duration: 0.3 }
                        }}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      {item.category && (
                        <div className="text-xs text-gray-400">{item.category}</div>
                      )}
                    </div>
                  </div>

                  {/* Bar Container */}
                  <div className="flex-1 relative">
                    <div 
                      className="relative bg-white/10 rounded-full overflow-hidden"
                      style={{ height: barHeight }}
                    >
                      {/* Target indicator */}
                      {showTargets && item.target && (
                        <motion.div
                          className="absolute top-0 bottom-0 w-1 bg-white/60 z-20"
                          style={{ left: `${targetPercentage}%` }}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <motion.div
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Target className="w-4 h-4 text-white" />
                          </motion.div>
                        </motion.div>
                      )}

                      {/* Main bar */}
                      <motion.div
                        className="absolute top-0 left-0 bottom-0 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${statusColor}ee, ${statusColor})`,
                          boxShadow: `0 0 10px ${statusColor}40`
                        }}
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: isLoaded ? `${percentage}%` : '0%',
                          background: overTarget ? [
                            `linear-gradient(90deg, ${statusColor}ee, ${statusColor})`,
                            `linear-gradient(90deg, #10b981ee, #10b981)`,
                            `linear-gradient(90deg, ${statusColor}ee, ${statusColor})`
                          ] : `linear-gradient(90deg, ${statusColor}ee, ${statusColor})`
                        }}
                        transition={{ 
                          width: { 
                            delay: index * 0.2,
                            duration: 1.5,
                            type: 'spring',
                            stiffness: 100,
                            damping: 15
                          },
                          background: { 
                            duration: 2, 
                            repeat: overTarget ? Infinity : 0 
                          }
                        }}
                      >
                        {/* Bar shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                            delay: 1 + index * 0.2
                          }}
                        />

                        {/* Success particles */}
                        <AnimatePresence>
                          {overTarget && Array.from({ length: 3 }).map((_, particleIndex) => (
                            <motion.div
                              key={`particle-${particleIndex}`}
                              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                              style={{
                                right: `${(particleIndex * 7) % 20}px`,
                                top: `${(particleIndex * 11) % (barHeight - 8)}px`,
                              }}
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{
                                scale: [0, 1, 0],
                                x: [0, 30],
                                opacity: [1, 1, 0]
                              }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 1.5,
                                delay: particleIndex * 0.2,
                                repeat: Infinity,
                                repeatDelay: 2
                              }}
                            />
                          ))}
                        </AnimatePresence>
                      </motion.div>

                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${statusColor}20, transparent)`,
                        }}
                        animate={{
                          opacity: isHovered ? [0, 1, 0] : 0
                        }}
                        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                      />
                    </div>

                    {/* Bounce indicators */}
                    <AnimatePresence>
                      {animationPhase === 1 && (
                        <motion.div
                          className="absolute -top-8 left-0 right-0 flex justify-center"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                        >
                          <motion.div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: statusColor }}
                            animate={{
                              y: [0, -10, 0],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.1
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Value Display */}
                  <div className="w-24 text-right">
                    <motion.div
                      className="text-lg font-bold text-white"
                      animate={{
                        scale: isHovered ? [1, 1.1, 1] : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      ${item.value.toLocaleString()}
                    </motion.div>
                    
                    {item.target && (
                      <div className="text-xs text-gray-400">
                        of ${item.target.toLocaleString()}
                      </div>
                    )}
                    
                    {item.target && (
                      <div className={`text-xs font-semibold ${
                        overTarget ? 'text-green-400' : 
                        (item.value / item.target) >= 0.8 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {((item.value / item.target) * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className="w-8">
                    {overTarget ? (
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 2, repeat: Infinity },
                          scale: { duration: 1, repeat: Infinity }
                        }}
                      >
                        <Award className="w-5 h-5 text-yellow-400" />
                      </motion.div>
                    ) : item.target && (item.value / item.target) >= 0.8 ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 z-30 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 min-w-[200px]"
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className="text-center">
                        <h4 className="text-white font-bold text-sm mb-2">{item.label}</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Current:</span>
                            <span className="text-white font-semibold">${item.value.toLocaleString()}</span>
                          </div>
                          {item.target && (
                            <>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Target:</span>
                                <span className="text-white">${item.target.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Progress:</span>
                                <span className={`font-semibold ${
                                  overTarget ? 'text-green-400' : 
                                  (item.value / item.target) >= 0.8 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {((item.value / item.target) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Remaining:</span>
                                <span className="text-white">
                                  ${Math.max(0, item.target - item.value).toLocaleString()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Tooltip arrow */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white/20" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {data.filter(item => isOverTarget(item)).length}
            </div>
            <div className="text-xs text-gray-400">Goals Achieved</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {(data.reduce((sum, item) => sum + item.value, 0)).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total Value</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {data.filter(item => item.target && (item.value / item.target) >= 0.8).length}
            </div>
            <div className="text-xs text-gray-400">Near Target</div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header with comparison toggle */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
          
          {showComparison && (
            <div className="flex gap-1 bg-white/10 rounded-lg p-1">
              {['current', 'previous', 'target'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setComparisonMode(mode as typeof comparisonMode)}
                  className={`px-3 py-1 text-xs rounded-lg capitalize transition-all ${
                    comparisonMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm">Vertical bars with growth animations and value counters</p>
      </motion.div>

      {/* Chart Container */}
      <div className="relative">
        <div 
          className="grid gap-4 justify-items-center"
          style={{ 
            gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
            height: '300px'
          }}
        >
          {data.map((item, index) => {
            const Icon = item.icon;
            const percentage = getBarPercentage(item.value);
            const targetPercentage = item.target ? getTargetPercentage(item.target) : 0;
            const statusColor = getStatusColor(item);
            const isHovered = hoveredBar === item.id;
            const overTarget = isOverTarget(item);

            return (
              <motion.div
                key={item.id}
                className="relative flex flex-col items-center h-full cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * staggerDelay,
                  type: 'spring',
                  stiffness: 100
                }}
                onMouseEnter={() => setHoveredBar(item.id)}
                onMouseLeave={() => setHoveredBar(null)}
                whileHover={{ scale: 1.02 }}
              >
                {/* Value Display Above Bar */}
                <motion.div
                  className="mb-2 text-center"
                  animate={{
                    scale: isHovered ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-lg font-bold text-white">
                    $<AnimatedCounter value={item.value} delay={index * staggerDelay * 1000} />
                  </div>
                  {item.target && (
                    <div className="text-xs text-gray-400">
                      of ${item.target.toLocaleString()}
                    </div>
                  )}
                </motion.div>

                {/* Bar Container */}
                <div className="relative flex-1 w-12 flex flex-col justify-end">
                  {/* Target Line */}
                  {showTargets && item.target && (
                    <motion.div
                      className="absolute w-16 h-0.5 bg-white/60 z-20 left-1/2 transform -translate-x-1/2"
                      style={{ bottom: `${targetPercentage}%` }}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 0.5 + index * staggerDelay }}
                    >
                      <motion.div
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Target className="w-3 h-3 text-white" />
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Main Bar */}
                  <motion.div
                    className="relative w-full rounded-t-xl overflow-hidden"
                    style={{
                      background: `linear-gradient(to top, ${statusColor}ee, ${statusColor})`,
                      boxShadow: `0 0 20px ${statusColor}40`
                    }}
                    initial={{ height: '0%', scaleY: 0 }}
                    animate={{ 
                      height: isLoaded ? `${percentage}%` : '0%',
                      scaleY: 1,
                      background: overTarget ? [
                        `linear-gradient(to top, ${statusColor}ee, ${statusColor})`,
                        `linear-gradient(to top, #10b981ee, #10b981)`,
                        `linear-gradient(to top, ${statusColor}ee, ${statusColor})`
                      ] : `linear-gradient(to top, ${statusColor}ee, ${statusColor})`
                    }}
                    transition={{ 
                      height: { 
                        delay: index * staggerDelay + 0.5,
                        duration: 1.5,
                        type: 'spring',
                        stiffness: 100,
                        damping: 15
                      },
                      scaleY: {
                        delay: index * staggerDelay + 0.3,
                        duration: 0.5
                      },
                      background: { 
                        duration: 2, 
                        repeat: overTarget ? Infinity : 0 
                      }
                    }}
                    transformOrigin="bottom"
                  >
                    {/* Bar Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                      animate={{
                        y: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        delay: 1 + index * staggerDelay
                      }}
                    />

                    {/* Success Sparkles */}
                    <AnimatePresence>
                      {overTarget && Array.from({ length: 3 }).map((_, sparkleIndex) => (
                        <motion.div
                          key={`sparkle-${sparkleIndex}`}
                          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                          style={{
                            left: `${20 + (sparkleIndex * 20)}%`,
                            top: `${10 + (sparkleIndex * 15)}%`,
                          }}
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{
                            scale: [0, 1, 0],
                            y: [-10, -30],
                            opacity: [1, 1, 0]
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            delay: sparkleIndex * 0.3,
                            repeat: Infinity,
                            repeatDelay: 2
                          }}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-t-xl"
                      style={{
                        background: `linear-gradient(to top, ${statusColor}20, transparent)`,
                      }}
                      animate={{
                        opacity: isHovered ? [0, 1, 0] : 0
                      }}
                      transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                    />
                  </motion.div>
                </div>

                {/* Label and Icon */}
                <motion.div
                  className="mt-3 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * staggerDelay }}
                >
                  {Icon && (
                    <motion.div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1"
                      style={{ backgroundColor: statusColor }}
                      animate={{
                        boxShadow: isHovered ? [
                          `0 0 0px ${statusColor}`,
                          `0 0 20px ${statusColor}60`,
                          `0 0 0px ${statusColor}`
                        ] : `0 0 0px ${statusColor}`,
                        rotate: isHovered ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ 
                        boxShadow: { duration: 1, repeat: isHovered ? Infinity : 0 },
                        rotate: { duration: 0.5 }
                      }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  {item.category && (
                    <div className="text-xs text-gray-400">{item.category}</div>
                  )}
                  
                  {item.target && (
                    <div className={`text-xs font-semibold mt-1 ${
                      overTarget ? 'text-green-400' : 
                      (item.value / item.target) >= 0.8 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {((item.value / item.target) * 100).toFixed(0)}%
                    </div>
                  )}
                </motion.div>

                {/* Status Badge */}
                <div className="absolute -top-2 -right-2">
                  {overTarget ? (
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 2, repeat: Infinity },
                        scale: { duration: 1, repeat: Infinity }
                      }}
                    >
                      <Award className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                  ) : item.target && (item.value / item.target) >= 0.8 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Hover Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-30 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 min-w-[160px]"
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className="text-center">
                        <h4 className="text-white font-bold text-sm mb-2">{item.label}</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Current:</span>
                            <span className="text-white font-semibold">${item.value.toLocaleString()}</span>
                          </div>
                          {item.target && (
                            <>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Target:</span>
                                <span className="text-white">${item.target.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Progress:</span>
                                <span className={`font-semibold ${
                                  overTarget ? 'text-green-400' : 
                                  (item.value / item.target) >= 0.8 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {((item.value / item.target) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              <AnimatedCounter value={data.filter(item => isOverTarget(item)).length} delay={1500} />
            </div>
            <div className="text-xs text-gray-400">Goals Achieved</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              $<AnimatedCounter value={data.reduce((sum, item) => sum + item.value, 0)} delay={1800} />
            </div>
            <div className="text-xs text-gray-400">Total Value</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              <AnimatedCounter value={data.filter(item => item.target && (item.value / item.target) >= 0.8).length} delay={2100} />
            </div>
            <div className="text-xs text-gray-400">Near Target</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}