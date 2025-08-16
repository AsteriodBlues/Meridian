'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import StickyNav from '@/components/dashboard/StickyNav';
import MagneticCursor from '@/components/ui/MagneticCursor';
import PropertyCard from '@/components/realestate/PropertyCard';
import PropertyAnalytics from '@/components/realestate/PropertyAnalytics';
import { 
  Home, TrendingUp, DollarSign, MapPin, Filter, 
  Grid3X3, List, Search, Plus, Star, Award, Target
} from 'lucide-react';

// Mock data for properties
const generateMockProperties = () => [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    address: '123 Main St, Downtown, NY 10001',
    price: 850000,
    originalPrice: 820000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    ],
    type: 'apartment' as const,
    status: 'for-sale' as const,
    yearBuilt: 2018,
    mortgage: {
      totalAmount: 680000,
      paidAmount: 120000,
      monthlyPayment: 3800,
      remainingYears: 27
    },
    rental: {
      monthlyIncome: 4200,
      occupancyRate: 95,
      yearlyIncome: 50400
    },
    valueHistory: [
      { date: '2023-01', value: 750000 },
      { date: '2023-03', value: 760000 },
      { date: '2023-06', value: 780000 },
      { date: '2023-09', value: 800000 },
      { date: '2023-12', value: 820000 },
      { date: '2024-03', value: 850000 },
    ],
    features: ['Gym', 'Rooftop', 'Parking', 'Doorman'],
    rating: 4.8,
    lastUpdated: '2 hours ago'
  },
  {
    id: '2',
    title: 'Luxury Suburban Villa',
    address: '456 Oak Avenue, Westfield, NJ 07090',
    price: 1250000,
    originalPrice: 1180000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    ],
    type: 'house' as const,
    status: 'for-rent' as const,
    yearBuilt: 2015,
    lotSize: 0.5,
    mortgage: {
      totalAmount: 1000000,
      paidAmount: 300000,
      monthlyPayment: 5200,
      remainingYears: 22
    },
    rental: {
      monthlyIncome: 6800,
      occupancyRate: 98,
      yearlyIncome: 81600
    },
    valueHistory: [
      { date: '2023-01', value: 1100000 },
      { date: '2023-03', value: 1120000 },
      { date: '2023-06', value: 1150000 },
      { date: '2023-09', value: 1180000 },
      { date: '2023-12', value: 1200000 },
      { date: '2024-03', value: 1250000 },
    ],
    features: ['Pool', 'Garden', 'Garage', 'Fireplace'],
    rating: 4.9,
    lastUpdated: '1 day ago'
  },
  {
    id: '3',
    title: 'Waterfront Condo',
    address: '789 Harbor View, Miami Beach, FL 33139',
    price: 980000,
    originalPrice: 950000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1600,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop',
    ],
    type: 'condo' as const,
    status: 'sold' as const,
    yearBuilt: 2020,
    mortgage: {
      totalAmount: 784000,
      paidAmount: 196000,
      monthlyPayment: 4100,
      remainingYears: 25
    },
    rental: {
      monthlyIncome: 5200,
      occupancyRate: 92,
      yearlyIncome: 62400
    },
    valueHistory: [
      { date: '2023-01', value: 900000 },
      { date: '2023-03', value: 920000 },
      { date: '2023-06', value: 940000 },
      { date: '2023-09', value: 950000 },
      { date: '2023-12', value: 970000 },
      { date: '2024-03', value: 980000 },
    ],
    features: ['Ocean View', 'Balcony', 'Concierge', 'Spa'],
    rating: 4.7,
    lastUpdated: '3 days ago'
  }
];

