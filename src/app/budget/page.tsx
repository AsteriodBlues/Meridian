'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import ParticleBackground from '@/components/budget/ParticleBackground';
import ScrollReveal, { FadeUpReveal, ScaleReveal, BlurReveal, MagneticReveal } from '@/components/budget/ScrollReveal';

// Budget Components
import BudgetCategories from '@/components/budget/BudgetCategories';
import SavingsPlant from '@/components/budget/SavingsPlant';
import EnvelopeSystem from '@/components/budget/EnvelopeSystem';

// Chart Components
import AnimatedLineChart from '@/components/budget/charts/AnimatedLineChart';
import AnimatedBarChart from '@/components/budget/charts/AnimatedBarChart';
import LiquidDonutChart from '@/components/budget/charts/LiquidDonutChart';
import SankeyFlowChart from '@/components/budget/charts/SankeyFlowChart';
import SpendingTreeMap from '@/components/budget/charts/SpendingTreeMap';
import SpendingHeatmap from '@/components/budget/charts/SpendingHeatmap';

import { 
  DollarSign, TrendingUp, PieChart, BarChart3, Calendar, 
  Home, Car, ShoppingCart, Utensils, Heart, GraduationCap,
  Plane, Coffee, Gamepad2, Zap, Target, Activity
} from 'lucide-react';

// Mock data
const mockBudgetCategories = [
  {
    id: '1',
    name: 'Housing',
    allocated: 2000,
    spent: 1850,
    icon: Home,
    color: '#3b82f6',
    priority: 'high' as const
  },
  {
    id: '2',
    name: 'Transportation',
    allocated: 800,
    spent: 650,
    icon: Car,
    color: '#10b981',
    priority: 'medium' as const
  },
  {
    id: '3',
    name: 'Food',
    allocated: 600,
    spent: 720,
    icon: Utensils,
    color: '#f59e0b',
    priority: 'high' as const
  },
  {
    id: '4',
    name: 'Entertainment',
    allocated: 300,
    spent: 180,
    icon: Gamepad2,
    color: '#8b5cf6',
    priority: 'low' as const
  },
  {
    id: '5',
    name: 'Healthcare',
    allocated: 400,
    spent: 200,
    icon: Heart,
    color: '#ef4444',
    priority: 'medium' as const
  },
  {
    id: '6',
    name: 'Education',
    allocated: 500,
    spent: 350,
    icon: GraduationCap,
    color: '#06b6d4',
    priority: 'medium' as const
  }
];

const mockEnvelopes = [
  {
    id: '1',
    name: 'Groceries',
    allocated: 400,
    remaining: 180,
    color: '#10b981',
    icon: ShoppingCart,
    transactions: [
      { id: '1', amount: 85, description: 'Whole Foods', date: '2024-01-15', type: 'expense' as const },
      { id: '2', amount: 45, description: 'Local Market', date: '2024-01-14', type: 'expense' as const },
      { id: '3', amount: 90, description: 'Costco', date: '2024-01-12', type: 'expense' as const }
    ]
  },
  {
    id: '2',
    name: 'Gas',
    allocated: 200,
    remaining: 75,
    color: '#f59e0b',
    icon: Car,
    transactions: [
      { id: '4', amount: 55, description: 'Shell Station', date: '2024-01-16', type: 'expense' as const },
      { id: '5', amount: 70, description: 'BP Gas', date: '2024-01-10', type: 'expense' as const }
    ]
  },
  {
    id: '3',
    name: 'Coffee',
    allocated: 100,
    remaining: 40,
    color: '#8b5cf6',
    icon: Coffee,
    transactions: [
      { id: '6', amount: 15, description: 'Starbucks', date: '2024-01-16', type: 'expense' as const },
      { id: '7', amount: 12, description: 'Local Cafe', date: '2024-01-15', type: 'expense' as const }
    ]
  }
];

const mockLineChartData = [
  {
    id: 'income',
    name: 'Income',
    color: '#10b981',
    strokeWidth: 3,
    showDots: true,
    showArea: true,
    data: [
      { x: 1, y: 5000, date: 'Jan', value: 5000 },
      { x: 2, y: 5200, date: 'Feb', value: 5200 },
      { x: 3, y: 4800, date: 'Mar', value: 4800 },
      { x: 4, y: 5500, date: 'Apr', value: 5500 },
      { x: 5, y: 5300, date: 'May', value: 5300 },
      { x: 6, y: 5800, date: 'Jun', value: 5800 }
    ]
  },
  {
    id: 'expenses',
    name: 'Expenses',
    color: '#ef4444',
    strokeWidth: 3,
    showDots: true,
    showArea: true,
    data: [
      { x: 1, y: 3200, date: 'Jan', value: 3200 },
      { x: 2, y: 3400, date: 'Feb', value: 3400 },
      { x: 3, y: 3800, date: 'Mar', value: 3800 },
      { x: 4, y: 3600, date: 'Apr', value: 3600 },
      { x: 5, y: 3900, date: 'May', value: 3900 },
      { x: 6, y: 3500, date: 'Jun', value: 3500 }
    ]
  }
];

