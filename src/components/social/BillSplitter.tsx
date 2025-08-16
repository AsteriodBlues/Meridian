'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, DollarSign, Calculator, Check, X, Plus,
  Minus, CreditCard, Split, Share, Download,
  Receipt, Coffee, Utensils, Car, Home, Gift,
  Star, Zap, Crown, Heart, Sparkles
} from 'lucide-react';

interface BillItem {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'drinks' | 'transport' | 'entertainment' | 'utilities' | 'other';
  assignedTo: string[];
  icon: React.ElementType;
}

interface Person {
  id: string;
  name: string;
  avatar: string;
  email: string;
  color: string;
  isConnected: boolean;
  totalOwed: number;
  itemsShared: number;
}

interface BillSplit {
  id: string;
  title: string;
  totalAmount: number;
  date: string;
  location: string;
  items: BillItem[];
  people: Person[];
  tax: number;
  tip: number;
  isSettled: boolean;
  splitMethod: 'equal' | 'by-item' | 'percentage' | 'custom';
}

interface BillSplitterProps {
  billSplit?: BillSplit;
  className?: string;
  onSplitUpdate?: (split: BillSplit) => void;
  onShareBill?: (splitId: string) => void;
  onSettleBill?: (splitId: string) => void;
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

export default function BillSplitter({ 
  billSplit,
  className = '',
  onSplitUpdate,
  onShareBill,
  onSettleBill 
}: BillSplitterProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'equal' | 'by-item' | 'percentage' | 'custom'>('by-item');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const splitterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default bill split data
  const defaultBillSplit: BillSplit = {
    id: 'dinner-split-1',
    title: 'Team Dinner at The Grove',
    totalAmount: 124.75,
    date: '2024-08-15',
    location: 'The Grove Restaurant',
    tax: 9.50,
    tip: 18.70,
    isSettled: false,
    splitMethod: 'by-item',
    items: [
      {
        id: 'pasta',
        name: 'Truffle Pasta',
        price: 32.50,
        category: 'food',
        assignedTo: ['alice', 'bob'],
        icon: Utensils
      },
      {
        id: 'salmon',
        name: 'Grilled Salmon',
        price: 28.90,
        category: 'food',
        assignedTo: ['charlie'],
        icon: Utensils
      },
      {
        id: 'wine',
        name: 'House Wine (Bottle)',
        price: 35.85,
        category: 'drinks',
        assignedTo: ['alice', 'bob', 'charlie', 'diana'],
        icon: Coffee
      }
    ],
    people: [
      {
        id: 'alice',
        name: 'Alice Johnson',
        avatar: '👩‍💼',
        email: 'alice@example.com',
        color: '#ec4899',
        isConnected: true,
        totalOwed: 0,
        itemsShared: 0
      },
      {
        id: 'bob',
        name: 'Bob Smith',
        avatar: '👨‍💻',
        email: 'bob@example.com',
        color: '#3b82f6',
        isConnected: true,
        totalOwed: 0,
        itemsShared: 0
      },
      {
        id: 'charlie',
        name: 'Charlie Brown',
        avatar: '👨‍🎨',
        email: 'charlie@example.com',
        color: '#10b981',
        isConnected: false,
        totalOwed: 0,
        itemsShared: 0
      },
      {
        id: 'diana',
        name: 'Diana Prince',
        avatar: '👩‍🚀',
        email: 'diana@example.com',
        color: '#8b5cf6',
        isConnected: true,
        totalOwed: 0,
        itemsShared: 0
      }
    ]
  };

  const currentBill = billSplit || defaultBillSplit;

  // Calculate splits
  const calculateSplits = () => {
    const subtotal = currentBill.items.reduce((sum, item) => sum + item.price, 0);
    const totalWithTaxTip = subtotal + currentBill.tax + currentBill.tip;
    const taxTipPercentage = (currentBill.tax + currentBill.tip) / subtotal;

    const splits = currentBill.people.map(person => {
      let itemTotal = 0;
      let itemCount = 0;

      currentBill.items.forEach(item => {
        if (item.assignedTo.includes(person.id)) {
          itemTotal += item.price / item.assignedTo.length;
          itemCount++;
        }
      });

      const taxTipShare = itemTotal * taxTipPercentage;
      const total = itemTotal + taxTipShare;

      return {
        ...person,
        itemTotal,
        taxTipShare,
        total,
        itemCount
      };
    });

    return splits;
  };

  const splits = calculateSplits();

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return Utensils;
      case 'drinks': return Coffee;
      case 'transport': return Car;
      case 'entertainment': return Star;
      case 'utilities': return Home;
      case 'other': return Gift;
      default: return Receipt;
    }
  };

  // Handle person assignment
  const togglePersonAssignment = (itemId: string, personId: string) => {
    // Logic to update item assignments
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Animate bill splitting
  const animateSplit = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setShowBreakdown(true);
    }, 2000);
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
          Bill Splitter
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Split bills easily with beautiful animations and real-time calculations
        </motion.p>
      </div>

      {/* Bill Overview */}
      <motion.div
        className="p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/20 rounded-2xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-bold text-xl">{currentBill.title}</h4>
            <p className="text-gray-400">{currentBill.location} • {currentBill.date}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              ${currentBill.totalAmount.toFixed(2)}
            </div>
            <div className="text-gray-400 text-sm">Total Amount</div>
          </div>
        </div>

        {/* Split Method Selector */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'equal', label: 'Equal Split', icon: Users },
            { key: 'by-item', label: 'By Item', icon: Receipt },
            { key: 'percentage', label: 'Percentage', icon: Calculator },
            { key: 'custom', label: 'Custom', icon: Split }
          ].map((method) => {
            const Icon = method.icon;
            return (
              <motion.button
                key={method.key}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedMethod === method.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
                onClick={() => setSelectedMethod(method.key as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                {method.label}
              </motion.button>
            );
          })}
        </div>

        {/* People Involved */}
        <div className="mb-4">
          <div className="text-white font-medium mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            People ({currentBill.people.length})
          </div>
          <div className="flex gap-2">
            {currentBill.people.map((person, index) => (
              <motion.div
                key={person.id}
                className="relative flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2"
                  style={{ 
                    backgroundColor: `${person.color}20`,
                    borderColor: person.color
                  }}
                >
                  {person.avatar}
                </div>
                <span className="text-white text-sm font-medium">{person.name}</span>
                
                {/* Connection Status */}
                <div className={`w-2 h-2 rounded-full ${
                  person.isConnected ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bill Items */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-white font-bold text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Bill Items
          </h4>

          {currentBill.items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <IconComponent className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-white font-medium">{item.name}</h5>
                    <p className="text-gray-400 text-sm capitalize">{item.category}</p>
                  </div>
                  <div className="text-white font-bold text-lg">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Person Assignment */}
                <div className="space-y-2">
                  <div className="text-gray-400 text-sm">Shared by:</div>
                  <div className="flex gap-2">
                    {currentBill.people.map((person) => {
                      const isAssigned = item.assignedTo.includes(person.id);
                      return (
                        <motion.button
                          key={person.id}
                          className={`relative p-2 rounded-lg border-2 transition-all ${
                            isAssigned
                              ? 'border-white/30 bg-white/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                          onClick={() => togglePersonAssignment(item.id, person.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                            style={{ 
                              backgroundColor: isAssigned ? `${person.color}40` : `${person.color}20`
                            }}
                          >
                            {person.avatar}
                          </div>
                          
                          {isAssigned && (
                            <motion.div
                              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <Check className="w-2 h-2 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {/* Split Preview */}
                  <div className="text-gray-400 text-xs">
                    ${(item.price / item.assignedTo.length).toFixed(2)} per person ({item.assignedTo.length} people)
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Additional Costs */}
          <motion.div
            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: currentBill.items.length * 0.1 + 0.4 }}
          >
            <h5 className="text-white font-medium mb-3">Additional Costs</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="text-white">${currentBill.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tip</span>
                <span className="text-white">${currentBill.tip.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Split Results */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <h4 className="text-white font-bold text-lg flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Split Breakdown
            </h4>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium"
              onClick={animateSplit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isAnimating}
            >
              {isAnimating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
              ) : (
                <>
                  <Split className="w-4 h-4 inline mr-2" />
                  Calculate Split
                </>
              )}
            </motion.button>
          </div>

          {splits.map((person, index) => (
            <motion.div
              key={person.id}
              className="relative p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              style={{
                boxShadow: isAnimating ? `0 0 20px ${person.color}40` : 'none'
              }}
            >
              {/* Background Effect */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${person.color}40, transparent 70%)`
                }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg border-2"
                    style={{ 
                      backgroundColor: `${person.color}20`,
                      borderColor: person.color
                    }}
                    animate={isAnimating ? {
                      scale: [1, 1.2, 1],
                      boxShadow: [`0 0 0px ${person.color}`, `0 0 30px ${person.color}80`, `0 0 0px ${person.color}`]
                    } : {}}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  >
                    {person.avatar}
                  </motion.div>
                  <div className="flex-1">
                    <h5 className="text-white font-bold">{person.name}</h5>
                    <p className="text-gray-400 text-sm">{person.itemCount} items shared</p>
                  </div>
                  <div className="text-right">
                    <motion.div
                      className="text-2xl font-bold text-white"
                      animate={isAnimating ? {
                        scale: [1, 1.3, 1],
                        color: [person.color, '#ffffff', person.color]
                      } : {}}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    >
                      ${person.total.toFixed(2)}
                    </motion.div>
                    <div className="text-gray-400 text-sm">Total owed</div>
                  </div>
                </div>

                {/* Breakdown */}
                <AnimatePresence>
                  {showBreakdown && (
                    <motion.div
                      className="space-y-2 mb-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Items</span>
                        <span className="text-white">${person.itemTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Tax & Tip</span>
                        <span className="text-white">${person.taxTipShare.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-white/10" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Payment Status */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                    person.isConnected 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      person.isConnected ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                    {person.isConnected ? 'Connected' : 'Pending'}
                  </div>
                  
                  <motion.button
                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Request Payment
                  </motion.button>
                </div>
              </div>

              {/* Payment Animation */}
              {isAnimating && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-green-400 text-lg"
                      style={{
                        left: `${20 + (i % 3) * 30}%`,
                        top: `${30 + Math.floor(i / 3) * 30}%`
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        repeat: 1
                      }}
                    >
                      💰
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onShareBill?.(currentBill.id)}
            >
              <Share className="w-4 h-4" />
              Share Bill
            </motion.button>
            
            <motion.button
              className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSettleBill?.(currentBill.id)}
            >
              <CreditCard className="w-4 h-4" />
              Settle Bill
            </motion.button>
            
            <motion.button
              className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 15 }).map((_, i) => {
          const xSeed = `bill-particle-x-${i}`;
          const ySeed = `bill-particle-y-${i}`;
          const delaySeed = `bill-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-blue-400/20 text-lg"
              style={{
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, seededRandom(xSeed) * 30 - 15, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 6 + seededRandom(`bill-duration-${i}`) * 8,
                delay: seededRandom(delaySeed) * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['💰', '🧾', '💳', '✨', '🎯'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}