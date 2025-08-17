'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'avatar' | 'chart' | 'table';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

export default function LoadingSkeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animate = true
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700';
  
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const skeletonVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const getSkeletonStyle = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, index) => (
              <motion.div
                key={index}
                className={`h-4 ${baseClasses} rounded relative overflow-hidden ${className}`}
                style={{ 
                  width: index === lines - 1 ? '75%' : '100%',
                  ...getSkeletonStyle() 
                }}
                variants={animate ? skeletonVariants : undefined}
                initial={animate ? 'initial' : undefined}
                animate={animate ? 'animate' : undefined}
              >
                {animate && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                )}
              </motion.div>
            ))}
          </div>
        );

      case 'circular':
        return (
          <motion.div
            className={`rounded-full ${baseClasses} relative overflow-hidden ${className}`}
            style={{ 
              width: width || '40px', 
              height: height || '40px',
              ...getSkeletonStyle() 
            }}
            variants={animate ? skeletonVariants : undefined}
            initial={animate ? 'initial' : undefined}
            animate={animate ? 'animate' : undefined}
          >
            {animate && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            )}
          </motion.div>
        );

      case 'avatar':
        return (
          <div className="flex items-center space-x-4">
            <motion.div
              className={`w-12 h-12 rounded-full ${baseClasses} relative overflow-hidden`}
              variants={animate ? skeletonVariants : undefined}
              initial={animate ? 'initial' : undefined}
              animate={animate ? 'animate' : undefined}
            >
              {animate && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              )}
            </motion.div>
            <div className="flex-1 space-y-2">
              <motion.div
                className={`h-4 ${baseClasses} rounded relative overflow-hidden`}
                style={{ width: '60%' }}
                variants={animate ? skeletonVariants : undefined}
                initial={animate ? 'initial' : undefined}
                animate={animate ? 'animate' : undefined}
              >
                {animate && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                )}
              </motion.div>
              <motion.div
                className={`h-3 ${baseClasses} rounded relative overflow-hidden`}
                style={{ width: '40%' }}
                variants={animate ? skeletonVariants : undefined}
                initial={animate ? 'initial' : undefined}
                animate={animate ? 'animate' : undefined}
              >
                {animate && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                )}
              </motion.div>
            </div>
          </div>
        );

      case 'card':
        return (
          <motion.div
            className={`p-6 space-y-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}
            variants={animate ? skeletonVariants : undefined}
            initial={animate ? 'initial' : undefined}
            animate={animate ? 'animate' : undefined}
          >
            <motion.div
              className={`h-48 ${baseClasses} rounded-xl relative overflow-hidden`}
              variants={animate ? skeletonVariants : undefined}
              initial={animate ? 'initial' : undefined}
              animate={animate ? 'animate' : undefined}
            >
              {animate && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              )}
            </motion.div>
            <div className="space-y-2">
              <motion.div
                className={`h-6 ${baseClasses} rounded relative overflow-hidden`}
                style={{ width: '75%' }}
                variants={animate ? skeletonVariants : undefined}
                initial={animate ? 'initial' : undefined}
                animate={animate ? 'animate' : undefined}
              >
                {animate && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                )}
              </motion.div>
              <motion.div
                className={`h-4 ${baseClasses} rounded relative overflow-hidden`}
                style={{ width: '50%' }}
                variants={animate ? skeletonVariants : undefined}
                initial={animate ? 'initial' : undefined}
                animate={animate ? 'animate' : undefined}
              >
                {animate && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                )}
              </motion.div>
            </div>
          </motion.div>
        );

      case 'chart':
        return (
          <motion.div
            className={`space-y-4 ${className}`}
            variants={animate ? skeletonVariants : undefined}
            initial={animate ? 'initial' : undefined}
            animate={animate ? 'animate' : undefined}
          >
            <div className="flex justify-between items-end h-32 space-x-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <motion.div
                  key={index}
                  className={`${baseClasses} rounded-t relative overflow-hidden`}
                  style={{ 
                    width: '20px',
                    height: `${Math.random() * 80 + 20}%`
                  }}
                  variants={animate ? skeletonVariants : undefined}
                  initial={animate ? 'initial' : undefined}
                  animate={animate ? 'animate' : undefined}
                >
                  {animate && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                    />
                  )}
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between">
              {Array.from({ length: 7 }).map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-3 w-8 ${baseClasses} rounded relative overflow-hidden`}
                  variants={animate ? skeletonVariants : undefined}
                  initial={animate ? 'initial' : undefined}
                  animate={animate ? 'animate' : undefined}
                >
                  {animate && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'table':
        return (
          <motion.div
            className={`space-y-3 ${className}`}
            variants={animate ? skeletonVariants : undefined}
            initial={animate ? 'initial' : undefined}
            animate={animate ? 'animate' : undefined}
          >
            {/* Table header */}
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-4 ${baseClasses} rounded relative overflow-hidden`}
                  variants={animate ? skeletonVariants : undefined}
                  initial={animate ? 'initial' : undefined}
                  animate={animate ? 'animate' : undefined}
                >
                  {animate && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                      variants={shimmerVariants}
                      initial="initial"
                      animate="animate"
                    />
                  )}
                </motion.div>
              ))}
            </div>
            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <motion.div
                    key={colIndex}
                    className={`h-6 ${baseClasses} rounded relative overflow-hidden`}
                    style={{ 
                      width: colIndex === 3 ? '60%' : '100%'
                    }}
                    variants={animate ? skeletonVariants : undefined}
                    initial={animate ? 'initial' : undefined}
                    animate={animate ? 'animate' : undefined}
                  >
                    {animate && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                        variants={shimmerVariants}
                        initial="initial"
                        animate="animate"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        );

      default:
        return (
          <motion.div
            className={`${baseClasses} rounded relative overflow-hidden ${className}`}
            style={getSkeletonStyle()}
            variants={animate ? skeletonVariants : undefined}
            initial={animate ? 'initial' : undefined}
            animate={animate ? 'animate' : undefined}
          >
            {animate && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-500/40"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            )}
          </motion.div>
        );
    }
  };

  return renderSkeleton();
}

// Morphing skeleton that transforms into actual content
interface MorphingSkeletonProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function MorphingSkeleton({
  isLoading,
  skeleton,
  children,
  className = ''
}: MorphingSkeletonProps) {
  return (
    <motion.div
      className={className}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        key={isLoading ? 'skeleton' : 'content'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        layout
      >
        {isLoading ? skeleton : children}
      </motion.div>
    </motion.div>
  );
}