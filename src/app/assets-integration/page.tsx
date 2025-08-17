'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Grid, Car, Home, Shield, Camera, PieChart, Building2,
  Smartphone, Settings, RefreshCw, Plus, Eye, TrendingUp,
  Star, Award, Zap, Target, Clock, Bell, Search, Filter
} from 'lucide-react';

// Import components
import AssetManager from '@/components/assets/AssetManager';
import MaintenanceTimeline from '@/components/assets/MaintenanceTimeline';
import InsuranceComparison from '@/components/assets/InsuranceComparison';
import AssetGallery from '@/components/assets/AssetGallery';
import NetWorthComposition from '@/components/assets/NetWorthComposition';
import PlaidIntegration from '@/components/banking/PlaidIntegration';

type ViewType = 'overview' | 'asset-manager' | 'maintenance' | 'insurance' | 'gallery' | 'net-worth' | 'banking';

interface QuickStat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  change?: string;
}

export default function AssetsIntegrationPage() {
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate through steps
  useEffect(() => {
    if (mounted) {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 6);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mounted]);

  // Navigation items
  const navItems = [
    {
      id: 'overview' as ViewType,
      label: 'Overview',
      icon: Grid,
      description: 'Dashboard overview'
    },
    {
      id: 'asset-manager' as ViewType,
      label: 'Asset Manager',
      icon: Home,
      description: 'Vehicle depreciation & assets'
    },
    {
      id: 'maintenance' as ViewType,
      label: 'Maintenance Timeline',
      icon: Settings,
      description: 'Service schedules & history'
    },
    {
      id: 'insurance' as ViewType,
      label: 'Insurance Comparison',
      icon: Shield,
      description: 'Compare quotes & coverage'
    },
    {
      id: 'gallery' as ViewType,
      label: 'Asset Gallery',
      icon: Camera,
      description: 'Photos & documents'
    },
    {
      id: 'net-worth' as ViewType,
      label: 'Net Worth Composition',
      icon: PieChart,
      description: 'Asset breakdown & trends'
    },
    {
      id: 'banking' as ViewType,
      label: 'Banking Integration',
      icon: Building2,
      description: 'Plaid connection & sync'
    }
  ];

  // Quick stats
  const quickStats: QuickStat[] = [
    {
      label: 'Total Assets',
      value: '$1,247,850',
      icon: TrendingUp,
      color: '#10b981',
      change: '+8.4%'
    },
    {
      label: 'Connected Accounts',
      value: '7',
      icon: Building2,
      color: '#3b82f6',
      change: 'All synced'
    },
    {
      label: 'Asset Photos',
      value: '247',
      icon: Camera,
      color: '#f59e0b',
      change: 'Organized'
    },
    {
      label: 'Maintenance Due',
      value: '3',
      icon: Clock,
      color: '#ef4444',
      change: 'This month'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Assets & Integration
              </h1>
              <p className="text-gray-400">
                Comprehensive asset management with secure banking integration
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </motion.button>

              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-4 h-4" />
                Sync All
              </motion.button>

              <motion.button
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Quick Stats */}
          {currentView === 'overview' && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      if (index === 0) setCurrentView('net-worth');
                      if (index === 1) setCurrentView('banking');
                      if (index === 2) setCurrentView('gallery');
                      if (index === 3) setCurrentView('maintenance');
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${stat.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      {stat.change && (
                        <span className="text-gray-400 text-sm">{stat.change}</span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            className="flex items-center gap-4 mb-8 overflow-x-auto scrollbar-hide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentView === 'overview' ? 0.4 : 0.2 }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white/10 text-white border-2 border-white/20'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border-2 border-transparent'
                  }`}
                  onClick={() => setCurrentView(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Search (for overview) */}
          {currentView === 'overview' && (
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets, accounts, maintenance..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {navItems.slice(1).map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.id}
                        className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all cursor-pointer group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.8 }}
                        whileHover={{ y: -10 }}
                        onClick={() => setCurrentView(feature.id)}
                      >
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                          animate={{
                            boxShadow: animationStep === index % 6 
                              ? ['0 0 0px rgba(59, 130, 246, 0)', '0 0 30px rgba(59, 130, 246, 0.6)', '0 0 0px rgba(59, 130, 246, 0)']
                              : '0 0 10px rgba(59, 130, 246, 0.3)'
                          }}
                          transition={{ duration: 2 }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-white font-bold text-xl mb-3">{feature.label}</h3>
                        <p className="text-gray-400 mb-6">{feature.description}</p>
                        
                        <motion.div
                          className="flex items-center text-blue-400 font-medium group-hover:gap-3 transition-all"
                          initial={{ gap: '8px' }}
                          whileHover={{ gap: '12px' }}
                        >
                          <span>Explore</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            →
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Recent Activity */}
                <motion.div
                  className="mt-12 p-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="text-white font-bold text-xl">Recent Activity</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Asset Value Updated',
                        description: '2022 Tesla Model 3 value adjusted to $38,500',
                        time: '2 hours ago',
                        icon: Car,
                        color: '#3b82f6'
                      },
                      {
                        title: 'Bank Account Synced',
                        description: 'Chase checking account synchronized successfully',
                        time: '4 hours ago',
                        icon: Building2,
                        color: '#10b981'
                      },
                      {
                        title: 'Insurance Quote Received',
                        description: 'New auto insurance quote from State Farm',
                        time: '1 day ago',
                        icon: Shield,
                        color: '#f59e0b'
                      }
                    ].map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={activity.title}
                          className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.7 + index * 0.1 }}
                          whileHover={{ y: -3 }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${activity.color}20` }}
                            >
                              <Icon className="w-4 h-4" style={{ color: activity.color }} />
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm">{activity.title}</div>
                              <div className="text-gray-400 text-xs mb-2">{activity.description}</div>
                              <div className="text-gray-500 text-xs">{activity.time}</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {currentView === 'asset-manager' && (
              <motion.div
                key="asset-manager"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <AssetManager />
              </motion.div>
            )}

            {currentView === 'maintenance' && (
              <motion.div
                key="maintenance"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <MaintenanceTimeline />
              </motion.div>
            )}

            {currentView === 'insurance' && (
              <motion.div
                key="insurance"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <InsuranceComparison />
              </motion.div>
            )}

            {currentView === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <AssetGallery />
              </motion.div>
            )}

            {currentView === 'net-worth' && (
              <motion.div
                key="net-worth"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <NetWorthComposition />
              </motion.div>
            )}

            {currentView === 'banking' && (
              <motion.div
                key="banking"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <PlaidIntegration />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
}