const mockBarChartData = [
  {
    id: '1',
    label: 'Housing',
    value: 1850,
    target: 2000,
    color: '#3b82f6',
    icon: Home,
    category: 'Fixed'
  },
  {
    id: '2',
    label: 'Food',
    value: 720,
    target: 600,
    color: '#f59e0b',
    icon: Utensils,
    category: 'Variable'
  },
  {
    id: '3',
    label: 'Transport',
    value: 650,
    target: 800,
    color: '#10b981',
    icon: Car,
    category: 'Variable'
  },
  {
    id: '4',
    label: 'Entertainment',
    value: 180,
    target: 300,
    color: '#8b5cf6',
    icon: Gamepad2,
    category: 'Discretionary'
  }
];

const mockDonutData = [
  {
    id: '1',
    label: 'Housing',
    value: 1850,
    color: '#3b82f6',
    icon: Home,
    targetPercentage: 35
  },
  {
    id: '2',
    label: 'Food',
    value: 720,
    color: '#10b981',
    icon: Utensils,
    targetPercentage: 15
  },
  {
    id: '3',
    label: 'Transportation',
    value: 650,
    color: '#f59e0b',
    icon: Car,
    targetPercentage: 15
  },
  {
    id: '4',
    label: 'Entertainment',
    value: 180,
    color: '#8b5cf6',
    icon: Gamepad2,
    targetPercentage: 10
  },
  {
    id: '5',
    label: 'Savings',
    value: 800,
    color: '#06b6d4',
    icon: Target,
    targetPercentage: 20
  }
];

const mockSankeyData = {
  nodes: [
    { id: 'salary', label: 'Salary', category: 'income' as const, color: '#10b981', icon: DollarSign, x: 50, y: 100, width: 120, height: 60 },
    { id: 'freelance', label: 'Freelance', category: 'income' as const, color: '#059669', icon: Zap, x: 50, y: 180, width: 120, height: 60 },
    { id: 'housing', label: 'Housing', category: 'expense' as const, color: '#3b82f6', icon: Home, x: 650, y: 80, width: 120, height: 60 },
    { id: 'food', label: 'Food', category: 'expense' as const, color: '#f59e0b', icon: Utensils, x: 650, y: 160, width: 120, height: 60 },
    { id: 'savings', label: 'Savings', category: 'savings' as const, color: '#06b6d4', icon: Target, x: 650, y: 240, width: 120, height: 60 },
    { id: 'investment', label: 'Investment', category: 'investment' as const, color: '#8b5cf6', icon: TrendingUp, x: 650, y: 320, width: 120, height: 60 }
  ],
  links: [
    { source: 'salary', target: 'housing', value: 1850, color: '#3b82f6' },
    { source: 'salary', target: 'food', value: 600, color: '#f59e0b' },
    { source: 'salary', target: 'savings', value: 800, color: '#06b6d4' },
    { source: 'freelance', target: 'food', value: 120, color: '#f59e0b' },
    { source: 'freelance', target: 'investment', value: 300, color: '#8b5cf6' }
  ]
};

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

const mockHeatmapData = Array.from({ length: 365 }, (_, i) => {
  const date = new Date(2024, 0, 1);
  date.setDate(date.getDate() + i);
  
  // Use deterministic randomness based on day index
  const amountSeed = `amount-${i}`;
  const transactionSeed = `trans-${i}`;
  const categorySeed = `cat-${i}`;
  
  return {
    date: date.toISOString().split('T')[0],
    amount: seededRandom(amountSeed) * 500 + 50,
    transactions: Math.floor(seededRandom(transactionSeed) * 10) + 1,
    category: ['Food', 'Shopping', 'Entertainment', 'Transport'][Math.floor(seededRandom(categorySeed) * 4)],
    dayOfWeek: date.getDay(),
    week: Math.floor(i / 7)
  };
});

