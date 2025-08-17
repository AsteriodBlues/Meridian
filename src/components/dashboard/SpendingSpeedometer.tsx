'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SpeedometerProps {
  value: number; // 0-100
  title: string;
  subtitle?: string;
}

export default function SpendingSpeedometer({ value, title, subtitle }: SpeedometerProps) {
  const [mounted, setMounted] = useState(false);
  const animatedValue = useSpring(0, { damping: 40, stiffness: 120 });
  const animatedProgress = useTransform(animatedValue, [0, 100], [0, 1]);
  
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      animatedValue.set(value);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [animatedValue, value]);

  const getStatusInfo = (val: number) => {
    if (val <= 40) return { 
      color: '#10B981', 
      bgColor: 'rgba(16, 185, 129, 0.1)', 
      status: 'Optimal', 
      message: 'Healthy spending pace' 
    };
    if (val <= 65) return { 
      color: '#F59E0B', 
      bgColor: 'rgba(245, 158, 11, 0.1)', 
      status: 'Moderate', 
      message: 'Monitor spending closely' 
    };
    if (val <= 85) return { 
      color: '#EF4444', 
      bgColor: 'rgba(239, 68, 68, 0.1)', 
      status: 'High', 
      message: 'Consider slowing down' 
    };
    return { 
      color: '#DC2626', 
      bgColor: 'rgba(220, 38, 38, 0.1)', 
      status: 'Critical', 
      message: 'Immediate attention needed' 
    };
  };

  const statusInfo = getStatusInfo(value);

  return (
    <div className="relative h-full">
      {/* Main container matching current theme */}
      <motion.div
        className="relative h-full glassmorphic hover:bg-white/10 transition-all duration-500 p-6 group overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Subtle glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-wisdom-500/10 via-transparent to-trust-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        
        {/* Floating geometric accents - matching existing style */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-8 h-8 border border-wisdom-400/30 rotate-45"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-trust-400/40 rounded-full"></div>
        </div>
        
        {/* Header - compact */}
        <div className="relative z-10 mb-4">
          <motion.h3 
            className="text-lg font-semibold text-white mb-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {title}
          </motion.h3>
          {subtitle && (
            <motion.p 
              className="text-xs text-gray-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Main content area - better proportions */}
        <div className="relative z-10 flex items-center justify-between">
          {/* Left side - Value display */}
          <div className="flex-1">
            <motion.div
              className="text-4xl font-bold text-white leading-none mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            >
              {mounted ? value : 0}
              <span className="text-lg text-gray-400 ml-1">%</span>
            </motion.div>
            
            {/* Status with theme colors */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusInfo.color }}
              />
              <span 
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: statusInfo.color }}
              >
                {statusInfo.status}
              </span>
            </motion.div>
          </div>

          {/* Right side - Circular progress - smaller, cleaner */}
          <div className="flex-shrink-0 ml-4">
            <motion.div
              className="relative w-20 h-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            >
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="6"
                />
                
                {/* Progress circle with gradient */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={statusInfo.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  style={{
                    strokeDashoffset: useTransform(
                      animatedProgress,
                      [0, 1],
                      [2 * Math.PI * 35, 0]
                    ),
                  }}
                />
              </svg>
              
              {/* Center value */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {mounted ? value : 0}%
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom section - minimal progress bar */}
        <div className="relative z-10 mt-4">
          <motion.div
            className="relative h-1.5 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: statusInfo.color }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: value / 100 }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
            />
            
            {/* Threshold markers - subtle */}
            {[40, 65, 85].map((threshold) => (
              <div
                key={threshold}
                className="absolute top-0 w-px h-full bg-white/20"
                style={{ left: `${threshold}%` }}
              />
            ))}
          </motion.div>

          {/* Status message - compact */}
          <motion.p
            className="text-xs text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            {statusInfo.message}
          </motion.p>
        </div>

        {/* Theme accent border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full opacity-50"
          style={{ backgroundColor: statusInfo.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
      </motion.div>
    </div>
  );
}