'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Droplets, Zap, Target, TrendingUp } from 'lucide-react';

interface DonutSegment {
  id: string;
  label: string;
  value: number;
  color: string;
  icon?: React.ElementType;
  targetPercentage?: number;
}

interface LiquidDonutChartProps {
  data: DonutSegment[];
  size?: number;
  thickness?: number;
  showLabels?: boolean;
  showCenter?: boolean;
  animated?: boolean;
  liquidEffect?: boolean;
  className?: string;
}

export default function LiquidDonutChart({
  data,
  size = 300,
  thickness = 40,
  showLabels = true,
  showCenter = true,
  animated = true,
  liquidEffect = true,
  className = ''
}: LiquidDonutChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [morphPhase, setMorphPhase] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const radius = (size - thickness) / 2;
  const innerRadius = radius - thickness;
  const center = size / 2;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Liquid morph animation phases
  useEffect(() => {
    const interval = setInterval(() => {
      setMorphPhase(prev => (prev + 1) % 8);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // General animation phases
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate path for donut segment with liquid morphing
  const createLiquidPath = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number,
    morphOffset: number = 0
  ) => {
    const liquidVariation = liquidEffect ? Math.sin(morphOffset) * 3 : 0;
    const adjustedOuterRadius = outerRadius + liquidVariation;
    const adjustedInnerRadius = innerRadius - liquidVariation * 0.5;

    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + adjustedOuterRadius * Math.cos(startAngleRad);
    const y1 = center + adjustedOuterRadius * Math.sin(startAngleRad);
    const x2 = center + adjustedOuterRadius * Math.cos(endAngleRad);
    const y2 = center + adjustedOuterRadius * Math.sin(endAngleRad);

    const x3 = center + adjustedInnerRadius * Math.cos(endAngleRad);
    const y3 = center + adjustedInnerRadius * Math.sin(endAngleRad);
    const x4 = center + adjustedInnerRadius * Math.cos(startAngleRad);
    const y4 = center + adjustedInnerRadius * Math.sin(startAngleRad);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${adjustedOuterRadius} ${adjustedOuterRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${adjustedInnerRadius} ${adjustedInnerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  // Calculate segment angles
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    const midAngle = (startAngle + endAngle) / 2;
    
    currentAngle = endAngle;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      midAngle,
      index
    };
  });

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  return (
    <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Budget Distribution</h3>
        <p className="text-gray-400 text-sm">Interactive liquid donut chart with morphing effects</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Chart Container */}
        <motion.div
          className="relative"
          style={{ width: size, height: size }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSegment(null)}
        >
          <svg width={size} height={size} className="overflow-visible">
            <defs>
              {/* Gradients for each segment */}
              {segments.map(segment => (
                <React.Fragment key={`gradients-${segment.id}`}>
                  <radialGradient id={`gradient-${segment.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={segment.color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={segment.color} stopOpacity={1} />
                  </radialGradient>
                  
                  <radialGradient id={`liquid-gradient-${segment.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={segment.color} stopOpacity={0.3} />
                    <stop offset="70%" stopColor={segment.color} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={segment.color} stopOpacity={0.9} />
                  </radialGradient>
                </React.Fragment>
              ))}

              {/* Liquid effects filters */}
              <filter id="liquid-glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="liquid-distortion">
                <feTurbulence baseFrequency="0.3" numOctaves="3" result="turbulence"/>
                <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2"/>
              </filter>
            </defs>

            {/* Background circle */}
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Segments */}
            {segments.map((segment, index) => {
              const isHovered = hoveredSegment === segment.id;
              const isSelected = selectedSegment === segment.id;
              const morphOffset = morphPhase + index * 0.5;
              const hoverScale = isHovered ? 1.05 : 1;
              
              return (
                <motion.g
                  key={segment.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedSegment(
                    isSelected ? null : segment.id
                  )}
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                >
                  {/* Main segment */}
                  <motion.path
                    d={createLiquidPath(
                      segment.startAngle,
                      segment.endAngle,
                      radius * hoverScale,
                      innerRadius / hoverScale,
                      morphOffset
                    )}
                    fill={`url(#gradient-${segment.id})`}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1"
                    filter={liquidEffect ? "url(#liquid-glow)" : undefined}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      d: animated ? createLiquidPath(
                        segment.startAngle,
                        segment.endAngle,
                        radius * hoverScale,
                        innerRadius / hoverScale,
                        morphOffset
                      ) : undefined
                    }}
                    transition={{
                      opacity: { delay: 0.7 + index * 0.1 },
                      scale: { delay: 0.7 + index * 0.1, type: 'spring' },
                      d: { duration: 0.5 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      filter: `drop-shadow(0 0 10px ${segment.color}40)`
                    }}
                  />

                  {/* Liquid layer */}
                  {liquidEffect && (
                    <motion.path
                      d={createLiquidPath(
                        segment.startAngle,
                        segment.endAngle,
                        radius * 0.95,
                        innerRadius * 1.05,
                        morphOffset + 1
                      )}
                      fill={`url(#liquid-gradient-${segment.id})`}
                      opacity={0.6}
                      animate={{
                        d: createLiquidPath(
                          segment.startAngle,
                          segment.endAngle,
                          radius * 0.95,
                          innerRadius * 1.05,
                          morphOffset + Math.sin(morphPhase * 0.1 + index) * 2
                        )
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  )}

                  {/* Bubble effects */}
                  <AnimatePresence>
                    {liquidEffect && isHovered && Array.from({ length: 3 }).map((_, bubbleIndex) => {
                      const bubbleAngle = segment.midAngle + (bubbleIndex - 1) * 10;
                      const bubbleDistance = innerRadius + (radius - innerRadius) * ((bubbleIndex * 0.3 + 0.2) % 1);
                      const bubbleX = center + bubbleDistance * Math.cos((bubbleAngle - 90) * Math.PI / 180);
                      const bubbleY = center + bubbleDistance * Math.sin((bubbleAngle - 90) * Math.PI / 180);
                      
                      return (
                        <motion.circle
                          key={`bubble-${bubbleIndex}`}
                          cx={bubbleX}
                          cy={bubbleY}
                          r={2 + (bubbleIndex * 0.7 + 1) % 3}
                          fill={segment.color}
                          opacity={0.6}
                          initial={{ scale: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            y: [0, -10],
                            opacity: [0.6, 0.8, 0]
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            delay: bubbleIndex * 0.2,
                            repeat: Infinity,
                            repeatDelay: 1
                          }}
                        />
                      );
                    })}
                  </AnimatePresence>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.path
                      d={createLiquidPath(
                        segment.startAngle - 2,
                        segment.endAngle + 2,
                        radius + 5,
                        innerRadius - 5
                      )}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.8)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  {/* Value labels */}
                  {showLabels && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      {/* Percentage text */}
                      <motion.text
                        x={center + (radius - thickness/2) * Math.cos((segment.midAngle - 90) * Math.PI / 180)}
                        y={center + (radius - thickness/2) * Math.sin((segment.midAngle - 90) * Math.PI / 180)}
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        animate={{
                          scale: isHovered ? [1, 1.2, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {segment.percentage.toFixed(1)}%
                      </motion.text>

                      {/* Icon */}
                      {segment.icon && (
                        <motion.g
                          transform={`translate(${
                            center + (radius - thickness/2) * Math.cos((segment.midAngle - 90) * Math.PI / 180) - 8
                          }, ${
                            center + (radius - thickness/2) * Math.sin((segment.midAngle - 90) * Math.PI / 180) - 15
                          })`}
                          animate={{
                            scale: isHovered ? 1.2 : 1,
                            rotate: isHovered ? [0, 10, -10, 0] : 0
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <rect width="16" height="16" rx="3" fill={segment.color} opacity="0.8" />
                          <foreignObject width="16" height="16">
                            <segment.icon className="w-4 h-4 text-white" />
                          </foreignObject>
                        </motion.g>
                      )}
                    </motion.g>
                  )}
                </motion.g>
              );
            })}

            {/* Center content */}
            {showCenter && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
              >
                <circle
                  cx={center}
                  cy={center}
                  r={innerRadius * 0.8}
                  fill="rgba(255, 255, 255, 0.05)"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1"
                />
                
                <text
                  x={center}
                  y={center - 10}
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  ${total.toLocaleString()}
                </text>
                
                <text
                  x={center}
                  y={center + 15}
                  fill="rgba(255, 255, 255, 0.6)"
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  Total Budget
                </text>

                {/* Center liquid effect */}
                {liquidEffect && (
                  <motion.circle
                    cx={center}
                    cy={center}
                    r={innerRadius * 0.6}
                    fill={`url(#liquid-gradient-${segments[0]?.id})`}
                    opacity={0.3}
                    animate={{
                      r: [innerRadius * 0.6, innerRadius * 0.65, innerRadius * 0.6],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                )}
              </motion.g>
            )}
          </svg>

          {/* Floating liquid particles */}
          <AnimatePresence>
            {liquidEffect && animationPhase === 2 && Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={`particle-${index}`}
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${segments[index % segments.length]?.color || '#3b82f6'}, transparent)`,
                  left: `${20 + (index * 13) % 60}%`,
                  top: `${20 + (index * 17) % 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  y: [-20, -40],
                  x: [0, (index * 7) % 40 - 20]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: index * 0.3,
                  ease: 'easeOut'
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex-1 space-y-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            const isHovered = hoveredSegment === segment.id;
            const isSelected = selectedSegment === segment.id;
            
            return (
              <motion.div
                key={segment.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                onMouseEnter={() => setHoveredSegment(segment.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() => setSelectedSegment(isSelected ? null : segment.id)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                style={{
                  border: isSelected ? `2px solid ${segment.color}` : '2px solid transparent'
                }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: segment.color }}
                  animate={{
                    scale: isHovered ? [1, 1.3, 1] : 1,
                    boxShadow: isHovered ? [
                      `0 0 0px ${segment.color}`,
                      `0 0 15px ${segment.color}60`,
                      `0 0 0px ${segment.color}`
                    ] : `0 0 0px ${segment.color}`
                  }}
                  transition={{ 
                    scale: { duration: 0.3 },
                    boxShadow: { duration: 1, repeat: isHovered ? Infinity : 0 }
                  }}
                />
                
                {Icon && (
                  <motion.div
                    animate={{ rotate: isHovered ? [0, 5, -5, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                  </motion.div>
                )}
                
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{segment.label}</div>
                  <div className="text-xs text-gray-400">
                    ${segment.value.toLocaleString()} ({segment.percentage.toFixed(1)}%)
                  </div>
                </div>
                
                {segment.targetPercentage && (
                  <div className="text-right">
                    <div className={`text-xs font-semibold ${
                      segment.percentage >= segment.targetPercentage ? 'text-green-400' : 'text-red-400'
                    }`}>
                      Target: {segment.targetPercentage}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {segment.percentage >= segment.targetPercentage ? '✓' : '○'} 
                      {Math.abs(segment.percentage - segment.targetPercentage).toFixed(1)}%
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}