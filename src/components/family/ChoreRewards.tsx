'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Star, Check, Clock, Trophy, Crown, Gift,
  Home, Car, Utensils, Shirt, Leaf, Sparkles,
  Plus, Edit, Calendar, DollarSign, Target,
  Award, Medal, Zap, Heart, Smile, Flame
} from 'lucide-react';

interface Chore {
  id: string;
  title: string;
  description: string;
  category: 'cleaning' | 'kitchen' | 'outdoor' | 'pets' | 'organization' | 'laundry';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  reward: number;
  estimatedTime: number; // in minutes
  icon: React.ElementType;
  color: string;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: string;
  dueDate?: string;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

interface Kid {
  id: string;
  name: string;
  avatar: string;
  age: number;
  totalPoints: number;
  completedChores: number;
  streakDays: number;
  level: number;
  color: string;
  badges: string[];
}

interface ChoreRewardsProps {
  chores: Chore[];
  kids: Kid[];
  className?: string;
  onChoreComplete?: (choreId: string, kidId: string) => void;
  onAddChore?: () => void;
  onEditChore?: (choreId: string) => void;
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

export default function ChoreRewards({ 
  chores, 
  kids,
  className = '',
  onChoreComplete,
  onAddChore,
  onEditChore 
}: ChoreRewardsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedChore, setSelectedChore] = useState<string | null>(null);
  const [completingChore, setCompletingChore] = useState<string | null>(null);
  const [showRewardAnimation, setShowRewardAnimation] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const choreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data if none provided
  const defaultChores: Chore[] = [
    {
      id: 'dishes',
      title: 'Load Dishwasher',
      description: 'Load dirty dishes into the dishwasher and start the cycle',
      category: 'kitchen',
      difficulty: 'easy',
      points: 10,
      reward: 2,
      estimatedTime: 15,
      icon: Utensils,
      color: '#3b82f6',
      isCompleted: false,
      dueDate: '2024-08-16',
      isRecurring: true,
      frequency: 'daily'
    },
    {
      id: 'vacuum',
      title: 'Vacuum Living Room',
      description: 'Vacuum the entire living room including under furniture',
      category: 'cleaning',
      difficulty: 'medium',
      points: 20,
      reward: 5,
      estimatedTime: 30,
      icon: Home,
      color: '#10b981',
      isCompleted: true,
      completedBy: 'emma',
      completedAt: '2024-08-15',
      isRecurring: true,
      frequency: 'weekly'
    },
    {
      id: 'laundry',
      title: 'Fold & Put Away Laundry',
      description: 'Fold clean clothes and put them away in drawers',
      category: 'laundry',
      difficulty: 'medium',
      points: 15,
      reward: 3,
      estimatedTime: 25,
      icon: Shirt,
      color: '#8b5cf6',
      isCompleted: false,
      isRecurring: true,
      frequency: 'weekly'
    },
    {
      id: 'garden',
      title: 'Water Plants',
      description: 'Water all the plants in the garden and check for pests',
      category: 'outdoor',
      difficulty: 'easy',
      points: 8,
      reward: 1.5,
      estimatedTime: 20,
      icon: Leaf,
      color: '#22c55e',
      isCompleted: false,
      dueDate: '2024-08-16',
      isRecurring: true,
      frequency: 'daily'
    },
    {
      id: 'car-wash',
      title: 'Wash Family Car',
      description: 'Wash and vacuum the family car inside and out',
      category: 'outdoor',
      difficulty: 'hard',
      points: 30,
      reward: 10,
      estimatedTime: 60,
      icon: Car,
      color: '#f59e0b',
      isCompleted: false,
      isRecurring: false
    },
    {
      id: 'organize',
      title: 'Organize Toy Room',
      description: 'Clean up and organize all toys in the playroom',
      category: 'organization',
      difficulty: 'medium',
      points: 18,
      reward: 4,
      estimatedTime: 40,
      icon: Gift,
      color: '#ec4899',
      isCompleted: true,
      completedBy: 'alex',
      completedAt: '2024-08-14',
      isRecurring: false
    }
  ];

