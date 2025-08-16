'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Trophy, Target, Users, Star, Crown, Flame,
  Zap, Clock, Calendar, Gift, Plus, Share,
  ThumbsUp, MessageCircle, Award, Shield
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'savings' | 'spending' | 'budget' | 'streak' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  progress: number;
  isJoined: boolean;
  isCompleted: boolean;
  icon: React.ElementType;
  color: string;
  createdBy: string;
  endDate: string;
}

interface SocialChallengesProps {
  challenges: Challenge[];
  className?: string;
  onJoinChallenge?: (challengeId: string) => void;
  onCreateChallenge?: () => void;
  onShareChallenge?: (challengeId: string) => void;
}

export default function SocialChallenges({ 
  challenges,
  className = '',
  onJoinChallenge,
  onCreateChallenge,
  onShareChallenge 
}: SocialChallengesProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'joined' | 'available'>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultChallenges: Challenge[] = [
    {
      id: 'savings-streak',
      title: 'Save $10 Every Day',
      description: 'Build a daily savings habit by saving at least $10 every day for 30 days',
      type: 'savings',
      difficulty: 'medium',
      reward: '$50 bonus + Savings Master badge',
      duration: '30 days',
      participants: 47,
      maxParticipants: 100,
      progress: 65,
      isJoined: true,
      isCompleted: false,
      icon: Flame,
      color: '#ef4444',
      createdBy: 'Meridian Team',
      endDate: '2024-09-15'
    },
    {
      id: 'budget-master',
      title: 'Under Budget Champion',
      description: 'Stay under your weekly budget for 4 consecutive weeks',
      type: 'budget',
      difficulty: 'hard',
      reward: 'Budget Master badge + $100 reward',
      duration: '4 weeks',
      participants: 23,
      maxParticipants: 50,
      progress: 40,
      isJoined: false,
      isCompleted: false,
      icon: Target,
      color: '#10b981',
      createdBy: 'Budget Pros Community',
      endDate: '2024-09-20'
    },
    {
      id: 'no-spend',
      title: 'No-Spend September',
      description: 'Challenge yourself to only spend on essentials for the entire month',
      type: 'spending',
      difficulty: 'hard',
      reward: 'Minimalist Master badge + $200 reward',
      duration: '30 days',
      participants: 156,
      maxParticipants: 200,
      progress: 25,
      isJoined: true,
      isCompleted: false,
      icon: Shield,
      color: '#8b5cf6',
      createdBy: 'Minimalist Living',
      endDate: '2024-09-30'
    }
  ];

  const challengeData = challenges.length > 0 ? challenges : defaultChallenges;
  
  const filteredChallenges = challengeData.filter(challenge => {
    if (filter === 'joined') return challenge.isJoined;
    if (filter === 'available') return !challenge.isJoined && !challenge.isCompleted;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
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
          Social Challenges
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Join challenges with friends and compete for rewards and badges
        </motion.p>
      </div>

      {/* Filters */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { key: 'all', label: 'All Challenges' },
          { key: 'joined', label: 'Joined' },
          { key: 'available', label: 'Available' }
        ].map((filterOption) => (
          <motion.button
            key={filterOption.key}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === filterOption.key
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            onClick={() => setFilter(filterOption.key as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filterOption.label}
          </motion.button>
        ))}
        
        <motion.button
          className="ml-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium"
          onClick={onCreateChallenge}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Create Challenge
        </motion.button>
      </motion.div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge, index) => {
          const IconComponent = challenge.icon;
          const isSelected = selectedChallenge === challenge.id;
          
          return (
            <motion.div
              key={challenge.id}
              className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                challenge.isCompleted
                  ? 'border-green-500/30 bg-green-500/5'
                  : challenge.isJoined
                  ? 'border-blue-500/30 bg-blue-500/5'
                  : isSelected
                  ? 'border-white/30 bg-white/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => setSelectedChallenge(isSelected ? null : challenge.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                boxShadow: challenge.isJoined 
                  ? `0 0 30px ${challenge.color}40` 
                  : isSelected 
                  ? `0 0 30px ${challenge.color}40`
                  : 'none'
              }}
            >
              {/* Background */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${challenge.color}40, transparent 70%)`
                }}
              />

              {/* Header */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${challenge.color}20` }}
                    animate={{
                      boxShadow: challenge.isJoined 
                        ? [`0 0 0px ${challenge.color}`, `0 0 20px ${challenge.color}60`, `0 0 0px ${challenge.color}`]
                        : `0 0 10px ${challenge.color}30`
                    }}
                    transition={{ duration: 2, repeat: challenge.isJoined ? Infinity : 0 }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: challenge.color }}
                    />
                  </motion.div>
                  
                  <div className="flex gap-2">
                    {challenge.isJoined && (
                      <div className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold">
                        JOINED
                      </div>
                    )}
                    {challenge.isCompleted && (
                      <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-bold">
                        COMPLETED
                      </div>
                    )}
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{ 
                        backgroundColor: `${getDifficultyColor(challenge.difficulty)}20`,
                        color: getDifficultyColor(challenge.difficulty)
                      }}
                    >
                      {challenge.difficulty.toUpperCase()}
                    </div>
                  </div>
                </div>

                <h4 className="text-white font-bold text-lg mb-2">{challenge.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{challenge.description}</p>

                {/* Progress */}
                {challenge.isJoined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Your Progress</span>
                      <span className="text-white font-bold">{challenge.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: challenge.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${challenge.progress}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg text-center">
                    <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <div className="text-white font-bold text-sm">
                      {challenge.participants}/{challenge.maxParticipants}
                    </div>
                    <div className="text-gray-400 text-xs">Participants</div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg text-center">
                    <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <div className="text-white font-bold text-sm">{challenge.duration}</div>
                    <div className="text-gray-400 text-xs">Duration</div>
                  </div>
                </div>

                {/* Reward */}
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Gift className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">Reward</span>
                  </div>
                  <p className="text-white text-sm">{challenge.reward}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!challenge.isJoined && !challenge.isCompleted && (
                    <motion.button
                      className="flex-1 p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onJoinChallenge?.(challenge.id);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Join Challenge
                    </motion.button>
                  )}
                  
                  <motion.button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareChallenge?.(challenge.id);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Created By */}
                <div className="mt-3 text-gray-400 text-xs">
                  Created by {challenge.createdBy} • Ends {challenge.endDate}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}