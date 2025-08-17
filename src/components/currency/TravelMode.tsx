'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Plane, Navigation, Compass, Globe, Wallet,
  CreditCard, Receipt, Camera, Clock, AlertCircle, CheckCircle
} from 'lucide-react';

interface Location {
  country: string;
  city: string;
  currency: string;
  symbol: string;
  flag: string;
  timezone: string;
  coordinates: { lat: number; lng: number };
  exchangeRate: number;
  isDetected?: boolean;
}

interface TravelExpense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  convertedAmount: number;
  category: string;
  timestamp: string;
  location: string;
}

interface TravelModeProps {
  className?: string;
  onLocationChange?: (location: Location) => void;
  onExpenseAdd?: (expense: TravelExpense) => void;
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

export default function TravelMode({ 
  className = '',
  onLocationChange,
  onExpenseAdd 
}: TravelModeProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [travelHistory, setTravelHistory] = useState<Location[]>([]);
  const [expenses, setExpenses] = useState<TravelExpense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample locations for demo
  const sampleLocations: Location[] = [
    {
      country: 'United States',
      city: 'New York',
      currency: 'USD',
      symbol: '$',
      flag: '🇺🇸',
      timezone: 'America/New_York',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      exchangeRate: 1.0,
      isDetected: true
    },
    {
      country: 'United Kingdom',
      city: 'London',
      currency: 'GBP',
      symbol: '£',
      flag: '🇬🇧',
      timezone: 'Europe/London',
      coordinates: { lat: 51.5074, lng: -0.1278 },
      exchangeRate: 0.7342
    },
    {
      country: 'Japan',
      city: 'Tokyo',
      currency: 'JPY',
      symbol: '¥',
      flag: '🇯🇵',
      timezone: 'Asia/Tokyo',
      coordinates: { lat: 35.6762, lng: 139.6503 },
      exchangeRate: 148.75
    },
    {
      country: 'European Union',
      city: 'Paris',
      currency: 'EUR',
      symbol: '€',
      flag: '🇪🇺',
      timezone: 'Europe/Paris',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      exchangeRate: 0.8532
    }
  ];

  // Initialize with sample location
  useEffect(() => {
    setCurrentLocation(sampleLocations[0]);
    setTravelHistory([sampleLocations[0]]);
  }, []);

  // Mock location detection
  const detectLocation = async () => {
    if (!mounted) return;
    
    setIsDetecting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use deterministic selection for demo
    const locationSeed = `location-${Date.now()}`;
    const randomIndex = Math.floor(seededRandom(locationSeed) * sampleLocations.length);
    const randomLocation = { ...sampleLocations[randomIndex] };
    randomLocation.isDetected = true;
    
    setCurrentLocation(randomLocation);
    setTravelHistory(prev => {
      const exists = prev.find(loc => loc.country === randomLocation.country);
      if (!exists) {
        return [...prev, randomLocation];
      }
      return prev;
    });
    
    setIsDetecting(false);
    setLocationPermission('granted');
    onLocationChange?.(randomLocation);
  };

  // Add expense
  const addExpense = (description: string, amount: number, category: string) => {
    if (!currentLocation) return;
    
    const expense: TravelExpense = {
      id: `expense-${expenses.length}`,
      description,
      amount,
      currency: currentLocation.currency,
      convertedAmount: amount / currentLocation.exchangeRate,
      category,
      timestamp: new Date().toISOString(),
      location: `${currentLocation.city}, ${currentLocation.country}`
    };
    
    setExpenses(prev => [expense, ...prev]);
    onExpenseAdd?.(expense);
    setShowExpenseForm(false);
  };

  const getCurrentTime = (timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date());
  };