  const defaultKids: Kid[] = [
    {
      id: 'emma',
      name: 'Emma',
      avatar: '👧',
      age: 16,
      totalPoints: 1250,
      completedChores: 47,
      streakDays: 12,
      level: 6,
      color: '#8b5cf6',
      badges: ['Streak Master', 'Cleaning Pro', 'Helper Hero']
    },
    {
      id: 'alex',
      name: 'Alex',
      avatar: '👦',
      age: 12,
      totalPoints: 890,
      completedChores: 35,
      streakDays: 8,
      level: 4,
      color: '#10b981',
      badges: ['Chore Champion', 'Organization King']
    },
    {
      id: 'lily',
      name: 'Lily',
      avatar: '👧',
      age: 8,
      totalPoints: 450,
      completedChores: 18,
      streakDays: 3,
      level: 2,
      color: '#f59e0b',
      badges: ['First Helper']
    }
  ];

  const choreData = chores.length > 0 ? chores : defaultChores;
  const kidsData = kids.length > 0 ? kids : defaultKids;

  // Filter chores
  const filteredChores = choreData.filter(chore => {
    if (filter === 'pending') return !chore.isCompleted;
    if (filter === 'completed') return chore.isCompleted;
    return true;
  });

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cleaning': return Home;
      case 'kitchen': return Utensils;
      case 'outdoor': return Leaf;
      case 'pets': return Heart;
      case 'organization': return Gift;
      case 'laundry': return Shirt;
      default: return Star;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Handle chore completion
  const handleChoreComplete = async (choreId: string, kidId: string) => {
    setCompletingChore(choreId);
    
    // Animate completion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowRewardAnimation(choreId);
    onChoreComplete?.(choreId, kidId);
    
    // Clear animations
    setTimeout(() => {
      setCompletingChore(null);
      setShowRewardAnimation(null);
    }, 2000);
  };

  // Get kid by ID
  const getKidById = (kidId: string) => {
    return kidsData.find(kid => kid.id === kidId);
  };

