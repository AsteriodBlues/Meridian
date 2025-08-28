'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import MoneyGarden from '@/components/garden/MoneyGarden';
import { 
  Sprout, TreePine, Flower2, Leaf, Bug, Cloud, 
  Sun, CloudRain, Snowflake, Zap, TrendingUp, TrendingDown,
  Settings, RefreshCw, Eye, EyeOff
} from 'lucide-react';

// Mock data for the garden
const mockPlants = [
  {
    id: 'emergency-fund',
    type: 'emergency' as const,
    name: 'Emergency Fund',
    value: 15000,
    target: 20000,
    x: 150,
    y: 450,
    growth: 75,
    health: 0.9,
    lastWatered: Date.now() - 86400000,
    species: 'oak' as const
  },
  {
    id: 'retirement-401k',
    type: 'retirement' as const,
    name: 'Retirement 401k',
    value: 125000,
    target: 1000000,
    x: 350,
    y: 480,
    growth: 12.5,
    health: 0.85,
    lastWatered: Date.now() - 43200000,
    species: 'sunflower' as const
  },
  {
    id: 'house-down-payment',
    type: 'savings' as const,
    name: 'House Fund',
    value: 45000,
    target: 60000,
    x: 550,
    y: 440,
    growth: 75,
    health: 0.95,
    lastWatered: Date.now() - 21600000,
    species: 'rose' as const
  },
  {
    id: 'vacation-fund',
    type: 'savings' as const,
    name: 'Vacation',
    value: 3200,
    target: 5000,
    x: 200,
    y: 350,
    growth: 64,
    health: 0.8,
    lastWatered: Date.now() - 172800000,
    species: 'lily' as const
  },
  {
    id: 'investment-portfolio',
    type: 'investment' as const,
    name: 'Stock Portfolio',
    value: 28000,
    target: 50000,
    x: 650,
    y: 380,
    growth: 56,
    health: 0.7,
    lastWatered: Date.now() - 259200000,
    species: 'bamboo' as const
  },
  {
    id: 'crypto-portfolio',
    type: 'investment' as const,
    name: 'Crypto',
    value: 8500,
    target: 15000,
    x: 450,
    y: 320,
    growth: 57,
    health: 0.6,
    lastWatered: Date.now() - 345600000,
    species: 'cactus' as const
  }
];

const mockTransfers = [
  { from: 'checking', to: 'emergency-fund', amount: 500 },
  { from: 'paycheck', to: 'retirement-401k', amount: 1200 },
  { from: 'bonus', to: 'house-down-payment', amount: 2000 },
  { from: 'side-hustle', to: 'vacation-fund', amount: 300 }
];

const mockSubscriptions = [
  { name: 'Netflix Premium', cost: 22.99 },
  { name: 'Unused Gym', cost: 49.99 },
  { name: 'Software Trial', cost: 29.99 },
  { name: 'Magazine Sub', cost: 12.99 },
  { name: 'Streaming #3', cost: 15.99 }
];

