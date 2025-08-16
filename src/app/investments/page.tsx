'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import StickyNav from '@/components/dashboard/StickyNav';
import MagneticCursor from '@/components/ui/MagneticCursor';
import ConstellationMap from '@/components/investments/ConstellationMap';
import SectorPieChart from '@/components/investments/SectorPieChart';
import CorrelationMatrix from '@/components/investments/CorrelationMatrix';
import { PerformanceSparkline, AnimatedValue } from '@/components/investments/Sparkline';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, BarChart3, 
  Zap, Star, Activity, Layers, PieChart, Grid3X3, Eye
} from 'lucide-react';

// Mock data for demonstration
const mockHoldings = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    value: 125000,
    change: 2350,
    changePercent: 1.92,
    shares: 250,
    price: 500,
    sector: 'Technology',
    marketCap: 3000000000000
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    value: 98000,
    change: -1200,
    changePercent: -1.21,
    shares: 180,
    price: 544,
    sector: 'Technology',
    marketCap: 2800000000000
  },
  {
    id: '3',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    value: 87500,
    change: 1800,
    changePercent: 2.1,
    shares: 120,
    price: 729,
    sector: 'Technology',
    marketCap: 1800000000000
  },
  {
    id: '4',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    value: 72000,
    change: -2100,
    changePercent: -2.84,
    shares: 90,
    price: 800,
    sector: 'Consumer',
    marketCap: 800000000000
  },
  {
    id: '5',
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    value: 65000,
    change: 950,
    changePercent: 1.48,
    shares: 200,
    price: 325,
    sector: 'Finance',
    marketCap: 450000000000
  },
  {
    id: '6',
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    value: 58000,
    change: 420,
    changePercent: 0.73,
    shares: 150,
    price: 387,
    sector: 'Healthcare',
    marketCap: 420000000000
  },
  {
    id: '7',
    symbol: 'XOM',
    name: 'Exxon Mobil',
    value: 45000,
    change: 1200,
    changePercent: 2.74,
    shares: 300,
    price: 150,
    sector: 'Energy',
    marketCap: 380000000000
  },
  {
    id: '8',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    value: 92000,
    change: 3200,
    changePercent: 3.6,
    shares: 80,
    price: 1150,
    sector: 'Technology',
    marketCap: 2900000000000
  }
];

const mockSectorData = [
  { sector: 'Technology', value: 402500, percentage: 55.2, color: '#3B82F6', icon: Zap, holdings: 4 },
  { sector: 'Finance', value: 65000, percentage: 8.9, color: '#F59E0B', icon: DollarSign, holdings: 1 },
  { sector: 'Healthcare', value: 58000, percentage: 8.0, color: '#10B981', icon: Activity, holdings: 1 },
  { sector: 'Consumer', value: 72000, percentage: 9.9, color: '#8B5CF6', icon: Target, holdings: 1 },
  { sector: 'Energy', value: 45000, percentage: 6.2, color: '#EF4444', icon: Zap, holdings: 1 },
  { sector: 'Industrial', value: 87500, percentage: 12.0, color: '#06B6D4', icon: BarChart3, holdings: 0 }
];

const mockCorrelations = [
  { symbol1: 'AAPL', symbol2: 'MSFT', correlation: 0.75, strength: 'strong' as const, direction: 'positive' as const },
  { symbol1: 'AAPL', symbol2: 'GOOGL', correlation: 0.68, strength: 'moderate' as const, direction: 'positive' as const },
  { symbol1: 'AAPL', symbol2: 'TSLA', correlation: 0.45, strength: 'moderate' as const, direction: 'positive' as const },
  { symbol1: 'AAPL', symbol2: 'JPM', correlation: 0.23, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'AAPL', symbol2: 'JNJ', correlation: 0.15, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'AAPL', symbol2: 'XOM', correlation: -0.12, strength: 'weak' as const, direction: 'negative' as const },
  { symbol1: 'AAPL', symbol2: 'NVDA', correlation: 0.82, strength: 'strong' as const, direction: 'positive' as const },
  { symbol1: 'MSFT', symbol2: 'GOOGL', correlation: 0.71, strength: 'strong' as const, direction: 'positive' as const },
  { symbol1: 'MSFT', symbol2: 'TSLA', correlation: 0.38, strength: 'moderate' as const, direction: 'positive' as const },
  { symbol1: 'MSFT', symbol2: 'JPM', correlation: 0.28, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'MSFT', symbol2: 'JNJ', correlation: 0.19, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'MSFT', symbol2: 'XOM', correlation: -0.08, strength: 'weak' as const, direction: 'negative' as const },
  { symbol1: 'MSFT', symbol2: 'NVDA', correlation: 0.79, strength: 'strong' as const, direction: 'positive' as const },
  { symbol1: 'GOOGL', symbol2: 'TSLA', correlation: 0.52, strength: 'moderate' as const, direction: 'positive' as const },
  { symbol1: 'GOOGL', symbol2: 'JPM', correlation: 0.31, strength: 'moderate' as const, direction: 'positive' as const },
  { symbol1: 'GOOGL', symbol2: 'JNJ', correlation: 0.22, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'GOOGL', symbol2: 'XOM', correlation: -0.15, strength: 'weak' as const, direction: 'negative' as const },
  { symbol1: 'GOOGL', symbol2: 'NVDA', correlation: 0.73, strength: 'strong' as const, direction: 'positive' as const },
  { symbol1: 'TSLA', symbol2: 'JPM', correlation: 0.18, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'TSLA', symbol2: 'JNJ', correlation: 0.09, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'TSLA', symbol2: 'XOM', correlation: -0.25, strength: 'weak' as const, direction: 'negative' as const },
  { symbol1: 'TSLA', symbol2: 'NVDA', correlation: 0.61, strength: 'moderate' as const, direction: 'positive' as const },
  { symbol1: 'JPM', symbol2: 'JNJ', correlation: 0.35, strength: 'moderate' as const, direction: 'positive' as const },
  { symbol1: 'JPM', symbol2: 'XOM', correlation: 0.42, strength: 'moderate' as const, direction: 'positive' as const },
  { symbol1: 'JPM', symbol2: 'NVDA', correlation: 0.26, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'JNJ', symbol2: 'XOM', correlation: 0.28, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'JNJ', symbol2: 'NVDA', correlation: 0.17, strength: 'weak' as const, direction: 'positive' as const },
  { symbol1: 'XOM', symbol2: 'NVDA', correlation: -0.22, strength: 'weak' as const, direction: 'negative' as const }
];