  const LocationCard = ({ location, isCurrent = false }: { location: Location; isCurrent?: boolean }) => (
    <motion.div
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
        isCurrent 
          ? 'border-blue-500/50 bg-blue-500/10' 
          : 'border-white/20 bg-white/5 hover:border-white/30'
      }`}
      onClick={() => {
        setCurrentLocation(location);
        onLocationChange?.(location);
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{location.flag}</div>
        <div className="flex-1">
          <div className="text-white font-medium">{location.city}</div>
          <div className="text-gray-400 text-sm">{location.country}</div>
        </div>
        <div className="text-right">
          <div className="text-white font-mono">{location.symbol}</div>
          <div className="text-gray-400 text-xs">{location.currency}</div>
        </div>
        {location.isDetected && (
          <motion.div
            className="w-3 h-3 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      
      {isCurrent && (
        <motion.div
          className="mt-3 pt-3 border-t border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Local Time</span>
            </div>
            <span className="text-white font-mono">
              {getCurrentTime(location.timezone)}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const ExpenseForm = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');

    const categories = [
      { id: 'food', label: 'Food & Dining', icon: '🍽️' },
      { id: 'transport', label: 'Transportation', icon: '🚗' },
      { id: 'accommodation', label: 'Accommodation', icon: '🏨' },
      { id: 'entertainment', label: 'Entertainment', icon: '🎭' },
      { id: 'shopping', label: 'Shopping', icon: '🛍️' },
      { id: 'other', label: 'Other', icon: '📋' }
    ];

    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowExpenseForm(false)}
      >
        <motion.div
          className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-white text-xl font-bold mb-4">Add Expense</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                placeholder="Coffee at local café"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Amount ({currentLocation?.currency})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 pl-8 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
                  placeholder="0.00"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {currentLocation?.symbol}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    className={`p-3 rounded-xl border-2 transition-all text-sm ${
                      category === cat.id
                        ? 'border-blue-500/50 bg-blue-500/20 text-white'
                        : 'border-white/20 bg-white/5 text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setCategory(cat.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {amount && currentLocation && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="text-green-400 text-sm">
                  Converted: ${((parseFloat(amount) || 0) / currentLocation.exchangeRate).toFixed(2)} USD
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 mt-6">
            <motion.button
              className="flex-1 p-3 bg-white/10 hover:bg-white/15 rounded-xl text-white transition-colors"
              onClick={() => setShowExpenseForm(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="flex-1 p-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white transition-colors disabled:opacity-50"
              onClick={() => addExpense(description, parseFloat(amount) || 0, category)}
              disabled={!description || !amount}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Expense
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`relative p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Travel Mode
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Auto-detect your location and manage expenses on the go
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Location Detection */}
        <div className="space-y-6">
          <div className="text-white font-medium">Current Location</div>
          
          {/* Current Location Card */}
          {currentLocation && (
            <motion.div
              className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              layout
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">{currentLocation.flag}</div>
                <div className="flex-1">
                  <div className="text-white text-xl font-bold">{currentLocation.city}</div>
                  <div className="text-gray-400">{currentLocation.country}</div>
                </div>
                <motion.div
                  className="p-2 bg-green-500/20 rounded-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <MapPin className="w-5 h-5 text-green-400" />
                </motion.div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Currency</span>
                  <span className="text-white font-mono">
                    {currentLocation.currency} ({currentLocation.symbol})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Exchange Rate</span>
                  <span className="text-white font-mono">
                    {currentLocation.exchangeRate.toFixed(4)} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Local Time</span>
                  <span className="text-white font-mono">
                    {getCurrentTime(currentLocation.timezone)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Location Detection Button */}
          <motion.button
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
            onClick={detectLocation}
            disabled={isDetecting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              {isDetecting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Compass className="w-5 h-5" />
                  </motion.div>
                  <span>Detecting Location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  <span>Detect Current Location</span>
                </>
              )}
            </div>
          </motion.button>

          {/* Travel History */}
          <div>
            <div className="text-white font-medium mb-3">Travel History</div>
            <div className="space-y-3">
              {travelHistory.map((location, index) => (
                <LocationCard 
                  key={`${location.country}-${index}`} 
                  location={location} 
                  isCurrent={currentLocation?.country === location.country}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Expense Tracking */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-white font-medium">Travel Expenses</div>
            <motion.button
              className="p-3 bg-green-500 hover:bg-green-600 rounded-xl text-white transition-colors"
              onClick={() => setShowExpenseForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Receipt className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-gray-400 text-sm">Total Spent</div>
              <div className="text-white text-xl font-bold">
                ${expenses.reduce((sum, exp) => sum + exp.convertedAmount, 0).toFixed(2)}
              </div>
              <div className="text-gray-400 text-xs">USD Equivalent</div>
            </motion.div>

            <motion.div
              className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-gray-400 text-sm">Transactions</div>
              <div className="text-white text-xl font-bold">{expenses.length}</div>
              <div className="text-gray-400 text-xs">This Trip</div>
            </motion.div>

            <motion.div
              className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-gray-400 text-sm">Avg per Day</div>
              <div className="text-white text-xl font-bold">
                ${expenses.length > 0 ? (expenses.reduce((sum, exp) => sum + exp.convertedAmount, 0) / 1).toFixed(2) : '0.00'}
              </div>
              <div className="text-gray-400 text-xs">USD Equivalent</div>
            </motion.div>
          </div>

          {/* Expense List */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="text-white font-medium mb-4">Recent Expenses</div>
            
            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">No expenses recorded yet</div>
                <motion.button
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={() => setShowExpenseForm(true)}
                  whileHover={{ scale: 1.05 }}
                >
                  Add your first expense
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {expenses.map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-white font-medium">{expense.description}</div>
                        <div className="text-gray-400 text-sm flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          <span>{expense.location}</span>
                          <span>•</span>
                          <span>{new Date(expense.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-mono">
                          {expense.currency === 'USD' ? '$' : 
                           sampleLocations.find(l => l.currency === expense.currency)?.symbol || ''}
                          {expense.amount.toFixed(2)} {expense.currency}
                        </div>
                        <div className="text-gray-400 text-sm">
                          ${expense.convertedAmount.toFixed(2)} USD
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      <AnimatePresence>
        {showExpenseForm && <ExpenseForm />}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/6 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>
    </div>
  );
}