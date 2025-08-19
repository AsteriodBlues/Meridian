'use client';

import { motion, useInView, stagger, useAnimate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface SplitTextProps {
  children: string;
  className?: string;
  animation?: 'slideUp' | 'fadeIn' | 'scaleIn' | 'rotateIn' | 'wave' | 'typewriter';
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  trigger?: boolean;
  once?: boolean;
}

export default function SplitTextAnimation({
  children,
  className = '',
  animation = 'slideUp',
  delay = 0,
  duration = 0.6,
  staggerDelay = 0.03,
  trigger = true,
  once = true
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });
  const [scope, animate] = useAnimate();
  const [isReady, setIsReady] = useState(false);

  // Split text into characters
  const splitText = children.split('').map((char, index) => ({
    char: char === ' ' ? '\u00A0' : char,
    index
  }));

  useEffect(() => {
    if (!ref.current) return;
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !trigger || !isInView) return;

    const chars = scope.current?.querySelectorAll('.split-char');
    if (!chars) return;

    // Reset all characters
    gsap.set(chars, { 
      opacity: 0,
      y: animation === 'slideUp' ? 100 : 0,
      scale: animation === 'scaleIn' ? 0 : 1,
      rotation: animation === 'rotateIn' ? 180 : 0
    });

    // Animate based on type
    switch (animation) {
      case 'slideUp':
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: staggerDelay,
          ease: 'back.out(1.7)'
        });
        break;
        
      case 'fadeIn':
        gsap.to(chars, {
          opacity: 1,
          duration,
          delay,
          stagger: staggerDelay,
          ease: 'power2.out'
        });
        break;
        
      case 'scaleIn':
        gsap.to(chars, {
          opacity: 1,
          scale: 1,
          duration,
          delay,
          stagger: staggerDelay,
          ease: 'back.out(1.7)'
        });
        break;
        
      case 'rotateIn':
        gsap.to(chars, {
          opacity: 1,
          rotation: 0,
          duration,
          delay,
          stagger: staggerDelay,
          ease: 'power3.out'
        });
        break;
        
      case 'wave':
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: {
            each: staggerDelay,
            from: 'start',
            ease: 'sine.inOut'
          },
          ease: 'elastic.out(1, 0.5)'
        });
        break;
        
      case 'typewriter':
        gsap.to(chars, {
          opacity: 1,
          duration: 0.05,
          delay,
          stagger: staggerDelay * 3,
          ease: 'none'
        });
        break;
    }
  }, [isReady, trigger, isInView, animation, delay, duration, staggerDelay, scope]);

  return (
    <div ref={ref} className={`split-text ${className}`}>
      <div ref={scope} className="inline-block">
        {splitText.map(({ char, index }) => (
          <span
            key={index}
            className="split-char inline-block"
            style={{ 
              display: char === '\u00A0' ? 'inline' : 'inline-block',
              opacity: 0
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

// Word-based split animation
export function SplitWordsAnimation({
  children,
  className = '',
  animation = 'slideUp',
  delay = 0,
  duration = 0.8,
  staggerDelay = 0.1,
  trigger = true,
  once = true
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });
  const [scope, animate] = useAnimate();

  const words = children.split(' ');

  useEffect(() => {
    if (!trigger || !isInView) return;

    const wordElements = scope.current?.querySelectorAll('.split-word');
    if (!wordElements) return;

    // Reset
    gsap.set(wordElements, { 
      opacity: 0,
      y: animation === 'slideUp' ? 50 : 0,
      scale: animation === 'scaleIn' ? 0.8 : 1,
    });

    // Animate
    gsap.to(wordElements, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger: staggerDelay,
      ease: 'power3.out'
    });
  }, [trigger, isInView, animation, delay, duration, staggerDelay, scope]);

  return (
    <div ref={ref} className={`split-words ${className}`}>
      <div ref={scope}>
        {words.map((word, index) => (
          <span key={index} className="split-word inline-block mr-2 overflow-hidden">
            <span className="inline-block">{word}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Lines animation
export function SplitLinesAnimation({
  children,
  className = '',
  delay = 0,
  duration = 1,
  staggerDelay = 0.2
}: {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const lines = children.split('\n');

  return (
    <div ref={ref} className={`split-lines ${className}`}>
      {lines.map((line, index) => (
        <motion.div
          key={index}
          className="overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + index * staggerDelay, duration: 0.2 }}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{ 
              delay: delay + index * staggerDelay, 
              duration,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            {line}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// Premium text reveal with mask
export function MaskTextReveal({
  children,
  className = '',
  delay = 0,
  duration = 1.5
}: {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : { y: '100%' }}
        transition={{ 
          delay,
          duration,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {children}
      </motion.div>
      
      {/* Reveal overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-aurora-primary to-aurora-accent"
        initial={{ x: '-100%' }}
        animate={isInView ? { x: '100%' } : { x: '-100%' }}
        transition={{
          delay: delay + 0.2,
          duration: duration * 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
    </div>
  );
}