'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronDown, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Advanced Physics-Based Particle System
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

const ParticleSystem = ({ count = 150 }: { count?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initializeParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() * 60 + 200, // Blue to purple range
      life: Math.random() * 1000 + 500,
      maxLife: Math.random() * 1000 + 500
    }));
  }, [count]);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      // Physics simulation
      const mouseDistance = Math.sqrt(
        Math.pow(particle.x - mouseRef.current.x, 2) + 
        Math.pow(particle.y - mouseRef.current.y, 2)
      );
      
      // Mouse attraction/repulsion
      if (mouseDistance < 100) {
        const angle = Math.atan2(
          particle.y - mouseRef.current.y,
          particle.x - mouseRef.current.x
        );
        const force = (100 - mouseDistance) / 100;
        particle.vx += Math.cos(angle) * force * 0.01;
        particle.vy += Math.sin(angle) * force * 0.01;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary wrapping
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Life cycle
      particle.life -= 1;
      if (particle.life <= 0) {
        particle.life = particle.maxLife;
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
      }

      // Render particle
      const lifeRatio = particle.life / particle.maxLife;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * lifeRatio, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * lifeRatio})`;
      ctx.fill();

      // Connection lines
      particlesRef.current.forEach((otherParticle) => {
        if (particle.id < otherParticle.id) {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );
          
          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 50%, 70%, ${0.1 * (80 - distance) / 80})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
    });

    animationRef.current = requestAnimationFrame(updateParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resizeCanvas();
    initializeParticles();
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    updateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeParticles, updateParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// Animated Gradient Mesh Background
const GradientMesh = () => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.01);
    }, 16);
    
    return () => clearInterval(interval);
  }, []);

  const gradientStyle = {
    background: `
      radial-gradient(ellipse at ${20 + Math.sin(time) * 10}% ${30 + Math.cos(time * 0.8) * 15}%, 
        hsla(240, 100%, 70%, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at ${80 + Math.cos(time * 1.2) * 10}% ${70 + Math.sin(time * 0.6) * 20}%, 
        hsla(280, 80%, 60%, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse at ${50 + Math.sin(time * 0.7) * 15}% ${20 + Math.cos(time) * 10}%, 
        hsla(200, 90%, 80%, 0.15) 0%, transparent 50%),
      linear-gradient(135deg, 
        hsla(220, 70%, 10%, 0.9) 0%, 
        hsla(240, 60%, 5%, 0.95) 100%)
    `,
    transition: 'background 0.1s ease-out'
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={gradientStyle}
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

// Cinematic Text Animations
const CinematicText = ({ children, delay = 0 }: { children: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const letters = children.split('').map((char, i) => ({ char, id: i }));
  
  return (
    <div ref={ref} className="overflow-hidden">
      {letters.map(({ char, id }) => (
        <motion.span
          key={id}
          className="inline-block"
          initial={{ 
            y: 100, 
            rotateX: 90, 
            opacity: 0,
            filter: 'blur(10px)'
          }}
          animate={isInView ? { 
            y: 0, 
            rotateX: 0, 
            opacity: 1,
            filter: 'blur(0px)'
          } : {}}
          transition={{
            duration: 0.8,
            delay: delay + (id * 0.05),
            ease: [0.22, 1, 0.36, 1],
            type: "spring",
            damping: 12,
            stiffness: 200
          }}
          style={{ 
            transformStyle: 'preserve-3d',
            display: char === ' ' ? 'inline' : 'inline-block'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
};

// Morphing Number Counter
const MorphingCounter = ({ 
  value, 
  prefix = '', 
  suffix = '',
  duration = 2000 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = value / (duration / 16);
    
    const animate = () => {
      start += increment;
      if (start < value) {
        setDisplayValue(Math.floor(start));
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    const timeout = setTimeout(animate, 500);
    return () => clearTimeout(timeout);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// Liquid Fill CTA Button
const LiquidCTA = ({ 
  children, 
  onClick, 
  className = '' 
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { id: Date.now(), x, y };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }
    
    onClick?.();
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden px-8 py-4 rounded-full border border-white/20 backdrop-blur-xl font-semibold text-white ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Breathing glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse -z-10 blur-sm" />
      
      {/* Liquid fill background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '0%' : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.2 : 0.8 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

// Parallax Scroll Indicator
const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
      <motion.div
        className="flex flex-col items-center text-white/60 cursor-pointer hover:text-white/90 transition-colors"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-sm mb-2 tracking-wider">SCROLL</span>
        <ChevronDown className="w-6 h-6" />
      </motion.div>
      
      {/* Progress indicator */}
      <motion.div
        className="w-px h-20 bg-gradient-to-b from-white/20 to-transparent mt-4"
        style={{ scaleY: scrollYProgress }}
        initial={{ scaleY: 0 }}
      />
    </div>
  );
};

// Main Cinematic Hero Component
export default function CinematicHero() {
  const { data: session } = useSession();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = session?.user?.name?.split(' ')[0] || 'Ritwik';

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background layers */}
      <GradientMesh />
      <ParticleSystem count={120} />
      
      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/70 text-lg mb-4 tracking-wider"
        >
          {getGreeting()}, {userName}
        </motion.div>

        {/* Main headline */}
        <div className="mb-6">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-none"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, lineHeight: '0.9' }}
          >
            <div className="mb-2">
              <CinematicText delay={0.5}>Financial</CinematicText>
            </div>
            <div>
              <CinematicText delay={1.2}>Evolution</CinematicText>
            </div>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          Experience the future of wealth management with
          <span className="text-blue-300 font-semibold"> AI-powered insights</span> and
          <span className="text-purple-300 font-semibold"> real-time analytics</span>
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex justify-center items-center gap-12 mb-12 text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              $<MorphingCounter value={2847592} />
            </div>
            <div className="text-sm text-white/60">Total Assets</div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold mb-1 text-green-400">
              +<MorphingCounter value={12.8} suffix="%" />
            </div>
            <div className="text-sm text-white/60">Growth Rate</div>
          </div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              <MorphingCounter value={847} />
            </div>
            <div className="text-sm text-white/60">Credit Score</div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3 }}
        >
          <LiquidCTA 
            className="bg-white/10 hover:bg-white/20"
            onClick={() => router.push('/dashboard')}
          >
            <Sparkles className="w-5 h-5" />
            Explore Dashboard
            <ArrowRight className="w-5 h-5" />
          </LiquidCTA>
          
          <LiquidCTA 
            className="bg-transparent border-white/40"
            onClick={() => router.push('/investments')}
          >
            <TrendingUp className="w-5 h-5" />
            View Portfolio
          </LiquidCTA>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </motion.section>
  );
}