'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import ParticleBackground from '@/components/budget/ParticleBackground';
import { FadeUpReveal, ScaleReveal, BlurReveal, MagneticReveal } from '@/components/budget/ScrollReveal';

// Family Components
import FamilyHub from '@/components/family/FamilyHub';
import FamilyGoals from '@/components/family/FamilyGoals';
import AllowanceTracker from '@/components/family/AllowanceTracker';
import ChoreRewards from '@/components/family/ChoreRewards';
import SpendingLeaderboard from '@/components/family/SpendingLeaderboard';

// Social Components
import BillSplitter from '@/components/social/BillSplitter';
import GroupExpenses from '@/components/social/GroupExpenses';
import SocialChallenges from '@/components/social/SocialChallenges';
import AchievementCards from '@/components/social/AchievementCards';

import { 
  Users, Target, DollarSign, Star, Trophy,
  Split, MessageCircle, Zap, Award, BarChart3,
  Heart, Shield, Gift, Crown, Sparkles
} from 'lucide-react';

export default function FamilyPage() {
  const [activeView, setActiveView] = useState<'overview' | 'family-hub' | 'goals' | 'allowance' | 'chores' | 'leaderboard' | 'bill-split' | 'group-expenses' | 'challenges' | 'achievements'>('overview');

  const views = [
    { 
      key: 'overview', 
      label: 'Family & Social Hub', 
      icon: BarChart3, 
      description: 'Complete overview of family finances and social features',
      color: '#3b82f6',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      key: 'family-hub', 
      label: 'Family Hub', 
      icon: Users, 
      description: 'Interactive family member circle with stats',
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      key: 'goals', 
      label: 'Family Goals', 
      icon: Target, 
      description: 'Shared family goals with progress rings',
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      key: 'allowance', 
      label: 'Allowance Tracker', 
      icon: DollarSign, 
      description: 'Kids allowance and savings tracker',
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-blue-500'
    },
    { 
      key: 'chores', 
      label: 'Chore Rewards', 
      icon: Star, 
      description: 'Gamified chore system with rewards',
      color: '#f59e0b',
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      key: 'leaderboard', 
      label: 'Spending Leaderboard', 
      icon: Trophy, 
      description: 'Family spending competition and challenges',
      color: '#ec4899',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      key: 'bill-split', 
      label: 'Bill Splitter', 
      icon: Split, 
      description: 'Animated bill splitting with friends',
      color: '#84cc16',
      gradient: 'from-lime-500 to-green-500'
    },
    { 
      key: 'group-expenses', 
      label: 'Group Expenses', 
      icon: MessageCircle, 
      description: 'Chat and expense sharing with groups',
      color: '#10b981',
      gradient: 'from-emerald-500 to-green-500'
    },
    { 
      key: 'challenges', 
      label: 'Social Challenges', 
      icon: Zap, 
      description: 'Compete in financial challenges with friends',
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-teal-500'
    },
    { 
      key: 'achievements', 
      label: 'Achievement Cards', 
      icon: Award, 
      description: 'Beautiful shareable achievement cards',
      color: '#eab308',
      gradient: 'from-yellow-400 to-yellow-600'
    }
  ];

  const featuredViews = [
    {
      id: 'family-hub',
      title: 'Family Hub',
      description: 'Interactive circular layout with family member avatars, stats, and real-time status updates.',
      icon: Users,
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'goals',
      title: 'Family Goals',
      description: 'Collaborative goal setting with beautiful progress rings and milestone celebrations.',
      icon: Target,
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'bill-split',
      title: 'Smart Bill Splitter',
      description: 'Animated bill splitting with real-time calculations and beautiful payment flows.',
      icon: Split,
      color: '#84cc16',
      gradient: 'from-lime-500 to-green-500'
    },
    {
      id: 'challenges',
      title: 'Social Challenges',
      description: 'Compete with friends in financial challenges with rewards and achievement badges.',
      icon: Zap,
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-teal-500'
    }
  ];

  return (
    <PageLayout>
      <TimeBasedBackground>
        <ParticleBackground 
          particleCount={120}
          interactive={true}
          colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899']}
        />
        <MagneticCursor />
        
        <div className="min-h-screen">
        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <FadeUpReveal>
                <div className="max-w-7xl mx-auto px-6 py-12">
                  <div className="text-center mb-16">
                    <ScaleReveal delay={0.2}>
                      <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
                        Family & Social
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                          Financial Hub
                        </span>
                      </h1>
                    </ScaleReveal>
                    <BlurReveal delay={0.4}>
                      <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
                        Connect, collaborate, and compete with family and friends. Manage allowances, 
                        share expenses, complete challenges, and celebrate financial victories together.
                      </p>
                    </BlurReveal>
                  </div>

                  {/* Featured Tools */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {featuredViews.map((view, index) => {
                      const Icon = view.icon;
                      return (
                        <MagneticReveal key={view.id} delay={0.1 * index}>
                          <motion.div
                            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl cursor-pointer group hover:border-white/20 transition-all"
                            onClick={() => setActiveView(view.id as any)}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${view.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{view.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{view.description}</p>
                          </motion.div>
                        </MagneticReveal>
                      );
                    })}
                  </div>

                  {/* Quick Access Grid */}
                  <BlurReveal delay={0.8}>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
                      {views.slice(1).map((view) => {
                        const Icon = view.icon;
                        return (
                          <motion.button
                            key={view.key}
                            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-center hover:border-white/20 hover:bg-white/10 transition-all group"
                            onClick={() => setActiveView(view.key as any)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div 
                              className="w-8 h-8 mx-auto mb-2 rounded-lg p-1.5 group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: `${view.color}20` }}
                            >
                              <Icon className="w-full h-full" style={{ color: view.color }} />
                            </div>
                            <div className="text-white text-sm font-medium">{view.label}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </BlurReveal>

                  {/* Demo Sections */}
                  <div className="space-y-16">
                    {/* Family Features Preview */}
                    <ScaleReveal delay={1.0}>
                      <div className="p-8 bg-gradient-to-r from-green-900/30 to-blue-900/30 backdrop-blur-xl border border-green-500/20 rounded-2xl">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                            <Users className="w-6 h-6 text-green-400" />
                            Family Features
                          </h2>
                          <p className="text-gray-400">Manage family finances together with interactive tools</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {[
                            { title: 'Family Hub', desc: 'Member avatars in interactive circle', icon: Users, color: '#10b981' },
                            { title: 'Shared Goals', desc: 'Progress rings for family objectives', icon: Target, color: '#8b5cf6' },
                            { title: 'Chore Rewards', desc: 'Gamified chore system with stars', icon: Star, color: '#f59e0b' }
                          ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                              <motion.div
                                key={feature.title}
                                className="p-6 bg-white/5 rounded-xl text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 1.1 }}
                              >
                                <div 
                                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: `${feature.color}20` }}
                                >
                                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                                </div>
                                <h3 className="text-white font-bold mb-1">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </ScaleReveal>

                    {/* Social Features Preview */}
                    <BlurReveal delay={1.2}>
                      <div className="p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                            <MessageCircle className="w-6 h-6 text-purple-400" />
                            Social Features
                          </h2>
                          <p className="text-gray-400">Connect and compete with friends on financial goals</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {[
                            { title: 'Bill Splitting', desc: 'Animated expense sharing', icon: Split, color: '#84cc16' },
                            { title: 'Group Chat', desc: 'Expense sharing with chat', icon: MessageCircle, color: '#06b6d4' },
                            { title: 'Challenges', desc: 'Compete in financial goals', icon: Zap, color: '#ef4444' }
                          ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                              <motion.div
                                key={feature.title}
                                className="p-6 bg-white/5 rounded-xl text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 1.3 }}
                              >
                                <div 
                                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: `${feature.color}20` }}
                                >
                                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                                </div>
                                <h3 className="text-white font-bold mb-1">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </BlurReveal>

                    {/* Achievements Preview */}
                    <FadeUpReveal delay={1.4}>
                      <div className="p-8 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 backdrop-blur-xl border border-yellow-500/20 rounded-2xl">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                            <Award className="w-6 h-6 text-yellow-400" />
                            Achievement System
                          </h2>
                          <p className="text-gray-400">Unlock and share beautiful achievement cards</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { icon: Trophy, label: 'Savings Master', unlocked: true, rarity: 'epic' },
                            { icon: Crown, label: 'Budget King', unlocked: true, rarity: 'legendary' },
                            { icon: Star, label: 'Goal Crusher', unlocked: false, rarity: 'rare' },
                            { icon: Shield, label: 'Family Hero', unlocked: false, rarity: 'epic' }
                          ].map((badge, index) => {
                            const Icon = badge.icon;
                            const colors = {
                              rare: '#3b82f6',
                              epic: '#8b5cf6',
                              legendary: '#eab308'
                            };
                            
                            return (
                              <motion.div
                                key={badge.label}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${
                                  badge.unlocked 
                                    ? 'border-white/20 bg-white/10' 
                                    : 'border-white/10 bg-white/5 opacity-50'
                                }`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 1.5 }}
                                style={{
                                  boxShadow: badge.unlocked ? `0 0 20px ${colors[badge.rarity]}40` : 'none'
                                }}
                              >
                                <div 
                                  className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: `${colors[badge.rarity]}20` }}
                                >
                                  <Icon 
                                    className="w-6 h-6" 
                                    style={{ color: badge.unlocked ? colors[badge.rarity] : '#6b7280' }}
                                  />
                                </div>
                                <div className={`text-sm font-medium ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>
                                  {badge.label}
                                </div>
                                <div 
                                  className="text-xs mt-1 capitalize"
                                  style={{ color: colors[badge.rarity] }}
                                >
                                  {badge.rarity}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </FadeUpReveal>
                  </div>
                </div>
              </FadeUpReveal>
            </motion.div>
          )}

          {activeView === 'family-hub' && (
            <motion.div
              key="family-hub"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <FamilyHub family={[]} />
            </motion.div>
          )}

          {activeView === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <FamilyGoals goals={[]} />
            </motion.div>
          )}

          {activeView === 'allowance' && (
            <motion.div
              key="allowance"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <AllowanceTracker kids={[]} />
            </motion.div>
          )}

          {activeView === 'chores' && (
            <motion.div
              key="chores"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <ChoreRewards chores={[]} kids={[]} />
            </motion.div>
          )}

          {activeView === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <SpendingLeaderboard members={[]} challenges={[]} period="week" />
            </motion.div>
          )}

          {activeView === 'bill-split' && (
            <motion.div
              key="bill-split"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <BillSplitter />
            </motion.div>
          )}

          {activeView === 'group-expenses' && (
            <motion.div
              key="group-expenses"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <GroupExpenses 
                group={{
                  id: 'default',
                  name: 'Sample Group',
                  description: 'Sample expense group',
                  members: [],
                  totalExpenses: 0,
                  settledAmount: 0,
                  pendingAmount: 0,
                  createdAt: '2024-08-16',
                  isActive: true,
                  category: 'other'
                }}
                messages={[]}
                currentUserId="user1"
              />
            </motion.div>
          )}

          {activeView === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <SocialChallenges challenges={[]} />
            </motion.div>
          )}

          {activeView === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-6 py-8"
            >
              <AchievementCards achievements={[]} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Bar */}
        {activeView !== 'overview' && (
          <motion.div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex gap-2 p-3 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl overflow-x-auto">
              <motion.button
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors flex-shrink-0"
                onClick={() => setActiveView('overview')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="w-5 h-5" />
              </motion.button>
              
              {views.slice(1).map((view) => {
                const Icon = view.icon;
                const isActive = activeView === view.key;
                
                return (
                  <motion.button
                    key={view.key}
                    className={`p-3 rounded-xl transition-all flex-shrink-0 ${ 
                      isActive 
                        ? 'text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: isActive ? view.color : undefined
                    }}
                    onClick={() => setActiveView(view.key as any)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={view.description}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
        </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}