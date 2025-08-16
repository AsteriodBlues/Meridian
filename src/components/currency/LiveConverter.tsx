'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Zap, Eye, Calculator, TrendingUp, TrendingDown, 
  Globe, CreditCard, Wallet, Receipt, Clock, AlertCircle
} from 'lucide-react';

interface ConversionItem {
  id: string;
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
  rate: number;
  timestamp: string;
  category: string;
  description: string;
  isLive: boolean;
}

interface LiveConverterProps {
  baseCurrency?: string;
  targetCurrencies?: string[];
  className?: string;
  onConversion?: (item: ConversionItem) => void;
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

export default function LiveConverter({ 
  baseCurrency = 'USD',
  targetCurrencies = ['EUR', 'GBP', 'JPY', 'CAD'],
  className = '',
  onConversion 
}: LiveConverterProps) {
  const [amount, setAmount] = useState<string>('100');
  const [selectedCurrency, setSelectedCurrency] = useState(targetCurrencies[0]);
  const [conversions, setConversions] = useState<ConversionItem[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock exchange rates (in real app, these would come from API)
  const exchangeRates: Record<string, number> = {
    'EUR': 0.8532,
    'GBP': 0.7342,
    'JPY': 148.75,
    'CAD': 1.3567,
    'AUD': 1.5234,
    'CHF': 0.8845,
    'CNY': 7.2456,
    'INR': 83.12
  };

  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', color: '#3b82f6' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', color: '#8b5cf6' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', color: '#f59e0b' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', color: '#ef4444' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', color: '#06b6d4' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭', color: '#84cc16' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', color: '#ec4899' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', color: '#f97316' }
  ];

  // Live conversion updates
  useEffect(() => {
    if (!isLiveMode || !mounted) return;

    intervalRef.current = setInterval(() => {
      const numericAmount = parseFloat(amount) || 0;
      if (numericAmount <= 0) return;

      // Simulate real-time rate fluctuations using deterministic randomness
      const baseRate = exchangeRates[selectedCurrency] || 1;
      const seed = `${selectedCurrency}-${Date.now()}`;
      const fluctuation = (seededRandom(seed) - 0.5) * 0.001; // ±0.1% fluctuation
      const currentRate = baseRate + fluctuation;
      
      const conversion: ConversionItem = {
        id: `conversion-${Date.now()}-${selectedCurrency}`,
        originalAmount: numericAmount,
        originalCurrency: baseCurrency,
        convertedAmount: numericAmount * currentRate,
        convertedCurrency: selectedCurrency,
        rate: currentRate,
        timestamp: new Date().toISOString(),
        category: 'live',
        description: 'Live conversion',
        isLive: true
      };

      setConversions(prev => [conversion, ...prev.slice(0, 19)]); // Keep last 20 conversions
      onConversion?.(conversion);
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [amount, selectedCurrency, isLiveMode, baseCurrency, mounted]);

  // Manual conversion
  const performConversion = () => {
    if (!mounted) return;
    
    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount <= 0) return;

    const rate = exchangeRates[selectedCurrency] || 1;
    const conversion: ConversionItem = {
      id: `manual-${Date.now()}-${selectedCurrency}`,
      originalAmount: numericAmount,
      originalCurrency: baseCurrency,
      convertedAmount: numericAmount * rate,
      convertedCurrency: selectedCurrency,
      rate,
      timestamp: new Date().toISOString(),
      category: 'manual',
      description: 'Manual conversion',
      isLive: false
    };

    setConversions(prev => [conversion, ...prev]);
    onConversion?.(conversion);
  };

  // Get currency info
  const getCurrencyInfo = (code: string) => {
    return currencies.find(c => c.code === code) || currencies[0];
  };

  // Format number with appropriate decimals
  const formatAmount = (amount: number, currency: string) => {
    const decimals = currency === 'JPY' ? 0 : 2;
    return amount.toFixed(decimals);
  };

  // Get rate change indicator
  const getRateChange = (current: number, previous?: number) => {
    if (!previous) return { change: 0, direction: 'neutral' as const };
    
    const change = ((current - previous) / previous) * 100;
    const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    
    return { change: Math.abs(change), direction };
  };

  // Animated number component
  const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      const startValue = displayValue;
      const targetValue = value;
      const duration = 500;
      let startTime: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (targetValue - startValue) * easeOutCubic;
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [value]);

    return <span>{formatAmount(displayValue, suffix)}</span>;
  };

  const ConversionCard = ({ conversion, index }: { conversion: ConversionItem; index: number }) => {
    const currencyInfo = getCurrencyInfo(conversion.convertedCurrency);
    const isHovered = hoveredItem === conversion.id;
    const previousConversion = conversions[index + 1];
    const rateChange = getRateChange(conversion.rate, previousConversion?.rate);

    return (
      <motion.div
        className={`p-4 rounded-xl border transition-all cursor-pointer ${
          isHovered 
            ? 'border-blue-500/50 bg-blue-500/10' 
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
        onMouseEnter={() => setHoveredItem(conversion.id)}
        onMouseLeave={() => setHoveredItem(null)}
        layout
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-xl">{currencyInfo.flag}</div>
            <div>
              <div className="text-white font-medium">{conversion.convertedCurrency}</div>
              <div className="text-gray-400 text-xs">
                {new Date(conversion.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {conversion.isLive && (
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {rateChange.direction !== 'neutral' && (
              <div className={`flex items-center gap-1 ${
                rateChange.direction === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {rateChange.direction === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs">{rateChange.change.toFixed(3)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">
              ${formatAmount(conversion.originalAmount, baseCurrency)} {baseCurrency}
            </span>
            <span className="text-white font-mono text-lg">
              {currencyInfo.symbol}<AnimatedNumber value={conversion.convertedAmount} suffix={conversion.convertedCurrency} />
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-xs">Rate</span>
            <span className="text-gray-300 font-mono text-xs">
              1 {baseCurrency} = {conversion.rate.toFixed(4)} {conversion.convertedCurrency}
            </span>
          </div>
        </div>

        {/* Hover Effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: currencyInfo.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (!mounted) {
    return <div className={`relative p-6 ${className}`}>Loading...</div>;
  }

  return (
    <div className={`relative p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Live Currency Converter
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Real-time conversions with live rate updates
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversion Input */}
        <div className="space-y-6">
          {/* Amount Input */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-gray-400 text-sm font-medium">Amount ({baseCurrency})</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white text-xl font-mono text-center focus:outline-none focus:border-blue-500/50 transition-all"
                placeholder="100.00"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </div>
            </div>
          </motion.div>

          {/* Currency Selector */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-gray-400 text-sm font-medium">Convert To</label>
            <div className="grid grid-cols-2 gap-2">
              {currencies.slice(0, 6).map((currency) => (
                <motion.button
                  key={currency.code}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedCurrency === currency.code
                      ? 'border-blue-500/50 bg-blue-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-gray-400 hover:text-white hover:border-white/30'
                  }`}
                  onClick={() => setSelectedCurrency(currency.code)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{currency.flag}</span>
                    <span className="font-medium text-sm">{currency.code}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Live Mode Toggle */}
          <motion.div
            className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-white font-medium">Live Mode</div>
                <div className="text-gray-400 text-xs">Auto-updates every 2s</div>
              </div>
            </div>
            <motion.button
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isLiveMode ? 'bg-green-500' : 'bg-gray-600'
              }`}
              onClick={() => setIsLiveMode(!isLiveMode)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                animate={{ x: isLiveMode ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </motion.div>

          {/* Manual Convert Button */}
          {!isLiveMode && (
            <motion.button
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              onClick={performConversion}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Calculator className="w-5 h-5" />
                <span>Convert Now</span>
              </div>
            </motion.button>
          )}

          {/* Current Rate Display */}
          <motion.div
            className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-white/20 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-gray-400 text-sm mb-2">Current Rate</div>
            <div className="text-white text-xl font-mono">
              1 {baseCurrency} = {exchangeRates[selectedCurrency]?.toFixed(4) || '0.0000'} {selectedCurrency}
            </div>
            <div className="text-green-400 text-xs mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Live</span>
            </div>
          </motion.div>
        </div>

        {/* Conversion History */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="text-white font-medium">Conversion History</div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Eye className="w-4 h-4" />
              <span>{conversions.length} conversions</span>
            </div>
          </div>

          {conversions.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-gray-400 mb-4">No conversions yet</div>
              <div className="text-gray-500 text-sm">
                {isLiveMode ? 'Live conversions will appear here automatically' : 'Click "Convert Now" to see results'}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {conversions.map((conversion, index) => (
                  <ConversionCard
                    key={conversion.id}
                    conversion={conversion}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Summary Stats */}
          {conversions.length > 0 && (
            <motion.div
              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center">
                <div className="text-white text-lg font-bold">
                  ${formatAmount(conversions.reduce((sum, c) => sum + c.originalAmount, 0), baseCurrency)}
                </div>
                <div className="text-gray-400 text-sm">Total Converted</div>
              </div>

              <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center">
                <div className="text-white text-lg font-bold">
                  {formatAmount(
                    conversions.reduce((sum, c) => sum + c.convertedAmount, 0) / conversions.length,
                    selectedCurrency
                  )}
                </div>
                <div className="text-gray-400 text-sm">Avg. Converted</div>
              </div>

              <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center">
                <div className="text-white text-lg font-bold">
                  {conversions.filter(c => c.isLive).length}
                </div>
                <div className="text-gray-400 text-sm">Live Updates</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"
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
        
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </div>
  );
}