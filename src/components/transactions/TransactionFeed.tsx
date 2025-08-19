'use client';

import { motion, useScroll, useTransform, useSpring, AnimatePresence, PanInfo } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Coffee, ShoppingBag, Car, Home, Zap, Heart, 
  Gamepad2, Music, Plane, Utensils, Gift, 
  ChevronRight, Trash2, Edit3, Star
} from 'lucide-react';

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  type: 'income' | 'expense';
  merchant?: string;
  icon: React.ElementType;
  color: string;
  description?: string;
  logoUrl?: string;
  brandName?: string;
}

// Global counter to ensure unique IDs
let transactionCounter = 0;

const generateTransactions = (count: number): Transaction[] => {
  const categories = [
    { name: 'Food', icon: Utensils, color: '#F59E0B' },
    { name: 'Shopping', icon: ShoppingBag, color: '#EC4899' },
    { name: 'Transport', icon: Car, color: '#3B82F6' },
    { name: 'Home', icon: Home, color: '#10B981' },
    { name: 'Entertainment', icon: Gamepad2, color: '#8B5CF6' },
    { name: 'Health', icon: Heart, color: '#EF4444' },
    { name: 'Coffee', icon: Coffee, color: '#92400E' },
    { name: 'Music', icon: Music, color: '#06B6D4' },
    { name: 'Travel', icon: Plane, color: '#7C3AED' },
    { name: 'Gifts', icon: Gift, color: '#F97316' },
  ];

  const brands = [
    // Food & Restaurants
    { 
      name: 'Starbucks', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Starbucks-Symbol.png',
      category: 'Food',
      amounts: [4.50, 5.75, 6.25, 7.80, 8.45]
    },
    { 
      name: 'McDonald\'s', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png',
      category: 'Food',
      amounts: [8.99, 12.45, 15.80, 18.75, 22.30]
    },
    { 
      name: 'Subway', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Subway-Logo.png',
      category: 'Food',
      amounts: [7.99, 10.45, 12.80, 15.25, 18.50]
    },
    { 
      name: 'Chipotle', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Chipotle-Logo.png',
      category: 'Food',
      amounts: [9.50, 11.75, 13.25, 15.80, 18.45]
    },
    { 
      name: 'Whole Foods', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/Whole-Foods-Market-Logo.png',
      category: 'Food',
      amounts: [45.67, 78.90, 123.45, 89.99, 156.78]
    },
    { 
      name: 'DoorDash', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/12/DoorDash-Logo.png',
      category: 'Food',
      amounts: [18.99, 24.75, 31.45, 28.80, 35.60]
    },
    { 
      name: 'Uber Eats', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Uber-Eats-Logo.png',
      category: 'Food',
      amounts: [16.50, 22.30, 28.75, 34.20, 41.60]
    },
    
    // Shopping & Retail
    { 
      name: 'Amazon', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png',
      category: 'Shopping',
      amounts: [25.99, 49.99, 89.99, 129.99, 199.99]
    },
    { 
      name: 'Target', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Target-Logo.png',
      category: 'Shopping',
      amounts: [34.99, 67.80, 125.45, 89.99, 156.78]
    },
    { 
      name: 'Walmart', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Walmart-Logo.png',
      category: 'Shopping',
      amounts: [25.50, 45.75, 78.90, 123.45, 189.99]
    },
    { 
      name: 'Best Buy', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Best-Buy-Logo.png',
      category: 'Shopping',
      amounts: [89.99, 149.99, 299.99, 599.99, 999.99]
    },
    { 
      name: 'Apple Store', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
      category: 'Shopping',
      amounts: [0.99, 2.99, 9.99, 99.99, 999.99]
    },
    { 
      name: 'Costco', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/09/Costco-Symbol.png',
      category: 'Shopping',
      amounts: [67.89, 145.60, 234.75, 178.99, 289.45]
    },
    { 
      name: 'Home Depot', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Home-Depot-Logo.png',
      category: 'Home',
      amounts: [23.50, 67.80, 145.25, 234.90, 456.75]
    },
    
    // Transportation
    { 
      name: 'Uber', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png',
      category: 'Transport',
      amounts: [12.50, 18.75, 24.30, 31.85, 45.60]
    },
    { 
      name: 'Lyft', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Lyft-Logo.png',
      category: 'Transport',
      amounts: [11.25, 17.80, 23.50, 29.75, 42.30]
    },
    { 
      name: 'Shell', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Shell-Logo.png',
      category: 'Transport',
      amounts: [35.50, 42.75, 55.80, 68.45, 75.20]
    },
    { 
      name: 'Exxon', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Exxon-Mobil-Logo.png',
      category: 'Transport',
      amounts: [33.25, 41.50, 54.75, 66.20, 78.90]
    },
    { 
      name: 'Tesla Supercharger', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/03/Tesla-Logo.png',
      category: 'Transport',
      amounts: [15.50, 28.75, 35.20, 42.80, 55.60]
    },
    
    // Entertainment & Subscriptions
    { 
      name: 'Netflix', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png',
      category: 'Entertainment',
      amounts: [15.99, 19.99, 22.99]
    },
    { 
      name: 'Spotify', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Spotify-Logo.png',
      category: 'Entertainment',
      amounts: [9.99, 14.99, 19.99]
    },
    { 
      name: 'Disney+', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Disney-Plus-Logo.png',
      category: 'Entertainment',
      amounts: [7.99, 13.99, 79.99]
    },
    { 
      name: 'YouTube Premium', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/YouTube-Logo.png',
      category: 'Entertainment',
      amounts: [11.99, 17.99, 22.99]
    },
    { 
      name: 'Hulu', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Hulu-Logo.png',
      category: 'Entertainment',
      amounts: [7.99, 12.99, 14.99]
    },
    
    // Health & Pharmacy
    { 
      name: 'CVS Pharmacy', 
      logo: 'https://logos-world.net/wp-content/uploads/2021/02/CVS-Pharmacy-Logo.png',
      category: 'Health',
      amounts: [15.99, 28.45, 34.99, 67.80, 89.99]
    },
    { 
      name: 'Walgreens', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Walgreens-Logo.png',
      category: 'Health',
      amounts: [12.50, 25.75, 38.90, 56.25, 78.45]
    },
    
    // Travel
    { 
      name: 'Airbnb', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Airbnb-Logo.png',
      category: 'Travel',
      amounts: [89.00, 145.50, 210.75, 289.99, 345.80]
    },
    { 
      name: 'Booking.com', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Bookingcom-Logo.png',
      category: 'Travel',
      amounts: [125.00, 189.50, 267.75, 345.99, 456.80]
    },
    { 
      name: 'Delta Airlines', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/03/Delta-Air-Lines-Logo.png',
      category: 'Travel',
      amounts: [189.00, 345.50, 567.75, 789.99, 1234.80]
    },
    
    // Coffee Shops
    { 
      name: 'Dunkin\'', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Dunkin-Donuts-Logo.png',
      category: 'Food',
      amounts: [3.50, 4.75, 6.25, 8.80, 11.45]
    },
    { 
      name: 'Tim Hortons', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/05/Tim-Hortons-Logo.png',
      category: 'Food',
      amounts: [2.99, 4.25, 5.75, 7.50, 9.99]
    }
  ];

  return Array.from({ length: count }, (_, i) => {
    const isIncome = Math.random() > 0.85;
    
    if (isIncome) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      return {
        id: `transaction-${++transactionCounter}`,
        title: 'Salary Deposit',
        category: 'Income',
        amount: Math.floor(Math.random() * 5000) + 2500,
        date: date.toLocaleDateString(),
        time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        type: 'income' as const,
        merchant: 'Direct Deposit',
        icon: categories[0].icon,
        color: '#10B981',
        description: 'Monthly salary payment',
        logoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        brandName: 'Payroll'
      };
    } else {
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const amount = brand.amounts[Math.floor(Math.random() * brand.amounts.length)];
      const categoryInfo = categories.find(c => c.name === brand.category) || categories[0];
      
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      return {
        id: `transaction-${++transactionCounter}`,
        title: `${brand.category} Purchase`,
        category: brand.category,
        amount,
        date: date.toLocaleDateString(),
        time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        type: 'expense' as const,
        merchant: brand.name,
        icon: categoryInfo.icon,
        color: categoryInfo.color,
        description: `Purchase at ${brand.name}`,
        logoUrl: brand.logo,
        brandName: brand.name
      };
    }
  });
};

