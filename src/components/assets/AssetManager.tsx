'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Car, Home, Smartphone, Laptop, Camera, Watch, Palette,
  TrendingDown, TrendingUp, Calendar, DollarSign, Edit,
  Plus, Search, Filter, Grid, List, Eye, Trash2, Upload,
  Star, Award, Shield, Zap, Clock, AlertCircle, CheckCircle
} from 'lucide-react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  purchasePrice: number;
  currentValue: number;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  photos: string[];
  purchaseDate: string;
  vin?: string;
  color: string;
  logo: string; // SVG or image URL for brand logo
}

interface Asset {
  id: string;
  name: string;
  category: 'vehicle' | 'property' | 'electronics' | 'jewelry' | 'collectibles' | 'other';
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  purchaseDate: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  photos: string[];
  description?: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  location?: string;
}

interface AssetManagerProps {
  assets?: Asset[];
  vehicles?: Vehicle[];
  className?: string;
  onAddAsset?: (asset: Partial<Asset>) => void;
  onUpdateAsset?: (id: string, updates: Partial<Asset>) => void;
  onDeleteAsset?: (id: string) => void;
  onUploadPhotos?: (assetId: string, files: FileList) => void;
}

export default function AssetManager({ 
  assets = [],
  vehicles = [],
  className = '',
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onUploadPhotos 
}: AssetManagerProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'assets' | 'analytics'>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'vehicle' | 'property' | 'electronics' | 'jewelry' | 'collectibles' | 'other'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Car brand logos (SVG strings for popular brands)
  const carLogos = {
    'Tesla': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="#cc0000" stroke="#fff" stroke-width="2"/>
      <text x="50" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">T</text>
    </svg>`,
    'BMW': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#0066cc" stroke="#fff" stroke-width="3"/>
      <path d="M50 10 A40 40 0 0 1 50 90 A40 40 0 0 1 50 10 Z" fill="#fff"/>
      <text x="50" y="55" text-anchor="middle" fill="#0066cc" font-family="Arial" font-size="10" font-weight="bold">BMW</text>
    </svg>`,
    'Mercedes': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#c0c0c0" stroke="#333" stroke-width="2"/>
      <path d="M50 20 L30 70 L70 70 Z" fill="#333"/>
      <circle cx="50" cy="50" r="8" fill="#c0c0c0"/>
    </svg>`,
    'Audi': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#333" stroke-width="4">
        <circle cx="25" cy="50" r="15"/>
        <circle cx="40" cy="50" r="15"/>
        <circle cx="60" cy="50" r="15"/>
        <circle cx="75" cy="50" r="15"/>
      </g>
    </svg>`,
    'Toyota': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="40" ry="30" fill="#cc0000" stroke="#333" stroke-width="2"/>
      <ellipse cx="50" cy="45" rx="25" ry="15" fill="#fff"/>
      <ellipse cx="50" cy="55" rx="15" ry="10" fill="#fff"/>
    </svg>`,
    'Honda': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="60" height="40" rx="20" fill="#cc0000" stroke="#333" stroke-width="2"/>
      <text x="50" y="55" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">H</text>
    </svg>`
  };

  // Default vehicles data
  const defaultVehicles: Vehicle[] = [
    {
      id: 'vehicle-001',
      make: 'Tesla',
      model: 'Model 3',
      year: 2022,
      purchasePrice: 45000,
      currentValue: 38500,
      mileage: 15420,
      condition: 'excellent',
      photos: ['/car-photos/tesla-model3-1.jpg', '/car-photos/tesla-model3-2.jpg'],
      purchaseDate: '2022-03-15',
      vin: '5YJ3E1EA1NF123456',
      color: 'Pearl White',
      logo: carLogos.Tesla
    },
    {
      id: 'vehicle-002', 
      make: 'BMW',
      model: 'X5',
      year: 2021,
      purchasePrice: 62000,
      currentValue: 49800,
      mileage: 28650,
      condition: 'good',
      photos: ['/car-photos/bmw-x5-1.jpg'],
      purchaseDate: '2021-08-22',
      color: 'Alpine White',
      logo: carLogos.BMW
    },
    {
      id: 'vehicle-003',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      purchasePrice: 28500,
      currentValue: 22100,
      mileage: 42300,
      condition: 'good',
      photos: [],
      purchaseDate: '2020-11-10',
      color: 'Midnight Black',
      logo: carLogos.Toyota
    }
  ];

  // Default assets data
  const defaultAssets: Asset[] = [
    {
      id: 'asset-001',
      name: 'MacBook Pro 16"',
      category: 'electronics',
      purchasePrice: 2499,
      currentValue: 1850,
      depreciationRate: 12,
      purchaseDate: '2023-01-15',
      condition: 'excellent',
      photos: ['/asset-photos/macbook-1.jpg'],
      description: 'M2 Max chip, 32GB RAM, 1TB SSD',
      serialNumber: 'FVFX3LL/A',
      brand: 'Apple',
      model: 'MacBook Pro',
      location: 'Home Office'
    },
    {
      id: 'asset-002',
      name: 'Rolex Submariner',
      category: 'jewelry',
      purchasePrice: 8500,
      currentValue: 12800,
      depreciationRate: -8.5, // Appreciation
      purchaseDate: '2019-06-20',
      condition: 'excellent',
      photos: ['/asset-photos/rolex-1.jpg', '/asset-photos/rolex-2.jpg'],
      description: 'Date, Oystersteel, Black dial',
      serialNumber: 'Z123456',
      brand: 'Rolex',
      model: 'Submariner Date',
      location: 'Safe'
    },
    {
      id: 'asset-003',
      name: 'Investment Property',
      category: 'property',
      purchasePrice: 320000,
      currentValue: 385000,
      depreciationRate: -3.2, // Appreciation
      purchaseDate: '2021-04-10',
      condition: 'good',
      photos: ['/asset-photos/property-1.jpg'],
      description: '2BR/2BA Condo, Downtown',
      location: '123 Main St, San Francisco'
    }
  ];

  const vehicleData = vehicles.length > 0 ? vehicles : defaultVehicles;
  const assetData = assets.length > 0 ? assets : defaultAssets;

  // Calculate total asset value
  const totalAssetValue = [...vehicleData, ...assetData].reduce((sum, item) => {
    return sum + ('currentValue' in item ? item.currentValue : 0);
  }, 0);

  // Calculate depreciation curve for vehicles
  const calculateDepreciation = (vehicle: Vehicle) => {
    const yearsOwned = new Date().getFullYear() - vehicle.year;
    const monthsOwned = Math.max(1, yearsOwned * 12 + (new Date().getMonth() + 1));
    
    // Standard depreciation curve: 20% first year, 15% second year, 10% thereafter
    let depreciationRate = 0;
    if (monthsOwned <= 12) {
      depreciationRate = 20 * (monthsOwned / 12);
    } else if (monthsOwned <= 24) {
      depreciationRate = 20 + 15 * ((monthsOwned - 12) / 12);
    } else {
      depreciationRate = 35 + 10 * ((monthsOwned - 24) / 12);
    }
    
    return Math.min(depreciationRate, 80); // Cap at 80% depreciation
  };

  // Filter assets
  const filteredAssets = assetData.filter(asset => {
    const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.model?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vehicle': return Car;
      case 'property': return Home;
      case 'electronics': return Laptop;
      case 'jewelry': return Star;
      case 'collectibles': return Award;
      default: return Grid;
    }
  };

  // Get condition color
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
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
          Asset Manager
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Track, analyze, and optimize your valuable assets with smart depreciation insights
        </motion.p>
      </div>

      {/* Tabs */}
      <motion.div
        className="flex gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { key: 'overview', label: 'Overview', icon: Grid },
          { key: 'vehicles', label: 'Vehicles', icon: Car },
          { key: 'assets', label: 'Assets', icon: Home },
          { key: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
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
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Total Value Summary */}
            <motion.div
              className="p-8 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/20 rounded-3xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
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
                  <DollarSign className="w-10 h-10 text-white" />
                </motion.div>
                
                <h4 className="text-white font-bold text-xl mb-2">Total Asset Value</h4>
                <motion.div
                  className="text-4xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  ${totalAssetValue.toLocaleString()}
                </motion.div>
                <p className="text-gray-400 mt-2">
                  Across {vehicleData.length + assetData.length} tracked assets
                </p>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: 'Vehicles',
                  value: vehicleData.length.toString(),
                  icon: Car,
                  color: '#3b82f6',
                  subtext: `$${vehicleData.reduce((sum, v) => sum + v.currentValue, 0).toLocaleString()}`
                },
                {
                  label: 'Properties',
                  value: assetData.filter(a => a.category === 'property').length.toString(),
                  icon: Home,
                  color: '#10b981',
                  subtext: `$${assetData.filter(a => a.category === 'property').reduce((sum, a) => sum + a.currentValue, 0).toLocaleString()}`
                },
                {
                  label: 'Electronics',
                  value: assetData.filter(a => a.category === 'electronics').length.toString(),
                  icon: Laptop,
                  color: '#f59e0b',
                  subtext: `$${assetData.filter(a => a.category === 'electronics').reduce((sum, a) => sum + a.currentValue, 0).toLocaleString()}`
                },
                {
                  label: 'Appreciating',
                  value: assetData.filter(a => a.depreciationRate < 0).length.toString(),
                  icon: TrendingUp,
                  color: '#ef4444',
                  subtext: 'Growing in value'
                }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${stat.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      <span className="text-gray-400 text-sm">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.subtext}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Assets Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-bold text-lg">Recent Assets</h4>
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                  onClick={() => setShowAddForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Asset
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...vehicleData.slice(0, 2), ...assetData.slice(0, 4)].map((item, index) => {
                  const isVehicle = 'make' in item;
                  const Icon = isVehicle ? Car : getCategoryIcon((item as Asset).category);
                  const depreciation = isVehicle ? calculateDepreciation(item as Vehicle) : (item as Asset).depreciationRate;
                  
                  return (
                    <motion.div
                      key={item.id}
                      className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      {/* Asset Image */}
                      <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
                        {item.photos && item.photos.length > 0 ? (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            {isVehicle && (item as Vehicle).logo ? (
                              <div 
                                className="w-16 h-16"
                                dangerouslySetInnerHTML={{ __html: (item as Vehicle).logo }}
                              />
                            ) : (
                              <Icon className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                        )}
                        
                        {/* Condition Badge */}
                        <div className="absolute top-2 right-2">
                          <div 
                            className="px-2 py-1 rounded-full text-xs font-bold uppercase"
                            style={{ 
                              backgroundColor: `${getConditionColor(item.condition)}20`,
                              color: getConditionColor(item.condition)
                            }}
                          >
                            {item.condition}
                          </div>
                        </div>
                      </div>

                      {/* Asset Info */}
                      <div className="mb-4">
                        <h5 className="text-white font-bold mb-1">
                          {isVehicle ? `${(item as Vehicle).year} ${(item as Vehicle).make} ${(item as Vehicle).model}` : item.name}
                        </h5>
                        <p className="text-gray-400 text-sm">
                          {isVehicle ? `${(item as Vehicle).mileage.toLocaleString()} miles` : (item as Asset).brand}
                        </p>
                      </div>

                      {/* Value & Depreciation */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold text-lg">
                            ${item.currentValue.toLocaleString()}
                          </div>
                          <div className={`text-sm flex items-center gap-1 ${
                            depreciation < 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {depreciation < 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(depreciation).toFixed(1)}%
                          </div>
                        </div>
                        
                        <motion.button
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'vehicles' && (
          <motion.div
            key="vehicles"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Vehicle-specific content */}
            <div className="space-y-6">
              {vehicleData.map((vehicle, index) => {
                const depreciation = calculateDepreciation(vehicle);
                const monthlyDepreciation = (vehicle.purchasePrice - vehicle.currentValue) / 
                  Math.max(1, (new Date().getTime() - new Date(vehicle.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
                
                return (
                  <motion.div
                    key={vehicle.id}
                    className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Vehicle Image & Logo */}
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-700 rounded-2xl overflow-hidden relative">
                          {vehicle.photos && vehicle.photos.length > 0 ? (
                            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                              <Camera className="w-12 h-12 text-gray-400" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                              <Car className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Brand Logo Overlay */}
                          <div className="absolute top-4 left-4">
                            <div 
                              className="w-12 h-12 bg-white/90 rounded-full p-2"
                              dangerouslySetInnerHTML={{ __html: vehicle.logo }}
                            />
                          </div>
                          
                          {/* Condition Badge */}
                          <div className="absolute top-4 right-4">
                            <div 
                              className="px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-md"
                              style={{ 
                                backgroundColor: `${getConditionColor(vehicle.condition)}20`,
                                color: getConditionColor(vehicle.condition),
                                border: `1px solid ${getConditionColor(vehicle.condition)}40`
                              }}
                            >
                              {vehicle.condition}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="lg:col-span-2">
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span>VIN: {vehicle.vin || 'Not provided'}</span>
                            <span>Color: {vehicle.color}</span>
                            <span>Mileage: {vehicle.mileage.toLocaleString()} miles</span>
                          </div>
                        </div>

                        {/* Value & Depreciation Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="p-4 bg-white/5 rounded-xl">
                            <div className="text-gray-400 text-xs mb-1">Purchase Price</div>
                            <div className="text-white font-bold">${vehicle.purchasePrice.toLocaleString()}</div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl">
                            <div className="text-gray-400 text-xs mb-1">Current Value</div>
                            <div className="text-white font-bold">${vehicle.currentValue.toLocaleString()}</div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl">
                            <div className="text-gray-400 text-xs mb-1">Total Depreciation</div>
                            <div className="text-red-400 font-bold">-{depreciation.toFixed(1)}%</div>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl">
                            <div className="text-gray-400 text-xs mb-1">Monthly Loss</div>
                            <div className="text-red-400 font-bold">-${monthlyDepreciation.toFixed(0)}</div>
                          </div>
                        </div>

                        {/* Depreciation Curve Visualization */}
                        <div className="p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white font-medium">Depreciation Curve</span>
                            <span className="text-gray-400 text-sm">Over time</span>
                          </div>
                          
                          {/* Simple curve visualization */}
                          <div className="relative h-16 bg-gray-700 rounded-lg overflow-hidden">
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-red-500/60 to-red-500/20 rounded-lg"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, depreciation)}%` }}
                              transition={{ duration: 2, delay: 0.5 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {depreciation.toFixed(1)}% depreciated
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                          <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit className="w-4 h-4" />
                            Edit Details
                          </motion.button>
                          <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Upload className="w-4 h-4" />
                            Add Photos
                          </motion.button>
                          <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Calendar className="w-4 h-4" />
                            Maintenance
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 15 }).map((_, i) => (
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
              duration: 10 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
          >
            <DollarSign />
          </motion.div>
        ))}
      </div>
    </div>
  );
}