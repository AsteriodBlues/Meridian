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

export function BauhausLoadingScreen({ 
  title = "MERIDIAN",
  subtitle = "FORM FOLLOWS FUNCTION",
  className = ""
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  // Add artificial minimum loading time
  const minLoadingTime = 3000; // 3 seconds
  
  return (
    <div className={`min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden ${className}`}>
      {/* Bauhaus geometric background elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-red-500"
        animate={{
          rotate: [0, 45, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-48 bg-blue-600"
        animate={{
          x: [-10, 10, -10],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/4 right-1/4 w-0 h-0"
        style={{
          borderLeft: '40px solid transparent',
          borderRight: '40px solid transparent',
          borderBottom: '70px solid #eab308',
        }}
        animate={{
          rotate: [0, 360],
          y: [-20, 20, -20]
        }}
        transition={{
          rotate: { duration: 12, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Central loading area */}
      <div className="relative z-10 text-center">
        {/* Add delay to make loading visible longer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1,
            delay: 0.5,
          }}
        >
          <BauhausLoader size={200} className="mb-12" />
        </motion.div>
        
        {/* Typography - Bauhaus style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="space-y-4"
        >
          <h1 className="text-6xl font-black text-gray-900 tracking-wider">
            {title.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                animate={{
                  y: [0, -10, 0],
                  color: ['#111827', '#dc2626', '#111827']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          
          <motion.div
            className="flex justify-center"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          >
            <div className="h-1 w-32 bg-red-500"></div>
          </motion.div>
          
          <p className="text-lg font-medium text-gray-700 tracking-widest uppercase">
            {subtitle}
          </p>
        </motion.div>
        
        {/* Bauhaus progress indicator */}
        <motion.div
          className="flex justify-center items-center space-x-4 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`${
                i === 0 ? 'w-4 h-4 bg-red-500 rounded-full' :
                i === 1 ? 'w-4 h-4 bg-blue-600' :
                'w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-yellow-500'
              }`}
              animate={{
                scale: [1, 1.3, 1],
                rotate: i === 2 ? [0, 360] : 0
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}