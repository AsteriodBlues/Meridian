'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap, Eye, Palette } from 'lucide-react';

// Import all our enhanced charts
import AnimatedLineChart from '../budget/charts/AnimatedLineChart';
import AnimatedBarChart from '../budget/charts/AnimatedBarChart';
import LiquidDonutChart from '../budget/charts/LiquidDonutChart';
import SectorPieChart from '../investments/SectorPieChart';
import SankeyFlowChart from '../budget/charts/SankeyFlowChart';
import SpendingHeatmap from '../budget/charts/SpendingHeatmap';
import SpendingTreeMap from '../budget/charts/SpendingTreeMap';
import Portfolio3DChart from '../investments/Portfolio3DChart';

// Sample data for testing
const sampleLineData = [
  {
    id: 'revenue',
    name: 'Revenue',
    color: '#3b82f6',
    showArea: true,
    showDots: true,
    data: [
      { x: 0, y: 5000, date: 'Jan', value: 5000 },
      { x: 1, y: 7500, date: 'Feb', value: 7500 },
      { x: 2, y: 6200, date: 'Mar', value: 6200 },
      { x: 3, y: 8800, date: 'Apr', value: 8800 },
      { x: 4, y: 9500, date: 'May', value: 9500 },
      { x: 5, y: 11200, date: 'Jun', value: 11200 },
    ]
  },
  {
    id: 'expenses',
    name: 'Expenses',
    color: '#ef4444',
    showArea: true,
    showDots: true,
    data: [
      { x: 0, y: 3000, date: 'Jan', value: 3000 },
      { x: 1, y: 4200, date: 'Feb', value: 4200 },
      { x: 2, y: 3800, date: 'Mar', value: 3800 },
      { x: 3, y: 5100, date: 'Apr', value: 5100 },
      { x: 4, y: 4700, date: 'May', value: 4700 },
      { x: 5, y: 6300, date: 'Jun', value: 6300 },
    ]
  }
];

const sampleBarData = [
  { id: '1', label: 'Food', value: 2500, target: 3000, color: '#10b981', category: 'Essential' },
  { id: '2', label: 'Transport', value: 800, target: 600, color: '#3b82f6', category: 'Essential' },
  { id: '3', label: 'Entertainment', value: 1200, target: 800, color: '#f59e0b', category: 'Lifestyle' },
  { id: '4', label: 'Shopping', value: 900, target: 1000, color: '#ef4444', category: 'Lifestyle' },
];

const sampleDonutData = [
  { id: '1', label: 'Savings', value: 5000, color: '#10b981', targetPercentage: 40 },
  { id: '2', label: 'Investments', value: 3000, color: '#3b82f6', targetPercentage: 25 },
  { id: '3', label: 'Expenses', value: 2500, color: '#f59e0b', targetPercentage: 20 },
  { id: '4', label: 'Emergency', value: 1500, color: '#ef4444', targetPercentage: 15 },
];

interface ChartShowcaseProps {
  className?: string;
}

