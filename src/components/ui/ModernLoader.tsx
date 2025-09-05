'use client';

import { motion } from 'framer-motion';

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

export function AwwardsLoadingScreen({ 
  title = "MERIDIAN",
  subtitle = "Your Financial Companion",
  className = ""
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`min-h-screen bg-luxury-950 flex items-center justify-center relative overflow-hidden ${className}`}>
      {/* Cinematic Background System */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.08) 35%, rgba(240, 147, 251, 0.05) 70%, transparent 100%)'
        }}
        animate={{
          scale: [1, 1.3, 1.1, 1],
          opacity: [0.3, 0.6, 0.4, 0.3]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />

      {/* Advanced Particle System */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#a855f7' : '#22c55e',
            filter: 'blur(0.5px)'
          }}
          animate={{
            x: [
              0, 
              Math.sin(i * 0.5) * (Math.random() * 200 + 100),
              Math.cos(i * 0.3) * (Math.random() * 150 + 75),
              0
            ],
            y: [
              0,
              Math.cos(i * 0.7) * (Math.random() * 200 + 100), 
              Math.sin(i * 0.4) * (Math.random() * 150 + 75),
              0
            ],
            opacity: [0, 0.8, 0.4, 0],
            scale: [0.5, 1.5, 1, 0.5]
          }}
          transition={{
            duration: Math.random() * 8 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}

      {/* Sophisticated Glass Morphism Elements */}
      <motion.div
        className="absolute top-20 left-20 glassmorphic rounded-3xl border border-white/5"
        style={{ width: 180, height: 120 }}
        animate={{
          rotate: [0, 15, -10, 5, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
          x: [-20, 20, -10, 10, 0],
          y: [0, -30, 15, -15, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
      
      <motion.div
        className="absolute bottom-32 right-24 glassmorphic-dark rounded-2xl border border-white/10"
        style={{ width: 140, height: 100 }}
        animate={{
          rotate: [0, -20, 12, -8, 0],
          scale: [1, 0.9, 1.15, 0.98, 1],
          x: [0, -25, 15, -10, 0],
          y: [0, 20, -25, 10, 0]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 glassmorphic rounded-full border border-white/8"
        style={{ width: 80, height: 80 }}
        animate={{
          scale: [1, 1.3, 0.8, 1.1, 1],
          opacity: [0.6, 1, 0.4, 0.8, 0.6],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />

      {/* Cinematic Central Loading System */}
      <div className="relative z-10 text-center">
        {/* Advanced Multi-Layer Loader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ 
            duration: 2,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="mb-16 relative"
          style={{ perspective: '1000px' }}
        >
          <div className="relative w-52 h-52 mx-auto">
            {/* Outer Orbital Ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe, #667eea)',
                maskImage: 'radial-gradient(circle, transparent 70%, black 75%, black 85%, transparent 90%)',
                filter: 'blur(0.5px)'
              }}
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.08, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Middle Pulse Ring */}
            <motion.div
              className="absolute inset-6 rounded-full"
              style={{
                background: 'conic-gradient(from 180deg, #22c55e, #a855f7, #3b82f6, #22c55e)',
                maskImage: 'radial-gradient(circle, transparent 65%, black 70%, black 80%, transparent 85%)',
                filter: 'blur(0.3px)'
              }}
              animate={{ 
                rotate: [360, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Inner Core with Advanced Gradient */}
            <motion.div
              className="absolute inset-12 rounded-full glassmorphic"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(102,126,234,0.4) 30%, rgba(168,85,247,0.3) 60%, rgba(34,197,94,0.2) 100%)',
                boxShadow: '0 0 50px rgba(102, 126, 234, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.1)'
              }}
              animate={{
                scale: [0.8, 1.3, 0.9, 1.1, 0.8],
                opacity: [0.7, 1, 0.8, 0.9, 0.7],
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />

            {/* Central Energy Dot */}
            <motion.div
              className="absolute inset-20 rounded-full bg-white"
              style={{
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(102, 126, 234, 0.4)'
              }}
              animate={{
                scale: [0.5, 1.2, 0.7, 1, 0.5],
                opacity: [0.8, 1, 0.9, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
        
        {/* Cinematic Typography */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: -30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 2, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-8"
          style={{ perspective: '1000px' }}
        >
          <h1 className="text-display text-7xl font-bold tracking-wide relative">
            {title.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block aurora-text"
                style={{ 
                  textShadow: '0 0 20px rgba(102, 126, 234, 0.5)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
                animate={{
                  y: [0, -15, 5, -8, 0],
                  rotateY: [0, 5, -3, 2, 0],
                  scale: [1, 1.05, 0.98, 1.02, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
          
          {/* Advanced Animated Divider */}
          <motion.div
            className="flex justify-center relative"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="h-1 w-48 rounded-full aurora-gradient relative"
              style={{
                boxShadow: '0 0 20px rgba(102, 126, 234, 0.6), 0 4px 12px rgba(0,0,0,0.3)'
              }}
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-300 font-medium tracking-wider"
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.5)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 2.2, duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
        
        {/* Premium Progress System */}
        <motion.div
          className="flex justify-center items-center space-x-8 mt-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8, duration: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="relative"
              animate={{
                scale: [1, 1.4, 1.1, 1],
                opacity: [0.6, 1, 0.8, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <div className={`
                w-4 h-4 rounded-full glassmorphic relative
                ${i === 0 ? 'bg-trust-400' : i === 1 ? 'bg-wisdom-400' : 'bg-growth-400'}
              `} 
                style={{
                  boxShadow: `0 0 20px ${i === 0 ? 'rgba(96, 165, 250, 0.6)' : i === 1 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(34, 197, 94, 0.6)'}`
                }}
              />
              <motion.div 
                className={`
                  absolute inset-0 rounded-full blur-lg
                  ${i === 0 ? 'bg-trust-400' : i === 1 ? 'bg-wisdom-400' : 'bg-growth-400'}
                `}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
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
    </div>
  );
}