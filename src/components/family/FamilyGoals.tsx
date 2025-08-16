'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Target, Home, Car, Plane, GraduationCap, Heart,
  Plus, Edit, Check, Clock, TrendingUp, Star,
  DollarSign, Calendar, Users, Gift, Trophy,
  Sparkles, Zap, Flag, Crown
} from 'lucide-react';

interface FamilyGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'vacation' | 'home' | 'education' | 'emergency' | 'fun' | 'charity';
  contributors: {
    id: string;
    name: string;
    avatar: string;
    contribution: number;
    color: string;
  }[];
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
  icon: React.ElementType;
  color: string;
  gradient: string;
  milestones: {
    percentage: number;
    title: string;
    reached: boolean;
    date?: string;
  }[];
}

interface FamilyGoalsProps {
  goals: FamilyGoal[];
  className?: string;
  onGoalClick?: (goal: FamilyGoal) => void;
  onAddGoal?: () => void;
  onEditGoal?: (goalId: string) => void;
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

export default function FamilyGoals({ 
  goals, 
  className = '',
  onGoalClick,
  onAddGoal,
  onEditGoal 
}: FamilyGoalsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const goalsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default goals if none provided
  const defaultGoals: FamilyGoal[] = [
    {
      id: 'vacation-fund',
      title: 'Family Vacation to Hawaii',
      description: 'Save for our dream family vacation to the beautiful islands of Hawaii',
      targetAmount: 8000,
      currentAmount: 4250,
      deadline: '2024-12-15',
      category: 'vacation',
      contributors: [
        { id: 'dad', name: 'David', avatar: '👨‍💼', contribution: 2100, color: '#3b82f6' },
        { id: 'mom', name: 'Sarah', avatar: '👩‍💻', contribution: 1800, color: '#ec4899' },
        { id: 'teen', name: 'Emma', avatar: '👧', contribution: 250, color: '#8b5cf6' },
        { id: 'kid', name: 'Alex', avatar: '👦', contribution: 100, color: '#10b981' }
      ],
      isCompleted: false,
      priority: 'high',
      icon: Plane,
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-blue-500',
      milestones: [
        { percentage: 25, title: 'First Quarter', reached: true, date: '2024-03-15' },
        { percentage: 50, title: 'Halfway There!', reached: true, date: '2024-06-10' },
        { percentage: 75, title: 'Almost Ready', reached: false },
        { percentage: 100, title: 'Hawaii Here We Come!', reached: false }
      ]
    },
    {
      id: 'home-improvement',
      title: 'Kitchen Renovation',
      description: 'Upgrade our kitchen with modern appliances and beautiful countertops',
      targetAmount: 15000,
      currentAmount: 8900,
      deadline: '2024-09-30',
      category: 'home',
      contributors: [
        { id: 'dad', name: 'David', avatar: '👨‍💼', contribution: 5200, color: '#3b82f6' },
        { id: 'mom', name: 'Sarah', avatar: '👩‍💻', contribution: 3700, color: '#ec4899' }
      ],
      isCompleted: false,
      priority: 'medium',
      icon: Home,
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-500',
      milestones: [
        { percentage: 25, title: 'Planning Phase', reached: true, date: '2024-01-20' },
        { percentage: 50, title: 'Design Approved', reached: true, date: '2024-04-05' },
        { percentage: 75, title: 'Materials Ordered', reached: false },
        { percentage: 100, title: 'Dream Kitchen Complete', reached: false }
      ]
    },
    {
      id: 'education-fund',
      title: "Emma's College Fund",
      description: 'Building a solid foundation for Emma\'s future education',
      targetAmount: 50000,
      currentAmount: 22500,
      deadline: '2026-08-31',
      category: 'education',
      contributors: [
        { id: 'dad', name: 'David', avatar: '👨‍💼', contribution: 12000, color: '#3b82f6' },
        { id: 'mom', name: 'Sarah', avatar: '👩‍💻', contribution: 9500, color: '#ec4899' },
        { id: 'teen', name: 'Emma', avatar: '👧', contribution: 1000, color: '#8b5cf6' }
      ],
      isCompleted: false,
      priority: 'high',
      icon: GraduationCap,
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-indigo-500',
      milestones: [
        { percentage: 25, title: 'Good Start', reached: true, date: '2023-12-10' },
        { percentage: 50, title: 'Halfway Mark', reached: false },
        { percentage: 75, title: 'Almost There', reached: false },
        { percentage: 100, title: 'College Ready!', reached: false }
      ]
    },
    {
      id: 'emergency-fund',
      title: 'Emergency Fund',
      description: 'Building financial security for unexpected situations',
      targetAmount: 20000,
      currentAmount: 20000,
      deadline: '2024-06-01',
      category: 'emergency',
      contributors: [
        { id: 'dad', name: 'David', avatar: '👨‍💼', contribution: 12000, color: '#3b82f6' },
        { id: 'mom', name: 'Sarah', avatar: '👩‍💻', contribution: 8000, color: '#ec4899' }
      ],
      isCompleted: true,
      priority: 'high',
      icon: Target,
      color: '#10b981',
      gradient: 'from-emerald-500 to-green-600',
      milestones: [
        { percentage: 25, title: 'Safety Net Started', reached: true, date: '2023-09-15' },
        { percentage: 50, title: 'Halfway Secure', reached: true, date: '2023-12-01' },
        { percentage: 75, title: 'Almost Secure', reached: true, date: '2024-03-15' },
        { percentage: 100, title: 'Fully Protected!', reached: true, date: '2024-05-20' }
      ]
    }
  ];

  const familyGoals = goals.length > 0 ? goals : defaultGoals;

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vacation': return Plane;
      case 'home': return Home;
      case 'education': return GraduationCap;
      case 'emergency': return Target;
      case 'fun': return Star;
      case 'charity': return Heart;
      default: return Flag;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Calculate progress percentage
  const getProgress = (goal: FamilyGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  // Get days remaining
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  // Animate progress rings
  useEffect(() => {
    if (mounted) {
      setAnimationTrigger(true);
    }
  }, [mounted]);

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Family Goals
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Work together to achieve your family's dreams and aspirations
        </motion.p>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" ref={goalsRef}>
        {familyGoals.map((goal, index) => {
          const progress = getProgress(goal);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const IconComponent = goal.icon;
          const isSelected = selectedGoal === goal.id;
          const isHovered = hoveredGoal === goal.id;
          
          return (
            <motion.div
              key={goal.id}
              className={`relative p-6 rounded-2xl border-2 backdrop-blur-xl cursor-pointer transition-all overflow-hidden ${
                isSelected
                  ? 'border-white/30 bg-white/10 scale-105'
                  : goal.isCompleted
                  ? 'border-green-500/30 bg-green-500/5 hover:border-green-500/50'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              onClick={() => {
                setSelectedGoal(isSelected ? null : goal.id);
                onGoalClick?.(goal);
              }}
              onHoverStart={() => setHoveredGoal(goal.id)}
              onHoverEnd={() => setHoveredGoal(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                boxShadow: goal.isCompleted 
                  ? '0 0 30px rgba(16, 185, 129, 0.3)' 
                  : isSelected || isHovered 
                  ? `0 0 30px ${goal.color}40` 
                  : 'none'
              }}
            >
              {/* Background Gradient */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `linear-gradient(135deg, ${goal.color}40, transparent)`
                }}
              />

              {/* Completion Badge */}
              {goal.isCompleted && (
                <motion.div
                  className="absolute top-4 right-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, delay: 0.3 }}
                >
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500 rounded-full text-white text-xs font-bold">
                    <Trophy className="w-3 h-3" />
                    ACHIEVED
                  </div>
                </motion.div>
              )}

              {/* Priority Indicator */}
              <div 
                className="absolute top-4 left-4 w-3 h-3 rounded-full"
                style={{ backgroundColor: getPriorityColor(goal.priority) }}
              />

              {/* Main Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <motion.div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${goal.color}20` }}
                    animate={{
                      scale: goal.isCompleted ? [1, 1.1, 1] : 1,
                      boxShadow: goal.isCompleted 
                        ? `0 0 20px ${goal.color}60` 
                        : `0 0 10px ${goal.color}30`
                    }}
                    transition={{ duration: 2, repeat: goal.isCompleted ? Infinity : 0 }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: goal.color }}
                    />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-1">{goal.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{goal.description}</p>
                  </div>
                </div>

                {/* Progress Ring */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    {/* Background Ring */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                      />
                      
                      {/* Progress Ring */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={goal.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                        animate={{ 
                          strokeDashoffset: animationTrigger 
                            ? 2 * Math.PI * 45 * (1 - progress / 100)
                            : 2 * Math.PI * 45
                        }}
                        transition={{ duration: 2, delay: index * 0.2, ease: "easeInOut" }}
                        style={{
                          filter: goal.isCompleted ? `drop-shadow(0 0 10px ${goal.color})` : 'none'
                        }}
                      />
                    </svg>
                    
                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                        className="text-white font-bold text-xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 + 1, type: "spring", stiffness: 400 }}
                      >
                        {Math.round(progress)}%
                      </motion.div>
                      <div className="text-gray-400 text-xs">Complete</div>
                    </div>
                  </div>
                </div>

                {/* Amount Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Current</span>
                    <span className="text-white font-bold">
                      ${goal.currentAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Target</span>
                    <span style={{ color: goal.color }} className="font-bold">
                      ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Remaining</span>
                    <span className="text-gray-300 font-medium">
                      ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    {goal.isCompleted 
                      ? 'Completed!' 
                      : daysRemaining > 0 
                      ? `${daysRemaining} days left`
                      : 'Overdue'
                    }
                  </span>
                  {!goal.isCompleted && daysRemaining <= 30 && daysRemaining > 0 && (
                    <motion.div
                      className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Urgent
                    </motion.div>
                  )}
                </div>

                {/* Contributors */}
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div className="flex -space-x-2">
                    {goal.contributors.map((contributor, idx) => (
                      <motion.div
                        key={contributor.id}
                        className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-sm"
                        style={{ backgroundColor: `${contributor.color}20`, borderColor: contributor.color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 + 1.5 }}
                        title={`${contributor.name}: $${contributor.contribution.toLocaleString()}`}
                      >
                        {contributor.avatar}
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm ml-2">
                    {goal.contributors.length} contributor{goal.contributors.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    className="flex-1 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add contribution logic
                    }}
                  >
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Contribute
                  </motion.button>
                  
                  <motion.button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditGoal?.(goal.id);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Sparkle Effects for Completed Goals */}
              {goal.isCompleted && (
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
            </motion.div>
          );
        })}

        {/* Add New Goal Card */}
        <motion.div
          className="p-6 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all"
          onClick={onAddGoal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: familyGoals.length * 0.1 }}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Plus className="w-8 h-8 text-white" />
          </motion.div>
          <h4 className="text-white font-bold text-lg mb-2">Add New Goal</h4>
          <p className="text-gray-400 text-sm">Create a new family goal to work towards together</p>
        </motion.div>
      </div>

      {/* Selected Goal Details */}
      <AnimatePresence>
        {selectedGoal && (() => {
          const goal = familyGoals.find(g => g.id === selectedGoal);
          if (!goal) return null;
          
          return (
            <motion.div
              className="p-6 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-bold text-xl">Goal Milestones</h4>
                <motion.button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setSelectedGoal(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {goal.milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      milestone.reached 
                        ? 'border-green-500/30 bg-green-500/10' 
                        : 'border-white/10 bg-white/5'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {milestone.reached ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={`font-bold ${milestone.reached ? 'text-green-400' : 'text-gray-400'}`}>
                        {milestone.percentage}%
                      </span>
                    </div>
                    <h5 className={`font-medium mb-1 ${milestone.reached ? 'text-white' : 'text-gray-400'}`}>
                      {milestone.title}
                    </h5>
                    {milestone.date && (
                      <p className="text-gray-500 text-xs">{milestone.date}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 15 }).map((_, i) => {
          const xSeed = `goals-particle-x-${i}`;
          const ySeed = `goals-particle-y-${i}`;
          const sizeSeed = `goals-particle-size-${i}`;
          const delaySeed = `goals-particle-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
              style={{
                width: 2 + seededRandom(sizeSeed) * 6,
                height: 2 + seededRandom(sizeSeed) * 6,
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, seededRandom(xSeed) * 50 - 25, 0],
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 8 + seededRandom(`goals-duration-${i}`) * 12,
                delay: seededRandom(delaySeed) * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}