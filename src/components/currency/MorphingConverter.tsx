'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeftRight, TrendingUp, TrendingDown, RefreshCw, 
  Calculator, Zap, Star, Sparkles, ArrowUpDown
} from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number;
  color: string;
}

interface MorphingConverterProps {
  className?: string;
  onConversionComplete?: (result: { from: Currency; to: Currency; amount: number; result: number }) => void;
}

// Deterministic pseudo-random function for SSR compatibility
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 1000) / 1000;
};

export default function MorphingConverter({ 
  className = '',
  onConversionComplete 
}: MorphingConverterProps) {
  const [fromCurrency, setFromCurrency] = useState<Currency>({
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rate: 1.0,
    color: '#10b981'
  });

  const [toCurrency, setToCurrency] = useState<Currency>({
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    rate: 0.8532,
    color: '#3b82f6'
  });

  const [amount, setAmount] = useState<string>('1000');
  const [result, setResult] = useState<string>('853.20');
  const [isConverting, setIsConverting] = useState(false);
  const [showMorphing, setShowMorphing] = useState(false);
  const [animatingDigits, setAnimatingDigits] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currencies: Currency[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1.0, color: '#10b981' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.8532, color: '#3b82f6' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.7342, color: '#8b5cf6' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 148.75, color: '#f59e0b' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.3567, color: '#ef4444' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.5234, color: '#06b6d4' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭', rate: 0.8845, color: '#84cc16' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rate: 7.2456, color: '#ec4899' }
  ];

  // Animation values
  const swapRotation = useMotionValue(0);
  const morphProgress = useMotionValue(0);
  const resultScale = useSpring(1, { stiffness: 300, damping: 20 });

  // Morphing number animation
  const animateNumberMorph = useCallback(async (oldValue: string, newValue: string) => {
    setShowMorphing(true);
    setIsConverting(true);

    // Create array of digits that will animate
    const maxLength = Math.max(oldValue.length, newValue.length);
    const oldDigits = oldValue.padStart(maxLength, '0').split('');
    const newDigits = newValue.padStart(maxLength, '0').split('');
    
    const animDigits: number[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const oldDigit = parseInt(oldDigits[i]) || 0;
      const newDigit = parseInt(newDigits[i]) || 0;
      
      if (oldDigit !== newDigit) {
        // Animate through intermediate values
        for (let step = 0; step <= 10; step++) {
          setTimeout(() => {
            setAnimatingDigits(prev => {
              const updated = [...prev];
              updated[i] = Math.floor(oldDigit + (newDigit - oldDigit) * (step / 10));
              return updated;
            });
          }, step * 100 + i * 50);
        }
      } else {
        animDigits[i] = oldDigit;
      }
    }
    
    setAnimatingDigits(animDigits);

    // Final result after animation
    setTimeout(() => {
      setResult(newValue);
      setShowMorphing(false);
      setIsConverting(false);
      resultScale.set(1.1);
      setTimeout(() => resultScale.set(1), 200);
    }, 1500);
  }, [resultScale]);

  // Convert currency
  const convertCurrency = useCallback(() => {
    const amountNum = parseFloat(amount) || 0;
    const conversionRate = toCurrency.rate / fromCurrency.rate;
    const resultNum = amountNum * conversionRate;
    const newResult = resultNum.toFixed(2);
    
    if (newResult !== result) {
      animateNumberMorph(result, newResult);
      onConversionComplete?.({
        from: fromCurrency,
        to: toCurrency,
        amount: amountNum,
        result: resultNum
      });
    }
  }, [amount, fromCurrency, toCurrency, result, animateNumberMorph]);

  // Auto-convert when values change
  useEffect(() => {
    const timeoutId = setTimeout(convertCurrency, 500);
    return () => clearTimeout(timeoutId);
  }, [convertCurrency]);

  // Swap currencies with animation
  const swapCurrencies = () => {
    swapRotation.set(180);
    setTimeout(() => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      swapRotation.set(0);
    }, 200);
  };

  // Format number with morphing effect
  const formatMorphingNumber = (value: string) => {
    if (!showMorphing) return value;
    
    return value.split('').map((digit, index) => (
      <motion.span
        key={`${index}-${digit}`}
        className="inline-block"
        animate={{
          y: [0, -20, 0],
          opacity: [1, 0.5, 1],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: "easeInOut"
        }}
      >
        {animatingDigits[index] !== undefined ? animatingDigits[index] : digit}
      </motion.span>
    ));
  };

  const CurrencySelector = ({ 
    currency, 
    setCurrency, 
    label, 
    position 
  }: { 
    currency: Currency; 
    setCurrency: (c: Currency) => void; 
    label: string;
    position: 'left' | 'right';
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <motion.button
          className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/15 transition-all group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{currency.flag}</div>
              <div className="text-left">
                <div className="text-white font-medium">{currency.code}</div>
                <div className="text-gray-400 text-sm">{currency.name}</div>
              </div>
            </div>
            <motion.div
              className="text-white/60"
              animate={{ rotate: isOpen ? 180 : 0 }}
            >
              <ArrowUpDown className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`absolute top-full mt-2 w-72 max-h-64 overflow-y-auto bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-2 z-50 ${
                position === 'right' ? 'right-0' : 'left-0'
              }`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {currencies.map((curr) => (
                <motion.button
                  key={curr.code}
                  className="w-full p-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setCurrency(curr);
                    setIsOpen(false);
                  }}
                >
                  <div className="text-xl">{curr.flag}</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{curr.code}</div>
                    <div className="text-gray-400 text-xs">{curr.name}</div>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: curr.color }}
                  />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={`relative p-8 ${className}`}>
      {/* Main Converter Container */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Currency Converter
          </motion.h2>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Real-time exchange rates with morphing animations
          </motion.p>
        </div>

        {/* Conversion Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* From Currency */}
          <div className="space-y-4">
            <div className="text-gray-400 text-sm font-medium">FROM</div>
            <CurrencySelector
              currency={fromCurrency}
              setCurrency={setFromCurrency}
              label="From"
              position="left"
            />
            
            {/* Amount Input */}
            <div className="relative">
              <motion.input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white text-xl font-mono text-center focus:outline-none focus:border-blue-500/50 transition-all"
                placeholder="0.00"
                whileFocus={{ scale: 1.02 }}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                {fromCurrency.symbol}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <motion.button
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={swapCurrencies}
              style={{ rotate: swapRotation }}
            >
              <ArrowLeftRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* To Currency */}
          <div className="space-y-4">
            <div className="text-gray-400 text-sm font-medium">TO</div>
            <CurrencySelector
              currency={toCurrency}
              setCurrency={setToCurrency}
              label="To"
              position="right"
            />
            
            {/* Result Display */}
            <div className="relative">
              <motion.div
                className="w-full p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white text-xl font-mono text-center"
                style={{ scale: resultScale }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-400">{toCurrency.symbol}</span>
                  <motion.span
                    className="text-white font-bold"
                    animate={{ opacity: isConverting ? 0.5 : 1 }}
                  >
                    {showMorphing ? formatMorphingNumber(result) : result}
                  </motion.span>
                  {isConverting && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <motion.div
          className="mt-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Rate */}
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">Exchange Rate</div>
              <div className="text-white text-lg font-mono">
                1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}
              </div>
            </div>

            {/* Rate Change */}
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">24h Change</div>
              <div className="flex items-center justify-center gap-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-mono">+0.23%</span>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-2">Last Updated</div>
              <div className="flex items-center justify-center gap-2 text-cyan-400">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="text-sm">Live</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Amount Buttons */}
        <motion.div
          className="mt-6 flex justify-center gap-3 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {['100', '500', '1000', '5000'].map((quickAmount) => (
            <motion.button
              key={quickAmount}
              className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAmount(quickAmount)}
            >
              {quickAmount}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Gradients */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.8, 0.5, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Floating Particles */}
        {mounted && Array.from({ length: 20 }).map((_, i) => {
          const leftSeed = `particle-left-${i}`;
          const topSeed = `particle-top-${i}`;
          const durationSeed = `particle-duration-${i}`;
          const delaySeed = `particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${seededRandom(leftSeed) * 100}%`,
                top: `${seededRandom(topSeed) * 100}%`
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + seededRandom(durationSeed) * 2,
                repeat: Infinity,
                delay: seededRandom(delaySeed) * 5,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}