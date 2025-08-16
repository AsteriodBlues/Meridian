'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Clock, Calendar, TrendingUp, TrendingDown, Play, Pause,
  SkipBack, SkipForward, RotateCcw, Zap, Activity, Target
} from 'lucide-react';

interface HistoricalRate {
  date: string;
  rate: number;
  high: number;
  low: number;
  volume: number;
  change: number;
}

interface TimeRange {
  id: string;
  label: string;
  duration: string;
  color: string;
}

interface TimeMachineProps {
  fromCurrency?: string;
  toCurrency?: string;
  className?: string;
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

export default function TimeMachine({ 
  fromCurrency = 'USD',
  toCurrency = 'EUR',
  className = '' 
}: TimeMachineProps) {
  const [selectedRange, setSelectedRange] = useState<string>('1Y');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Time ranges
  const timeRanges: TimeRange[] = [
    { id: '1M', label: '1 Month', duration: '30 days', color: '#10b981' },
    { id: '3M', label: '3 Months', duration: '90 days', color: '#3b82f6' },
    { id: '6M', label: '6 Months', duration: '180 days', color: '#8b5cf6' },
    { id: '1Y', label: '1 Year', duration: '365 days', color: '#f59e0b' },
    { id: '2Y', label: '2 Years', duration: '730 days', color: '#ef4444' },
    { id: '5Y', label: '5 Years', duration: '1825 days', color: '#06b6d4' }
  ];

  // Generate sample historical data
  const generateHistoricalData = (range: string): HistoricalRate[] => {
    const days = range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 180 : 
                 range === '1Y' ? 365 : range === '2Y' ? 730 : 1825;
    
    const data: HistoricalRate[] = [];
    let baseRate = 0.85;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      // Simulate realistic market movements using deterministic randomness
      const volatility = 0.02;
      const trend = Math.sin(i / 50) * 0.01;
      const seed = `${range}-${i}`;
      const randomWalk = (seededRandom(seed) - 0.5) * volatility;
      
      baseRate += trend + randomWalk;
      baseRate = Math.max(0.7, Math.min(1.2, baseRate)); // Keep within realistic bounds
      
      const highSeed = `${range}-${i}-high`;
      const lowSeed = `${range}-${i}-low`;
      const volumeSeed = `${range}-${i}-volume`;
      
      const high = baseRate + seededRandom(highSeed) * 0.01;
      const low = baseRate - seededRandom(lowSeed) * 0.01;
      const volume = seededRandom(volumeSeed) * 2000000 + 500000;
      const change = i > 0 ? ((baseRate - data[i-1].rate) / data[i-1].rate) * 100 : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        rate: baseRate,
        high,
        low,
        volume,
        change
      });
    }
    
    return data;
  };

  const [historicalData, setHistoricalData] = useState<HistoricalRate[]>(() => 
    generateHistoricalData(selectedRange)
  );

  // Update data when range changes
  useEffect(() => {
    setHistoricalData(generateHistoricalData(selectedRange));
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [selectedRange]);

  // Playback controls
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= historicalData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, historicalData.length]);

  const currentRate = historicalData[currentIndex];
  const selectedTimeRange = timeRanges.find(r => r.id === selectedRange);

  // Chart dimensions and calculations
  const chartWidth = 800;
  const chartHeight = 300;
  const padding = 40;
  const effectiveWidth = chartWidth - padding * 2;
  const effectiveHeight = chartHeight - padding * 2;

  const minRate = Math.min(...historicalData.map(d => d.low));
  const maxRate = Math.max(...historicalData.map(d => d.high));
  const rateRange = maxRate - minRate;

  // Generate SVG path for rate line
  const generateRatePath = () => {
    let path = '';
    historicalData.forEach((point, index) => {
      const x = padding + (index / (historicalData.length - 1)) * effectiveWidth;
      const y = padding + effectiveHeight - ((point.rate - minRate) / rateRange) * effectiveHeight;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };

  // Generate area path
  const generateAreaPath = () => {
    let path = generateRatePath();
    const lastX = padding + effectiveWidth;
    const bottomY = padding + effectiveHeight;
    path += ` L ${lastX} ${bottomY} L ${padding} ${bottomY} Z`;
    return path;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: selectedRange.includes('Y') ? 'numeric' : undefined
    });
  };

  const formatRate = (rate: number) => rate.toFixed(4);

  if (!mounted) {
    return <div className={`relative p-6 ${className}`}>Loading...</div>;
  }

  return (
    <div className={`relative p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Historical Rates Time Machine
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Travel through time to explore {fromCurrency}/{toCurrency} exchange rate history
        </motion.p>
      </div>

      {/* Time Range Selector */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-white font-medium mb-3">Time Period</div>
        <div className="flex gap-2 flex-wrap">
          {timeRanges.map((range) => (
            <motion.button
              key={range.id}
              className={`px-4 py-2 rounded-xl border-2 transition-all ${
                selectedRange === range.id
                  ? 'border-blue-500/50 bg-blue-500/20 text-white'
                  : 'border-white/20 bg-white/5 text-gray-400 hover:text-white hover:border-white/30'
              }`}
              onClick={() => setSelectedRange(range.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: range.color }}
                />
                <span className="font-medium">{range.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="xl:col-span-2">
          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-white font-medium text-lg">
                  {fromCurrency}/{toCurrency} Exchange Rate
                </h4>
                <p className="text-gray-400 text-sm">{selectedTimeRange?.duration}</p>
              </div>
              
              {currentRate && (
                <div className="text-right">
                  <div className="text-2xl font-mono text-white">
                    {formatRate(currentRate.rate)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    currentRate.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {currentRate.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(currentRate.change).toFixed(2)}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* SVG Chart */}
            <div className="relative">
              <svg width={chartWidth} height={chartHeight} className="w-full h-auto">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={selectedTimeRange?.color || '#3b82f6'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={selectedTimeRange?.color || '#3b82f6'} stopOpacity="0.0" />
                  </linearGradient>
                  
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid Lines */}
                <g opacity="0.1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const y = padding + (i / 4) * effectiveHeight;
                    return (
                      <line
                        key={`grid-h-${i}`}
                        x1={padding}
                        y1={y}
                        x2={padding + effectiveWidth}
                        y2={y}
                        stroke="white"
                        strokeWidth="1"
                      />
                    );
                  })}
                  
                  {Array.from({ length: 6 }).map((_, i) => {
                    const x = padding + (i / 5) * effectiveWidth;
                    return (
                      <line
                        key={`grid-v-${i}`}
                        x1={x}
                        y1={padding}
                        x2={x}
                        y2={padding + effectiveHeight}
                        stroke="white"
                        strokeWidth="1"
                      />
                    );
                  })}
                </g>

                {/* Area Fill */}
                <motion.path
                  d={generateAreaPath()}
                  fill="url(#areaGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />

                {/* Rate Line */}
                <motion.path
                  d={generateRatePath()}
                  stroke={selectedTimeRange?.color || '#3b82f6'}
                  strokeWidth="3"
                  fill="none"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.6, duration: 2, ease: "easeInOut" }}
                />

                {/* Current Position Indicator */}
                {currentRate && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {/* Vertical line */}
                    <line
                      x1={padding + (currentIndex / (historicalData.length - 1)) * effectiveWidth}
                      y1={padding}
                      x2={padding + (currentIndex / (historicalData.length - 1)) * effectiveWidth}
                      y2={padding + effectiveHeight}
                      stroke="rgba(255, 255, 255, 0.5)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    
                    {/* Current point */}
                    <circle
                      cx={padding + (currentIndex / (historicalData.length - 1)) * effectiveWidth}
                      cy={padding + effectiveHeight - ((currentRate.rate - minRate) / rateRange) * effectiveHeight}
                      r="6"
                      fill={selectedTimeRange?.color || '#3b82f6'}
                      stroke="white"
                      strokeWidth="2"
                    >
                      <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </motion.g>
                )}

                {/* Data Points */}
                {historicalData.map((point, index) => {
                  if (index % Math.ceil(historicalData.length / 20) !== 0) return null;
                  
                  const x = padding + (index / (historicalData.length - 1)) * effectiveWidth;
                  const y = padding + effectiveHeight - ((point.rate - minRate) / rateRange) * effectiveHeight;
                  
                  return (
                    <motion.circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={selectedTimeRange?.color || '#3b82f6'}
                      opacity={hoveredPoint === index ? 1 : 0.6}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => setCurrentIndex(index)}
                      whileHover={{ scale: 1.5 }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.01 }}
                    />
                  );
                })}

                {/* Axis Labels */}
                <g className="text-xs fill-gray-400">
                  {/* Y-axis labels */}
                  {Array.from({ length: 5 }).map((_, i) => {
                    const rate = minRate + (rateRange * i / 4);
                    const y = padding + effectiveHeight - (i / 4) * effectiveHeight;
                    return (
                      <text key={i} x={padding - 10} y={y + 4} textAnchor="end">
                        {formatRate(rate)}
                      </text>
                    );
                  })}
                  
                  {/* X-axis labels */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const dataIndex = Math.floor((i / 5) * (historicalData.length - 1));
                    const point = historicalData[dataIndex];
                    if (!point) return null;
                    
                    const x = padding + (i / 5) * effectiveWidth;
                    return (
                      <text key={i} x={x} y={padding + effectiveHeight + 20} textAnchor="middle">
                        {formatDate(point.date)}
                      </text>
                    );
                  })}
                </g>
              </svg>
            </div>
          </motion.div>

          {/* Playback Controls */}
          <motion.div
            className="mt-6 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                  onClick={() => setCurrentIndex(0)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white transition-colors"
                  onClick={() => setIsPlaying(!isPlaying)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </motion.button>
                
                <motion.button
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                  onClick={() => setCurrentIndex(historicalData.length - 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-gray-400 text-sm">Speed:</div>
                {[0.5, 1, 2, 4].map((speed) => (
                  <motion.button
                    key={speed}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      playbackSpeed === speed
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setPlaybackSpeed(speed)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {speed}x
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Progress</span>
                <span className="text-white text-sm">
                  {currentIndex + 1} / {historicalData.length}
                </span>
              </div>
              
              <div 
                className="w-full h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  const newIndex = Math.floor(percentage * historicalData.length);
                  setCurrentIndex(Math.max(0, Math.min(historicalData.length - 1, newIndex)));
                }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{ 
                    width: `${((currentIndex + 1) / historicalData.length) * 100}%` 
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Current Data Panel */}
        <div className="space-y-6">
          {/* Current Rate Card */}
          {currentRate && (
            <motion.div
              className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Current Data</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400 text-sm">Date</div>
                  <div className="text-white font-mono text-lg">
                    {formatDate(currentRate.date)}
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">Exchange Rate</div>
                  <div className="text-white font-mono text-2xl font-bold">
                    {formatRate(currentRate.rate)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">High</div>
                    <div className="text-green-400 font-mono">
                      {formatRate(currentRate.high)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Low</div>
                    <div className="text-red-400 font-mono">
                      {formatRate(currentRate.low)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">24h Change</div>
                  <div className={`flex items-center gap-2 font-mono ${
                    currentRate.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {currentRate.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(currentRate.change).toFixed(2)}%
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">Volume</div>
                  <div className="text-cyan-400 font-mono">
                    ${(currentRate.volume / 1000000).toFixed(1)}M
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Statistics */}
          <motion.div
            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Period Statistics</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Highest Rate</span>
                <span className="text-green-400 font-mono">{formatRate(maxRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Lowest Rate</span>
                <span className="text-red-400 font-mono">{formatRate(minRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Average Rate</span>
                <span className="text-white font-mono">
                  {formatRate(historicalData.reduce((sum, d) => sum + d.rate, 0) / historicalData.length)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volatility</span>
                <span className="text-yellow-400 font-mono">
                  {(Math.sqrt(historicalData.reduce((sum, d) => {
                    const avg = historicalData.reduce((s, r) => s + r.rate, 0) / historicalData.length;
                    return sum + Math.pow(d.rate - avg, 2);
                  }, 0) / historicalData.length) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-white font-medium mb-3">Quick Actions</div>
            <div className="space-y-2">
              <motion.button
                className="w-full p-3 bg-white/10 hover:bg-white/15 rounded-xl text-white text-left transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {/* Export data */}}
              >
                Export Historical Data
              </motion.button>
              <motion.button
                className="w-full p-3 bg-white/10 hover:bg-white/15 rounded-xl text-white text-left transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {/* Set alert */}}
              >
                Set Rate Alert
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}