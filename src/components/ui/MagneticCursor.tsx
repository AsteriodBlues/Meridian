'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TrailDot {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  color: string;
  timestamp: number;
  rotation: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  timestamp: number;
}

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'button' | 'text' | 'link' | 'grab' | 'zoom'>('default');
  const [trailDots, setTrailDots] = useState<TrailDot[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('default');
  const [mouseVelocity, setMouseVelocity] = useState(0);
  const dotCounterRef = useRef(0);
  const particleCounterRef = useRef(0);
  const rippleCounterRef = useRef(0);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 15, stiffness: 800, mass: 0.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // Pre-define all transforms at the top level to avoid hook order issues
  const secondaryRingX = useTransform(cursorXSpring, x => x - 12);
  const secondaryRingY = useTransform(cursorYSpring, y => y - 12);
  const magneticField1X = useTransform(cursorXSpring, x => x - 60);
  const magneticField1Y = useTransform(cursorYSpring, y => y - 60);
  const magneticField2X = useTransform(cursorXSpring, x => x - 80);
  const magneticField2Y = useTransform(cursorYSpring, y => y - 80);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced color schemes with gradients
  const sectionColors = {
    default: {
      primary: ['#a855f7', '#3b82f6', '#06b6d4'],
      gradients: ['linear-gradient(45deg, #a855f7, #3b82f6)', 'linear-gradient(135deg, #3b82f6, #06b6d4)', 'linear-gradient(225deg, #06b6d4, #a855f7)']
    },
    dashboard: {
      primary: ['#22c55e', '#06b6d4', '#8b5cf6'],
      gradients: ['linear-gradient(45deg, #22c55e, #06b6d4)', 'linear-gradient(135deg, #06b6d4, #8b5cf6)', 'linear-gradient(225deg, #8b5cf6, #22c55e)']
    },
    income: {
      primary: ['#f59e0b', '#ef4444', '#ec4899'],
      gradients: ['linear-gradient(45deg, #f59e0b, #ef4444)', 'linear-gradient(135deg, #ef4444, #ec4899)', 'linear-gradient(225deg, #ec4899, #f59e0b)']
    },
    investments: {
      primary: ['#8b5cf6', '#06b6d4', '#10b981'],
      gradients: ['linear-gradient(45deg, #8b5cf6, #06b6d4)', 'linear-gradient(135deg, #06b6d4, #10b981)', 'linear-gradient(225deg, #10b981, #8b5cf6)']
    },
  };

  // Enhanced trail system with velocity-based morphing
  const updateTrail = useCallback((x: number, y: number, velocity: number) => {
    if (!mounted) return;
    
    setTrailDots(prev => {
      const currentColors = sectionColors[currentSection as keyof typeof sectionColors]?.primary || sectionColors.default.primary;
      const newDot: TrailDot = {
        id: dotCounterRef.current++,
        x: x + 16,
        y: y + 16,
        scale: Math.min(1 + velocity * 0.02, 2),
        opacity: Math.min(0.8 + velocity * 0.01, 1),
        color: currentColors[Math.floor(Math.random() * currentColors.length)],
        timestamp: Date.now(),
        rotation: Math.random() * 360
      };

      const filtered = prev.filter(dot => Date.now() - dot.timestamp < 800);
      return [...filtered, newDot].slice(-20);
    });
  }, [currentSection, mounted]);

  // Enhanced explosion with ripple effects
  const createExplosion = useCallback((x: number, y: number) => {
    if (!mounted) return;
    
    const newParticles: Particle[] = [];
    const currentColors = sectionColors[currentSection as keyof typeof sectionColors]?.primary || sectionColors.default.primary;
    
    // Create main explosion particles
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const velocity = 3 + Math.random() * 4;
      newParticles.push({
        id: particleCounterRef.current++,
        x: x + 16,
        y: y + 16,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 4,
        color: currentColors[Math.floor(Math.random() * currentColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    // Create secondary smaller particles
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 1 + Math.random() * 2;
      newParticles.push({
        id: particleCounterRef.current++,
        x: x + 16,
        y: y + 16,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1.5,
        maxLife: 1.5,
        size: 1 + Math.random() * 2,
        color: currentColors[Math.floor(Math.random() * currentColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
    
    // Create ripple effect
    setRipples(prev => [...prev, {
      id: rippleCounterRef.current++,
      x: x + 16,
      y: y + 16,
      scale: 0,
      opacity: 1,
      timestamp: Date.now()
    }]);
  }, [currentSection, mounted]);

  // Enhanced particle and ripple animation system
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.97,
          vy: particle.vy * 0.97 + 0.05,
          life: particle.life - 0.015,
          rotation: particle.rotation + particle.rotationSpeed
        })).filter(particle => particle.life > 0)
      );

      setRipples(prev => 
        prev.map(ripple => ({
          ...ripple,
          scale: ripple.scale + 2,
          opacity: Math.max(0, ripple.opacity - 0.02)
        })).filter(ripple => ripple.opacity > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    const moveCursor = (e: MouseEvent) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / Math.max(deltaTime, 1);

      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      setIsVisible(true);
      setMouseVelocity(velocity);

      // Enhanced trail generation based on velocity
      if (velocity > 0.3) {
        updateTrail(e.clientX - 16, e.clientY - 16, velocity);
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = currentTime;

      // Enhanced section detection
      const sections = ['dashboard', 'income', 'investments'];
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionIndex = Math.floor((scrollY + windowHeight / 2) / windowHeight);
      setCurrentSection(sections[sectionIndex] || 'default');
    };

    const handleClick = (e: MouseEvent) => {
      setIsClicking(true);
      createExplosion(e.clientX - 16, e.clientY - 16);
      setTimeout(() => setIsClicking(false), 150);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Enhanced magnetic effect with cursor type detection
    const addMagneticEffect = (element: Element) => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const distance = Math.sqrt(x * x + y * y);
        
        // Enhanced cursor type detection
        if (element.tagName === 'BUTTON' || element.classList.contains('magnetic')) {
          setCursorType('button');
        } else if (element.tagName === 'A') {
          setCursorType('link');
        } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          setCursorType('text');
        } else if (element.classList.contains('draggable') || element.draggable) {
          setCursorType('grab');
        } else if (element.classList.contains('zoomable')) {
          setCursorType('zoom');
        }
        
        if (distance < 120) {
          const strength = (120 - distance) / 120;
          cursorX.set(e.clientX - 16 + x * strength * 0.4);
          cursorY.set(e.clientY - 16 + y * strength * 0.4);
          setIsHovering(true);
        }
      };

      const handleEnter = () => {
        handleMouseEnter();
      };

      const handleLeave = () => {
        handleMouseLeave();
        setCursorType('default');
      };

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseenter', handleEnter);
      element.addEventListener('mouseleave', handleLeave);

      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseenter', handleEnter);
        element.removeEventListener('mouseleave', handleLeave);
      };
    };

    // Apply to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], .magnetic, input, textarea');
    const cleanupFunctions: (() => void)[] = [];

    interactiveElements.forEach(element => {
      const cleanup = addMagneticEffect(element);
      cleanupFunctions.push(cleanup);
    });

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseenter', () => setIsVisible(true));
    document.addEventListener('mouseleave', () => setIsVisible(false));

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('click', handleClick);
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [cursorX, cursorY, updateTrail, createExplosion]);

  const getCursorStyle = () => {
    const currentColors = sectionColors[currentSection as keyof typeof sectionColors] || sectionColors.default;
    const velocityScale = Math.min(1 + mouseVelocity * 0.05, 1.2);
    
    switch (cursorType) {
      case 'button':
        return {
          scale: isHovering ? 1.4 : 1.1,
          borderRadius: isHovering ? '60% 40% 40% 60%' : '50%',
          background: currentColors.gradients[0],
          filter: 'blur(0px) brightness(1.1)',
          rotate: isHovering ? [0, 5, -5, 0] : 0,
        };
      case 'link':
        return {
          scale: isHovering ? 1.3 : 1.0,
          borderRadius: isHovering ? '50% 50% 50% 50% / 60% 60% 40% 40%' : '50%',
          background: currentColors.gradients[1],
          filter: 'blur(0px) brightness(1.05)',
          rotate: isHovering ? [0, -3, 3, 0] : 0,
        };
      case 'text':
        return {
          scale: isHovering ? 1.1 : 0.8,
          borderRadius: isHovering ? '12px' : '8px',
          background: currentColors.gradients[2],
          filter: 'blur(0px)',
          scaleX: isHovering ? 2.5 : 3,
          scaleY: isHovering ? 0.8 : 0.6,
        };
      case 'grab':
        return {
          scale: isHovering ? 1.3 : 1.1,
          borderRadius: isHovering ? '40% 60% 60% 40%' : '50%',
          background: `conic-gradient(from ${isHovering ? 45 : 0}deg, ${currentColors.primary[0]}, ${currentColors.primary[1]}, ${currentColors.primary[2]}, ${currentColors.primary[0]})`,
          filter: 'blur(0px) brightness(1.1)',
          rotate: isHovering ? [0, 10, -10, 0] : mouseVelocity * 3,
        };
      case 'zoom':
        return {
          scale: isHovering ? 1.5 : 1.2,
          borderRadius: isHovering ? '30% 70% 70% 30%' : '50%',
          background: `radial-gradient(circle, ${currentColors.primary[0]}50, ${currentColors.primary[1]}20)`,
          filter: 'blur(1px) brightness(1.2)',
          rotate: isHovering ? [0, 8, -8, 0] : 0,
        };
      default:
        return {
          scale: isClicking ? 0.8 : 1 * velocityScale,
          borderRadius: isClicking ? '40% 60% 60% 40%' : '50%',
          background: `radial-gradient(circle, ${currentColors.primary[0]}60, ${currentColors.primary[1]}20)`,
          filter: `blur(${mouseVelocity * 0.2}px) brightness(${1 + mouseVelocity * 0.05})`,
          rotate: isClicking ? [0, 15, -15, 0] : mouseVelocity * 2,
        };
    }
  };

  if (!mounted) return null;

  const currentColors = sectionColors[currentSection as keyof typeof sectionColors] || sectionColors.default;

  return (
    <>
      {/* Main cursor with enhanced design */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          ...getCursorStyle(),
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Inner animated core */}
        <motion.div 
          className="absolute inset-1 rounded-full"
          style={{
            background: currentColors.primary[0],
            boxShadow: `0 0 20px ${currentColors.primary[0]}80, inset 0 0 20px ${currentColors.primary[1]}40`,
          }}
          animate={{
            scale: isClicking ? 0 : isHovering ? [1, 1.15, 1] : [1, 1.05, 1],
            rotate: [0, 360],
          }}
          transition={{ 
            scale: { 
              duration: isHovering ? 0.6 : 2, 
              repeat: Infinity, 
              ease: 'easeInOut'
            },
            rotate: { duration: 6, repeat: Infinity, ease: 'linear' }
          }}
        />
        
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: currentColors.primary[1],
            boxShadow: `0 0 30px ${currentColors.primary[1]}60`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Secondary cursor ring */}
      <motion.div
        className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[9998] border rounded-full"
        style={{
          x: secondaryRingX,
          y: secondaryRingY,
          borderColor: currentColors.primary[2],
          borderWidth: 1,
        }}
        animate={{
          scale: isHovering ? 1.4 : 1,
          opacity: isVisible ? 0.4 : 0,
          rotate: [0, -360],
        }}
        transition={{
          scale: { 
            duration: 0.5, 
            ease: [0.25, 0.46, 0.45, 0.94]
          },
          opacity: { duration: 0.3 },
          rotate: { duration: 12, repeat: Infinity, ease: 'linear' }
        }}
      />

      {/* Enhanced trail dots with rotation */}
      {trailDots.map(dot => (
        <motion.div
          key={dot.id}
          className="fixed pointer-events-none z-[9997]"
          style={{
            left: dot.x - 6,
            top: dot.y - 6,
            width: 12,
            height: 12,
          }}
          animate={{
            scale: [dot.scale, 0],
            opacity: [dot.opacity, 0],
            rotate: [dot.rotation, dot.rotation + 180],
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, ${dot.color}, transparent 70%)`,
              boxShadow: `0 0 10px ${dot.color}80`,
            }}
          />
        </motion.div>
      ))}

      {/* Enhanced explosion particles with rotation */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-[9997]"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            rotate: particle.rotation,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, ${particle.color}, ${particle.color}80 50%, transparent)`,
              opacity: particle.life,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}60`,
            }}
          />
        </motion.div>
      ))}

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-[9995] border-2 rounded-full"
          style={{
            left: ripple.x - ripple.scale,
            top: ripple.y - ripple.scale,
            width: ripple.scale * 2,
            height: ripple.scale * 2,
            borderColor: currentColors.primary[0],
            opacity: ripple.opacity,
          }}
        />
      ))}

      {/* Enhanced magnetic field with multiple layers */}
      {isHovering && (
        <>
          <motion.div
            className="fixed pointer-events-none z-[9996]"
            style={{
              x: magneticField1X,
              y: magneticField1Y,
              width: 120,
              height: 120,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(from 0deg, ${currentColors.primary[0]}30, ${currentColors.primary[1]}20, ${currentColors.primary[2]}30, transparent)`,
                filter: 'blur(10px)',
              }}
            />
          </motion.div>
          
          <motion.div
            className="fixed pointer-events-none z-[9994]"
            style={{
              x: magneticField2X,
              y: magneticField2Y,
              width: 160,
              height: 160,
            }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.05, 0.15, 0.05],
              rotate: [360, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${currentColors.primary[1]}15, transparent 70%)`,
                filter: 'blur(20px)',
              }}
            />
          </motion.div>
        </>
      )}
    </>
  );
}