export default function InvestmentsPage() {
  const [activeView, setActiveView] = useState<'portfolio' | 'sectors' | 'correlations'>('portfolio');
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalGain, setTotalGain] = useState(0);

  useEffect(() => {
    const totalValue = mockHoldings.reduce((sum, holding) => sum + holding.value, 0);
    const totalChange = mockHoldings.reduce((sum, holding) => sum + holding.change, 0);
    
    setPortfolioValue(totalValue);
    setTotalGain(totalChange);
  }, []);

  // Generate deterministic sparkline data
  const generateSparklineData = (seed = 0) => {
    return Array.from({ length: 20 }, (_, i) => 
      100 + Math.sin(i * 0.5) * 10 + ((seed + i) % 10) - 2.5
    );
  };

  return (
    <TimeBasedBackground>
      <MagneticCursor />
      <StickyNav />
      
      <div className="min-h-screen pt-20">
        {/* Header */}
        <motion.div
          className="max-w-7xl mx-auto px-6 py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Investment
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Theater
              </span>
            </motion.h1>
            <motion.p
              className="text-gray-400 text-lg max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Experience your portfolio through immersive visualizations, real-time analytics, and intelligent insights
            </motion.p>
          </div>

          {/* Portfolio Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </motion.div>
              <AnimatedValue 
                value={portfolioValue} 
                prefix="$" 
                className="text-2xl font-bold text-white mb-2"
              />
              <div className="text-gray-400 text-sm">Portfolio Value</div>
              <PerformanceSparkline 
                data={generateSparklineData(1)} 
                percentage={2.34} 
                className="mt-2 justify-center" 
              />
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              <AnimatedValue 
                value={totalGain} 
                prefix={totalGain >= 0 ? '+$' : '-$'} 
                className={`text-2xl font-bold mb-2 ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}
              />
              <div className="text-gray-400 text-sm">Today's Gain/Loss</div>
              <PerformanceSparkline 
                data={generateSparklineData(2)} 
                percentage={1.23} 
                className="mt-2 justify-center" 
              />
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Layers className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl font-bold text-white mb-2">{mockHoldings.length}</div>
              <div className="text-gray-400 text-sm">Holdings</div>
              <PerformanceSparkline 
                data={generateSparklineData(3)} 
                percentage={0.78} 
                className="mt-2 justify-center" 
              />
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Target className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl font-bold text-blue-400 mb-2">8.7%</div>
              <div className="text-gray-400 text-sm">Annualized Return</div>
              <PerformanceSparkline 
                data={generateSparklineData(4)} 
                percentage={8.7} 
                className="mt-2 justify-center" 
              />
            </div>
          </motion.div>

          {/* View Toggle */}
          <motion.div
            className="flex justify-center gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { key: 'portfolio', label: 'Portfolio Universe', icon: Grid3X3 },
              { key: 'sectors', label: 'Sector Analysis', icon: PieChart },
              { key: 'correlations', label: 'Correlation Matrix', icon: Activity },
            ].map((view) => {
              const Icon = view.icon;
              return (
                <motion.button
                  key={view.key}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    activeView === view.key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setActiveView(view.key as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{view.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <AnimatePresence mode="wait">
            {activeView === 'portfolio' && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <ConstellationMap holdings={mockHoldings} />
              </motion.div>
            )}

            {activeView === 'sectors' && (
              <motion.div
                key="sectors"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <SectorPieChart data={mockSectorData} />
              </motion.div>
            )}

            {activeView === 'correlations' && (
              <motion.div
                key="correlations"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <CorrelationMatrix 
                  symbols={mockHoldings.map(h => h.symbol)} 
                  correlations={mockCorrelations}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Performance Summary */}
        <motion.div
          className="fixed bottom-6 right-6 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 z-40"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-white">Live Market</p>
              <p className="text-xs text-gray-400">Real-time updates</p>
            </div>
            
            <div className="w-px h-8 bg-white/20" />
            
            <div className="text-center">
              <motion.div
                className="flex items-center gap-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-semibold">Active</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </TimeBasedBackground>
  );
}