export default function GardenPage() {
  const [gardenSettings, setGardenSettings] = useState({
    showWeeds: true,
    showBees: true,
    autoWater: false,
    seasonOverride: null as string | null,
    animationSpeed: 1
  });

  const [marketCondition, setMarketCondition] = useState<'bull' | 'bear' | 'sideways'>('bull');
  const [monthlyIncome] = useState(7500);
  const [monthlyExpenses] = useState(5200);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulate market changes
  useEffect(() => {
    const interval = setInterval(() => {
      const conditions: ('bull' | 'bear' | 'sideways')[] = ['bull', 'bear', 'sideways'];
      setMarketCondition(conditions[Math.floor(Math.random() * conditions.length)]);
    }, 30000); // Change every 30 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const getMarketIcon = () => {
    switch (marketCondition) {
      case 'bull': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'bear': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Zap className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getMarketColor = () => {
    switch (marketCondition) {
      case 'bull': return 'from-green-500/20 to-emerald-500/20';
      case 'bear': return 'from-red-500/20 to-rose-500/20';
      default: return 'from-yellow-500/20 to-amber-500/20';
    }
  };

  return (
    <PageLayout>
      <TimeBasedBackground>
        <MagneticCursor />
        
        <div className="min-h-screen">
          {/* Header */}
          <motion.div
            className="max-w-7xl mx-auto px-6 py-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <motion.h1
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                The Money
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
                  Garden 🌱
                </span>
              </motion.h1>
              <motion.p
                className="text-gray-400 text-lg max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Watch your financial goals grow like plants in a living ecosystem. Each investment blooms with contributions, 
                while market seasons and income rain nurture your garden to prosperity.
              </motion.p>

              {/* Garden Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Plants</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{mockPlants.length}</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-gray-300">Active Bees</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{mockTransfers.length}</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-red-400" />
                    <span className="text-sm text-gray-300">Weeds</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{mockSubscriptions.length}</div>
                </div>
                
                <div className={`bg-gradient-to-r ${getMarketColor()} backdrop-blur-xl border border-white/20 rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getMarketIcon()}
                    <span className="text-sm text-gray-300">Market</span>
                  </div>
                  <div className="text-2xl font-bold text-white capitalize">{marketCondition}</div>
                </div>
              </motion.div>
            </div>

            {/* Garden Controls */}
            <motion.div
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex gap-2">
                <motion.button
                  className={`relative px-4 py-2 rounded-xl border transition-all overflow-hidden ${
                    gardenSettings.showBees 
                      ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' 
                      : 'bg-white/10 border-white/20 text-gray-400'
                  }`}
                  onClick={() => setGardenSettings(prev => ({ ...prev, showBees: !prev.showBees }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-500/15 via-amber-500/10 to-yellow-500/15 animate-pulse -z-10 blur-sm" />
                  <Bug className="w-4 h-4 inline mr-2" />
                  Bees
                </motion.button>

                <motion.button
                  className={`relative px-4 py-2 rounded-xl border transition-all overflow-hidden ${
                    gardenSettings.showWeeds 
                      ? 'bg-red-500/20 border-red-500/40 text-red-300' 
                      : 'bg-white/10 border-white/20 text-gray-400'
                  }`}
                  onClick={() => setGardenSettings(prev => ({ ...prev, showWeeds: !prev.showWeeds }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/15 via-rose-500/10 to-red-500/15 animate-pulse -z-10 blur-sm" />
                  <Leaf className="w-4 h-4 inline mr-2" />
                  Weeds
                </motion.button>

                <motion.button
                  className="relative px-4 py-2 rounded-xl border border-white/20 bg-white/10 text-gray-300 hover:text-white transition-all overflow-hidden"
                  onClick={() => setGardenSettings(prev => ({ ...prev, autoWater: !prev.autoWater }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-blue-500/15 animate-pulse -z-10 blur-sm" />
                  <CloudRain className="w-4 h-4 inline mr-2" />
                  Auto-Water
                </motion.button>
              </div>

              <div className="flex gap-2">
                <motion.button
                  className="relative p-2 rounded-xl border border-white/20 bg-white/10 text-gray-300 hover:text-white transition-all overflow-hidden"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-purple-500/15 animate-pulse -z-10 blur-sm" />
                  {isFullscreen ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>

                <motion.button
                  className="relative p-2 rounded-xl border border-white/20 bg-white/10 text-gray-300 hover:text-white transition-all overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-green-500/15 animate-pulse -z-10 blur-sm" />
                  <RefreshCw className="w-5 h-5" />
                </motion.button>

                <motion.button
                  className="relative p-2 rounded-xl border border-white/20 bg-white/10 text-gray-300 hover:text-white transition-all overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-500/15 via-slate-500/10 to-gray-500/15 animate-pulse -z-10 blur-sm" />
                  <Settings className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Garden */}
          <motion.div
            className={`mx-auto px-6 pb-12 transition-all duration-500 ${
              isFullscreen ? 'max-w-none px-0' : 'max-w-6xl'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl ${
              isFullscreen ? 'h-screen rounded-none' : 'h-[70vh]'
            }`}>
              <MoneyGarden
                plants={mockPlants}
                recentTransfers={gardenSettings.showBees ? mockTransfers : []}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                unnecessarySubscriptions={gardenSettings.showWeeds ? mockSubscriptions : []}
                marketCondition={marketCondition}
              />
            </div>
          </motion.div>

          {/* Plant Details Panel */}
          {!isFullscreen && (
            <motion.div
              className="max-w-6xl mx-auto px-6 pb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPlants.map((plant, index) => (
                  <motion.div
                    key={plant.id}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${
                        plant.type === 'savings' ? 'bg-blue-500/20 text-blue-400' :
                        plant.type === 'investment' ? 'bg-purple-500/20 text-purple-400' :
                        plant.type === 'emergency' ? 'bg-green-500/20 text-green-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {plant.species === 'rose' ? <Flower2 className="w-5 h-5" /> :
                         plant.species === 'oak' ? <TreePine className="w-5 h-5" /> :
                         <Sprout className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{plant.name}</h3>
                        <p className="text-sm text-gray-400 capitalize">{plant.species} • {plant.type}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">${plant.value.toLocaleString()} / ${plant.target.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              plant.type === 'savings' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                              plant.type === 'investment' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                              plant.type === 'emergency' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                              'bg-gradient-to-r from-orange-400 to-yellow-400'
                            }`}
                            style={{ width: `${(plant.value / plant.target) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-400">Health</span>
                          <div className="text-white font-medium">{Math.round(plant.health * 100)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Growth</span>
                          <div className="text-white font-medium">{plant.growth}%</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}