export default function BudgetPage() {
  const [activeView, setActiveView] = useState<'overview' | 'categories' | 'envelopes' | 'charts' | 'analytics'>('overview');
  const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'donut' | 'sankey' | 'heatmap' | 'treemap'>('line');

  return (
    <PageLayout>
      <TimeBasedBackground>
        <ParticleBackground 
          particleCount={60}
          interactive={true}
          colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']}
        />
        <MagneticCursor />
        
        <div className="min-h-screen">
        {/* Header */}
        <FadeUpReveal>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center mb-12">
              <ScaleReveal delay={0.2}>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Budget &
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                    Analytics Stage
                  </span>
                </h1>
              </ScaleReveal>
              <BlurReveal delay={0.4}>
                <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                  Experience your finances through beautiful visualizations, liquid animations, and intelligent insights
                </p>
              </BlurReveal>
            </div>

            {/* View Toggle */}
            <MagneticReveal delay={0.6}>
              <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {[
              { key: 'overview', label: 'Overview', icon: DollarSign },
              { key: 'categories', label: 'Liquid Categories', icon: BarChart3 },
              { key: 'envelopes', label: 'Paper Envelopes', icon: Calendar },
              { key: 'charts', label: 'Chart Suite', icon: PieChart },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((view) => {
              const Icon = view.icon;
              return (
                <motion.button
                  key={view.key}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    activeView === view.key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setActiveView(view.key as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{view.label}</span>
                </motion.button>
              );
            })}
              </div>
            </MagneticReveal>
          </div>
        </FadeUpReveal>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <FadeUpReveal delay={0.2} animation="fadeLeft">
                      <BudgetCategories 
                        categories={mockBudgetCategories}
                        onCategoryUpdate={(id, newAllocated) => console.log('Update:', id, newAllocated)}
                      />
                    </FadeUpReveal>
                  </div>
                  <div>
                    <ScaleReveal delay={0.4}>
                      <SavingsPlant 
                        savingsRate={23.5}
                        targetRate={25}
                        monthlyGrowth={2.3}
                      />
                    </ScaleReveal>
                  </div>
                </div>
                
                <BlurReveal delay={0.6}>
                  <LiquidDonutChart 
                    data={mockDonutData}
                    size={400}
                    liquidEffect={true}
                    animated={true}
                  />
                </BlurReveal>
              </motion.div>
            )}

            {activeView === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <BudgetCategories 
                  categories={mockBudgetCategories}
                  onCategoryUpdate={(id, newAllocated) => console.log('Update:', id, newAllocated)}
                />
              </motion.div>
            )}

            {activeView === 'envelopes' && (
              <motion.div
                key="envelopes"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <EnvelopeSystem 
                  envelopes={mockEnvelopes}
                  onEnvelopeClick={(envelope) => console.log('Clicked:', envelope)}
                />
              </motion.div>
            )}

            {activeView === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Chart Selector */}
                <div className="flex justify-center gap-2 mb-8 flex-wrap">
                  {[
                    { key: 'line', label: '📈 Line Chart', desc: 'Animated growth lines' },
                    { key: 'bar', label: '📊 Bar Chart', desc: 'Growing bars with counters' },
                    { key: 'donut', label: '🍩 Donut Chart', desc: 'Liquid morphing effects' },
                    { key: 'sankey', label: '🌊 Sankey Flow', desc: 'Money flow visualization' },
                    { key: 'heatmap', label: '🔥 Heat Map', desc: 'Spending intensity map' },
                    { key: 'treemap', label: '🌳 TreeMap', desc: 'Hierarchical categories' },
                  ].map((chart) => (
                    <motion.button
                      key={chart.key}
                      className={`px-4 py-2 rounded-xl transition-all text-center ${
                        selectedChart === chart.key
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedChart(chart.key as any)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="font-medium text-sm">{chart.label}</div>
                      <div className="text-xs opacity-75">{chart.desc}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Selected Chart */}
                <AnimatePresence mode="wait">
                  {selectedChart === 'line' && (
                    <motion.div
                      key="line"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <AnimatedLineChart 
                        charts={mockLineChartData}
                        width={800}
                        height={400}
                        showGrid={true}
                        showTooltip={true}
                        showLegend={true}
                        animated={true}
                        realTimeData={false}
                        enableZoom={true}
                        enablePan={true}
                      />
                    </motion.div>
                  )}

                  {selectedChart === 'bar' && (
                    <motion.div
                      key="bar"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <AnimatedBarChart 
                        data={mockBarChartData}
                        showTargets={true}
                        showAnimation={true}
                        orientation="vertical"
                        showComparison={false}
                        animateValues={true}
                        staggerDelay={0.1}
                      />
                    </motion.div>
                  )}

                  {selectedChart === 'donut' && (
                    <motion.div
                      key="donut"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <LiquidDonutChart 
                        data={mockDonutData}
                        size={400}
                        liquidEffect={true}
                        animated={true}
                      />
                    </motion.div>
                  )}

                  {selectedChart === 'sankey' && (
                    <motion.div
                      key="sankey"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <SankeyFlowChart 
                        nodes={[
                          { id: 'salary', name: 'Salary', value: 5500, level: 0, color: '#10b981', icon: DollarSign, category: 'source' },
                          { id: 'freelance', name: 'Freelance', value: 800, level: 0, color: '#059669', icon: Zap, category: 'source' },
                          { id: 'housing', name: 'Housing', value: 1850, level: 1, color: '#3b82f6', icon: Home, category: 'destination' },
                          { id: 'food', name: 'Food', value: 720, level: 1, color: '#f59e0b', icon: Utensils, category: 'destination' },
                          { id: 'transport', name: 'Transport', value: 650, level: 1, color: '#10b981', icon: Car, category: 'destination' },
                          { id: 'savings', name: 'Savings', value: 800, level: 1, color: '#06b6d4', icon: Target, category: 'destination' },
                          { id: 'investment', name: 'Investment', value: 500, level: 1, color: '#8b5cf6', icon: TrendingUp, category: 'destination' },
                        ]}
                        links={[
                          { source: 'salary', target: 'housing', value: 1850 },
                          { source: 'salary', target: 'food', value: 600 },
                          { source: 'salary', target: 'transport', value: 650 },
                          { source: 'salary', target: 'savings', value: 800 },
                          { source: 'freelance', target: 'food', value: 120 },
                          { source: 'freelance', target: 'investment', value: 500 },
                        ]}
                        width={800}
                        height={500}
                        animated={true}
                        showLabels={true}
                      />
                    </motion.div>
                  )}

                  {selectedChart === 'heatmap' && (
                    <motion.div
                      key="heatmap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <SpendingHeatmap 
                        data={mockHeatmapData}
                        year={2024}
                        showTooltip={true}
                        animated={true}
                      />
                    </motion.div>
                  )}

                  {selectedChart === 'treemap' && (
                    <motion.div
                      key="treemap"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <SpendingTreeMap 
                        data={[
                          { id: '1', name: 'Housing', value: 1850, color: '#3b82f6', change: 5.2, category: 'Fixed' },
                          { id: '2', name: 'Food', value: 720, color: '#f59e0b', change: -2.1, category: 'Variable' },
                          { id: '3', name: 'Transport', value: 650, color: '#10b981', change: 8.7, category: 'Variable' },
                          { id: '4', name: 'Entertainment', value: 180, color: '#8b5cf6', change: 15.3, category: 'Discretionary' },
                          { id: '5', name: 'Healthcare', value: 200, color: '#ef4444', change: -5.8, category: 'Variable' },
                          { id: '6', name: 'Savings', value: 800, color: '#06b6d4', change: 12.4, category: 'Fixed' },
                        ]}
                        width={800}
                        height={500}
                        animated={true}
                        showLabels={true}
                        showTooltips={true}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeView === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <SankeyFlowChart 
                    nodes={[
                      { id: 'salary', name: 'Salary', value: 5500, level: 0, color: '#10b981', icon: DollarSign, category: 'source' },
                      { id: 'housing', name: 'Housing', value: 1850, level: 1, color: '#3b82f6', icon: Home, category: 'destination' },
                      { id: 'food', name: 'Food', value: 720, level: 1, color: '#f59e0b', icon: Utensils, category: 'destination' },
                      { id: 'savings', name: 'Savings', value: 800, level: 1, color: '#06b6d4', icon: Target, category: 'destination' },
                    ]}
                    links={[
                      { source: 'salary', target: 'housing', value: 1850 },
                      { source: 'salary', target: 'food', value: 720 },
                      { source: 'salary', target: 'savings', value: 800 },
                    ]}
                    width={600}
                    height={400}
                    animated={true}
                    showLabels={true}
                  />
                  <div className="space-y-4">
                    <SavingsPlant 
                      savingsRate={23.5}
                      targetRate={25}
                      monthlyGrowth={2.3}
                    />
                  </div>
                </div>
                
                <SpendingHeatmap 
                  data={mockHeatmapData}
                  year={2024}
                  showTooltip={true}
                  animated={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}