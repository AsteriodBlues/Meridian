'use client';

import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sun, Moon, Cloud, Star, Sunrise, Sunset } from 'lucide-react';

interface ModernClockProps {
  className?: string;
}

type TimeOfDay = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'midday';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
};

const timeIcons = {
  dawn: Sunrise,
  morning: Sun,
  midday: Sun,
  afternoon: Cloud,
  evening: Sunset,
  night: Moon,
};

const timeColors = {
  dawn: {
    bg: 'from-pink-500/20 via-orange-500/15 to-yellow-500/10',
    border: 'border-pink-500/30',
    icon: 'text-pink-400',
    glow: 'shadow-pink-500/20',
    particle: '#F472B6'
  },
  morning: {
    bg: 'from-blue-500/20 via-sky-500/15 to-cyan-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    glow: 'shadow-blue-500/20',
    particle: '#60A5FA'
  },
  midday: {
    bg: 'from-yellow-500/20 via-amber-500/15 to-orange-500/10',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    glow: 'shadow-yellow-500/20',
    particle: '#FBBF24'
  },
  afternoon: {
    bg: 'from-orange-500/20 via-amber-500/15 to-yellow-500/10',
    border: 'border-orange-500/30',
    icon: 'text-orange-400',
    glow: 'shadow-orange-500/20',
    particle: '#FB923C'
  },
  evening: {
    bg: 'from-purple-500/20 via-pink-500/15 to-orange-500/10',
    border: 'border-purple-500/30',
    icon: 'text-purple-400',
    glow: 'shadow-purple-500/20',
    particle: '#A855F7'
  },
  night: {
    bg: 'from-indigo-500/20 via-purple-500/15 to-slate-500/10',
    border: 'border-indigo-500/30',
    icon: 'text-indigo-400',
    glow: 'shadow-indigo-500/20',
    particle: '#6366F1'
  },
};

export default function ModernClock({ className = '' }: ModernClockProps) {
  const [time, setTime] = useState(new Date());
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const rotateY = useSpring(mouseY, { damping: 25, stiffness: 200 });

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      setTimeOfDay(getTimeOfDay());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (event.clientX - centerX) / 20;
    const y = (event.clientY - centerY) / 20;
    
    mouseX.set(x);
    mouseY.set(-y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!mounted) return null;

  const Icon = timeIcons[timeOfDay];
  const colors = timeColors[timeOfDay];
  
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const isPM = hours >= 12;
  const displayHours = hours % 12 || 12;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const timeString = `${formatNumber(displayHours)}:${formatNumber(minutes)}`;
  const period = isPM ? 'PM' : 'AM';

  return (
    <motion.div
      className={`fixed top-24 left-6 z-50 ${className}`}
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: 1, 
        duration: 0.8,
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        handleMouseLeave();
        setIsExpanded(false);
      }}
      onMouseEnter={() => setIsExpanded(true)}
    >
      <motion.div
        className={`relative bg-gradient-to-br ${colors.bg} backdrop-blur-xl ${colors.border} border rounded-2xl overflow-hidden group cursor-pointer`}
        style={{
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Simplified background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-40"
              style={{
                backgroundColor: colors.particle,
                left: `${25 + (i * 15)}%`,
                top: `${30 + (i % 2) * 25}%`,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Simplified glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />

        {/* Main content */}
        <div className="relative z-10 px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Simplified icon */}
            <div className="relative">
              <Icon className={`w-6 h-6 ${colors.icon}`} />
              
              {/* Static icon glow */}
              <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  background: `radial-gradient(circle, ${colors.particle}60 0%, transparent 70%)`,
                }}
              />
            </div>

            {/* Time display */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                {/* Hours and minutes */}
                <motion.span
                  className="text-white font-bold text-xl font-mono tracking-tight"
                  key={timeString}
                  initial={{ scale: 1.1, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {timeString}
                </motion.span>
                
                {/* Period (AM/PM) */}
                <motion.span
                  className={`text-xs font-semibold ${colors.icon} ml-1`}
                  key={period}
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {period}
                </motion.span>
              </div>

              {/* Time of day label */}
              <motion.span
                className="text-gray-300 text-xs font-medium capitalize tracking-wide"
                key={timeOfDay}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {timeOfDay}
              </motion.span>
            </div>

            {/* Seconds indicator */}
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className={`w-8 h-1 rounded-full ${colors.border.replace('border-', 'bg-').replace('/30', '/20')}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: seconds / 60 }}
                transition={{ duration: 0.1 }}
              />
              <motion.span
                className="text-gray-400 text-xs font-mono"
                key={seconds}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                {formatNumber(seconds)}
              </motion.span>
            </div>
          </div>

          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="mt-3 pt-3 border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {time.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className={`${colors.icon} font-semibold`}>
                    {time.getFullYear()}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Static edge accent */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background: `linear-gradient(135deg, ${colors.particle}30, transparent, ${colors.particle}15)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}