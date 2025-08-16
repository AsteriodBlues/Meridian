'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Trophy, Star, Crown, Medal, Award, Shield,
  Heart, Share, Download, Copy, Twitter,
  Facebook, Instagram, Sparkles, Zap, Flame
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'savings' | 'budget' | 'investment' | 'social' | 'streak' | 'milestone';
  unlockedAt: string;
  progress: number;
  maxProgress: number;
  reward: string;
  shareText: string;
  color: string;
  gradient: string;
}

interface AchievementCardsProps {
  achievements: Achievement[];
  className?: string;
  onShareAchievement?: (achievementId: string, platform: string) => void;
  onDownloadCard?: (achievementId: string) => void;
}

export default function AchievementCards({ 
  achievements,
  className = '',
  onShareAchievement,
  onDownloadCard 
}: AchievementCardsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultAchievements: Achievement[] = [
    {
      id: 'first-1000',
      title: 'First $1,000 Saved',
      description: 'Congratulations! You\'ve saved your first $1,000. This is a major milestone on your financial journey!',
      icon: Trophy,
      rarity: 'rare',
      category: 'savings',
      unlockedAt: '2024-08-15',
      progress: 1000,
      maxProgress: 1000,
      reward: '$10 bonus',
      shareText: 'I just saved my first $1,000! 💰 #FinancialGoals #Saving',
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'budget-master',
      title: 'Budget Master',
      description: 'You\'ve stayed under budget for 30 consecutive days. You\'re a true budget master!',
      icon: Crown,
      rarity: 'epic',
      category: 'budget',
      unlockedAt: '2024-08-12',
      progress: 30,
      maxProgress: 30,
      reward: '$25 bonus + Premium features',
      shareText: 'I\'ve mastered my budget for 30 days straight! 👑 #BudgetMaster #FinancialDiscipline',
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'streak-legend',
      title: 'Savings Streak Legend',
      description: 'Amazing! You\'ve maintained a 100-day savings streak. You\'re a true savings legend!',
      icon: Flame,
      rarity: 'legendary',
      category: 'streak',
      unlockedAt: '2024-08-10',
      progress: 100,
      maxProgress: 100,
      reward: '$100 bonus + Exclusive badge',
      shareText: '100 days of consistent saving! I\'m officially a Savings Streak Legend! 🔥 #SavingsStreak #FinancialWin',
      color: '#ef4444',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'You\'ve helped 10 friends with their financial goals. Spreading the wealth of knowledge!',
      icon: Heart,
      rarity: 'rare',
      category: 'social',
      unlockedAt: '2024-08-08',
      progress: 10,
      maxProgress: 10,
      reward: 'Helper badge',
      shareText: 'I\'ve helped 10 friends achieve their financial goals! 💖 #FinancialFriends #Community',
      color: '#ec4899',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  const achievementData = achievements.length > 0 ? achievements : defaultAchievements;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#eab308';
      default: return '#6b7280';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return '0 0 10px rgba(107, 114, 128, 0.5)';
      case 'rare': return '0 0 20px rgba(59, 130, 246, 0.6)';
      case 'epic': return '0 0 30px rgba(139, 92, 246, 0.7)';
      case 'legendary': return '0 0 40px rgba(234, 179, 8, 0.8)';
      default: return 'none';
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
          Achievement Gallery
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Share your financial victories with beautiful achievement cards
        </motion.p>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {achievementData.map((achievement, index) => {
          const IconComponent = achievement.icon;
          const isSelected = selectedAchievement === achievement.id;
          
          return (
            <motion.div
              key={achievement.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Achievement Card */}
              <motion.div
                className={`relative p-8 rounded-3xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                  isSelected
                    ? 'border-white/30 bg-white/10 scale-105'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                onClick={() => setSelectedAchievement(isSelected ? null : achievement.id)}
                whileHover={{ y: -5 }}
                style={{
                  boxShadow: getRarityGlow(achievement.rarity),
                  background: `linear-gradient(135deg, ${achievement.color}10, transparent)`
                }}
              >
                {/* Rarity Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${achievement.color}40, transparent 70%)`
                  }}
                />

                {/* Floating Particles for Legendary */}
                {achievement.rarity === 'legendary' && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-yellow-400"
                        style={{
                          left: `${20 + (i % 4) * 20}%`,
                          top: `${20 + Math.floor(i / 4) * 20}%`,
                          fontSize: '12px'
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5],
                          rotate: [0, 180, 360]
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.2,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        <Sparkles />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className="p-4 rounded-2xl"
                      style={{ backgroundColor: `${achievement.color}20` }}
                      animate={{
                        boxShadow: [
                          `0 0 0px ${achievement.color}`,
                          `0 0 30px ${achievement.color}60`,
                          `0 0 0px ${achievement.color}`
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <IconComponent 
                        className="w-12 h-12" 
                        style={{ color: achievement.color }}
                      />
                    </motion.div>
                    
                    <div 
                      className="px-3 py-1 rounded-full text-xs font-bold border-2"
                      style={{ 
                        backgroundColor: `${getRarityColor(achievement.rarity)}20`,
                        color: getRarityColor(achievement.rarity),
                        borderColor: getRarityColor(achievement.rarity)
                      }}
                    >
                      {achievement.rarity.toUpperCase()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h4 className="text-white font-bold text-2xl mb-3">{achievement.title}</h4>
                    <p className="text-gray-300 leading-relaxed mb-4">{achievement.description}</p>
                    
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-bold">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: achievement.color }}
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, delay: index * 0.2 }}
                        />
                      </div>
                    </div>

                    {/* Reward */}
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Reward</span>
                      </div>
                      <p className="text-white text-sm">{achievement.reward}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowShareMenu(showShareMenu === achievement.id ? null : achievement.id);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Share className="w-4 h-4" />
                      Share
                    </motion.button>
                    
                    <motion.button
                      className="p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadCard?.(achievement.id);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard?.writeText(achievement.shareText);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Unlock Date */}
                  <div className="mt-4 text-center text-gray-400 text-sm">
                    Unlocked on {achievement.unlockedAt}
                  </div>
                </div>

                {/* Share Menu */}
                <AnimatePresence>
                  {showShareMenu === achievement.id && (
                    <motion.div
                      className="absolute top-full left-0 right-0 mt-2 p-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl z-20"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-white font-medium mb-3">Share on:</div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { platform: 'twitter', icon: Twitter, color: '#1da1f2', label: 'Twitter' },
                          { platform: 'facebook', icon: Facebook, color: '#4267b2', label: 'Facebook' },
                          { platform: 'instagram', icon: Instagram, color: '#e4405f', label: 'Instagram' }
                        ].map((social) => {
                          const SocialIcon = social.icon;
                          return (
                            <motion.button
                              key={social.platform}
                              className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                              onClick={() => {
                                onShareAchievement?.(achievement.id, social.platform);
                                setShowShareMenu(null);
                              }}
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
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}