  // Generate floating stars
  const generateStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 2 * Math.PI;
      const radius = 30 + Math.random() * 20;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        delay: i * 0.1
      };
    });
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
          Chore Rewards System
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Complete chores to earn points, rewards, and achievement badges
        </motion.p>
      </div>

      {/* Kids Leaderboard */}
      <motion.div
        className="mb-8 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Chore Champions
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kidsData
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((kid, index) => (
              <motion.div
                key={kid.id}
                className="p-4 bg-white/5 rounded-xl border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {index === 0 && <Crown className="w-5 h-5 text-yellow-400" />}
                  {index === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                  {index === 2 && <Award className="w-5 h-5 text-orange-400" />}
                  
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                    style={{ 
                      backgroundColor: `${kid.color}20`,
                      borderColor: kid.color
                    }}
                  >
                    {kid.avatar}
                  </div>
                  <div>
                    <div className="text-white font-bold">{kid.name}</div>
                    <div className="text-gray-400 text-sm">Level {kid.level}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Points</span>
                    <span className="text-yellow-400 font-bold">{kid.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Chores Done</span>
                    <span className="text-white font-bold">{kid.completedChores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Streak</span>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span className="text-orange-400 font-bold">{kid.streakDays} days</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { key: 'all', label: 'All Chores', count: choreData.length },
          { key: 'pending', label: 'Pending', count: choreData.filter(c => !c.isCompleted).length },
          { key: 'completed', label: 'Completed', count: choreData.filter(c => c.isCompleted).length }
        ].map((tab) => (
          <motion.button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab.key
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            onClick={() => setFilter(tab.key as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label} ({tab.count})
          </motion.button>
        ))}
      </motion.div>

      {/* Chores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" ref={choreRef}>
        {filteredChores.map((chore, index) => {
          const IconComponent = chore.icon;
          const CategoryIcon = getCategoryIcon(chore.category);
          const isSelected = selectedChore === chore.id;
          const isCompleting = completingChore === chore.id;
          const showReward = showRewardAnimation === chore.id;
          const completedKid = chore.completedBy ? getKidById(chore.completedBy) : null;
          
          return (
            <motion.div
              key={chore.id}
              className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                chore.isCompleted
                  ? 'border-green-500/30 bg-green-500/5'
                  : isSelected
                  ? 'border-white/30 bg-white/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => setSelectedChore(isSelected ? null : chore.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              style={{
                boxShadow: chore.isCompleted 
                  ? '0 0 20px rgba(16, 185, 129, 0.3)' 
                  : isSelected 
                  ? `0 0 30px ${chore.color}40` 
                  : 'none'
              }}
            >
              {/* Background */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${chore.color}40, transparent 70%)`
                }}
              />

              {/* Completion Badge */}
              {chore.isCompleted && (
                <motion.div
                  className="absolute top-4 right-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500 rounded-full text-white text-xs font-bold">
                    <Check className="w-3 h-3" />
                    DONE
                  </div>
                </motion.div>
              )}

              {/* Difficulty Badge */}
              <div 
                className="absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-bold"
                style={{ 
                  backgroundColor: `${getDifficultyColor(chore.difficulty)}20`,
                  color: getDifficultyColor(chore.difficulty)
                }}
              >
                {chore.difficulty.toUpperCase()}
              </div>

              {/* Main Content */}
              <div className="relative z-10 mt-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${chore.color}20` }}
                    animate={{
                      scale: isCompleting ? [1, 1.2, 1] : 1,
                      rotate: isCompleting ? [0, 360] : 0
                    }}
                    transition={{ duration: 1 }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: chore.color }}
                    />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h4 className={`font-bold text-lg mb-1 ${chore.isCompleted ? 'text-green-400' : 'text-white'}`}>
                      {chore.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {chore.description}
                    </p>
                  </div>
                </div>

                {/* Rewards Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg text-center">
                    <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                    <div className="text-yellow-400 font-bold text-sm">{chore.points} pts</div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg text-center">
                    <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <div className="text-green-400 font-bold text-sm">${chore.reward}</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400">{chore.estimatedTime} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CategoryIcon className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400 capitalize">{chore.category}</span>
                  </div>
                  {chore.dueDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400">Due: {chore.dueDate}</span>
                    </div>
                  )}
                </div>

                {/* Completed By */}
                {chore.isCompleted && completedKid && (
                  <motion.div
                    className="flex items-center gap-2 mb-4 p-2 bg-green-500/10 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${completedKid.color}20` }}
                    >
                      {completedKid.avatar}
                    </div>
                    <span className="text-green-400 text-sm font-medium">
                      Completed by {completedKid.name}
                    </span>
                    <div className="ml-auto text-green-400 text-xs">
                      {chore.completedAt}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                {!chore.isCompleted && (
                  <div className="space-y-2">
                    <div className="text-gray-400 text-sm mb-2">Who's doing this chore?</div>
                    <div className="flex gap-2">
                      {kidsData.map((kid) => (
                        <motion.button
                          key={kid.id}
                          className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChoreComplete(chore.id, kid.id);
                          }}
                          disabled={isCompleting}
                        >
                          <span>{kid.avatar}</span>
                          <span>{kid.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edit Button */}
                <motion.button
                  className="absolute bottom-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditChore?.(chore.id);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Completion Stars Animation */}
              {isCompleting && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {generateStars(8).map((star, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-400 text-xl"
                      style={{
                        left: '50%',
                        top: '50%',
                        x: star.x,
                        y: star.y
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: star.delay
                      }}
                    >
                      <Star />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Reward Animation */}
              {showReward && (
                <motion.div
                  className="absolute inset-0 pointer-events-none flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="text-center p-4 bg-yellow-500/20 border-2 border-yellow-400 rounded-xl"
                    animate={{
                      scale: [0, 1.2, 1],
                      borderColor: ['#fbbf24', '#ffffff', '#fbbf24']
                    }}
                    transition={{ duration: 1 }}
                  >
                    <div className="text-yellow-400 text-2xl font-bold mb-1">
                      +{chore.points} ⭐
                    </div>
                    <div className="text-green-400 text-lg font-bold">
                      +${chore.reward} 💰
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Sparkle Effects for Completed Chores */}
              {chore.isCompleted && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-400/60"
                      style={{
                        left: `${20 + (i % 3) * 30}%`,
                        top: `${20 + Math.floor(i / 3) * 30}%`,
                        fontSize: '12px'
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 4
                      }}
                    >
                      <Sparkles />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Add New Chore Card */}
        <motion.div
          className="p-6 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all"
          onClick={onAddChore}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filteredChores.length * 0.05 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Plus className="w-8 h-8 text-white" />
          </motion.div>
          <h4 className="text-white font-bold text-lg mb-2">Add New Chore</h4>
          <p className="text-gray-400 text-sm">Create a new chore with rewards and points</p>
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 25 }).map((_, i) => {
          const xSeed = `chore-particle-x-${i}`;
          const ySeed = `chore-particle-y-${i}`;
          const delaySeed = `chore-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute text-yellow-400/20 text-lg"
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
                duration: 6 + seededRandom(`chore-duration-${i}`) * 8,
                delay: seededRandom(delaySeed) * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {['⭐', '💰', '🏆', '👑', '🎯'][i % 5]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}