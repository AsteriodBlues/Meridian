'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernClock from '@/components/ui/ModernClock';

interface TimeBasedBackgroundProps {
  children: React.ReactNode;
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

const timeGradients = {
  dawn: {
    primary: 'from-pink-900 via-purple-900 to-indigo-900',
    secondary: 'from-pink-500/20 via-purple-500/15 to-indigo-500/10',
    accent: 'from-pink-400/30 to-orange-400/20',
    particles: '#F472B6',
  },
  morning: {
    primary: 'from-blue-900 via-sky-800 to-cyan-900',
    secondary: 'from-blue-500/20 via-sky-500/15 to-cyan-500/10',
    accent: 'from-blue-400/30 to-cyan-400/20',
    particles: '#60A5FA',
  },
  midday: {
    primary: 'from-sky-900 via-blue-800 to-indigo-900',
    secondary: 'from-sky-500/15 via-blue-500/12 to-indigo-500/8',
    accent: 'from-sky-400/25 to-blue-400/15',
    particles: '#38BDF8',
  },
  afternoon: {
    primary: 'from-amber-900 via-orange-900 to-red-900',
    secondary: 'from-amber-500/20 via-orange-500/15 to-red-500/10',
    accent: 'from-amber-400/30 to-orange-400/20',
    particles: '#FBBF24',
  },
  evening: {
    primary: 'from-orange-900 via-red-900 to-purple-900',
    secondary: 'from-orange-500/20 via-red-500/15 to-purple-500/10',
    accent: 'from-orange-400/30 to-red-400/20',
    particles: '#FB923C',
  },
  night: {
    primary: 'from-slate-900 via-gray-900 to-black',
    secondary: 'from-slate-500/15 via-gray-500/10 to-black/5',
    accent: 'from-slate-400/20 to-gray-400/10',
    particles: '#94A3B8',
  },
};

const FloatingParticles = ({ color, timeOfDay }: { color: string; timeOfDay: TimeOfDay }) => {
  const particleCount = timeOfDay === 'night' ? 50 : 30;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full opacity-60"
          style={{
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const AnimatedBlobs = ({ timeOfDay }: { timeOfDay: TimeOfDay }) => {
  const gradients = timeGradients[timeOfDay];
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large blob */}
      <motion.div
        className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br ${gradients.accent} blur-3xl`}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Medium blob */}
      <motion.div
        className={`absolute -bottom-1/2 -left-1/2 w-3/4 h-3/4 rounded-full bg-gradient-to-tl ${gradients.accent} blur-2xl`}
        animate={{
          scale: [1, 0.8, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Small blob */}
      <motion.div
        className={`absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-r ${gradients.secondary} blur-xl`}
        animate={{
          scale: [0.8, 1.1, 0.8],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default function TimeBasedBackground({ children }: TimeBasedBackgroundProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());

    // Update time of day every minute
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-luxury-950">{children}</div>;
  }

  const gradients = timeGradients[timeOfDay];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base gradient background */}
      <AnimatePresence mode="wait">
        <motion.div
          key="background-gradient"
          className={`fixed inset-0 bg-gradient-to-br ${gradients.primary}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        />
      </AnimatePresence>

      {/* Secondary gradient overlay */}
      <div className={`fixed inset-0 bg-gradient-to-t ${gradients.secondary}`} />

      {/* Animated blobs */}
      <AnimatedBlobs timeOfDay={timeOfDay} />

      {/* Floating particles */}
      <FloatingParticles color={gradients.particles} timeOfDay={timeOfDay} />

      {/* Noise overlay for texture */}
      <div 
        className="fixed inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Modern Clock */}
      <ModernClock />
    </div>
  );
}