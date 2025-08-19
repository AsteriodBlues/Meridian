'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, stagger, useAnimate } from 'framer-motion';
import { useRef, useEffect, useState, useCallback, ReactNode } from 'react';
import { gsap } from 'gsap';

// === SCROLL-TRIGGERED ANIMATIONS ===

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'rotate' | 'blur';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  distance = 50,
  className = '',
  once = true,
  threshold = 0.3
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const animations = {
    fadeUp: {
      initial: { opacity: 0, y: distance },
      animate: { opacity: 1, y: 0 }
    },
    fadeDown: {
      initial: { opacity: 0, y: -distance },
      animate: { opacity: 1, y: 0 }
    },
    fadeLeft: {
      initial: { opacity: 0, x: distance },
      animate: { opacity: 1, x: 0 }
    },
    fadeRight: {
      initial: { opacity: 0, x: -distance },
      animate: { opacity: 1, x: 0 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    },
    rotate: {
      initial: { opacity: 0, rotate: 180 },
      animate: { opacity: 1, rotate: 0 }
    },
    blur: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' }
    }
  };

  const { initial, animate } = animations[animation];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
}

// === MAGNETIC INTERACTIONS ===

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  springConfig?: { damping: number; stiffness: number };
}

export function Magnetic({
  children,
  strength = 0.3,
  className = '',
  springConfig = { damping: 20, stiffness: 300 }
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  const x = useTransform(springX, (value) => value * strength);
  const y = useTransform(springY, (value) => value * strength);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}

// === PARALLAX SCROLL EFFECTS ===

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxScroll({
  children,
  speed = -0.5,
  className = ''
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

// === MORPHING SHAPES ===

export function MorphingBlob({
  size = 200,
  color = '#667eea',
  className = '',
  animate = true
}: {
  size?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent)`,
          borderRadius: '50%'
        }}
        animate={animate ? {
          borderRadius: [
            '50%',
            '45% 55% 65% 35%',
            '55% 45% 35% 65%',
            '60% 40% 50% 50%',
            '50%'
          ],
          scale: isHovered ? [1, 1.1, 1] : 1
        } : {}}
        transition={{
          borderRadius: {
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          },
          scale: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }}
      />
    </motion.div>
  );
}

// === STAGGER ANIMATIONS ===

interface StaggerProps {
  children: ReactNode[];
  staggerDelay?: number;
  animation?: 'fadeUp' | 'scale' | 'rotate';
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  animation = 'fadeUp',
  className = ''
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  const animations = {
    fadeUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    rotate: {
      hidden: { opacity: 0, rotate: 180 },
      visible: { opacity: 1, rotate: 0 }
    }
  };

  const itemVariants = animations[animation];

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// === LIQUID LOADING ANIMATION ===

export function LiquidLoader({
  size = 60,
  color = '#667eea',
  className = ''
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [0, 1, 0],
          opacity: [1, 0.5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{ backgroundColor: color }}
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
      <motion.div
        className="absolute inset-4 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [0, 1, 0],
          opacity: [1, 0.5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />
    </div>
  );
}

// === FLOATING PARTICLES ===

export function FloatingParticles({
  count = 50,
  className = '',
  colors = ['#667eea', '#764ba2', '#f093fb']
}: {
  count?: number;
  className?: string;
  colors?: string[];
}) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    color: string;
    initialX: number;
    initialY: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    setMounted(true);
    // Generate particles on client side only
    const newParticles = Array.from({ length: count }, (_, index) => ({
      id: index,
      color: colors[index % colors.length],
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: 8 + Math.random() * 4,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, [count]); // Remove colors dependency to prevent infinite re-renders

  if (!mounted) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: 0.6
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(particle.id) * 50, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

// === HOVER REVEAL ===

interface HoverRevealProps {
  children: ReactNode;
  revealContent: ReactNode;
  className?: string;
}

export function HoverReveal({
  children,
  revealContent,
  className = ''
}: HoverRevealProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          y: isHovered ? -20 : 0,
          opacity: isHovered ? 0 : 1
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{
          y: isHovered ? 0 : 20,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {revealContent}
      </motion.div>
    </div>
  );
}

// === SPRING PHYSICS ===

export function SpringButton({
  children,
  onClick,
  className = ''
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      className={`${className}`}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
      }}
      initial={{ scale: 1 }}
    >
      {children}
    </motion.button>
  );
}