'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check, Sparkles, Heart, Star, Zap } from 'lucide-react';

interface ConfettiSuccessProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'heart' | 'star';
  velocity: { x: number; y: number };
  gravity: number;
  life: number;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F06292', '#AED581', '#FFB74D'
];

const shapes = ['circle', 'square', 'triangle', 'heart', 'star'] as const;

const generateParticles = (count: number): ConfettiParticle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: -50,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.8,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    velocity: {
      x: (Math.random() - 0.5) * 8,
      y: Math.random() * 3 + 2,
    },
    gravity: 0.1 + Math.random() * 0.1,
    life: 1,
  }));
};

const ParticleShape = ({ particle }: { particle: ConfettiParticle }) => {
  const baseProps = {
    className: "absolute",
    style: {
      left: particle.x,
      top: particle.y,
      transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
      color: particle.color,
      opacity: particle.life,
    }
  };

  switch (particle.shape) {
    case 'circle':
      return (
        <div
          {...baseProps}
          style={{
            ...baseProps.style,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: particle.color,
          }}
        />
      );
    case 'square':
      return (
        <div
          {...baseProps}
          style={{
            ...baseProps.style,
            width: 8,
            height: 8,
            backgroundColor: particle.color,
          }}
        />
      );
    case 'triangle':
      return (
        <div
          {...baseProps}
          style={{
            ...baseProps.style,
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: `8px solid ${particle.color}`,
          }}
        />
      );
    case 'heart':
      return <Heart {...baseProps} className={`${baseProps.className} w-3 h-3`} fill={particle.color} />;
    case 'star':
      return <Star {...baseProps} className={`${baseProps.className} w-3 h-3`} fill={particle.color} />;
    default:
      return null;
  }
};

export default function ConfettiSuccess({ 
  isVisible, 
  title = "Success!", 
  message = "Transaction added successfully",
  onComplete,
  duration = 3000 
}: ConfettiSuccessProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Generate initial burst of confetti
      setParticles(generateParticles(50));
      
      // Show message after brief delay
      setTimeout(() => setShowMessage(true), 300);
      
      // Continue generating particles for a while
      const particleInterval = setInterval(() => {
        setParticles(prev => [...prev, ...generateParticles(10)]);
      }, 200);

      // Stop generating new particles after 1 second
      setTimeout(() => clearInterval(particleInterval), 1000);

      // Cleanup after duration
      const cleanup = setTimeout(() => {
        setParticles([]);
        setShowMessage(false);
        onComplete?.();
      }, duration);

      return () => {
        clearInterval(particleInterval);
        clearTimeout(cleanup);
      };
    }
  }, [isVisible, duration, onComplete]);

  // Animate existing particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animationFrame = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          velocity: {
            x: particle.velocity.x * 0.99, // Air resistance
            y: particle.velocity.y + particle.gravity, // Gravity
          },
          rotation: particle.rotation + (particle.velocity.x * 2),
          life: particle.life - 0.008, // Fade out
        })).filter(particle => 
          particle.life > 0 && 
          particle.y < window.innerHeight + 100 &&
          particle.x > -100 && 
          particle.x < window.innerWidth + 100
        )
      );
    }, 16);

    return () => clearInterval(animationFrame);
  }, [particles.length]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti particles */}
          {particles.map(particle => (
            <ParticleShape key={particle.id} particle={particle} />
          ))}

          {/* Success message */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-[10000]"
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20,
                  duration: 0.8 
                }}
              >
                <motion.div
                  className="bg-luxury-900/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(34, 197, 94, 0)',
                      '0 0 40px rgba(34, 197, 94, 0.3)',
                      '0 0 0px rgba(34, 197, 94, 0)',
                    ]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2, repeat: Infinity } 
                  }}
                >
                  {/* Success icon */}
                  <motion.div
                    className="relative mx-auto mb-6"
                    style={{ width: 80, height: 80 }}
                  >
                    {/* Animated background circles */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ 
                        scale: { duration: 2, repeat: Infinity },
                        rotate: { duration: 3, repeat: Infinity, ease: 'linear' }
                      }}
                    />
                    <motion.div
                      className="absolute inset-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [360, 0]
                      }}
                      transition={{ 
                        scale: { duration: 1.5, repeat: Infinity },
                        rotate: { duration: 2, repeat: Infinity, ease: 'linear' }
                      }}
                    />
                    
                    {/* Check icon */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                    >
                      <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </motion.div>

                    {/* Sparkle effects around the icon */}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={`sparkle-${i}-${Date.now()}`}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        style={{
                          left: `${50 + 40 * Math.cos((i * 60) * Math.PI / 180)}%`,
                          top: `${50 + 40 * Math.sin((i * 60) * Math.PI / 180)}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          rotate: [0, 180],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    className="text-2xl font-bold text-white mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {title}
                  </motion.h2>

                  {/* Message */}
                  <motion.p
                    className="text-gray-300 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {message}
                  </motion.p>

                  {/* Cute animated elements */}
                  <motion.div
                    className="flex justify-center gap-4"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: 0 
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, -5, 5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: 0.3 
                      }}
                    >
                      <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: 0.6 
                      }}
                    >
                      <Zap className="w-6 h-6 text-blue-400" />
                    </motion.div>
                  </motion.div>

                  {/* Progress bar showing auto-close */}
                  <motion.div
                    className="mt-6 h-1 bg-white/20 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ 
                        duration: duration / 1000 - 1, 
                        ease: 'linear',
                        delay: 1 
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Background overlay for dramatic effect */}
          <motion.div
            className="absolute inset-0 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}