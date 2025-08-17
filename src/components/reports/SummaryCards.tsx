'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Camera, Download, Share, Copy, Instagram, Facebook, Twitter,
  Sparkles, Star, Crown, TrendingUp, DollarSign, Target, Award,
  Calendar, Zap, Heart, Coffee, ShoppingBag, Car, Home, Palette,
  RotateCcw, Eye, Check, X, Plus, Edit, Wand2, Shuffle
} from 'lucide-react';

interface SummaryCardData {
  id: string;
  type: 'achievement' | 'milestone' | 'insight' | 'comparison' | 'goal' | 'streak';
  title: string;
  subtitle?: string;
  mainValue: string;
  secondaryValue?: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  decorativeElements?: React.ReactNode;
  metadata: {
    period: string;
    category?: string;
    trend?: 'up' | 'down' | 'stable';
    percentage?: number;
  };
}

interface SummaryCardsProps {
  cards: SummaryCardData[];
  className?: string;
  onGenerateCard?: () => void;
  onShareCard?: (cardId: string, platform: string) => void;
  onDownloadCard?: (cardId: string) => void;
  onCustomizeCard?: (cardId: string) => void;
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

export default function SummaryCards({ 
  cards,
  className = '',
  onGenerateCard,
  onShareCard,
  onDownloadCard,
  onCustomizeCard 
}: SummaryCardsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [shareMenu, setShareMenu] = useState<string | null>(null);
  const [generatingCard, setGeneratingCard] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default card data if none provided
  const defaultCards: SummaryCardData[] = [
    {
      id: 'savings-milestone',
      type: 'milestone',
      title: 'Savings Milestone',
      subtitle: 'ACHIEVEMENT UNLOCKED',
      mainValue: '$50,000',
      secondaryValue: 'saved this year',
      description: 'You\'ve officially reached your biggest savings goal! 🎉',
      icon: Crown,
      color: '#fbbf24',
      gradient: 'from-yellow-400 via-orange-400 to-red-400',
      metadata: {
        period: 'August 2024',
        category: 'savings',
        trend: 'up',
        percentage: 125
      }
    },
    {
      id: 'coffee-insight',
      type: 'insight',
      title: 'Coffee Connoisseur',
      subtitle: 'SPENDING INSIGHT',
      mainValue: '$2,847',
      secondaryValue: 'on coffee this year',
      description: 'That\'s enough to buy a really nice espresso machine! ☕',
      icon: Coffee,
      color: '#8b4513',
      gradient: 'from-amber-600 via-orange-600 to-red-600',
      metadata: {
        period: 'January - August 2024',
        category: 'food',
        trend: 'up',
        percentage: 18
      }
    },
    {
      id: 'budget-streak',
      type: 'streak',
      title: 'Budget Master',
      subtitle: 'CONSISTENCY CHAMPION',
      mainValue: '147 days',
      secondaryValue: 'under budget',
      description: 'Your longest streak yet! Keep the momentum going! 🔥',
      icon: Target,
      color: '#10b981',
      gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
      metadata: {
        period: 'Current streak',
        category: 'budget',
        trend: 'up'
      }
    },
    {
      id: 'investment-growth',
      type: 'achievement',
      title: 'Portfolio Rockstar',
      subtitle: 'INVESTMENT WIN',
      mainValue: '+23.4%',
      secondaryValue: 'portfolio growth',
      description: 'Your investments are on fire! Way above market average! 📈',
      icon: TrendingUp,
      color: '#3b82f6',
      gradient: 'from-blue-400 via-purple-400 to-indigo-400',
      metadata: {
        period: 'This year',
        category: 'investments',
        trend: 'up',
        percentage: 23.4
      }
    },
    {
      id: 'goal-comparison',
      type: 'comparison',
      title: 'Ahead of Schedule',
      subtitle: 'GOAL PROGRESS',
      mainValue: '8 months',
      secondaryValue: 'ahead of target',
      description: 'At this pace, you\'ll hit your goal way early! 🚀',
      icon: Star,
      color: '#8b5cf6',
      gradient: 'from-violet-400 via-purple-400 to-fuchsia-400',
      metadata: {
        period: 'Goal timeline',
        category: 'planning',
        trend: 'up'
      }
    },
    {
      id: 'expense-reduction',
      type: 'insight',
      title: 'Dining Optimizer',
      subtitle: 'SMART SAVER',
      mainValue: '-32%',
      secondaryValue: 'dining expenses',
      description: 'You\'ve mastered the art of eating well for less! 🍽️',
      icon: ShoppingBag,
      color: '#ef4444',
      gradient: 'from-red-400 via-pink-400 to-rose-400',
      metadata: {
        period: 'vs last year',
        category: 'food',
        trend: 'down',
        percentage: 32
      }
    }
  ];

  const cardData = cards.length > 0 ? cards : defaultCards;

  // Generate new card
  const handleGenerateCard = async () => {
    setGeneratingCard(true);
    // Simulate card generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingCard(false);
    onGenerateCard?.();
  };

  // Share card
  const handleShare = (cardId: string, platform: string) => {
    onShareCard?.(cardId, platform);
    setShareMenu(null);
  };

  // Card templates and styles
  const getCardTemplate = (card: SummaryCardData) => {
    switch (card.type) {
      case 'achievement':
        return 'achievement-template';
      case 'milestone':
        return 'milestone-template';
      case 'insight':
        return 'insight-template';
      case 'comparison':
        return 'comparison-template';
      case 'goal':
        return 'goal-template';
      case 'streak':
        return 'streak-template';
      default:
        return 'default-template';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h3 
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Instagram-Worthy Summary Cards
          </motion.h3>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Share your financial wins with beautiful, shareable cards
          </motion.p>
        </div>

        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg text-white font-medium transition-all"
          onClick={handleGenerateCard}
          disabled={generatingCard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {generatingCard ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate New Card
            </>
          )}
        </motion.button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => {
          const Icon = card.icon;
          const isSelected = selectedCard === card.id;
          const showShareMenu = shareMenu === card.id;
          
          return (
            <motion.div
              key={card.id}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Instagram Card */}
              <motion.div
                className={`relative w-full aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all ${
                  isSelected ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setSelectedCard(isSelected ? null : card.id)}
                whileHover={{ y: -5 }}
                style={{
                  boxShadow: isSelected 
                    ? `0 20px 40px ${card.color}40` 
                    : '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
                
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        left: `${seededRandom(`card-${card.id}-x-${i}`) * 100}%`,
                        top: `${seededRandom(`card-${card.id}-y-${i}`) * 100}%`
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 3 + seededRandom(`card-${card.id}-duration-${i}`) * 2,
                        repeat: Infinity,
                        delay: seededRandom(`card-${card.id}-delay-${i}`) * 3
                      }}
                    />
                  ))}
                </div>

                {/* Card Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl"
                        animate={{
                          rotate: isSelected ? [0, 5, -5, 0] : 0
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-8 h-8" />
                      </motion.div>
                      
                      {/* Type Badge */}
                      <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase backdrop-blur-xl">
                        {card.subtitle || card.type}
                      </div>
                    </div>

                    <motion.h3
                      className="text-2xl font-bold mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {card.title}
                    </motion.h3>
                  </div>

                  {/* Main Value */}
                  <div className="text-center my-8">
                    <motion.div
                      className="text-6xl font-black mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.4, 
                        type: "spring", 
                        stiffness: 100 
                      }}
                    >
                      {card.mainValue}
                    </motion.div>
                    {card.secondaryValue && (
                      <motion.div
                        className="text-lg font-medium opacity-90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                      >
                        {card.secondaryValue}
                      </motion.div>
                    )}
                  </div>

                  {/* Footer */}
                  <div>
                    <motion.p
                      className="text-sm opacity-90 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.8 }}
                    >
                      {card.description}
                    </motion.p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="opacity-70">{card.metadata.period}</span>
                      {card.metadata.trend && (
                        <div className="flex items-center gap-1">
                          {card.metadata.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                          {card.metadata.trend === 'down' && <TrendingUp className="w-3 h-3 rotate-180" />}
                          {card.metadata.percentage && (
                            <span>{card.metadata.percentage}%</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Effects */}
                  {card.type === 'milestone' && (
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  )}
                  
                  {card.type === 'streak' && (
                    <motion.div
                      className="absolute top-4 right-4"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Zap className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  )}
                </div>

                {/* Overlay Actions */}
                <motion.div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.button
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadCard?.(card.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareMenu(showShareMenu ? null : card.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomizeCard?.(card.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Palette className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Share Menu */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl z-20"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-white font-medium mb-3 text-center">Share to:</div>
                    <div className="flex gap-3">
                      {[
                        { platform: 'instagram', icon: Instagram, color: '#E4405F', label: 'Instagram' },
                        { platform: 'facebook', icon: Facebook, color: '#1877F2', label: 'Facebook' },
                        { platform: 'twitter', icon: Twitter, color: '#1DA1F2', label: 'Twitter' }
                      ].map((social) => {
                        const SocialIcon = social.icon;
                        return (
                          <motion.button
                            key={social.platform}
                            className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                            onClick={() => handleShare(card.id, social.platform)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <SocialIcon 
                              className="w-6 h-6" 
                              style={{ color: social.color }}
                            />
                            <span className="text-white text-xs">{social.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card Info */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 1 }}
              >
                <div className="text-white font-medium">{card.title}</div>
                <div className="text-gray-400 text-sm">{card.metadata.period}</div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Add New Card */}
        <motion.div
          className="aspect-square border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all group"
          onClick={handleGenerateCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: cardData.length * 0.1 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            whileHover={{ rotate: 5 }}
          >
            <Plus className="w-8 h-8 text-white" />
          </motion.div>
          <h4 className="text-white font-bold text-lg mb-2">Create New Card</h4>
          <p className="text-gray-400 text-sm px-4">
            Generate a new shareable card from your latest financial data
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Camera className="w-6 h-6 text-purple-400" />
          </div>
          <h4 className="text-white font-bold text-lg">Share Your Success</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shuffle className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-white font-medium">Auto-Generate</div>
              <div className="text-gray-400 text-sm">Create cards automatically from your data</div>
            </div>
          </motion.button>

          <motion.button
            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Palette className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-white font-medium">Custom Templates</div>
              <div className="text-gray-400 text-sm">Choose from beautiful pre-made designs</div>
            </div>
          </motion.button>

          <motion.button
            className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart className="w-5 h-5 text-pink-400" />
            <div>
              <div className="text-white font-medium">Share Stories</div>
              <div className="text-gray-400 text-sm">Inspire others with your financial journey</div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 15 }).map((_, i) => {
          const xSeed = `summary-particle-x-${i}`;
          const ySeed = `summary-particle-y-${i}`;
          const delaySeed = `summary-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-pink-400/20 text-lg"
              style={{
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, seededRandom(xSeed) * 20 - 10, 0],
                opacity: [0, 0.6, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 10 + seededRandom(`summary-duration-${i}`) * 8,
                delay: seededRandom(delaySeed) * 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['📸', '✨', '🎉', '💫', '🌟'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}