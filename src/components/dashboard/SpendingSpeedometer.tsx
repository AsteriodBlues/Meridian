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
  const animatedValue = useSpring(0, { damping: 30, stiffness: 100 });
  
  // Convert value to rotation angle (-90 to 90 degrees)
  const rotation = useTransform(animatedValue, [0, 100], [-90, 90]);
  
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      animatedValue.set(value);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [animatedValue, value]);

  const getColorFromValue = (val: number) => {
    if (val <= 30) return '#22C55E'; // Green - Conservative
    if (val <= 60) return '#F59E0B'; // Amber - Moderate  
    if (val <= 80) return '#EF4444'; // Red - High
    return '#DC2626'; // Dark Red - Very High
  };

  const segments = Array.from({ length: 20 }, (_, i) => {
    const angle = -90 + (i * 9); // Distribute across 180 degrees
    const segmentValue = (i / 19) * 100;
    const isActive = segmentValue <= value;
    
    return {
      angle,
      isActive,
      color: getColorFromValue(segmentValue),
    };
  });

  return (
    <div className="relative group">
      <motion.div
        className="relative w-64 h-32 mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-wisdom-500/20 to-transparent rounded-t-full blur-xl opacity-50" />
        
        {/* Speedometer arc segments */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <defs>
            <linearGradient id="speedometerGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Active segments */}
          {segments.map((segment, i) => (
            <motion.circle
              key={i}
              cx={100 + 60 * Math.cos((segment.angle * Math.PI) / 180)}
              cy={80 + 60 * Math.sin((segment.angle * Math.PI) / 180)}
              r="2"
              fill={segment.isActive ? segment.color : 'rgba(255,255,255,0.2)'}
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            />
          ))}
          
          {/* Center dot */}
          <circle
            cx="100"
            cy="80"
            r="4"
            fill="white"
            className="drop-shadow-lg"
          />
          
          {/* Needle */}
          <motion.line
            x1="100"
            y1="80"
            x2="100"
            y2="30"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ 
              transformOrigin: '100px 80px',
              rotate: rotation,
            }}
            className="drop-shadow-md"
          />
          
          {/* Needle tip */}
          <motion.circle
            cx="100"
            cy="30"
            r="3"
            fill={getColorFromValue(value)}
            style={{ 
              transformOrigin: '100px 80px',
              rotate: rotation,
            }}
            className="drop-shadow-lg"
          />
        </svg>
        
        {/* Value display */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <motion.div
            className="text-3xl font-bold text-white mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {mounted ? value : 0}%
          </motion.div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            {value <= 30 ? 'Conservative' : 
             value <= 60 ? 'Moderate' : 
             value <= 80 ? 'High' : 'Very High'}
          </div>
        </div>
      </motion.div>
      
      {/* Title and subtitle */}
      <div className="text-center mt-6">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}