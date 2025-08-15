'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TrendingUp, Zap, DollarSign, Target } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  delay?: number;
}

const MetricCard = ({ title, value, change, changeType, icon: Icon, delay = 0 }: MetricCardProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeColors = {
    positive: 'text-growth-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 transition-all duration-500"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-wisdom-500/20 via-transparent to-trust-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-wisdom-400/20 to-trust-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-wisdom-500/20 to-trust-500/20 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-5 w-5 text-wisdom-400" />
          </div>
          <span className={`text-sm font-medium ${changeColors[changeType]}`}>
            {change}
          </span>
        </div>
        
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <p className="text-2xl font-bold text-white group-hover:text-wisdom-300 transition-colors duration-300">
          {mounted ? value : '---'}
        </p>
      </div>
    </motion.div>
  );
};

const LiquidMetalCounter = () => {
  const [targetValue] = useState(2847592);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const springCount = useSpring(count, { damping: 50, stiffness: 100 });

  useEffect(() => {
    const timer = setTimeout(() => {
      count.set(targetValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [count, targetValue]);

  return (
    <div className="relative group">
      {/* Liquid metal background */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-wisdom-600 via-trust-500 to-growth-500 animate-liquid opacity-30 blur-xl" />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-green-500/30 animate-pulse" />
      
      <motion.div 
        className="relative z-10 text-center p-8 rounded-3xl border border-white/20 bg-black/20 backdrop-blur-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <h2 className="text-lg font-medium text-gray-300 mb-2">Total Net Worth</h2>
        <motion.div 
          className="text-5xl font-bold bg-gradient-to-r from-wisdom-300 via-trust-300 to-growth-300 bg-clip-text text-transparent"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          $<motion.span>{rounded}</motion.span>
        </motion.div>
        <p className="text-growth-400 text-sm mt-2 font-medium">+12.5% this month</p>
      </motion.div>
    </div>
  );
};

export default function HeroMetrics() {
  const metrics = [
    {
      title: 'Monthly Income',
      value: '$12,847',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      delay: 0.1,
    },
    {
      title: 'Spending Velocity',
      value: '73%',
      change: '-2.1%',
      changeType: 'positive' as const,
      icon: Zap,
      delay: 0.2,
    },
    {
      title: 'Investment Growth',
      value: '+$4,231',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      delay: 0.3,
    },
    {
      title: 'Savings Goal',
      value: '89%',
      change: 'On track',
      changeType: 'neutral' as const,
      icon: Target,
      delay: 0.4,
    },
  ];

  return (
    <section className="relative py-12">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-wisdom-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Liquid Metal Net Worth Counter */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <LiquidMetalCounter />
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </div>
    </section>
  );
}