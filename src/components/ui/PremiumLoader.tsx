'use client';

import { motion } from 'framer-motion';

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dots' | 'bars' | 'ring' | 'pulse';
  className?: string;
}

const LoaderDots = ({ size }: { size: string }) => {
  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }[size];

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSize} bg-gradient-to-r from-wisdom-400 to-trust-400 rounded-full`}
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const LoaderBars = ({ size }: { size: string }) => {
  const barHeight = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  }[size];

  return (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`w-1 ${barHeight} bg-gradient-to-t from-wisdom-400 to-trust-400 rounded-full`}
          animate={{
            scaleY: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const LoaderRing = ({ size }: { size: string }) => {
  const ringSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  return (
    <div className={`${ringSize} relative`}>
      <motion.div
        className="absolute inset-0 border-2 border-transparent border-t-wisdom-400 border-r-trust-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute inset-1 border border-transparent border-b-wisdom-300 border-l-trust-300 rounded-full"
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};

const LoaderPulse = ({ size }: { size: string }) => {
  const pulseSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  return (
    <div className={`${pulseSize} relative flex items-center justify-center`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-wisdom-400 to-trust-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.3, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="w-1/2 h-1/2 bg-gradient-to-r from-wisdom-500 to-trust-500 rounded-full"
        animate={{
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default function PremiumLoader({
  size = 'md',
  variant = 'dots',
  className = '',
}: PremiumLoaderProps) {
  const loaders = {
    dots: LoaderDots,
    bars: LoaderBars,
    ring: LoaderRing,
    pulse: LoaderPulse,
  };

  const LoaderComponent = loaders[variant];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoaderComponent size={size} />
    </div>
  );
}