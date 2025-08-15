'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface PremiumButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export default function PremiumButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
}: PremiumButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 overflow-hidden magnetic';
  
  const variants = {
    primary: 'bg-gradient-to-r from-wisdom-500 to-trust-500 text-white shadow-lg shadow-wisdom-500/25',
    secondary: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-700',
    ghost: 'bg-white/5 text-white border border-white/10 backdrop-blur-sm',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.02,
              y: -2,
              boxShadow: variant === 'primary' 
                ? '0 10px 40px rgba(168, 85, 247, 0.4)' 
                : '0 10px 40px rgba(0, 0, 0, 0.3)',
            }
      }
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      disabled={disabled}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isPressed
            ? { scale: 1, opacity: [0, 0.3, 0] }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}