// Mock analytics data
const mockAnalyticsData = {
  appreciation: {
    data: [
      { month: 'Jan 2023', value: 750000, appreciation: 2.1 },
      { month: 'Feb 2023', value: 755000, appreciation: 2.3 },
      { month: 'Mar 2023', value: 760000, appreciation: 2.5 },
      { month: 'Apr 2023', value: 768000, appreciation: 2.8 },
      { month: 'May 2023', value: 775000, appreciation: 3.1 },
      { month: 'Jun 2023', value: 780000, appreciation: 3.3 },
      { month: 'Jul 2023', value: 788000, appreciation: 3.6 },
      { month: 'Aug 2023', value: 795000, appreciation: 3.8 },
      { month: 'Sep 2023', value: 800000, appreciation: 4.0 },
      { month: 'Oct 2023', value: 810000, appreciation: 4.3 },
      { month: 'Nov 2023', value: 815000, appreciation: 4.5 },
      { month: 'Dec 2023', value: 820000, appreciation: 4.7 },
    ],
    currentValue: 850000,
    totalAppreciation: 100000,
    yearOverYear: 13.3
  },
  cashFlow: {
    rental: 4200,
    expenses: 800,
    maintenance: 300,
    taxes: 650,
    insurance: 200,
    management: 150,
    net: 2100
  },
  roi: {
    cashOnCash: 12.5,
    cap: 4.8,
    totalReturn: 16.3,
    appreciation: 13.3
  },
  marketComps: [
    {
      id: '1',
      address: '125 Main St',
      price: 825000,
      pricePerSqft: 688,
      sqft: 1200,
      sold: '2 weeks ago',
      distance: 0.1,
      lat: 40.7128,
      lng: -74.0060
    },
    {
      id: '2',
      address: '130 Main St',
      price: 875000,
      pricePerSqft: 729,
      sqft: 1200,
      sold: '1 month ago',
      distance: 0.2,
      lat: 40.7130,
      lng: -74.0058
    },
    {
      id: '3',
      address: '115 Main St',
      price: 810000,
      pricePerSqft: 675,
      sqft: 1200,
      sold: '3 weeks ago',
      distance: 0.15,
      lat: 40.7125,
      lng: -74.0062
    }
  ],
  taxHistory: [
    { year: 2024, assessment: 850000, tax: 12750, rate: 1.5, change: 5.2 },
    { year: 2023, assessment: 820000, tax: 12300, rate: 1.5, change: 3.8 },
    { year: 2022, assessment: 790000, tax: 11850, rate: 1.5, change: 2.1 },
    { year: 2021, assessment: 775000, tax: 11625, rate: 1.5, change: 1.8 },
    { year: 2020, assessment: 760000, tax: 11400, rate: 1.5, change: -2.3 }
  ]
};

export default function RealEstatePage() {
  const [properties, setProperties] = useState(generateMockProperties());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'for-sale' | 'for-rent' | 'sold'>('all');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties.filter(property => {
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleFavorite = (id: string) => {
    console.log('Favorited property:', id);
  };

  const handleShare = (id: string) => {
    console.log('Shared property:', id);
  };

  const handleView = (id: string) => {
    setSelectedProperty(id);
    setShowAnalytics(true);
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
              Real Estate
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Showcase
              </span>
            </motion.h1>
            <motion.p
              className="text-gray-400 text-lg max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Discover premium properties with advanced analytics, 3D visualizations, and intelligent market insights
            </motion.p>
          </div>

          {/* Stats Overview */}
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
                <Home className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl font-bold text-white mb-2">12</div>
              <div className="text-gray-400 text-sm">Properties Owned</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl font-bold text-green-400 mb-2">+18.2%</div>
              <div className="text-gray-400 text-sm">Portfolio Growth</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl font-bold text-white mb-2">$24.7K</div>
              <div className="text-gray-400 text-sm">Monthly Income</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Target className="w-6 h-6 text-white" />
              </motion.div>
              <div className="text-2xl font-bold text-blue-400 mb-2">14.3%</div>
              <div className="text-gray-400 text-sm">Average ROI</div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex gap-4 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors w-64"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:border-blue-400 focus:outline-none transition-colors"
              >
                <option value="all">All Properties</option>
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div className="flex gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Analytics Toggle */}
              <motion.button
                className={`px-4 py-2 rounded-xl transition-all ${
                  showAnalytics
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white border border-white/20'
                }`}
                onClick={() => setShowAnalytics(!showAnalytics)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Analytics
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <AnimatePresence mode="wait">
            {showAnalytics ? (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <PropertyAnalytics data={mockAnalyticsData} />
              </motion.div>
            ) : (
              <motion.div
                key="properties"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                {/* Property Grid/List */}
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
                  : 'space-y-6'
                }>
                  <AnimatePresence>
                    {filteredProperties.map((property, index) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        index={index}
                        onFavorite={handleFavorite}
                        onShare={handleShare}
                        onView={handleView}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Empty State */}
                {filteredProperties.length === 0 && (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Properties Found</h3>
                    <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Add Button */}
        <motion.button
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center z-40 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        >
          <Plus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-60"
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.button>
      </div>
    </TimeBasedBackground>
  );
}