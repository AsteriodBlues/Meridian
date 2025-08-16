'use client';

import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Home, ShoppingCart, Car, Utensils, Gamepad2, 
  Heart, GraduationCap, Plane, Coffee, AlertTriangle 
} from 'lucide-react';

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  icon: React.ElementType;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

interface BudgetCategoriesProps {
  categories: BudgetCategory[];
  onCategoryUpdate?: (id: string, newAllocated: number) => void;
  className?: string;
}

const liquidColors = {
  high: {
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
    glow: '#ef4444',
    wave: '#fecaca'
  },
  medium: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
    glow: '#f59e0b',
    wave: '#fed7aa'
  },
  low: {
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    glow: '#10b981',
    wave: '#a7f3d0'
  }
};

export default function BudgetCategories({ categories, onCategoryUpdate, className = '' }: BudgetCategoriesProps) {
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [shakeCategory, setShakeCategory] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Liquid animation phases
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const getCategoryPercentage = (category: BudgetCategory) => {
    return Math.min((category.spent / category.allocated) * 100, 100);
  };

  const isOverBudget = (category: BudgetCategory) => {
    return category.spent > category.allocated;
  };

  const handleDragEnd = (category: BudgetCategory, event: any, info: any) => {
    setDraggedCategory(null);
    
    // Calculate new allocated amount based on drag distance
    const dragDistance = info.offset.y;
    const sensitivity = 10; // Pixels per dollar
    const change = Math.round(dragDistance / sensitivity) * -1;
    const newAllocated = Math.max(0, category.allocated + change);
    
    if (newAllocated !== category.allocated && onCategoryUpdate) {
      onCategoryUpdate(category.id, newAllocated);
    }
    
    // Trigger shake if over budget after adjustment
    if (category.spent > newAllocated) {
      setShakeCategory(category.id);
      setTimeout(() => setShakeCategory(null), 600);
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {categories.map((category, index) => {
        const Icon = category.icon;
        const percentage = getCategoryPercentage(category);
        const overBudget = isOverBudget(category);
        const isDragged = draggedCategory === category.id;
        const shouldShake = shakeCategory === category.id;
        const liquidColor = liquidColors[category.priority];
        
        return (
          <motion.div
            key={category.id}
            className="relative group cursor-grab active:cursor-grabbing"
            drag="y"
            dragConstraints={{ top: -100, bottom: 100 }}
            dragElastic={0.1}
            onDragStart={() => setDraggedCategory(category.id)}
            onDragEnd={(event, info) => handleDragEnd(category, event, info)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              x: shouldShake ? [-2, 2, -2, 2, 0] : 0,
              scale: isDragged ? 1.05 : 1
            }}
            transition={{ 
              delay: index * 0.1,
              x: { duration: 0.1, repeat: shouldShake ? 3 : 0 },
              scale: { type: 'spring', stiffness: 300 }
            }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Container with glass morphism */}
            <div className="relative h-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group-hover:border-white/20 transition-all duration-300">
              
              {/* Category header */}
              <div className="absolute top-0 left-0 right-0 z-20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ 
                        background: liquidColor.gradient,
                        boxShadow: `0 0 20px ${liquidColor.glow}40`
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 20px ${liquidColor.glow}40`,
                          `0 0 30px ${liquidColor.glow}60`,
                          `0 0 20px ${liquidColor.glow}40`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <span className="text-white font-semibold text-sm">{category.name}</span>
                  </div>
                  
                  {overBudget && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                      transition={{ rotate: { duration: 0.5, repeat: Infinity } }}
                    >
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </motion.div>
                  )}
                </div>
                
                {/* Budget amounts */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Spent:</span>
                    <span className={`font-semibold ${overBudget ? 'text-red-400' : 'text-white'}`}>
                      ${category.spent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-white font-semibold">
                      ${category.allocated.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Liquid container */}
              <div className="absolute bottom-0 left-0 right-0 h-40 rounded-b-3xl overflow-hidden">
                
                {/* Background liquid base */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out"
                  style={{
                    height: `${percentage}%`,
                    background: liquidColor.gradient,
                    filter: overBudget ? 'hue-rotate(180deg) saturate(1.5)' : 'none'
                  }}
                  animate={{
                    height: `${percentage}%`,
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />

                {/* Liquid wave animation */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${percentage + 5}%`,
                    background: `radial-gradient(ellipse at center, ${liquidColor.wave}60 0%, transparent 70%)`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    scaleX: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2 + Math.sin(index) * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />

                {/* Multiple wave layers for more realistic effect */}
                {[0, 1, 2].map((waveIndex) => (
                  <motion.div
                    key={waveIndex}
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      height: `${percentage + 2}%`,
                      background: `linear-gradient(90deg, transparent 0%, ${liquidColor.wave}30 50%, transparent 100%)`,
                      transform: `translateX(${waveIndex * 20}%)`,
                    }}
                    animate={{
                      x: ['-100%', '100%'],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 3 + waveIndex * 0.5,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: waveIndex * 0.5
                    }}
                  />
                ))}

                {/* Bubble effects */}
                <AnimatePresence>
                  {Array.from({ length: 5 }).map((_, bubbleIndex) => (
                    <motion.div
                      key={`bubble-${bubbleIndex}-${animationPhase}`}
                      className="absolute rounded-full"
                      style={{
                        width: (bubbleIndex * 2 + 4) % 8 + 4,
                        height: (bubbleIndex * 2 + 4) % 8 + 4,
                        background: `${liquidColor.wave}40`,
                        left: `${(bubbleIndex * 20) % 100}%`,
                        bottom: `${(bubbleIndex * 15) % (percentage / 2)}%`,
                      }}
                      initial={{ scale: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        y: [-50, -100],
                        opacity: [0, 0.8, 0]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 2 + (bubbleIndex * 0.5) % 2,
                        delay: bubbleIndex * 0.2,
                        ease: 'easeOut'
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Percentage indicator */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="text-center">
                  <motion.div
                    className={`text-3xl font-bold ${overBudget ? 'text-red-100' : 'text-white'}`}
                    animate={{
                      scale: overBudget ? [1, 1.1, 1] : 1,
                      color: overBudget ? ['#fecaca', '#ffffff', '#fecaca'] : '#ffffff'
                    }}
                    transition={{ duration: 1, repeat: overBudget ? Infinity : 0 }}
                  >
                    {Math.round(percentage)}%
                  </motion.div>
                  <div className="text-xs text-gray-300">
                    {overBudget ? 'Over Budget' : 'Used'}
                  </div>
                </div>
              </motion.div>

              {/* Drag indicator */}
              <motion.div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="w-6 h-1 bg-white/30 rounded-full mb-1" />
                <div className="w-6 h-1 bg-white/30 rounded-full mb-1" />
                <div className="w-6 h-1 bg-white/30 rounded-full" />
              </motion.div>

              {/* Magnetic snap zones */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top snap zone */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-blue-500/20 to-transparent opacity-0"
                  animate={{
                    opacity: isDragged ? [0, 0.5, 0] : 0
                  }}
                  transition={{ duration: 1, repeat: isDragged ? Infinity : 0 }}
                />
                
                {/* Bottom snap zone */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-500/20 to-transparent opacity-0"
                  animate={{
                    opacity: isDragged ? [0, 0.5, 0] : 0
                  }}
                  transition={{ duration: 1, repeat: isDragged ? Infinity : 0, delay: 0.5 }}
                />
              </div>

              {/* Glass reflection effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)'
                }}
              />

            </div>
          </motion.div>
        );
      })}
    </div>
  );
}