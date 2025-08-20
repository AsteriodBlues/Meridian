'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Sparkles, ArrowLeft } from 'lucide-react';

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'dropdown' | 'icon';
}

export default function LogoutButton({ className = '', variant = 'default' }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Add a beautiful animation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    signOut({ callbackUrl: '/' });
  };

  const handleClick = () => {
    if (variant === 'icon') {
      setShowConfirm(true);
    } else {
      handleLogout();
    }
  };

  if (variant === 'icon') {
    return (
      <>
        {/* Icon Button for Navigation */}
        <motion.button
          onClick={handleClick}
          className={`relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group ${className}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoggingOut}
        >
          <AnimatePresence mode="wait">
            {isLoggingOut ? (
              <motion.div
                key="loading"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="w-5 h-5"
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="logout"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <LogOut className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Sparkle effects on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${15 + (i % 3) * 20}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        </motion.button>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
            >
              <motion.div
                className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-sm w-full"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full mx-auto mb-4 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity 
                    }}
                  >
                    <LogOut className="w-8 h-8 text-red-400" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">Sign Out</h3>
                  <p className="text-gray-400 mb-6">
                    Are you sure you want to return to the landing page?
                  </p>
                  
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 px-4 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/5 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing Out...
                        </>
                      ) : (
                        <>
                          <ArrowLeft className="w-4 h-4" />
                          Sign Out
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Default button variant
  return (
    <motion.button
      onClick={handleLogout}
      className={`relative overflow-hidden flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 border border-red-500/30 rounded-xl text-white transition-all duration-300 group ${className}`}
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}
      whileTap={{ scale: 0.95 }}
      disabled={isLoggingOut}
    >
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isLoggingOut ? (
            <motion.div
              key="loading"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="flex items-center gap-2"
            >
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-sm font-medium">Returning to Landing...</span>
            </motion.div>
          ) : (
            <motion.div
              key="logout"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-medium">Sign Out</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Sparkle effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + (i * 10)}%`,
              top: `${20 + (i % 4) * 15}%`,
            }}
          >
            <Sparkles 
              className="w-2 h-2 text-white/50" 
              style={{
                animationDelay: `${i * 0.1}s`,
                animation: 'pulse 2s infinite'
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.button>
  );
}