'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { GPUAcceleration } from '@/lib/performance';

interface GPUAnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  enableParallax?: boolean;
  enableGlow?: boolean;
  glowColor?: string;
  intensity?: number;
}

export default function GPUAnimatedCard({
  children,
  className = '',
  enableParallax = true,
  enableGlow = true,
  glowColor = '#3b82f6',
  intensity = 1
}: GPUAnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations for smooth movement
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);
  
  // Glow effect transforms
  const glowX = useSpring(useTransform(mouseX, [-300, 300], [-50, 50]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [-300, 300], [-50, 50]), springConfig);
  const glowIntensity = useSpring(0, springConfig);

  useEffect(() => {
    // Check for WebGL support and enable GPU acceleration
    setIsSupported(GPUAcceleration.isWebGLSupported());
    
    if (cardRef.current && isSupported) {
      GPUAcceleration.enableHardwareAcceleration(cardRef.current);
    }

    return () => {
      if (cardRef.current && isSupported) {
        GPUAcceleration.disableHardwareAcceleration(cardRef.current);
      }
    };
  }, [isSupported]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableParallax || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * intensity;
    const deltaY = (e.clientY - centerY) * intensity;
    
    mouseX.set(deltaX);
    mouseY.set(deltaY);
    
    if (enableGlow) {
      glowIntensity.set(0.8);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    glowIntensity.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative transform-gpu ${className}`}
      style={{
        rotateX: enableParallax ? rotateX : 0,
        rotateY: enableParallax ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* GPU-accelerated glow effect */}
      {enableGlow && isSupported && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowX}px ${glowY}px, ${glowColor}40, transparent 70%)`,
            opacity: glowIntensity,
            filter: 'blur(20px)',
            transform: 'translateZ(-1px)'
          }}
        />
      )}
      
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          background: `conic-gradient(from ${mouseX}deg, transparent, ${glowColor}80, transparent)`,
          opacity: enableGlow ? glowIntensity : 0,
          mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)',
          maskComposite: 'xor',
          padding: '1px'
        }}
      />
      
      {/* Main content */}
      <motion.div
        className="relative z-10"
        style={{
          transform: enableParallax ? 'translateZ(50px)' : 'none'
        }}
      >
        {children}
      </motion.div>
      
      {/* Reflection effect */}
      {enableParallax && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-inherit pointer-events-none"
          style={{
            transform: 'translateZ(25px)',
            opacity: glowIntensity
          }}
        />
      )}
    </motion.div>
  );
}

// High-performance particle system for backgrounds
interface ParticleSystemProps {
  particleCount?: number;
  color?: string;
  speed?: number;
  size?: number;
  opacity?: number;
  className?: string;
}

export function GPUParticleSystem({
  particleCount = 50,
  color = '#3b82f6',
  speed = 1,
  size = 2,
  opacity = 0.6,
  className = ''
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100
      }));
    };

    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      // Enable hardware acceleration
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 1;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width / window.devicePixelRatio;
        if (particle.x > canvas.width / window.devicePixelRatio) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height / window.devicePixelRatio;
        if (particle.y > canvas.height / window.devicePixelRatio) particle.y = 0;

        // Reset particle if life exceeded
        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * canvas.width / window.devicePixelRatio;
          particle.y = Math.random() * canvas.height / window.devicePixelRatio;
        }

        // Calculate alpha based on life
        const alpha = Math.sin((particle.life / particle.maxLife) * Math.PI) * opacity;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connections to nearby particles
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const connectionAlpha = (1 - distance / 100) * alpha * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = color + Math.floor(connectionAlpha * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, color, speed, size, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

// Optimized morphing blob background
export function GPUMorphingBlob({
  color = '#3b82f6',
  size = 300,
  intensity = 0.5,
  className = ''
}: {
  color?: string;
  size?: number;
  intensity?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className={`absolute opacity-20 pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
        filter: 'blur(40px)',
        willChange: 'transform'
      }}
      animate={{
        scale: [1, 1.2, 0.8, 1],
        rotate: [0, 90, 180, 270, 360],
        borderRadius: ['30%', '50%', '20%', '40%', '30%']
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
}