interface TransactionItemProps {
  transaction: Transaction;
  index: number;
  onSwipeLeft: (id: string) => void;
  onSwipeRight: (id: string) => void;
}

const TransactionItem = ({ transaction, index, onSwipeLeft, onSwipeRight }: TransactionItemProps) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwipeAction, setIsSwipeAction] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  
  const Icon = transaction.icon;
  const isIncome = transaction.type === 'income';
  
  // Dynamic amount color based on size
  const getAmountColor = (amount: number) => {
    if (isIncome) return '#10B981'; // Always green for income
    
    if (amount < 25) return '#6B7280'; // Small amounts - gray
    if (amount < 100) return '#F59E0B'; // Medium amounts - orange
    if (amount < 300) return '#EF4444'; // Large amounts - red
    return '#DC2626'; // Very large amounts - dark red
  };

  const getAmountIntensity = (amount: number) => {
    if (isIncome) return 1;
    
    if (amount < 25) return 0.6;
    if (amount < 100) return 0.8;
    if (amount < 300) return 0.95;
    return 1;
  };

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    const threshold = 120;
    const velocity = info.velocity.x;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      setIsSwipeAction(true);
      if (info.offset.x > 0) {
        onSwipeRight(transaction.id);
      } else {
        onSwipeLeft(transaction.id);
      }
    } else {
      setDragOffset(0);
    }
  }, [transaction.id, onSwipeLeft, onSwipeRight]);

  return (
    <motion.div
      ref={itemRef}
      className="relative mb-3 overflow-hidden"
      initial={{ opacity: 0, x: -50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
      layout
    >
      {/* Swipe action backgrounds */}
      <div className="absolute inset-0 flex">
        {/* Left swipe - Delete */}
        <motion.div 
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-start pl-6"
          animate={{ 
            opacity: dragOffset > 0 ? Math.min(dragOffset / 120, 1) : 0,
            scale: dragOffset > 0 ? [1, 1.05, 1] : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ 
              rotate: dragOffset > 60 ? [0, 10, -10, 0] : 0,
              scale: dragOffset > 60 ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <Trash2 className="w-6 h-6 text-white" />
          </motion.div>
          <span className="ml-3 text-white font-medium">Delete</span>
        </motion.div>
        
        {/* Right swipe - Edit */}
        <motion.div 
          className="flex-1 bg-gradient-to-l from-blue-500 to-blue-600 flex items-center justify-end pr-6"
          animate={{ 
            opacity: dragOffset < 0 ? Math.min(Math.abs(dragOffset) / 120, 1) : 0,
            scale: dragOffset < 0 ? [1, 1.05, 1] : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="mr-3 text-white font-medium">Edit</span>
          <motion.div
            animate={{ 
              rotate: dragOffset < -60 ? [0, -10, 10, 0] : 0,
              scale: dragOffset < -60 ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <Edit3 className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Main transaction item */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        onDrag={(event, info) => setDragOffset(info.offset.x)}
        onDragEnd={handleDragEnd}
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 cursor-grab active:cursor-grabbing group hover:bg-white/10 transition-colors duration-300"
        whileHover={{ 
          scale: 1.02,
          y: -2,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
        }}
        whileTap={{ scale: 0.98 }}
        style={{ x: dragOffset }}
      >
        {/* Drag indicator */}
        <motion.div
          className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100"
          animate={{ 
            scaleY: Math.abs(dragOffset) > 10 ? [1, 1.5, 1] : 1,
            backgroundColor: dragOffset > 0 ? '#EF4444' : dragOffset < 0 ? '#3B82F6' : '#ffffff33'
          }}
          transition={{ duration: 0.2 }}
        />

        <div className="flex items-center gap-4">
          {/* Brand logo or category icon with micro-animations */}
          <motion.div
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden bg-white p-1"
              animate={{
                boxShadow: [
                  `0 0 0 2px ${transaction.color}20`,
                  `0 0 0 2px ${transaction.color}40`,
                  `0 0 0 2px ${transaction.color}20`
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {transaction.logoUrl ? (
                <motion.img
                  src={transaction.logoUrl}
                  alt={transaction.brandName || transaction.merchant}
                  className="w-8 h-8 object-contain"
                  animate={{ 
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut'
                  }}
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              
              {/* Fallback icon (hidden by default if logo exists) */}
              <motion.div
                className={transaction.logoUrl ? 'hidden' : ''}
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
              >
                <Icon 
                  className="w-6 h-6" 
                  style={{ color: transaction.color }}
                />
              </motion.div>
              
              {/* Cute sparkle effect */}
              <motion.div
                className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            </motion.div>
          </motion.div>

          {/* Transaction details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <motion.h3 
                  className="font-semibold text-white truncate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                >
                  {transaction.title}
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray-400 truncate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                >
                  {transaction.merchant} • {transaction.time}
                </motion.p>
              </div>
              
              {/* Amount with dynamic styling */}
              <div className="text-right flex-shrink-0 ml-4">
                <motion.p 
                  className="font-bold text-lg"
                  style={{ 
                    color: getAmountColor(transaction.amount),
                    opacity: getAmountIntensity(transaction.amount)
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: getAmountIntensity(transaction.amount), scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.3, type: 'spring' }}
                  whileHover={{ 
                    scale: 1.05,
                    textShadow: `0 0 20px ${getAmountColor(transaction.amount)}60`
                  }}
                >
                  {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
                </motion.p>
                <motion.p 
                  className="text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.4 }}
                >
                  {transaction.date}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Interaction indicator */}
          <motion.div
            className="flex-shrink-0 opacity-0 group-hover:opacity-100"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>

        {/* Favorite star (appears on hover) */}
        <motion.button
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 opacity-0 group-hover:opacity-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400 transition-colors" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default function TransactionFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [transactionCounter, setTransactionCounter] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll({ container: scrollRef });
  const momentum = useSpring(scrollY, { damping: 50, stiffness: 100 });
  
  // Load initial transactions
  useEffect(() => {
    const initialTransactions = generateTransactions(15);
    setTransactions(initialTransactions);
    setTransactionCounter(15);
  }, []);

  // Infinite scroll with momentum
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setLoading(true);
          
          // Simulate API call with momentum-based delay
          setTimeout(() => {
            const newTransactions = generateTransactions(10);
            setTransactions(prev => [...prev, ...newTransactions]);
            setTransactionCounter(prev => prev + 10);
            setLoading(false);
            
            // Stop loading after 100 items for demo
            if (transactionCounter > 90) {
              setHasMore(false);
            }
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, transactionCounter]);

  const handleSwipeLeft = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleSwipeRight = useCallback((id: string) => {
    // Handle edit action
    console.log('Edit transaction:', id);
  }, []);

  return (
    <div className="w-full h-[600px] flex flex-col">
      {/* Header */}
      <motion.div
        className="flex-shrink-0 bg-luxury-950/80 backdrop-blur-xl border-b border-white/10 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
        <p className="text-gray-400 text-sm">Swipe left to delete, right to edit</p>
      </motion.div>

      {/* Scrollable transaction list */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        <motion.div 
          className="py-2"
          style={{ y: useTransform(momentum, [0, 1000], [0, -50]) }}
        >
          <AnimatePresence mode="popLayout">
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                index={index}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {loading && (
            <motion.div
              className="flex items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-8 h-8 border-2 border-wisdom-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span className="ml-3 text-gray-400">Loading more transactions...</span>
            </motion.div>
          )}

          {/* Load more trigger */}
          <div ref={loadingRef} className="h-4" />

          {/* End message */}
          {!hasMore && (
            <motion.div
              className="text-center py-8 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>You've reached the end! 🎉</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}