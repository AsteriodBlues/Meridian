'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImageProps, generateBlurDataURL } from '@/lib/performance';

export default function LazyImage({
  src,
  alt,
  placeholder,
  className = '',
  width,
  height,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [blurDataURL, setBlurDataURL] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate blur placeholder
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dataURL = placeholder || generateBlurDataURL(width || 400, height || 300);
      setBlurDataURL(dataURL);
    }
  }, [placeholder, width, height]);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      <AnimatePresence mode="wait">
        {/* Blur placeholder */}
        {(isLoading || !isInView) && (
          <motion.div
            key="placeholder"
            className="absolute inset-0 bg-gray-200"
            style={{
              backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(10px)',
              scale: 1.1
            }}
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.4, ease: 'easeOut' }
            }}
          />
        )}

        {/* Loading shimmer effect */}
        {isLoading && isInView && !hasError && (
          <motion.div
            key="shimmer"
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* Error state */}
        {hasError && (
          <motion.div
            key="error"
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              className="w-8 h-8 mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-sm mb-2">Failed to load image</span>
            <motion.button
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={handleRetry}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          </motion.div>
        )}

        {/* Actual image */}
        {isInView && !hasError && (
          <motion.img
            key="image"
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: isLoading ? 0 : 1,
              scale: isLoading ? 1.05 : 1
            }}
            transition={{ 
              duration: 0.4,
              ease: 'easeOut'
            }}
            style={{
              willChange: 'transform, opacity'
            }}
          />
        )}
      </AnimatePresence>

      {/* Loading progress indicator */}
      {isLoading && isInView && !hasError && (
        <motion.div
          className="absolute bottom-2 left-2 w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  );
}