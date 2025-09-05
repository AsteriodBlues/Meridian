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

export function MeridianLoadingScreen({ 
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
      {/* Aurora Background Animation */}
      <motion.div
        className="absolute inset-0 aurora-gradient-slow opacity-30"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating Particles - matching dashboard */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-trust-400 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Glass Morphism Background Elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 glassmorphic rounded-2xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-24 h-24 glassmorphic-dark rounded-xl"
        animate={{
          rotate: [0, -180, 0],
          y: [-20, 20, -20]
        }}
        transition={{
          rotate: { duration: 12, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Central Loading Area */}
      <div className="relative z-10 text-center">
        {/* Premium Aurora Loader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="mb-12"
        >
          <div className="relative w-40 h-40 mx-auto">
            {/* Outer Aurora Ring */}
            <motion.div
              className="absolute inset-0 rounded-full aurora-gradient"
              style={{
                background: 'conic-gradient(from 0deg, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe, #667eea)',
                maskImage: 'radial-gradient(circle, transparent 60%, black 65%, black 100%)'
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Trust Core */}
            <motion.div
              className="absolute inset-6 rounded-full bg-gradient-to-br from-trust-400 via-wisdom-500 to-growth-400"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Central Glow */}
            <motion.div
              className="absolute inset-12 rounded-full bg-white/20 glassmorphic"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
        
        {/* Aurora Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-6"
        >
          <h1 className="text-display text-6xl font-bold aurora-text tracking-wide">
            {title.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
          
          {/* Animated Divider */}
          <motion.div
            className="flex justify-center"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="h-0.5 w-40 aurora-gradient rounded-full"></div>
          </motion.div>
          
          <motion.p 
            className="text-lg text-gray-300 font-medium tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
        
        {/* Premium Progress Indicators */}
        <motion.div
          className="flex justify-center items-center space-x-6 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="relative"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            >
              <div className={`
                w-3 h-3 rounded-full glassmorphic
                ${i === 0 ? 'bg-trust-400' : i === 1 ? 'bg-wisdom-400' : 'bg-growth-400'}
              `} />
              <div className={`
                absolute inset-0 rounded-full blur-md opacity-50
                ${i === 0 ? 'bg-trust-400' : i === 1 ? 'bg-wisdom-400' : 'bg-growth-400'}
              `} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Noise Overlay for Premium Feel */}
      <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
    </div>
  );
}