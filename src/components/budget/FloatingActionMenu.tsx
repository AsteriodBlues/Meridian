'use client';

import React from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { 
  Plus, Download, Share2, Settings, Zap, Target, 
  TrendingUp, PieChart, BarChart3, Calendar, Bell
} from 'lucide-react';

interface FloatingActionMenuProps {
  className?: string;
}

export default function FloatingActionMenu({ className = '' }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const constraintsRef = useRef(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Magnetic effect
  const magneticX = useTransform(mouseX, [-100, 100], [-12, 12]);
  const magneticY = useTransform(mouseY, [-100, 100], [-12, 12]);

  const actions = [
    { 
      id: 'quick-add', 
      label: 'Quick Add Transaction', 
      icon: Plus, 
      color: '#10b981',
      shortcut: 'Q'
    },
    { 
      id: 'export', 
      label: 'Export Report', 
      icon: Download, 
      color: '#3b82f6',
      shortcut: 'E'
    },
    { 
      id: 'share', 
      label: 'Share Insights', 
      icon: Share2, 
      color: '#8b5cf6',
      shortcut: 'S'
    },
    { 
      id: 'goals', 
      label: 'Set Goals', 
      icon: Target, 
      color: '#f59e0b',
      shortcut: 'G'
    },
    { 
      id: 'alerts', 
      label: 'Budget Alerts', 
      icon: Bell, 
      color: '#ef4444',
      shortcut: 'A'
    },
    { 
      id: 'analyze', 
      label: 'AI Analysis', 
      icon: Zap, 
      color: '#06b6d4',
      shortcut: 'I'
    }
  ];

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const buttonVariants = {
    closed: { 
      scale: 1,
      rotate: 0,
      backgroundColor: 'rgba(59, 130, 246, 0.9)',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
    },
    open: { 
      scale: 1.1,
      rotate: 45,
      backgroundColor: 'rgba(239, 68, 68, 0.9)',
      boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)'
    },
    hover: {
      scale: 1.2,
      boxShadow: '0 16px 48px rgba(59, 130, 246, 0.6)'
    }
  };

  const menuVariants = {
    closed: {
      scale: 0,
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    open: {
      scale: 1,
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const actionVariants = {
    closed: {
      scale: 0,
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    open: (i: number) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
        delay: i * 0.05
      }
    })
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${className}`} ref={constraintsRef}>
      {/* Backdrop blur when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>

      {/* Action Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0 space-y-4"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              const isHovered = hoveredAction === action.id;
              
              return (
                <motion.div
                  key={action.id}
                  className="relative flex items-center gap-4"
                  variants={actionVariants}
                  custom={index}
                  onMouseEnter={() => setHoveredAction(action.id)}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  {/* Action Label */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2 flex items-center gap-2"
                        initial={{ opacity: 0, x: 10, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <span className="text-white text-sm font-medium whitespace-nowrap">
                          {action.label}
                        </span>
                        <kbd className="text-xs bg-white/20 px-2 py-1 rounded font-mono">
                          {action.shortcut}
                        </kbd>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Button */}
                  <motion.button
                    className="w-14 h-14 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-xl relative overflow-hidden group"
                    style={{ backgroundColor: action.color }}
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: `0 12px 32px ${action.color}60`
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      console.log(`Action: ${action.id}`);
                      // Add haptic feedback
                      if ('vibrate' in navigator) {
                        navigator.vibrate(50);
                      }
                    }}
                  >
                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: action.color }}
                      animate={{
                        scale: isHovered ? [1, 1.2, 1] : 1,
                        opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5
                      }}
                      transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                    />
                    
                    {/* Icon */}
                    <motion.div
                      animate={{
                        rotate: isHovered ? [0, -10, 10, 0] : 0,
                        scale: isHovered ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-6 h-6 text-white relative z-10" />
                    </motion.div>

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                      animate={{
                        x: isHovered ? ['-100%', '100%'] : '-100%'
                      }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 relative overflow-hidden group"
        variants={buttonVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        whileHover="hover"
        onClick={() => setIsOpen(!isOpen)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          x: magneticX,
          y: magneticY
        }}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #10b981, #f59e0b, #ef4444, #3b82f6)'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner button */}
        <motion.div
          className="absolute inset-1 rounded-full bg-black/80 backdrop-blur-xl flex items-center justify-center"
          animate={{
            scale: isOpen ? 0.9 : 1
          }}
        >
          <motion.div
            animate={{
              rotate: isOpen ? 45 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Plus className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>

        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        {/* Particles */}
        <AnimatePresence>
          {isOpen && Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={`particle-${index}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: actions[index]?.color || '#3b82f6',
                left: '50%',
                top: '50%'
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((index * 60) * Math.PI / 180) * 40,
                y: Math.sin((index * 60) * Math.PI / 180) * 40,
                opacity: [0, 1, 0]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 1,
                delay: index * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </AnimatePresence>
      </motion.button>

      {/* Floating helper text */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute -top-16 right-0 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ delay: 2 }}
          >
            <span className="text-white text-xs font-medium">Quick Actions</span>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}