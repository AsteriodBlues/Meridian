'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Lightbulb, Star, TrendingUp, Shield, Clock,
  Target, DollarSign, AlertCircle, CheckCircle, Zap,
  ArrowRight, Pause, Play, RotateCcw
} from 'lucide-react';

interface CreditTip {
  id: string;
  category: string;
  title: string;
  content: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  icon: React.ElementType;
  color: string;
}

interface CreditTipsProps {
  className?: string;
  autoPlay?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
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

export default function CreditTips({ 
  className = '',
  autoPlay = true,
  speed = 'normal'
}: CreditTipsProps) {
  const [mounted, setMounted] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllTips, setShowAllTips] = useState(false);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Credit tips data
  const creditTips: CreditTip[] = [
    {
      id: 'payment-history',
      category: 'Payment History',
      title: 'Always Pay On Time',
      content: 'Payment history is the most important factor in your credit score, accounting for 35% of your total score. Set up automatic payments to ensure you never miss a due date. Even one late payment can significantly impact your score.',
      impact: 'high',
      difficulty: 'easy',
      timeframe: 'Immediate',
      icon: Clock,
      color: '#10b981'
    },
    {
      id: 'utilization',
      category: 'Credit Utilization',
      title: 'Keep Utilization Below 30%',
      content: 'Credit utilization is the second most important factor. Keep your credit card balances below 30% of your available credit limit. For the best scores, aim for under 10%. Pay down balances before your statement closes.',
      impact: 'high',
      difficulty: 'medium',
      timeframe: '1-3 months',
      icon: Target,
      color: '#3b82f6'
    },
    {
      id: 'length-of-history',
      category: 'Credit History',
      title: 'Keep Old Accounts Open',
      content: 'The length of your credit history matters. Keep your oldest credit cards open and active, even if you don\'t use them often. Make a small purchase once in a while to keep them active.',
      impact: 'medium',
      difficulty: 'easy',
      timeframe: 'Long-term',
      icon: Shield,
      color: '#8b5cf6'
    },
    {
      id: 'credit-mix',
      category: 'Credit Mix',
      title: 'Diversify Your Credit Types',
      content: 'Having different types of credit accounts (credit cards, auto loans, mortgages) can improve your score. However, only open new accounts when you need them. Don\'t rush to diversify.',
      impact: 'low',
      difficulty: 'hard',
      timeframe: '6-12 months',
      icon: Star,
      color: '#f59e0b'
    },
    {
      id: 'new-credit',
      category: 'New Credit',
      title: 'Limit Hard Inquiries',
      content: 'Avoid applying for multiple credit accounts in a short period. Each hard inquiry can temporarily lower your score. Shop for rates within a 14-45 day window for the same type of loan.',
      impact: 'medium',
      difficulty: 'easy',
      timeframe: '2 years',
      icon: AlertCircle,
      color: '#ef4444'
    },
    {
      id: 'credit-monitoring',
      category: 'Monitoring',
      title: 'Monitor Your Credit Regularly',
      content: 'Check your credit reports from all three bureaus annually for free at annualcreditreport.com. Look for errors and dispute them immediately. Consider using credit monitoring services.',
      impact: 'high',
      difficulty: 'easy',
      timeframe: 'Ongoing',
      icon: CheckCircle,
      color: '#06b6d4'
    },
    {
      id: 'debt-payoff',
      category: 'Debt Management',
      title: 'Use the Debt Snowball Method',
      content: 'Pay minimum amounts on all debts, then put extra money toward the smallest balance first. Once paid off, move to the next smallest. This builds momentum and motivation.',
      impact: 'high',
      difficulty: 'medium',
      timeframe: '6-24 months',
      icon: TrendingUp,
      color: '#84cc16'
    },
    {
      id: 'authorized-user',
      category: 'Building Credit',
      title: 'Become an Authorized User',
      content: 'Ask a family member with good credit to add you as an authorized user on their account. This can help build your credit history, especially if you\'re just starting out.',
      impact: 'medium',
      difficulty: 'easy',
      timeframe: '1-3 months',
      icon: Zap,
      color: '#ec4899'
    },
    {
      id: 'balance-transfers',
      category: 'Debt Management',
      title: 'Consider Balance Transfers Wisely',
      content: 'Balance transfer cards with 0% intro APR can help you pay down debt faster. However, have a plan to pay off the balance before the promotional rate ends. Avoid running up new debt.',
      impact: 'medium',
      difficulty: 'hard',
      timeframe: '12-21 months',
      icon: DollarSign,
      color: '#f97316'
    },
    {
      id: 'disputes',
      category: 'Credit Repair',
      title: 'Dispute Errors Promptly',
      content: 'If you find errors on your credit report, dispute them with the credit bureau and the creditor. You have the right to accurate information. Keep records of all communications.',
      impact: 'high',
      difficulty: 'medium',
      timeframe: '30-90 days',
      icon: Shield,
      color: '#6366f1'
    }
  ];

  // Speed settings
  const speedSettings = {
    slow: 80,
    normal: 50,
    fast: 20
  };

  useEffect(() => {
    setTypingSpeed(speedSettings[speed]);
  }, [speed]);