export default function ChartShowcase({ className = '' }: ChartShowcaseProps) {
  const [activeDemo, setActiveDemo] = useState<string>('line');
  const [isAnimating, setIsAnimating] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const chartTypes = [
    { id: 'line', name: 'Line Charts', icon: '📈', description: 'Animated line drawing with gradients' },
    { id: 'bar', name: 'Bar Charts', icon: '📊', description: 'Growing bars with value counters' },
    { id: 'donut', name: 'Donut Charts', icon: '🍩', description: 'Liquid morphing effects' },
    { id: 'pie', name: '3D Pie Charts', icon: '🥧', description: 'Interactive 3D visualization' },
    { id: 'sankey', name: 'Sankey Flow', icon: '🌊', description: 'Money flow visualization' },
    { id: 'heatmap', name: 'Heatmap', icon: '🔥', description: 'Spending pattern analysis' },
    { id: 'treemap', name: 'TreeMap', icon: '🌳', description: 'Hierarchical category view' },
    { id: '3d', name: '3D Portfolio', icon: '🎯', description: 'Three.js powered charts' },
  ];

  const renderActiveChart = () => {
    const commonProps = { animated: isAnimating, className: "w-full" };
    
    switch (activeDemo) {
      case 'line':
        return (
          <AnimatedLineChart
            charts={sampleLineData}
            realTimeData={showAdvanced}
            enableZoom={showAdvanced}
            enablePan={showAdvanced}
            {...commonProps}
          />
        );
      
      case 'bar':
        return (
          <AnimatedBarChart
            data={sampleBarData}
            orientation="vertical"
            showComparison={showAdvanced}
            animateValues={isAnimating}
            {...commonProps}
          />
        );
      
      case 'donut':
        return (
          <LiquidDonutChart
            data={sampleDonutData}
            liquidEffect={showAdvanced}
            {...commonProps}
          />
        );
      
      case 'pie':
        return (
          <SectorPieChart
            data={[
              { sector: 'Technology', value: 45000, percentage: 35, color: '#3b82f6', icon: Zap, holdings: 12 },
              { sector: 'Healthcare', value: 32000, percentage: 25, color: '#10b981', icon: Eye, holdings: 8 },
              { sector: 'Finance', value: 25000, percentage: 20, color: '#f59e0b', icon: Palette, holdings: 6 },
              { sector: 'Energy', value: 18000, percentage: 15, color: '#ef4444', icon: Zap, holdings: 4 },
              { sector: 'Consumer', value: 8000, percentage: 5, color: '#8b5cf6', icon: Eye, holdings: 2 },
            ]}
            {...commonProps}
          />
        );
      
      case 'sankey':
        return (
          <SankeyFlowChart
            nodes={[
              { id: 'income', name: 'Income', value: 10000, level: 0, color: '#10b981', category: 'source' },
              { id: 'savings', name: 'Savings', value: 3000, level: 1, color: '#3b82f6', category: 'intermediate' },
              { id: 'expenses', name: 'Expenses', value: 7000, level: 1, color: '#f59e0b', category: 'intermediate' },
              { id: 'investments', name: 'Investments', value: 2000, level: 2, color: '#8b5cf6', category: 'destination' },
              { id: 'emergency', name: 'Emergency', value: 1000, level: 2, color: '#ef4444', category: 'destination' },
              { id: 'food', name: 'Food', value: 2500, level: 2, color: '#06b6d4', category: 'destination' },
              { id: 'housing', name: 'Housing', value: 4500, level: 2, color: '#f97316', category: 'destination' },
            ]}
            links={[
              { source: 'income', target: 'savings', value: 3000 },
              { source: 'income', target: 'expenses', value: 7000 },
              { source: 'savings', target: 'investments', value: 2000 },
              { source: 'savings', target: 'emergency', value: 1000 },
              { source: 'expenses', target: 'food', value: 2500 },
              { source: 'expenses', target: 'housing', value: 4500 },
            ]}
            {...commonProps}
          />
        );
      
      case 'heatmap':
        return (
          <SpendingHeatmap
            data={Array.from({ length: 365 }, (_, i) => ({
              date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
              amount: Math.random() * 500 + 50,
              transactions: Math.floor(Math.random() * 10) + 1,
              dayOfWeek: i % 7,
              week: Math.floor(i / 7),
              category: ['Food', 'Transport', 'Shopping', 'Entertainment'][Math.floor(Math.random() * 4)]
            }))}
            year={2024}
            {...commonProps}
          />
        );
      
      case 'treemap':
        return (
          <SpendingTreeMap
            data={[
              { id: '1', name: 'Housing', value: 2500, color: '#3b82f6', change: 5.2, category: 'Essential' },
              { id: '2', name: 'Food', value: 800, color: '#10b981', change: -2.1, category: 'Essential' },
              { id: '3', name: 'Transport', value: 600, color: '#f59e0b', change: 8.7, category: 'Essential' },
              { id: '4', name: 'Entertainment', value: 400, color: '#ef4444', change: 15.3, category: 'Lifestyle' },
              { id: '5', name: 'Shopping', value: 300, color: '#8b5cf6', change: -5.8, category: 'Lifestyle' },
              { id: '6', name: 'Health', value: 200, color: '#06b6d4', change: 2.4, category: 'Essential' },
            ]}
            {...commonProps}
          />
        );
      
      case '3d':
        return (
          <Portfolio3DChart
            data={[
              { id: '1', name: 'AAPL', value: 15000, percentage: 25, change: 12.5, color: '#3b82f6', category: 'Tech', volatility: 0.15 },
              { id: '2', name: 'GOOGL', value: 12000, percentage: 20, change: 8.2, color: '#10b981', category: 'Tech', volatility: 0.12 },
              { id: '3', name: 'TSLA', value: 10000, percentage: 17, change: -5.3, color: '#f59e0b', category: 'Auto', volatility: 0.25 },
              { id: '4', name: 'MSFT', value: 8000, percentage: 13, change: 15.7, color: '#ef4444', category: 'Tech', volatility: 0.08 },
              { id: '5', name: 'AMZN', value: 7500, percentage: 12, change: 6.1, color: '#8b5cf6', category: 'Tech', volatility: 0.18 },
              { id: '6', name: 'NVDA', value: 5000, percentage: 8, change: 25.4, color: '#06b6d4', category: 'Tech', volatility: 0.30 },
              { id: '7', name: 'META', value: 3000, percentage: 5, change: -8.9, color: '#f97316', category: 'Social', volatility: 0.22 },
            ]}
            showLabels={showAdvanced}
            {...commonProps}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Interactive Chart Gallery</h1>
        <p className="text-gray-400">Showcase of advanced animated visualizations</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="flex items-center justify-center gap-4 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isAnimating ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400'
          }`}
        >
          {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAnimating ? 'Pause' : 'Play'} Animations
        </button>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showAdvanced ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
          }`}
        >
          <Zap className="w-4 h-4" />
          {showAdvanced ? 'Basic' : 'Advanced'} Mode
        </button>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </motion.div>

      {/* Chart Type Selector */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {chartTypes.map((chart, index) => (
          <motion.button
            key={chart.id}
            onClick={() => setActiveDemo(chart.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeDemo === chart.id
                ? 'bg-blue-500/20 border-blue-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl mb-2">{chart.icon}</div>
            <div className="font-semibold text-sm">{chart.name}</div>
            <div className="text-xs opacity-75 mt-1">{chart.description}</div>
          </motion.button>
        ))}
      </motion.div>

      {/* Chart Display */}
      <motion.div
        key={activeDemo}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-[600px]"
      >
        <AnimatePresence mode="wait">
          {renderActiveChart()}
        </AnimatePresence>
      </motion.div>

      {/* Feature List */}
      <motion.div
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">✨ Enhanced Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            '🎨 Animated line drawing with gradients',
            '📊 Bars growing from bottom with counters',
            '🌀 Liquid morphing donut charts',
            '🎭 3D interactive pie charts',
            '🌊 Sankey flow visualizations',
            '🔥 Calendar heatmaps',
            '🌳 Hierarchical treemaps',
            '🎯 Three.js 3D portfolios',
            '🔍 Zoom and pan controls',
            '⏯️ Real-time data streaming',
            '✨ Particle effects and animations',
            '🎪 Interactive tooltips and legends',
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.05 }}
            >
              <span>{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}