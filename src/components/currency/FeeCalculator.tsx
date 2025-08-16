'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Calculator, DollarSign, Percent, Info, AlertTriangle,
  TrendingDown, TrendingUp, CreditCard, Building2, Zap
} from 'lucide-react';

interface FeeBreakdown {
  id: string;
  label: string;
  type: 'fixed' | 'percentage' | 'spread';
  amount: number;
  percentage?: number;
  description: string;
  color: string;
  icon: React.ElementType;
}

interface Provider {
  id: string;
  name: string;
  logo: string;
  rating: number;
  fees: FeeBreakdown[];
  totalFee: number;
  exchangeRate: number;
  speed: string;
  color: string;
}

interface FeeCalculatorProps {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  className?: string;
}

export default function FeeCalculator({ 
  amount = 1000,
  fromCurrency = 'USD',
  toCurrency = 'EUR',
  className = '' 
}: FeeCalculatorProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('wise');
  const [animatingFees, setAnimatingFees] = useState<{ [key: string]: number }>({});
  const [showComparison, setShowComparison] = useState(false);

  // Sample fee providers
  const providers: Provider[] = [
    {
      id: 'wise',
      name: 'Wise',
      logo: '💸',
      rating: 4.8,
      exchangeRate: 0.8532,
      speed: '1-2 days',
      color: '#10b981',
      totalFee: 8.52,
      fees: [
        {
          id: 'transfer-fee',
          label: 'Transfer Fee',
          type: 'fixed',
          amount: 4.12,
          description: 'Fixed fee for processing the transfer',
          color: '#3b82f6',
          icon: CreditCard
        },
        {
          id: 'conversion-fee',
          label: 'Conversion Fee',
          type: 'percentage',
          amount: 4.40,
          percentage: 0.44,
          description: 'Fee for currency conversion',
          color: '#8b5cf6',
          icon: Calculator
        }
      ]
    },
    {
      id: 'traditional-bank',
      name: 'Traditional Bank',
      logo: '🏦',
      rating: 3.2,
      exchangeRate: 0.8410,
      speed: '3-5 days',
      color: '#ef4444',
      totalFee: 35.80,
      fees: [
        {
          id: 'wire-fee',
          label: 'Wire Transfer Fee',
          type: 'fixed',
          amount: 25.00,
          description: 'Standard international wire transfer fee',
          color: '#ef4444',
          icon: Building2
        },
        {
          id: 'exchange-spread',
          label: 'Exchange Rate Spread',
          type: 'spread',
          amount: 10.80,
          percentage: 1.8,
          description: 'Hidden markup on exchange rate',
          color: '#f59e0b',
          icon: TrendingDown
        }
      ]
    },
    {
      id: 'crypto-exchange',
      name: 'Crypto Bridge',
      logo: '₿',
      rating: 4.5,
      exchangeRate: 0.8528,
      speed: '10 minutes',
      color: '#06b6d4',
      totalFee: 12.75,
      fees: [
        {
          id: 'network-fee',
          label: 'Network Fee',
          type: 'fixed',
          amount: 2.50,
          description: 'Blockchain network transaction fee',
          color: '#06b6d4',
          icon: Zap
        },
        {
          id: 'platform-fee',
          label: 'Platform Fee',
          type: 'percentage',
          amount: 10.25,
          percentage: 0.75,
          description: 'Platform service fee',
          color: '#8b5cf6',
          icon: Calculator
        }
      ]
    }
  ];

  const selectedProviderData = providers.find(p => p.id === selectedProvider) || providers[0];

  // Animate fee amounts when provider changes
  useEffect(() => {
    const newAnimatingFees: { [key: string]: number } = {};
    selectedProviderData.fees.forEach(fee => {
      newAnimatingFees[fee.id] = fee.amount;
    });
    setAnimatingFees(newAnimatingFees);
  }, [selectedProvider, selectedProviderData]);

  // Calculate results
  const totalAmount = amount;
  const totalFees = selectedProviderData.totalFee;
  const netAmount = totalAmount - totalFees;
  const receivedAmount = netAmount * selectedProviderData.exchangeRate;

  // Animation components
  const AnimatedNumber = ({ 
    value, 
    prefix = '', 
    suffix = '', 
    duration = 1000 
  }: { 
    value: number; 
    prefix?: string; 
    suffix?: string; 
    duration?: number; 
  }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      let startTime: number;
      let startValue = displayValue;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (value - startValue) * easeOutCubic;
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [value, duration]);

    return (
      <span>
        {prefix}{displayValue.toFixed(2)}{suffix}
      </span>
    );
  };

  const FeeBreakdownItem = ({ fee, index }: { fee: FeeBreakdown; index: number }) => {
    const Icon = fee.icon;
    
    return (
      <motion.div
        className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${fee.color}20`, border: `1px solid ${fee.color}40` }}
          >
            <Icon className="w-4 h-4" style={{ color: fee.color }} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-medium">{fee.label}</span>
              <div className="text-right">
                <div className="text-white font-mono">
                  $<AnimatedNumber value={fee.amount} />
                </div>
                {fee.percentage && (
                  <div className="text-xs text-gray-400">
                    {fee.percentage}%
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-gray-400 text-sm">{fee.description}</p>
            
            {/* Visual Fee Bar */}
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: fee.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(fee.amount / totalFees) * 100}%` }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`relative p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Fee Calculator
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Compare transfer costs across different providers
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Provider Selection */}
        <div className="space-y-6">
          <div className="text-white font-medium mb-4">Choose Provider</div>
          
          <div className="space-y-3">
            {providers.map((provider) => (
              <motion.button
                key={provider.id}
                className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedProvider === provider.id
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                onClick={() => setSelectedProvider(provider.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{provider.logo}</div>
                    <div>
                      <div className="text-white font-medium">{provider.name}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor(provider.rating) 
                                  ? 'bg-yellow-400' 
                                  : 'bg-gray-600'
                              }`}
                            />
                          ))}
                          <span className="text-gray-400 ml-1">{provider.rating}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{provider.speed}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-mono text-lg">
                      $<AnimatedNumber value={provider.totalFee} />
                    </div>
                    <div className="text-gray-400 text-sm">Total Fee</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Comparison Toggle */}
          <motion.button
            className="w-full p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
            onClick={() => setShowComparison(!showComparison)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showComparison ? 'Hide' : 'Show'} Detailed Comparison
          </motion.button>
        </div>

        {/* Fee Breakdown */}
        <div className="space-y-6">
          <div className="text-white font-medium mb-4">Fee Breakdown</div>
          
          {/* Summary Card */}
          <motion.div
            className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sending Amount</span>
                <span className="text-white font-mono text-lg">
                  ${fromCurrency} <AnimatedNumber value={totalAmount} />
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Fees</span>
                <span className="text-red-400 font-mono text-lg">
                  -$<AnimatedNumber value={totalFees} />
                </span>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">You'll Receive</span>
                  <div className="text-right">
                    <div className="text-green-400 font-mono text-xl font-bold">
                      {toCurrency} <AnimatedNumber value={receivedAmount} />
                    </div>
                    <div className="text-gray-400 text-sm">
                      Rate: <AnimatedNumber value={selectedProviderData.exchangeRate} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Individual Fee Items */}
          <div className="space-y-3">
            {selectedProviderData.fees.map((fee, index) => (
              <FeeBreakdownItem key={fee.id} fee={fee} index={index} />
            ))}
          </div>

          {/* Fee Visualization */}
          <motion.div
            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-white font-medium mb-3">Fee Distribution</div>
            <div className="space-y-2">
              {selectedProviderData.fees.map((fee, index) => (
                <div key={fee.id} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: fee.color }}
                  />
                  <span className="text-gray-400 text-sm flex-1">{fee.label}</span>
                  <span className="text-white text-sm font-mono">
                    {((fee.amount / totalFees) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            className="mt-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-white font-medium mb-4">Provider Comparison</div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-gray-400 pb-3">Provider</th>
                    <th className="text-right text-gray-400 pb-3">Total Fee</th>
                    <th className="text-right text-gray-400 pb-3">Exchange Rate</th>
                    <th className="text-right text-gray-400 pb-3">You Receive</th>
                    <th className="text-right text-gray-400 pb-3">Speed</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider, index) => (
                    <motion.tr
                      key={provider.id}
                      className={`border-b border-white/5 ${selectedProvider === provider.id ? 'bg-blue-500/10' : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="py-3 text-white">{provider.name}</td>
                      <td className="py-3 text-right text-white font-mono">${provider.totalFee.toFixed(2)}</td>
                      <td className="py-3 text-right text-white font-mono">{provider.exchangeRate.toFixed(4)}</td>
                      <td className="py-3 text-right text-green-400 font-mono">
                        {((amount - provider.totalFee) * provider.exchangeRate).toFixed(2)}
                      </td>
                      <td className="py-3 text-right text-gray-400">{provider.speed}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}