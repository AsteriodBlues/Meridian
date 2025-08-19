'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Page Transition Context
interface TransitionContextType {
  isTransitioning: boolean;
  transitionType: 'fade' | 'slide' | 'scale' | 'liquid';
  setTransitionType: (type: 'fade' | 'slide' | 'scale' | 'liquid') => void;
  triggerTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  transitionType: 'fade',
  setTransitionType: () => {},
  triggerTransition: () => {}
});

export const usePageTransition = () => useContext(TransitionContext);

// Page Transition Provider
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<'fade' | 'slide' | 'scale' | 'liquid'>('fade');
  const pathname = usePathname();

  const triggerTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{
      isTransitioning,
      transitionType,
      setTransitionType,
      triggerTransition
    }}>
      {children}
    </TransitionContext.Provider>
  );
}

// Shared Element Transition
export const SharedElement = ({ 
  id, 
  children, 
  className = '' 
}: { 
  id: string; 
  children: ReactNode; 
  className?: string; 
}) => {
  return (
    <motion.div
      layoutId={id}
      className={className}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.8
      }}
    >
      {children}
    </motion.div>
  );
};

// Liquid Morph Transition
export const LiquidMorph = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Liquid blob morphing effect */}
          <motion.div
            className="absolute inset-0"
            initial={{ 
              clipPath: 'circle(0% at 50% 50%)',
              backgroundColor: '#000000'
            }}
            animate={{ 
              clipPath: 'circle(150% at 50% 50%)',
              backgroundColor: ['#000000', '#1e1b4b', '#3730a3', '#1e1b4b', '#000000']
            }}
            exit={{ 
              clipPath: 'circle(0% at 50% 50%)'
            }}
            transition={{
              duration: 1,
              ease: [0.76, 0, 0.24, 1],
              backgroundColor: {
                duration: 1,
                times: [0, 0.25, 0.5, 0.75, 1]
              }
            }}
          />
          
          {/* Morphing particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: '50vw',
                y: '50vh',
                scale: 0,
                opacity: 0
              }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                delay: i * 0.05,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Loading State Component
export const LoadingState = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            {/* Liquid loader */}
            <motion.div
              className="relative w-16 h-16 mx-auto mb-6"
            >
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              
              <motion.div
                className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              <motion.div
                className="absolute inset-4 rounded-full bg-white"
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 0.5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: 'easeInOut',
                  delay: 0.5 
                }}
              />
            </motion.div>
            
            {/* Loading text */}
            <motion.p
              className="text-white text-lg font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              Loading your experience...
            </motion.p>
            
            {/* Progress dots */}
            <div className="flex justify-center gap-1 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Page Wrapper with Transitions
export const PageWrapper = ({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string; 
}) => {
  const { transitionType } = usePageTransition();
  const pathname = usePathname();

  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { x: 100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -100, opacity: 0 }
    },
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.2, opacity: 0 }
    },
    liquid: {
      initial: { 
        clipPath: 'circle(0% at 50% 100%)',
        opacity: 0 
      },
      animate: { 
        clipPath: 'circle(150% at 50% 100%)',
        opacity: 1 
      },
      exit: { 
        clipPath: 'circle(0% at 50% 0%)',
        opacity: 0 
      }
    }
  };

  const currentTransition = transitions[transitionType];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className={className}
        initial={currentTransition.initial}
        animate={currentTransition.animate}
        exit={currentTransition.exit}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Swipe Gesture Handler
export const SwipeHandler = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeUp, 
  onSwipeDown 
}: {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setCurrentPos({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const touch = e.touches[0];
    setCurrentPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);

    const deltaX = currentPos.x - startPos.x;
    const deltaY = currentPos.y - startPos.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }
  };

  return (
    <motion.div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="h-full"
      animate={{
        x: isSwiping ? (currentPos.x - startPos.x) * 0.5 : 0,
        y: isSwiping ? (currentPos.y - startPos.y) * 0.2 : 0
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {children}
    </motion.div>
  );
};

// Pull to Refresh Component
export const PullToRefresh = ({ 
  onRefresh, 
  children 
}: { 
  onRefresh: () => Promise<void>; 
  children: ReactNode; 
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const maxPull = 120;
  const triggerDistance = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, Math.min(maxPull, currentY - startY));
    setPullDistance(distance);
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= triggerDistance && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  const refreshProgress = Math.min(1, pullDistance / triggerDistance);
  
  return (
    <motion.div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
      animate={{ y: pullDistance * 0.5 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full flex flex-col items-center py-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="w-8 h-8 border-2 border-blue-500/30 rounded-full mb-2 relative"
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
            >
              <motion.div
                className="absolute inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: isRefreshing ? [0.8, 1.2, 0.8] : refreshProgress 
                }}
                transition={isRefreshing ? { 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                } : {}}
              />
            </motion.div>
            
            <motion.p
              className="text-xs text-gray-400 font-medium"
              animate={{ opacity: refreshProgress }}
            >
              {isRefreshing ? 'Refreshing...' : 
               pullDistance >= triggerDistance ? 'Release to refresh' : 'Pull to refresh'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  );
};