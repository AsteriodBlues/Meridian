'use client';

import React from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'rotate' | 'blur' | 'wave' | 'magnetic';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  stagger?: boolean;
  intensity?: number;
}

export default function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = '',
  once = true,
  stagger = false,
  intensity = 1
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    threshold, 
    once,
    margin: "0px 0px -100px 0px"
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Always call all transforms - they'll only be used conditionally in render
  const scrollY = useTransform(scrollYProgress, [0, 1], [100 * intensity, -100 * intensity]);
  const scrollX = useTransform(scrollYProgress, [0, 1], [100 * intensity, -100 * intensity]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [0, 360 * intensity]);
  const scrollBlur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [10, 0, 0, 10]);
  const magneticY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  const magneticScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.95]);
  const magneticRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
  const waveY = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20]);
  const waveRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);

  const getAnimationVariants = () => {
    const baseDistance = 60 * intensity;
    
    switch (animation) {
      case 'fadeUp':
        return {
          hidden: { 
            opacity: 0, 
            y: baseDistance,
            filter: 'blur(4px)'
          },
          visible: { 
            opacity: 1, 
            y: 0,
            filter: 'blur(0px)',
            transition: {
              duration,
              delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }
        };

      case 'fadeLeft':
        return {
          hidden: { 
            opacity: 0, 
            x: -baseDistance,
            rotateY: -15,
            filter: 'blur(4px)'
          },
          visible: { 
            opacity: 1, 
            x: 0,
            rotateY: 0,
            filter: 'blur(0px)',
            transition: {
              duration,
              delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }
        };

      case 'fadeRight':
        return {
          hidden: { 
            opacity: 0, 
            x: baseDistance,
            rotateY: 15,
            filter: 'blur(4px)'
          },
          visible: { 
            opacity: 1, 
            x: 0,
            rotateY: 0,
            filter: 'blur(0px)',
            transition: {
              duration,
              delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }
        };

      case 'scale':
        return {
          hidden: { 
            opacity: 0, 
            scale: 0.8,
            filter: 'blur(6px)'
          },
          visible: { 
            opacity: 1, 
            scale: 1,
            filter: 'blur(0px)',
            transition: {
              duration,
              delay,
              type: 'spring',
              stiffness: 100,
              damping: 15
            }
          }
        };

      case 'rotate':
        return {
          hidden: { 
            opacity: 0, 
            rotate: -180 * intensity,
            scale: 0.5
          },
          visible: { 
            opacity: 1, 
            rotate: 0,
            scale: 1,
            transition: {
              duration: duration * 1.5,
              delay,
              type: 'spring',
              stiffness: 80,
              damping: 20
            }
          }
        };

      case 'blur':
        return {
          hidden: { 
            opacity: 0,
            filter: `blur(${20 * intensity}px)`,
            scale: 1.1
          },
          visible: { 
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            transition: {
              duration: duration * 1.2,
              delay,
              ease: 'easeOut'
            }
          }
        };

      case 'wave':
        return {
          hidden: { 
            opacity: 0,
            y: baseDistance,
            rotateX: 45
          },
          visible: { 
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
              duration,
              delay,
              ease: [0.34, 1.56, 0.64, 1]
            }
          }
        };

      case 'magnetic':
        return {
          hidden: { 
            opacity: 0,
            scale: 0.3,
            rotateZ: -45,
            filter: 'brightness(2) blur(8px)'
          },
          visible: { 
            opacity: 1,
            scale: 1,
            rotateZ: 0,
            filter: 'brightness(1) blur(0px)',
            transition: {
              duration: duration * 1.5,
              delay,
              type: 'spring',
              stiffness: 150,
              damping: 25
            }
          }
        };

      default:
        return {
          hidden: { opacity: 0, y: baseDistance },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration, delay }
          }
        };
    }
  };

  const variants = getAnimationVariants();

  // Stagger children animation
  const containerVariants = stagger ? {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay
      }
    }
  } : variants;

  // Determine style based on animation type
  const getAnimationStyle = () => {
    switch (animation) {
      case 'magnetic':
        return {
          y: magneticY,
          scale: magneticScale,
          rotateX: magneticRotateX
        };
      case 'blur':
        return { filter: scrollBlur };
      case 'wave':
        return { 
          y: waveY,
          rotateX: waveRotateX
        };
      default:
        return undefined;
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger ? containerVariants : variants}
      style={getAnimationStyle()}
    >
      {stagger ? (
        React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: variants.hidden,
              visible: {
                ...variants.visible,
                transition: {
                  ...variants.visible.transition,
                  delay: index * 0.1
                }
              }
            }}
          >
            {child}
          </motion.div>
        ))
      ) : children}
    </motion.div>
  );
}

// Specialized scroll reveal components
export function FadeUpReveal({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="fadeUp" {...props}>{children}</ScrollReveal>;
}

export function ScaleReveal({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="scale" {...props}>{children}</ScrollReveal>;
}

export function BlurReveal({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="blur" {...props}>{children}</ScrollReveal>;
}

export function MagneticReveal({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="magnetic" {...props}>{children}</ScrollReveal>;
}

export function WaveReveal({ children, ...props }: Omit<ScrollRevealProps, 'animation'>) {
  return <ScrollReveal animation="wave" {...props}>{children}</ScrollReveal>;
}