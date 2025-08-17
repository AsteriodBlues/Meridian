'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3,
  Home, Car, Laptop, Star, Shield, Briefcase, Heart,
  Target, Zap, Award, Eye, Filter, Calendar, RefreshCw,
  ArrowUp, ArrowDown, Activity, Clock, Globe, Plus,
  Minus, Edit, Share, Download, Settings, Info
} from 'lucide-react';

interface AssetCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  value: number;
  change: number; // percentage change
  changeValue: number; // dollar change
  count: number; // number of assets
  assets: Array<{
    id: string;
    name: string;
    value: number;
    change: number;
    type: string;
  }>;
}

interface NetWorthData {
  totalValue: number;
  totalChange: number;
  totalChangeValue: number;
  categories: AssetCategory[];
  history: Array<{
    date: string;
    value: number;
    categories: Record<string, number>;
  }>;
}

interface NetWorthCompositionProps {
  data?: NetWorthData;
  className?: string;
  timeframe?: '1M' | '3M' | '6M' | '1Y' | 'ALL';
  onTimeframeChange?: (timeframe: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onAssetClick?: (assetId: string) => void;
}

export default function NetWorthComposition({ 
  data,
  className = '',
  timeframe = '1Y',
  onTimeframeChange,
  onCategoryClick,
  onAssetClick 
}: NetWorthCompositionProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'breakdown' | 'trends' | 'allocation'>('overview');
  const [animationStep, setAnimationStep] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate through pie segments
  useEffect(() => {
    if (mounted) {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 8);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  // Default net worth data
  const defaultData: NetWorthData = {
    totalValue: 1247850,
    totalChange: 8.4,
    totalChangeValue: 96420,
    categories: [
      {
        id: 'property',
        name: 'Real Estate',
        icon: Home,
        color: '#10b981',
        value: 685000,
        change: 12.3,
        changeValue: 75200,
        count: 2,
        assets: [
          { id: 'prop-1', name: 'Primary Residence', value: 450000, change: 8.5, type: 'property' },
          { id: 'prop-2', name: 'Investment Property', value: 235000, change: 18.2, type: 'property' }
        ]
      },
      {
        id: 'vehicles',
        name: 'Vehicles',
        icon: Car,
        color: '#3b82f6',
        value: 110300,
        change: -5.2,
        changeValue: -6050,
        count: 3,
        assets: [
          { id: 'car-1', name: '2022 Tesla Model 3', value: 38500, change: -14.4, type: 'vehicle' },
          { id: 'car-2', name: '2021 BMW X5', value: 49800, change: -19.7, type: 'vehicle' },
          { id: 'car-3', name: '2020 Toyota Camry', value: 22000, change: -22.8, type: 'vehicle' }
        ]
      },
      {
        id: 'investments',
        name: 'Investments',
        icon: TrendingUp,
        color: '#8b5cf6',
        value: 285600,
        change: 15.7,
        changeValue: 38700,
        count: 12,
        assets: [
          { id: 'inv-1', name: 'Stock Portfolio', value: 185000, change: 18.2, type: 'investment' },
          { id: 'inv-2', name: '401(k)', value: 67500, change: 12.1, type: 'investment' },
          { id: 'inv-3', name: 'Crypto Holdings', value: 33100, change: 8.9, type: 'investment' }
        ]
      },
      {
        id: 'electronics',
        name: 'Electronics',
        icon: Laptop,
        color: '#f59e0b',
        value: 42150,
        change: -2.1,
        changeValue: -900,
        count: 8,
        assets: [
          { id: 'elec-1', name: 'MacBook Pro 16"', value: 18500, change: -26.0, type: 'electronics' },
          { id: 'elec-2', name: 'iPhone 14 Pro', value: 8900, change: -11.2, type: 'electronics' },
          { id: 'elec-3', name: 'Gaming Setup', value: 14750, change: 8.5, type: 'electronics' }
        ]
      },
      {
        id: 'jewelry',
        name: 'Jewelry & Collectibles',
        icon: Star,
        color: '#ef4444',
        value: 89500,
        change: 22.8,
        changeValue: 16650,
        count: 5,
        assets: [
          { id: 'jew-1', name: 'Rolex Submariner', value: 52800, change: 51.8, type: 'jewelry' },
          { id: 'jew-2', name: 'Diamond Ring', value: 23500, change: -2.1, type: 'jewelry' },
          { id: 'jew-3', name: 'Art Collection', value: 13200, change: 12.0, type: 'jewelry' }
        ]
      },
      {
        id: 'cash',
        name: 'Cash & Savings',
        icon: DollarSign,
        color: '#06b6d4',
        value: 35300,
        change: 1.2,
        changeValue: 420,
        count: 4,
        assets: [
          { id: 'cash-1', name: 'Checking Account', value: 15200, change: 0.1, type: 'cash' },
          { id: 'cash-2', name: 'High-Yield Savings', value: 18500, change: 4.2, type: 'cash' },
          { id: 'cash-3', name: 'Emergency Fund', value: 1600, change: -2.1, type: 'cash' }
        ]
      }
    ],
    history: [
      { date: '2024-01', value: 1089200, categories: { property: 615000, vehicles: 125000, investments: 198000, electronics: 45000, jewelry: 71200, cash: 35000 } },
      { date: '2024-02', value: 1124800, categories: { property: 628000, vehicles: 122000, investments: 215000, electronics: 44500, jewelry: 80300, cash: 35000 } },
      { date: '2024-03', value: 1156400, categories: { property: 642000, vehicles: 118000, investments: 225000, electronics: 44000, jewelry: 92400, cash: 35000 } },
      { date: '2024-04', value: 1189600, categories: { property: 655000, vehicles: 116000, investments: 242000, electronics: 43500, jewelry: 98100, cash: 35000 } },
      { date: '2024-05', value: 1215200, categories: { property: 668000, vehicles: 114000, investments: 255000, electronics: 43000, jewelry: 100200, cash: 35000 } },
      { date: '2024-06', value: 1198400, categories: { property: 672000, vehicles: 112000, investments: 238000, electronics: 42500, jewelry: 98900, cash: 35000 } },
      { date: '2024-07', value: 1224800, categories: { property: 678000, vehicles: 111000, investments: 268000, electronics: 42000, jewelry: 90800, cash: 35000 } },
      { date: '2024-08', value: 1247850, categories: { property: 685000, vehicles: 110300, investments: 285600, electronics: 42150, jewelry: 89500, cash: 35300 } }
    ]
  };

  const netWorthData = data || defaultData;

  // Calculate pie chart segments
  const pieSegments = useMemo(() => {
    const total = netWorthData.totalValue;
    let currentAngle = 0;
    
    return netWorthData.categories.map((category, index) => {
      const percentage = (category.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const segment = {
        ...category,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        angle
      };
      currentAngle += angle;
      return segment;
    });
  }, [netWorthData]);

  // Create SVG path for pie segment
  const createPieSegment = (startAngle: number, endAngle: number, radius: number, innerRadius: number = 0) => {
    const start = polarToCartesian(0, 0, radius, endAngle);
    const end = polarToCartesian(0, 0, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    if (innerRadius === 0) {
      return [
        "M", 0, 0,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    } else {
      const innerStart = polarToCartesian(0, 0, innerRadius, endAngle);
      const innerEnd = polarToCartesian(0, 0, innerRadius, startAngle);
      
      return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
      ].join(" ");
    }
  };

  // Convert polar coordinates to cartesian
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Net Worth Composition
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Comprehensive breakdown of your total asset value and growth over time
        </motion.p>
      </div>

      {/* Total Value Display */}
      <motion.div
        className="p-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/20 rounded-3xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center">
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 40px rgba(59, 130, 246, 0.7)',
                '0 0 20px rgba(168, 85, 247, 0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <TrendingUp className="w-12 h-12 text-white" />
          </motion.div>
          
          <h4 className="text-white font-bold text-xl mb-2">Total Net Worth</h4>
          <motion.div
            className="text-5xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            ${netWorthData.totalValue.toLocaleString()}
          </motion.div>
          
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              netWorthData.totalChange >= 0 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              {netWorthData.totalChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`font-bold ${
                netWorthData.totalChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {Math.abs(netWorthData.totalChange).toFixed(1)}%
              </span>
            </div>
            <div className="text-gray-400">
              ${Math.abs(netWorthData.totalChangeValue).toLocaleString()} this period
            </div>
          </div>
        </div>
      </motion.div>

      {/* View Mode Tabs */}
      <motion.div
        className="flex gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { key: 'overview', label: 'Overview', icon: PieChart },
          { key: 'breakdown', label: 'Breakdown', icon: BarChart3 },
          { key: 'trends', label: 'Trends', icon: Activity },
          { key: 'allocation', label: 'Allocation', icon: Target }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setViewMode(tab.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Animated Pie Chart */}
              <motion.div
                className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h4 className="text-white font-bold text-lg mb-6 text-center">Asset Distribution</h4>
                
                <div className="relative w-80 h-80 mx-auto">
                  <svg width="320" height="320" viewBox="-160 -160 320 320" className="overflow-visible">
                    {/* Background Circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r="140"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="2"
                    />
                    
                    {/* Pie Segments */}
                    {pieSegments.map((segment, index) => (
                      <motion.path
                        key={segment.id}
                        d={createPieSegment(segment.startAngle, segment.endAngle, 120, 40)}
                        fill={segment.color}
                        stroke="rgba(0, 0, 0, 0.2)"
                        strokeWidth="1"
                        className="cursor-pointer"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scale: hoveredSegment === segment.id ? 1.05 : 1,
                          filter: animationStep === index ? 'drop-shadow(0 0 20px currentColor)' : 'none'
                        }}
                        transition={{ 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 300
                        }}
                        onMouseEnter={() => setHoveredSegment(segment.id)}
                        onMouseLeave={() => setHoveredSegment(null)}
                        onClick={() => {
                          setSelectedCategory(selectedCategory === segment.id ? null : segment.id);
                          onCategoryClick?.(segment.id);
                        }}
                      />
                    ))}
                    
                    {/* Center Circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r="35"
                      fill="rgba(0, 0, 0, 0.8)"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="2"
                    />
                    
                    {/* Center Icon */}
                    <foreignObject x="-12" y="-12" width="24" height="24">
                      <DollarSign className="w-6 h-6 text-white" />
                    </foreignObject>
                  </svg>
                  
                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredSegment && (
                      <motion.div
                        className="absolute top-4 left-4 right-4 p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/20"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {(() => {
                          const segment = pieSegments.find(s => s.id === hoveredSegment);
                          if (!segment) return null;
                          const Icon = segment.icon;
                          return (
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Icon className="w-5 h-5" style={{ color: segment.color }} />
                                <span className="text-white font-medium">{segment.name}</span>
                              </div>
                              <div className="text-2xl font-bold text-white mb-1">
                                ${segment.value.toLocaleString()}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {segment.percentage.toFixed(1)}% • {segment.count} assets
                              </div>
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Category Legend & Details */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-white font-bold text-lg mb-6">Categories</h4>
                
                {pieSegments.map((category, index) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <motion.div
                      key={category.id}
                      className={`p-6 bg-white/5 backdrop-blur-xl border rounded-2xl cursor-pointer transition-all ${
                        isSelected ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ y: -2 }}
                      onClick={() => {
                        setSelectedCategory(isSelected ? null : category.id);
                        onCategoryClick?.(category.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div 
                            className="p-3 rounded-xl"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: category.color }} />
                          </div>
                          <div>
                            <div className="text-white font-bold">{category.name}</div>
                            <div className="text-gray-400 text-sm">{category.count} assets</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-white font-bold text-lg">
                            ${category.value.toLocaleString()}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {category.percentage.toFixed(1)}%
                          </div>
                          <div className={`text-sm flex items-center gap-1 justify-end ${
                            category.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {category.change >= 0 ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : (
                              <ArrowDown className="w-3 h-3" />
                            )}
                            {Math.abs(category.change).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      {/* Expanded Asset List */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            className="mt-6 pt-6 border-t border-white/10"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div className="space-y-3">
                              {category.assets.map((asset) => (
                                <motion.div
                                  key={asset.id}
                                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAssetClick?.(asset.id);
                                  }}
                                  whileHover={{ x: 5 }}
                                >
                                  <div>
                                    <div className="text-white font-medium">{asset.name}</div>
                                    <div className="text-gray-400 text-sm capitalize">{asset.type}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-white font-bold">
                                      ${asset.value.toLocaleString()}
                                    </div>
                                    <div className={`text-sm ${
                                      asset.change >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                      {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(1)}%
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}

        {viewMode === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Trends Chart */}
            <motion.div
              className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-bold text-lg">Net Worth Trends</h4>
                <div className="flex gap-2">
                  {['1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
                    <motion.button
                      key={period}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        timeframe === period
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-gray-400 hover:text-white'
                      }`}
                      onClick={() => onTimeframeChange?.(period)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {period}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Simple Line Chart Visualization */}
              <div className="h-64 bg-gray-800/50 rounded-xl p-4 relative overflow-hidden">
                <svg className="w-full h-full">
                  {/* Grid Lines */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={`${(i + 1) * 20}%`}
                      x2="100%"
                      y2={`${(i + 1) * 20}%`}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Trend Line */}
                  <motion.path
                    d={`M 0,80 Q 25,70 50,60 T 100,20`}
                    fill="none"
                    stroke="url(#trendGradient)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                  
                  {/* Area Fill */}
                  <motion.path
                    d={`M 0,80 Q 25,70 50,60 T 100,20 L 100,100 L 0,100 Z`}
                    fill="url(#areaGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1, delay: 1 }}
                  />

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Chart Labels */}
                <div className="absolute bottom-2 left-4 text-gray-400 text-sm">
                  ${(netWorthData.totalValue - netWorthData.totalChangeValue).toLocaleString()}
                </div>
                <div className="absolute bottom-2 right-4 text-green-400 text-sm font-bold">
                  ${netWorthData.totalValue.toLocaleString()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/10 text-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
          >
            <PieChart />
          </motion.div>
        ))}
      </div>
    </div>
  );
}