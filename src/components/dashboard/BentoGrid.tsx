'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import PremiumButton from '@/components/ui/PremiumButton';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  gradient?: string;
}

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-1',
  large: 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-2',
  wide: 'col-span-1 sm:col-span-2 lg:col-span-3 row-span-1',
  tall: 'col-span-1 row-span-2',
};

export const BentoCard = ({ children, className = '', size = 'small', gradient }: BentoCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), {
    damping: 20,
    stiffness: 300,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), {
    damping: 20,
    stiffness: 300,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative group cursor-pointer overflow-hidden magnetic premium-hover ${sizeClasses[size]} ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Background with gradient */}
      <div className={`
        absolute inset-0 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden
        ${gradient || 'bg-gradient-to-br from-luxury-800/40 to-luxury-900/60'}
        group-hover:border-white/20 transition-all duration-500
      `} />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(168, 85, 247, 0.1), transparent 40%)',
        }}
      />

      {/* Content */}
      <div 
        className="relative z-10 h-full p-5 rounded-3xl flex flex-col"
        style={{ transform: 'translateZ(50px)' }}
      >
        {children}
      </div>

      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        }}
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export const BentoGrid = ({ children, className = '' }: BentoGridProps) => {
  return (
    <div className={`
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px]
      perspective-1000 w-full ${className}
    `}>
      {children}
    </div>
  );
};

// Pre-built bento components for common use cases
export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  size = 'small' 
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
}) => {
  const trendColors = {
    up: 'text-growth-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <BentoCard size={size}>
      <div className="h-full flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-400 text-sm font-medium mb-3 leading-relaxed break-words">{title}</h3>
            <motion.p 
              className="text-xl font-bold text-white leading-relaxed break-words mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-gray-500 text-sm leading-relaxed break-words">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <motion.div
              className="flex-shrink-0 p-2 rounded-lg bg-white/10"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon className="w-5 h-5 text-wisdom-400" />
            </motion.div>
          )}
        </div>
        
        {trend && trendValue && (
          <div className={`flex items-center gap-2 mt-4 ${trendColors[trend]}`}>
            <span className="text-sm font-medium break-words">{trendValue}</span>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              trend === 'up' ? 'bg-growth-400' : 
              trend === 'down' ? 'bg-red-400' : 'bg-gray-400'
            }`} />
          </div>
        )}
      </div>
    </BentoCard>
  );
};

export const ChartCard = ({ 
  title, 
  children, 
  size = 'medium' 
}: {
  title: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
}) => {
  return (
    <BentoCard size={size}>
      <div className="h-full flex flex-col">
        <h3 className="text-white text-sm font-semibold mb-4 leading-relaxed break-words">{title}</h3>
        <div className="flex-1 flex items-center justify-center min-h-0">
          {children}
        </div>
      </div>
    </BentoCard>
  );
};

export const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  size = 'small' 
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
}) => {
  return (
    <BentoCard size={size}>
      <motion.div
        className="h-full flex flex-col justify-center items-center text-center cursor-pointer p-2"
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full bg-gradient-to-r from-wisdom-500 to-trust-500 flex items-center justify-center mb-3 flex-shrink-0"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
        <h3 className="text-white font-semibold mb-2 text-sm leading-relaxed break-words">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed break-words">{description}</p>
      </motion.div>
    </BentoCard>
  );
};