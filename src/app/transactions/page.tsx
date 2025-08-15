'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import StickyNav from '@/components/dashboard/StickyNav';
import MagneticCursor from '@/components/ui/MagneticCursor';
import TransactionFeed from '@/components/transactions/TransactionFeed';
import MorphingFAB from '@/components/transactions/MorphingFAB';

export default function TransactionsPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleAddTransaction = (transactionData: any) => {
    console.log('Adding transaction:', transactionData);
    // Here you would typically save to your backend
    setTransactions(prev => [transactionData, ...prev]);
    
    // Trigger confetti
    setShowConfetti(true);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
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
          <div className="text-center mb-8">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Transaction Symphony
            </motion.h1>
            <motion.p
              className="text-gray-400 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Experience your financial flow with fluid interactions, smart AI assistance, and delightful animations
            </motion.p>
          </div>

          {/* Stats overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">147</div>
              <div className="text-gray-400">This Month</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">$12,847</div>
              <div className="text-gray-400">Total Spent</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">$87</div>
              <div className="text-gray-400">Avg Transaction</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Transaction Feed */}
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            <TransactionFeed />
          </div>
        </motion.div>

        {/* Spacing for FAB */}
        <div className="h-32" />
      </div>

      {/* Floating Action Button */}
      <MorphingFAB onAddTransaction={handleAddTransaction} />

    </TimeBasedBackground>
  );
}