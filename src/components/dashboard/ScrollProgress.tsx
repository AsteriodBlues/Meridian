'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-wisdom-500 via-trust-500 to-growth-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Side progress indicator */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-20 bg-white/20 relative overflow-hidden">
            <motion.div
              className="absolute bottom-0 w-full bg-gradient-to-t from-wisdom-500 to-trust-500"
              style={{ scaleY: scrollYProgress }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            />
          </div>
          <motion.div
            className="w-3 h-3 rounded-full bg-gradient-to-r from-wisdom-500 to-trust-500"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 0 0 rgba(168, 85, 247, 0.7)',
                '0 0 0 10px rgba(168, 85, 247, 0)',
                '0 0 0 0 rgba(168, 85, 247, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>
      </div>
    </>
  );
}