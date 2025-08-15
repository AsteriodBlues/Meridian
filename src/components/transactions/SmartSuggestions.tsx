'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Clock, TrendingUp, MapPin, Tag } from 'lucide-react';

interface Suggestion {
  id: string;
  text: string;
  amount?: number;
  category: string;
  type: 'recent' | 'predicted' | 'location' | 'pattern';
  confidence: number;
  icon: React.ElementType;
  color: string;
}

interface SmartSuggestionsProps {
  input: string;
  onSuggestionSelect: (suggestion: Suggestion) => void;
  className?: string;
}

const generateSuggestions = (input: string): Suggestion[] => {
  const allSuggestions: Suggestion[] = [
    // Recent transactions
    {
      id: 'recent-1',
      text: 'Coffee at Starbucks',
      amount: 4.50,
      category: 'Food & Drink',
      type: 'recent',
      confidence: 0.95,
      icon: Clock,
      color: '#3B82F6'
    },
    {
      id: 'recent-2',
      text: 'Groceries at Whole Foods',
      amount: 67.99,
      category: 'Groceries',
      type: 'recent',
      confidence: 0.88,
      icon: Clock,
      color: '#3B82F6'
    },
    // AI Predictions
    {
      id: 'predict-1',
      text: 'Lunch at your usual spot',
      amount: 12.50,
      category: 'Food & Drink',
      type: 'predicted',
      confidence: 0.92,
      icon: TrendingUp,
      color: '#10B981'
    },
    {
      id: 'predict-2',
      text: 'Gas station fill-up',
      amount: 45.00,
      category: 'Transportation',
      type: 'predicted',
      confidence: 0.76,
      icon: TrendingUp,
      color: '#10B981'
    },
    // Location-based
    {
      id: 'location-1',
      text: 'Target (Near your location)',
      category: 'Shopping',
      type: 'location',
      confidence: 0.83,
      icon: MapPin,
      color: '#F59E0B'
    },
    // Pattern recognition
    {
      id: 'pattern-1',
      text: 'Monthly Netflix subscription',
      amount: 15.99,
      category: 'Entertainment',
      type: 'pattern',
      confidence: 0.97,
      icon: Tag,
      color: '#8B5CF6'
    },
  ];

  if (!input.trim()) return [];

  return allSuggestions
    .filter(suggestion => 
      suggestion.text.toLowerCase().includes(input.toLowerCase()) ||
      suggestion.category.toLowerCase().includes(input.toLowerCase())
    )
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);
};

export default function SmartSuggestions({ input, onSuggestionSelect, className = '' }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (input.trim().length > 0) {
      setIsLoading(true);
      
      // Simulate AI processing delay
      timeoutRef.current = setTimeout(() => {
        const newSuggestions = generateSuggestions(input);
        setSuggestions(newSuggestions);
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [input]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recent': return 'Recent';
      case 'predicted': return 'AI Predicted';
      case 'location': return 'Nearby';
      case 'pattern': return 'Pattern';
      default: return 'Suggestion';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recent': return 'text-blue-400';
      case 'predicted': return 'text-green-400';
      case 'location': return 'text-orange-400';
      case 'pattern': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (!input.trim() && suggestions.length === 0) return null;

  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.div
                className="flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-wisdom-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
              <span className="text-wisdom-400 text-sm font-medium">AI analyzing...</span>
            </div>
          </motion.div>
        ) : suggestions.length > 0 ? (
          <motion.div
            key="suggestions"
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="p-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-wisdom-400" />
                <span className="text-sm font-medium text-wisdom-400">Smart Suggestions</span>
              </div>
            </div>

            {/* Suggestions list */}
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <motion.button
                    key={suggestion.id}
                    className="w-full p-3 text-left hover:bg-white/10 transition-colors group border-b border-white/5 last:border-b-0"
                    onClick={() => onSuggestionSelect(suggestion)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(-1)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <motion.div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${suggestion.color}20` }}
                        animate={hoveredIndex === index ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon 
                          className="w-4 h-4" 
                          style={{ color: suggestion.color }}
                        />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium truncate group-hover:text-wisdom-300 transition-colors">
                              {suggestion.text}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs font-medium ${getTypeColor(suggestion.type)}`}>
                                {getTypeLabel(suggestion.type)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {suggestion.category}
                              </span>
                            </div>
                          </div>
                          
                          {/* Amount and confidence */}
                          <div className="text-right ml-3 flex-shrink-0">
                            {suggestion.amount && (
                              <p className="text-white font-semibold">
                                ${suggestion.amount.toFixed(2)}
                              </p>
                            )}
                            {/* Confidence indicator */}
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-12 h-1 bg-gray-600 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-wisdom-500 to-trust-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${suggestion.confidence * 100}%` }}
                                  transition={{ delay: index * 0.1, duration: 0.5 }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">
                                {Math.round(suggestion.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover effect */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-wisdom-400 to-trust-400 opacity-0 group-hover:opacity-100"
                      initial={false}
                      animate={hoveredIndex === index ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                );
              })}
            </div>

            {/* Footer tip */}
            <motion.div
              className="p-3 bg-white/5 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-gray-400 text-center">
                💡 AI learns from your spending patterns
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}