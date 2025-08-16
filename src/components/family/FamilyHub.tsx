'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Users, Heart, Star, Crown, Gift, Sparkles,
  TrendingUp, DollarSign, Target, Calendar,
  Settings, Plus, Edit, Award, Shield
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  role: 'parent' | 'child' | 'teen';
  age: number;
  color: string;
  points: number;
  level: number;
  achievements: string[];
  allowance?: number;
  choresCompleted: number;
  savings: number;
  isOnline: boolean;
}

interface FamilyHubProps {
  family: FamilyMember[];
  className?: string;
  onMemberClick?: (member: FamilyMember) => void;
  onEditFamily?: () => void;
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

export default function FamilyHub({ 
  family, 
  className = '',
  onMemberClick,
  onEditFamily 
}: FamilyHubProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [centerAnimation, setCenterAnimation] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const hubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default family if none provided
  const defaultFamily: FamilyMember[] = [
    {
      id: 'dad',
      name: 'David',
      avatar: '👨‍💼',
      role: 'parent',
      age: 42,
      color: '#3b82f6',
      points: 2450,
      level: 8,
      achievements: ['Budget Master', 'Investment Pro', 'Goal Achiever'],
      choresCompleted: 0,
      savings: 45000,
      isOnline: true
    },
    {
      id: 'mom',
      name: 'Sarah',
      avatar: '👩‍💻',
      role: 'parent',
      age: 39,
      color: '#ec4899',
      points: 2890,
      level: 9,
      achievements: ['Savings Queen', 'Bill Wizard', 'Family CFO'],
      choresCompleted: 0,
      savings: 52000,
      isOnline: true
    },
    {
      id: 'teen',
      name: 'Emma',
      avatar: '👧',
      role: 'teen',
      age: 16,
      color: '#8b5cf6',
      points: 1250,
      level: 5,
      achievements: ['First Job', 'Saver Badge'],
      allowance: 50,
      choresCompleted: 12,
      savings: 850,
      isOnline: false
    },
    {
      id: 'kid',
      name: 'Alex',
      avatar: '👦',
      role: 'child',
      age: 12,
      color: '#10b981',
      points: 890,
      level: 4,
      achievements: ['Chore Champion', 'Penny Saver'],
      allowance: 25,
      choresCompleted: 18,
      savings: 320,
      isOnline: true
    },
    {
      id: 'kid2',
      name: 'Lily',
      avatar: '👧',
      role: 'child',
      age: 8,
      color: '#f59e0b',
      points: 450,
      level: 2,
      achievements: ['First Save'],
      allowance: 15,
      choresCompleted: 8,
      savings: 95,
      isOnline: true
    }
  ];

  const familyMembers = family.length > 0 ? family : defaultFamily;

  // Calculate circle positions
  const getCirclePosition = (index: number, total: number, radius = 200) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'parent': return Crown;
      case 'teen': return Star;
      case 'child': return Heart;
      default: return Users;
    }
  };

  // Get level color
  const getLevelColor = (level: number) => {
    if (level >= 8) return '#eab308';
    if (level >= 6) return '#8b5cf6';
    if (level >= 4) return '#3b82f6';
    if (level >= 2) return '#10b981';
    return '#6b7280';
  };

  // Family stats
  const familyStats = {
    totalSavings: familyMembers.reduce((sum, member) => sum + member.savings, 0),
    totalPoints: familyMembers.reduce((sum, member) => sum + member.points, 0),
    totalChores: familyMembers.reduce((sum, member) => sum + member.choresCompleted, 0),
    averageLevel: Math.round(familyMembers.reduce((sum, member) => sum + member.level, 0) / familyMembers.length),
    onlineMembers: familyMembers.filter(member => member.isOnline).length
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
          Family Hub
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Connect, share, and grow together as a family
        </motion.p>
      </div>

      {/* Family Circle Container */}
      <div className="relative" ref={hubRef}>
        {/* Main Circle Background */}
        <motion.div
          className="relative w-96 h-96 mx-auto mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/10"
            animate={{
              scale: centerAnimation ? [1, 1.05, 1] : 1,
              borderColor: centerAnimation ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)'] : 'rgba(255,255,255,0.1)'
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Inner Glow Ring */}
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm"
            animate={{
              rotate: 360
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Center Hub */}
          <motion.div
            className="absolute inset-1/3 rounded-full bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCenterAnimation(true);
              setShowStats(!showStats);
              setTimeout(() => setCenterAnimation(false), 2000);
            }}
          >
            <div className="text-center">
              <Users className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-white font-bold text-sm">Family</div>
              <div className="text-gray-400 text-xs">{familyMembers.length} members</div>
            </div>
          </motion.div>

          {/* Family Members */}
          {familyMembers.map((member, index) => {
            const position = getCirclePosition(index, familyMembers.length);
            const RoleIcon = getRoleIcon(member.role);
            const isSelected = selectedMember === member.id;
            const isHovered = hoveredMember === member.id;
            
            return (
              <motion.div
                key={member.id}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  x: position.x,
                  y: position.y
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
              >
                {/* Member Container */}
                <motion.div
                  className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredMember(member.id)}
                  onHoverEnd={() => setHoveredMember(null)}
                  onClick={() => {
                    setSelectedMember(isSelected ? null : member.id);
                    onMemberClick?.(member);
                  }}
                >
                  {/* Avatar Background */}
                  <motion.div
                    className="w-20 h-20 rounded-full p-1"
                    style={{
                      background: `linear-gradient(135deg, ${member.color}40, ${member.color}80)`
                    }}
                    animate={{
                      boxShadow: isSelected || isHovered 
                        ? `0 0 30px ${member.color}80` 
                        : `0 0 10px ${member.color}40`
                    }}
                  >
                    {/* Avatar */}
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-2xl border-2 border-white/20">
                      {member.avatar}
                    </div>
                  </motion.div>

                  {/* Online Status */}
                  {member.isOnline && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"
                      animate={{
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Role Badge */}
                  <motion.div
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 p-1 rounded-full border border-white/20"
                    style={{ backgroundColor: `${member.color}20` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.8 }}
                  >
                    <RoleIcon 
                      className="w-3 h-3" 
                      style={{ color: member.color }}
                    />
                  </motion.div>

                  {/* Level Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, ${getLevelColor(member.level)} ${(member.level / 10) * 360}deg, transparent ${(member.level / 10) * 360}deg)`
                    }}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 270, opacity: 0.6 }}
                    transition={{ delay: index * 0.1 + 1, duration: 1.5 }}
                  />

                  {/* Name Label */}
                  <motion.div
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 1.2 }}
                  >
                    <div className="text-white font-medium text-sm">{member.name}</div>
                    <div className="text-gray-400 text-xs">Level {member.level}</div>
                  </motion.div>

                  {/* Points Floating */}
                  {(isSelected || isHovered) && (
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg px-2 py-1 text-xs text-white font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {member.points} pts
                    </motion.div>
                  )}
                </motion.div>

                {/* Connection Lines to Center */}
                <motion.div
                  className="absolute left-1/2 top-1/2 origin-left h-0.5 bg-gradient-to-r from-white/20 to-transparent"
                  style={{
                    width: Math.sqrt(position.x * position.x + position.y * position.y),
                    transform: `translate(-50%, -50%) rotate(${Math.atan2(position.y, position.x)}rad)`
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isSelected || isHovered ? 1 : 0.3 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            );
          })}

          {/* Floating Particles */}
          {mounted && Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 2 * Math.PI;
            const radius = 180 + seededRandom(`particle-${i}`) * 40;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  x: x,
                  y: y
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  x: [x, x + seededRandom(`particle-drift-x-${i}`) * 20 - 10, x],
                  y: [y, y + seededRandom(`particle-drift-y-${i}`) * 20 - 10, y]
                }}
                transition={{
                  duration: 4 + seededRandom(`particle-duration-${i}`) * 4,
                  delay: seededRandom(`particle-delay-${i}`) * 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </motion.div>

        {/* Family Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              className="absolute top-0 right-0 w-64 p-6 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl"
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Family Stats
              </div>
              
              <div className="space-y-3">
                {[
                  { label: 'Total Savings', value: `$${familyStats.totalSavings.toLocaleString()}`, color: '#10b981' },
                  { label: 'Total Points', value: familyStats.totalPoints.toLocaleString(), color: '#8b5cf6' },
                  { label: 'Chores Done', value: familyStats.totalChores.toString(), color: '#f59e0b' },
                  { label: 'Avg Level', value: familyStats.averageLevel.toString(), color: '#3b82f6' },
                  { label: 'Online Now', value: `${familyStats.onlineMembers}/${familyMembers.length}`, color: '#10b981' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-gray-400 text-sm">{stat.label}</span>
                    <span 
                      className="font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Member Details */}
        <AnimatePresence>
          {selectedMember && (() => {
            const member = familyMembers.find(m => m.id === selectedMember);
            if (!member) return null;
            
            return (
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 border-white/20"
                    style={{ backgroundColor: `${member.color}20` }}
                  >
                    {member.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl">{member.name}</h4>
                    <p className="text-gray-400 capitalize">{member.role} • Level {member.level} • {member.points} points</p>
                  </div>
                  <div className="ml-auto">
                    <motion.button
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onEditFamily}
                    >
                      <Settings className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: 'Savings', value: `$${member.savings.toLocaleString()}`, icon: DollarSign },
                    { label: 'Allowance', value: member.allowance ? `$${member.allowance}` : 'N/A', icon: Gift },
                    { label: 'Chores', value: member.choresCompleted.toString(), icon: Star },
                    { label: 'Age', value: `${member.age} years`, icon: Calendar }
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        className="p-3 bg-white/5 rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm">{stat.label}</span>
                        </div>
                        <span className="text-white font-bold">{stat.value}</span>
                      </motion.div>
                    );
                  })}
                </div>

                {member.achievements.length > 0 && (
                  <div>
                    <div className="text-white font-medium mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      Recent Achievements
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement}
                          className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-yellow-400 text-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {achievement}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="flex justify-center gap-4 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEditFamily}
        >
          <Plus className="w-5 h-5" />
          Add Member
        </motion.button>
        
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-colors"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit className="w-5 h-5" />
          Edit Family
        </motion.button>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 20 }).map((_, i) => {
          const xSeed = `family-bg-x-${i}`;
          const ySeed = `family-bg-y-${i}`;
          const sizeSeed = `family-bg-size-${i}`;
          const delaySeed = `family-bg-delay-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
              style={{
                width: 1 + seededRandom(sizeSeed) * 4,
                height: 1 + seededRandom(sizeSeed) * 4,
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
                duration: 8 + seededRandom(`family-bg-duration-${i}`) * 12,
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