  // Typewriter effect
  useEffect(() => {
    if (!mounted || !autoPlay || isPaused) return;

    const currentTip = creditTips[currentTipIndex];
    if (!currentTip) return;

    const fullText = currentTip.content;
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, charIndex + 1));
        charIndex++;
        typewriterRef.current = setTimeout(typeNextChar, typingSpeed);
        setIsTyping(true);
      } else {
        setIsTyping(false);
        // Wait before moving to next tip
        typewriterRef.current = setTimeout(() => {
          setCurrentTipIndex((prevIndex) => (prevIndex + 1) % creditTips.length);
          setDisplayedText('');
        }, 3000);
      }
    };

    typewriterRef.current = setTimeout(typeNextChar, 500);

    return () => {
      if (typewriterRef.current) {
        clearTimeout(typewriterRef.current);
      }
    };
  }, [currentTipIndex, mounted, autoPlay, isPaused, typingSpeed]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
  };

  const resetTips = () => {
    setCurrentTipIndex(0);
    setDisplayedText('');
    setIsPaused(false);
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
  };

  const jumpToTip = (index: number) => {
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
    }
    setCurrentTipIndex(index);
    setDisplayedText('');
    setIsPaused(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const currentTip = creditTips[currentTipIndex];
  const categories = [...new Set(creditTips.map(tip => tip.category))];

  const filteredTips = selectedCategory 
    ? creditTips.filter(tip => tip.category === selectedCategory)
    : creditTips;

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Smart Credit Tips
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Personalized advice that types itself to help improve your credit score
        </motion.p>
      </div>

      {/* Controls */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/15 rounded-xl text-white transition-colors"
            onClick={togglePause}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </motion.button>
          
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/15 rounded-xl text-white transition-colors"
            onClick={resetTips}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Speed:</span>
          {(['slow', 'normal', 'fast'] as const).map((speedOption) => (
            <motion.button
              key={speedOption}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                speed === speedOption
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setTypingSpeed(speedSettings[speedOption])}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {speedOption}
            </motion.button>
          ))}
        </div>

        {/* View Toggle */}
        <motion.button
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-sm font-medium"
          onClick={() => setShowAllTips(!showAllTips)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showAllTips ? 'Show Typewriter' : 'Show All Tips'}
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!showAllTips ? (
          /* Typewriter Mode */
          <motion.div
            key="typewriter"
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Current Tip Display */}
            <div className="p-8 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${currentTip.color}40 0%, transparent 70%)`
                  }}
                />
              </div>

              {/* Header */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${currentTip.color}20` }}
                    animate={{
                      scale: isTyping ? [1, 1.05, 1] : 1,
                      boxShadow: isTyping ? [
                        'none',
                        `0 0 20px ${currentTip.color}40`,
                        'none'
                      ] : 'none'
                    }}
                    transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
                  >
                    <currentTip.icon 
                      className="w-6 h-6" 
                      style={{ color: currentTip.color }}
                    />
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-gray-400 text-sm">{currentTip.category}</div>
                    <h4 className="text-white font-bold text-xl">{currentTip.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${getImpactColor(currentTip.impact)}20`,
                        color: getImpactColor(currentTip.impact)
                      }}
                    >
                      {currentTip.impact} impact
                    </div>
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${getDifficultyColor(currentTip.difficulty)}20`,
                        color: getDifficultyColor(currentTip.difficulty)
                      }}
                    >
                      {currentTip.difficulty}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Timeframe: {currentTip.timeframe}</span>
                </div>
              </div>

              {/* Typewriter Content */}
              <div className="relative z-10">
                <div className="text-gray-300 text-lg leading-relaxed min-h-[120px]">
                  {displayedText}
                  <motion.span
                    className="inline-block w-0.5 h-6 bg-blue-400 ml-1"
                    animate={{ opacity: isTyping ? [0, 1, 0] : 0 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex items-center justify-center gap-2">
              {creditTips.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTipIndex
                      ? 'bg-blue-400 scale-125'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => jumpToTip(index)}
                  whileHover={{ scale: index === currentTipIndex ? 1.25 : 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          /* All Tips Mode */
          <motion.div
            key="all-tips"
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <motion.button
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
                onClick={() => setSelectedCategory(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All Categories
              </motion.button>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTips.map((tip, index) => {
                const IconComponent = tip.icon;
                
                return (
                  <motion.div
                    key={tip.id}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => jumpToTip(creditTips.indexOf(tip))}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div 
                        className="p-2 rounded-xl flex-shrink-0"
                        style={{ backgroundColor: `${tip.color}20` }}
                      >
                        <IconComponent 
                          className="w-5 h-5" 
                          style={{ color: tip.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-400 text-xs mb-1">{tip.category}</div>
                        <h5 className="text-white font-medium text-sm mb-2">{tip.title}</h5>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                          {tip.content}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            backgroundColor: `${getImpactColor(tip.impact)}20`,
                            color: getImpactColor(tip.impact)
                          }}
                        >
                          {tip.impact}
                        </div>
                        <div 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            backgroundColor: `${getDifficultyColor(tip.difficulty)}20`,
                            color: getDifficultyColor(tip.difficulty)
                          }}
                        >
                          {tip.difficulty}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 8 }).map((_, i) => {
          const xSeed = `tips-particle-x-${i}`;
          const ySeed = `tips-particle-y-${i}`;
          const sizeSeed = `tips-particle-size-${i}`;
          const delaySeed = `tips-particle-delay-${i}`;
          const durationSeed = `tips-particle-duration-${i}`;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: 2 + seededRandom(sizeSeed) * 8,
                height: 2 + seededRandom(sizeSeed) * 8,
                left: `${seededRandom(xSeed) * 100}%`,
                top: `${seededRandom(ySeed) * 100}%`
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, seededRandom(xSeed) * 50 - 25, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 6 + seededRandom(durationSeed) * 8,
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