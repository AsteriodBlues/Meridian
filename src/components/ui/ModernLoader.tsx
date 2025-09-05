'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BauhausLoaderProps {
  size?: number;
  className?: string;
}

export function BauhausLoader({ size = 160, className = '' }: BauhausLoaderProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Primary red circle - rotating */}
      <motion.div
        className="absolute bg-red-500"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: '50%',
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Blue square - counter-rotating */}
      <motion.div
        className="absolute bg-blue-600"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          top: '10%',
          left: '10%'
        }}
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Yellow triangle */}
      <motion.div
        className="absolute"
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size * 0.15}px solid transparent`,
          borderRight: `${size * 0.15}px solid transparent`,
          borderBottom: `${size * 0.25}px solid #eab308`,
          bottom: '15%',
          right: '15%'
        }}
        animate={{
          rotate: [0, 360],
          y: [-10, 10, -10]
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Black line element */}
      <motion.div
        className="absolute bg-gray-900"
        style={{
          width: size * 0.8,
          height: size * 0.02,
          top: '50%',
          left: '10%'
        }}
        animate={{
          scaleX: [0.5, 1.2, 0.5],
          rotate: [0, 90, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

// Time-based background system for loading screen
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
    primary: 'from-slate-800 via-gray-800 to-slate-900',
    secondary: 'from-slate-500/20 via-gray-500/15 to-slate-500/10',
    accent: 'from-slate-400/25 to-gray-400/15',
    particles: '#94A3B8',
  },
};

export function StunningLoadingScreen({ 
  title = "MERIDIAN",
  subtitle = "Your Financial Companion",
  className = "",
  onLoadingComplete
}: {
  title?: string;
  subtitle?: string;
  className?: string;
  onLoadingComplete?: () => void;
}) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeOfDay(getTimeOfDay());
  }, []);

  const gradients = mounted ? timeGradients[timeOfDay] : timeGradients.night;
  return (
    <motion.div 
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${className}`} 
      style={{ perspective: '2000px' }}
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        filter: 'blur(10px)'
      }}
      transition={{
        exit: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
    >
      {/* Time-Based Dashboard Background */}
      <motion.div
        key="background-gradient"
        className={`absolute inset-0 bg-gradient-to-br ${gradients.primary}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      
      {/* Secondary gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradients.secondary}`} />
      
      {/* Animated Time-Based Blobs */}
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

      {/* Time-Based Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: timeOfDay === 'night' ? 50 : 30 }).map((_, i) => (
          <motion.div
            key={`time-particle-${i}`}
            className="absolute w-1 h-1 rounded-full opacity-60"
            style={{
              backgroundColor: gradients.particles,
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

      {/* Noise overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Dreamy Aurora Background with Animated Mesh */}
      <div className="absolute inset-0 overflow-hidden opacity-50">
        {/* Primary Aurora Background */}
        <motion.div
          className="absolute inset-0 aurora-gradient-slow opacity-40"
          animate={{
            scale: [1, 1.15, 0.95, 1.05, 1],
            opacity: [0.3, 0.6, 0.4, 0.5, 0.3],
            rotateZ: [0, 8, -5, 3, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
        
        {/* Secondary Dreamy Mesh Layer */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 80% at 20% 20%, rgba(102, 126, 234, 0.3) 0%, transparent 60%),
              radial-gradient(ellipse 100% 100% at 80% 80%, rgba(168, 85, 247, 0.25) 0%, transparent 50%),
              radial-gradient(ellipse 80% 120% at 40% 90%, rgba(34, 197, 94, 0.2) 0%, transparent 55%),
              radial-gradient(ellipse 90% 70% at 90% 10%, rgba(240, 147, 251, 0.15) 0%, transparent 45%),
              radial-gradient(ellipse 110% 90% at 10% 60%, rgba(59, 130, 246, 0.18) 0%, transparent 50%)
            `
          }}
          animate={{
            scale: [1, 1.3, 0.9, 1.2, 1],
            opacity: [0.5, 0.8, 0.6, 0.9, 0.5],
            rotateZ: [0, -10, 6, -4, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />

        {/* Floating Aurora Dots */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`aurora-dot-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 12 + 6,
              height: Math.random() * 12 + 6,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(102, 126, 234, 0.8), rgba(102, 126, 234, 0.3))' 
                : i % 3 === 1 
                ? 'radial-gradient(circle, rgba(168, 85, 247, 0.8), rgba(168, 85, 247, 0.3))' 
                : 'radial-gradient(circle, rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 0.3))',
              boxShadow: `0 0 25px ${
                i % 3 === 0 ? 'rgba(102, 126, 234, 0.6)' 
                : i % 3 === 1 ? 'rgba(168, 85, 247, 0.6)' 
                : 'rgba(34, 197, 94, 0.6)'
              }`
            }}
            animate={{
              x: [
                0, 
                Math.sin(i * 0.5) * 200,
                Math.cos(i * 0.7) * 150,
                Math.sin(i * 0.3) * 180,
                0
              ],
              y: [
                0,
                Math.cos(i * 0.4) * 180,
                Math.sin(i * 0.6) * 120,
                Math.cos(i * 0.8) * 160,
                0
              ],
              opacity: [0.4, 0.9, 0.6, 1, 0.4],
              scale: [0.8, 1.4, 1, 1.2, 0.8],
              filter: [
                'blur(1px) brightness(0.8)',
                'blur(0px) brightness(1.3)',
                'blur(0.5px) brightness(1)',
                'blur(0px) brightness(1.1)',
                'blur(1px) brightness(0.8)'
              ]
            }}
            transition={{
              duration: Math.random() * 8 + 12,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        ))}

        {/* Dreamy Light Streaks */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`light-streak-${i}`}
            className="absolute"
            style={{
              width: Math.random() * 300 + 200,
              height: 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                rgba(${i % 2 === 0 ? '102, 126, 234' : '168, 85, 247'}, 0.6) 50%, 
                transparent 100%)`,
              filter: 'blur(1px)',
              transformOrigin: 'center'
            }}
            animate={{
              scaleX: [0, 1, 0.7, 1, 0],
              opacity: [0, 0.8, 0.5, 0.9, 0],
              rotate: [0, 15, -10, 20, 0]
            }}
            transition={{
              duration: Math.random() * 6 + 8,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        ))}
      </div>

      {/* Spectacular Particle Galaxy */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 8 + 3,
            height: Math.random() * 8 + 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `
              ${i % 4 === 0 ? 'radial-gradient(circle, #60a5fa, #3b82f6)' :
                i % 4 === 1 ? 'radial-gradient(circle, #a855f7, #7c3aed)' :
                i % 4 === 2 ? 'radial-gradient(circle, #22c55e, #16a34a)' :
                'radial-gradient(circle, #f59e0b, #d97706)'}
            `,
            boxShadow: `0 0 20px ${i % 4 === 0 ? '#60a5fa' : i % 4 === 1 ? '#a855f7' : i % 4 === 2 ? '#22c55e' : '#f59e0b'}`,
            filter: 'blur(0.5px)'
          }}
          animate={{
            x: [
              0, 
              Math.sin(i * 0.3) * (Math.random() * 400 + 200) * Math.cos(i * 0.2),
              Math.cos(i * 0.5) * (Math.random() * 300 + 150) * Math.sin(i * 0.4),
              Math.sin(i * 0.7) * (Math.random() * 250 + 125),
              0
            ],
            y: [
              0,
              Math.cos(i * 0.4) * (Math.random() * 400 + 200) * Math.sin(i * 0.3),
              Math.sin(i * 0.6) * (Math.random() * 300 + 150) * Math.cos(i * 0.5),
              Math.cos(i * 0.8) * (Math.random() * 250 + 125),
              0
            ],
            opacity: [0, 0.3, 0.8, 0.5, 0.9, 0.2, 0],
            scale: [0, 0.8, 1.5, 1.2, 2, 0.6, 0],
            rotateZ: [0, 180, 360, 540, 720],
            filter: [
              'blur(2px) brightness(0.5)',
              'blur(0.5px) brightness(1.2)',
              'blur(0px) brightness(1.5)',
              'blur(1px) brightness(1)',
              'blur(3px) brightness(0.3)'
            ]
          }}
          transition={{
            duration: Math.random() * 12 + 15,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}

      {/* Mesmerizing Floating Glass Elements */}
      <motion.div
        className="absolute glassmorphic rounded-3xl border border-white/10"
        style={{ 
          width: 220, 
          height: 140,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(102,126,234,0.05), rgba(168,85,247,0.05))',
          boxShadow: '0 8px 40px rgba(102, 126, 234, 0.15), inset 0 2px 20px rgba(255,255,255,0.1)'
        }}
        animate={{
          rotate: [0, 25, -15, 20, -10, 0],
          scale: [1, 1.15, 0.9, 1.2, 0.95, 1],
          x: [-30, 40, -20, 30, -10, 0],
          y: [0, -40, 25, -30, 15, 0],
          rotateX: [0, 15, -10, 20, -5, 0],
          rotateY: [0, -10, 25, -15, 10, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
      
      <motion.div
        className="absolute glassmorphic-dark rounded-2xl border border-white/15"
        style={{ 
          width: 180, 
          height: 120,
          background: 'linear-gradient(225deg, rgba(0,0,0,0.2), rgba(168,85,247,0.1), rgba(34,197,94,0.08))',
          boxShadow: '0 12px 50px rgba(168, 85, 247, 0.2), inset 0 4px 25px rgba(255,255,255,0.05)'
        }}
        animate={{
          rotate: [0, -30, 20, -25, 15, 0],
          scale: [1, 0.85, 1.25, 0.95, 1.1, 1],
          x: [0, -40, 25, -30, 20, 0],
          y: [0, 35, -30, 25, -15, 0],
          rotateX: [0, -20, 15, -25, 10, 0],
          rotateY: [0, 20, -15, 25, -10, 0]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />

      <motion.div
        className="absolute glassmorphic rounded-full border border-white/12"
        style={{ 
          width: 100, 
          height: 100,
          background: 'radial-gradient(circle, rgba(255,255,255,0.15), rgba(240,147,251,0.1), rgba(74,222,128,0.08))',
          boxShadow: '0 15px 60px rgba(240, 147, 251, 0.25), inset 0 5px 30px rgba(255,255,255,0.1)'
        }}
        animate={{
          scale: [1, 1.4, 0.7, 1.3, 0.9, 1.2, 1],
          opacity: [0.7, 1, 0.3, 0.9, 0.5, 1, 0.7],
          rotate: [0, 240, 480, 720],
          rotateX: [0, 360],
          rotateY: [0, -360]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />

      {/* Additional Floating Orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute glassmorphic rounded-full"
          style={{
            width: Math.random() * 60 + 40,
            height: Math.random() * 60 + 40,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, rgba(255,255,255,0.1), ${
              i % 3 === 0 ? 'rgba(102,126,234,0.08)' : 
              i % 3 === 1 ? 'rgba(168,85,247,0.08)' : 
              'rgba(34,197,94,0.08)'
            })`,
            boxShadow: `0 10px 40px ${
              i % 3 === 0 ? 'rgba(102, 126, 234, 0.2)' : 
              i % 3 === 1 ? 'rgba(168, 85, 247, 0.2)' : 
              'rgba(34, 197, 94, 0.2)'
            }`,
            border: '1px solid rgba(255,255,255,0.08)'
          }}
          animate={{
            scale: [0.8, 1.5, 1.1, 1.3, 0.9, 1.2, 0.8],
            opacity: [0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.4],
            x: [
              0,
              Math.sin(i * 1.2) * 100,
              Math.cos(i * 0.8) * 150,
              Math.sin(i * 1.5) * 120,
              0
            ],
            y: [
              0,
              Math.cos(i * 0.9) * 120,
              Math.sin(i * 1.1) * 100,
              Math.cos(i * 1.3) * 140,
              0
            ],
            rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
            rotateX: [0, 180],
            rotateY: [0, -180]
          }}
          transition={{
            duration: Math.random() * 15 + 20,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}

      {/* Mind-Blowing Central Loading System */}
      <div className="relative z-10 text-center">
        {/* Simple & Beautiful Loader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.5,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="mb-16 relative"
        >
          <div className="relative w-32 h-32 mx-auto">
            {/* Main Loading Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/20"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              }}
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Inner Glow */}
            <motion.div
              className="absolute inset-4 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
              }}
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
        
        {/* Elegant Typography - Clean & Sophisticated */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center space-y-8"
        >
          <motion.h1 
            className="text-6xl md:text-7xl text-white font-light tracking-wide"
            style={{ 
              fontFamily: '"Space Grotesk", "Inter", -apple-system, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.1em'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.3, ease: "easeOut" }}
          >
            {title.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  textShadow: [
                    '0 0 20px rgba(255, 255, 255, 0.1)',
                    '0 0 30px rgba(102, 126, 234, 0.3)',
                    '0 0 25px rgba(168, 85, 247, 0.2)',
                    '0 0 20px rgba(255, 255, 255, 0.1)'
                  ]
                }}
                transition={{
                  duration: 0.8,
                  delay: 1.5 + (i * 0.1),
                  ease: "easeOut",
                  textShadow: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>
          
          {/* Elegant Divider */}
          <motion.div
            className="flex justify-center"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="h-px w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-300/70 font-normal tracking-wider"
            style={{
              fontFamily: '"Inter", -apple-system, sans-serif',
              fontWeight: 400,
              letterSpacing: '0.05em'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 3, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
        
        {/* Simple Loading Indicator */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1, ease: "easeOut" }}
        >
          <motion.div className="flex items-center justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white/40 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
          <motion.p 
            className="text-sm text-gray-400/60 font-light tracking-widest uppercase mt-4"
            style={{
              fontFamily: '"Inter", -apple-system, sans-serif',
              letterSpacing: '0.2em'
            }}
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Loading
          </motion.p>
        </motion.div>

      </div>
      
      {/* Advanced Visual Effects */}
      <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
      
      {/* Cinematic Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(10, 10, 11, 0.3) 80%, rgba(10, 10, 11, 0.6) 100%)'
        }}
      />
    </motion.div>
  );
}