'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

interface InvestmentData {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  allocation: number;
  color: string;
}

const investments: InvestmentData[] = [
  {
    name: 'Technology Fund',
    symbol: 'TECH',
    value: 45280,
    change: 2340,
    changePercent: 5.45,
    allocation: 35,
    color: '#3B82F6',
  },
  {
    name: 'Growth Stocks',
    symbol: 'GROW',
    value: 32150,
    change: 1890,
    changePercent: 6.24,
    allocation: 25,
    color: '#10B981',
  },
  {
    name: 'Real Estate',
    symbol: 'REIT',
    value: 28900,
    change: -450,
    changePercent: -1.53,
    allocation: 22,
    color: '#F59E0B',
  },
  {
    name: 'Bonds',
    symbol: 'BOND',
    value: 23670,
    change: 120,
    changePercent: 0.51,
    allocation: 18,
    color: '#8B5CF6',
  },
];

interface GlowingCardProps {
  investment: InvestmentData;
  index: number;
}

const GlowingCard = ({ investment, index }: GlowingCardProps) => {
  const isPositive = investment.change >= 0;
  const animatedValue = useSpring(0, { damping: 50, stiffness: 100 });
  const animatedChange = useSpring(0, { damping: 50, stiffness: 100 });
  
  const displayValue = useTransform(animatedValue, Math.round);
  const displayChange = useTransform(animatedChange, Math.round);

  useEffect(() => {
    const timer = setTimeout(() => {
      animatedValue.set(investment.value);
      animatedChange.set(Math.abs(investment.change));
    }, 500 + index * 200);

    return () => clearTimeout(timer);
  }, [animatedValue, animatedChange, investment.value, investment.change, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glow effect based on performance */}
      <motion.div
        className={`absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500`}
        style={{
          background: `linear-gradient(135deg, ${investment.color}40, ${investment.color}20)`,
        }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <div className="relative bg-luxury-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group-hover:border-white/20 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-lg">{investment.name}</h3>
            <p className="text-gray-400 text-sm">{investment.symbol}</p>
          </div>
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${investment.color}20` }}
          >
            {isPositive ? (
              <TrendingUp className="w-6 h-6" style={{ color: investment.color }} />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-400" />
            )}
          </div>
        </div>

        {/* Value */}
        <div className="mb-4">
          <motion.p className="text-2xl font-bold text-white">
            $<motion.span>{displayValue}</motion.span>
          </motion.p>
        </div>

        {/* Change */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 ${isPositive ? 'text-growth-400' : 'text-red-400'}`}>
            <span className="text-sm font-medium">
              {isPositive ? '+' : '-'}$<motion.span>{displayChange}</motion.span>
            </span>
            <span className="text-sm">
              ({isPositive ? '+' : ''}{investment.changePercent}%)
            </span>
          </div>
        </div>

        {/* Allocation bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Portfolio Allocation</span>
            <span className="text-white font-medium">{investment.allocation}%</span>
          </div>
          <div className="w-full bg-luxury-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: investment.color }}
              initial={{ width: 0 }}
              animate={{ width: `${investment.allocation}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            />
          </div>
        </div>

        {/* Performance indicator dots */}
        <div className="absolute top-4 right-4 flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: investment.color }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function InvestmentPerformance() {
  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalChange = investments.reduce((sum, inv) => sum + inv.change, 0);
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100;

  return (
    <div className="space-y-8">
      {/* Header with total performance */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-wisdom-500/10 via-trust-500/10 to-growth-500/10 rounded-3xl blur-xl" />
        
        <div className="relative bg-luxury-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Investment Portfolio</h2>
              <p className="text-gray-400">Real-time performance tracking</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Total Value</p>
              <p className="text-3xl font-bold text-white mb-2">
                ${totalValue.toLocaleString()}
              </p>
              <div className={`flex items-center gap-2 justify-end ${totalChange >= 0 ? 'text-growth-400' : 'text-red-400'}`}>
                {totalChange >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {totalChange >= 0 ? '+' : ''}${totalChange.toLocaleString()} ({totalChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Performance metrics */}
          <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-growth-500/20">
                <DollarSign className="w-6 h-6 text-growth-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">24h Gain</p>
              <p className="text-xl font-bold text-growth-400">+$1,847</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-wisdom-500/20">
                <Percent className="w-6 h-6 text-wisdom-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Yield</p>
              <p className="text-xl font-bold text-wisdom-400">4.2%</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-trust-500/20">
                <TrendingUp className="w-6 h-6 text-trust-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">30d Return</p>
              <p className="text-xl font-bold text-trust-400">+12.8%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Investment cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {investments.map((investment, index) => (
          <GlowingCard
            key={investment.symbol}
            investment={investment}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}