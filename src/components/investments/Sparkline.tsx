'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  animated?: boolean;
  showDots?: boolean;
  showGradient?: boolean;
  className?: string;
}

export default function Sparkline({
  data,
  width = 100,
  height = 30,
  color = '#3B82F6',
  animated = true,
  showDots = false,
  showGradient = true,
  className = ''
}: SparklineProps) {
  const [animatedData, setAnimatedData] = useState<number[]>([]);
  
  useEffect(() => {
    if (animated) {
      setAnimatedData([]);
      const timer = setTimeout(() => setAnimatedData(data), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data);
    }
  }, [data, animated]);

  if (!data.length) return null;

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1;
  
  // Generate path for the sparkline
  const generatePath = () => {
    const padding = 2;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;
    
    let path = '';
    
    animatedData.forEach((value, index) => {
      const x = padding + (index / (animatedData.length - 1)) * effectiveWidth;
      const y = padding + effectiveHeight - ((value - minValue) / range) * effectiveHeight;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    const padding = 2;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;
    
    let path = '';
    
    // Start from bottom left
    path += `M ${padding} ${height - padding}`;
    
    // Draw line to first point
    if (animatedData.length > 0) {
      const firstY = padding + effectiveHeight - ((animatedData[0] - minValue) / range) * effectiveHeight;
      path += ` L ${padding} ${firstY}`;
    }
    
    // Draw the sparkline
    animatedData.forEach((value, index) => {
      const x = padding + (index / (animatedData.length - 1)) * effectiveWidth;
      const y = padding + effectiveHeight - ((value - minValue) / range) * effectiveHeight;
      path += ` L ${x} ${y}`;
    });
    
    // Close the path at bottom right
    if (animatedData.length > 0) {
      const lastX = padding + effectiveWidth;
      path += ` L ${lastX} ${height - padding}`;
    }
    
    path += ' Z';
    return path;
  };

  const path = generatePath();
  const areaPath = generateAreaPath();
  const isPositive = data[data.length - 1] > data[0];
  
  return (
    <div className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
          
          <linearGradient id={`sparkline-line-gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="50%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        
        {/* Gradient fill area */}
        {showGradient && animatedData.length > 0 && (
          <motion.path
            d={areaPath}
            fill={`url(#sparkline-gradient-${color.replace('#', '')})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        )}
        
        {/* Main sparkline path */}
        {animatedData.length > 0 && (
          <motion.path
            d={path}
            stroke={`url(#sparkline-line-gradient-${color.replace('#', '')})`}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              pathLength: { duration: 1.2, ease: "easeInOut" },
              opacity: { duration: 0.3 }
            }}
            style={{
              filter: `drop-shadow(0 0 4px ${color}40)`,
            }}
          />
        )}
        
        {/* Data points */}
        {showDots && animatedData.map((value, index) => {
          const padding = 2;
          const effectiveWidth = width - padding * 2;
          const effectiveHeight = height - padding * 2;
          const x = padding + (index / (animatedData.length - 1)) * effectiveWidth;
          const y = padding + effectiveHeight - ((value - minValue) / range) * effectiveHeight;
          
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.8 + index * 0.05,
                type: 'spring',
                stiffness: 300
              }}
              style={{
                filter: `drop-shadow(0 0 3px ${color}80)`,
              }}
            />
          );
        })}
        
        {/* Current value indicator */}
        {animatedData.length > 0 && (
          <motion.circle
            cx={width - 4}
            cy={2 + (height - 4) - ((animatedData[animatedData.length - 1] - minValue) / range) * (height - 4)}
            r="3"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 1.3, 1],
            }}
            transition={{ 
              delay: 1.5,
              duration: 1,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            style={{
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
        )}
      </svg>
      
      {/* Trend indicator */}
      <motion.div
        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          isPositive ? 'bg-green-500' : 'bg-red-500'
        }`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{
          boxShadow: `0 0 8px ${isPositive ? '#10B981' : '#EF4444'}80`,
        }}
      />
    </div>
  );
}

// Mini sparkline component for compact spaces
export function MiniSparkline({ 
  data, 
  color = '#3B82F6', 
  className = '',
  width = 60,
  height = 20 
}: Omit<SparklineProps, 'showDots' | 'showGradient'>) {
  return (
    <Sparkline
      data={data}
      width={width}
      height={height}
      color={color}
      animated={false}
      showDots={false}
      showGradient={false}
      className={className}
    />
  );
}

// Performance sparkline with percentage
export function PerformanceSparkline({ 
  data, 
  percentage, 
  className = '' 
}: { 
  data: number[]; 
  percentage: number; 
  className?: string; 
}) {
  const color = percentage >= 0 ? '#10B981' : '#EF4444';
  const isPositive = percentage >= 0;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Sparkline
        data={data}
        width={80}
        height={24}
        color={color}
        animated={true}
        showDots={false}
        showGradient={true}
      />
      <motion.span
        className={`text-sm font-semibold ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {isPositive ? '+' : ''}{percentage.toFixed(2)}%
      </motion.span>
    </div>
  );
}

// Animated number ticker
export function AnimatedValue({ 
  value, 
  prefix = '', 
  suffix = '', 
  className = '',
  duration = 1 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string; 
  className?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = (end - start) / (duration * 60); // 60 FPS
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 1000 / 60);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}