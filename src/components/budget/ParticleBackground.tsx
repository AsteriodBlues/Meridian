'use client';

import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  interactive?: boolean;
  colors?: string[];
  className?: string;
}

export default function ParticleBackground({ 
  particleCount = 50,
  interactive = true,
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  className = ''
}: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseActive, setIsMouseActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Create initial particles
  useEffect(() => {
    const createParticle = (id: string): Particle => ({
      id,
      x: Math.random() * (window.innerWidth || 1920),
      y: Math.random() * (window.innerHeight || 1080),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.6 + 0.2,
      life: 0,
      maxLife: Math.random() * 1000 + 500
    });

    const initialParticles = Array.from({ length: particleCount }, (_, i) => 
      createParticle(`particle-${i}`)
    );
    
    setParticles(initialParticles);
  }, [particleCount, colors]);

  // Mouse interaction
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setMousePosition({ x, y });
    mouseX.set(x);
    mouseY.set(y);
    setIsMouseActive(true);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setIsMouseActive(false);
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let { x, y, vx, vy, life, maxLife, ...rest } = particle;
          
          // Mouse attraction/repulsion
          if (interactive && isMouseActive) {
            const dx = mousePosition.x - x;
            const dy = mousePosition.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
              const force = (150 - distance) / 150;
              const angle = Math.atan2(dy, dx);
              
              // Attraction for closer particles, repulsion for very close ones
              const attractionForce = distance < 50 ? -force * 2 : force * 0.5;
              
              vx += Math.cos(angle) * attractionForce * 0.01;
              vy += Math.sin(angle) * attractionForce * 0.01;
            }
          }
          
          // Apply velocity
          x += vx;
          y += vy;
          
          // Add some randomness
          vx += (Math.random() - 0.5) * 0.01;
          vy += (Math.random() - 0.5) * 0.01;
          
          // Damping
          vx *= 0.99;
          vy *= 0.99;
          
          // Boundary wrapping
          if (x < 0) x = window.innerWidth || 1920;
          if (x > (window.innerWidth || 1920)) x = 0;
          if (y < 0) y = window.innerHeight || 1080;
          if (y > (window.innerHeight || 1080)) y = 0;
          
          // Life cycle
          life += 1;
          let opacity = rest.opacity;
          
          if (life > maxLife * 0.8) {
            opacity *= (maxLife - life) / (maxLife * 0.2);
          }
          
          // Reset particle if it dies
          if (life >= maxLife) {
            return {
              ...rest,
              x: Math.random() * (window.innerWidth || 1920),
              y: Math.random() * (window.innerHeight || 1080),
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              life: 0,
              maxLife: Math.random() * 1000 + 500,
              opacity: Math.random() * 0.6 + 0.2
            };
          }
          
          return { ...rest, x, y, vx, vy, life, opacity };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [interactive, isMouseActive, mousePosition]);

  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !interactive) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, interactive]);

  // Connection lines between nearby particles
  const getConnections = () => {
    const connections: Array<{ from: Particle; to: Particle; distance: number }> = [];
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          connections.push({
            from: particles[i],
            to: particles[j],
            distance
          });
        }
      }
    }
    
    return connections.slice(0, 20); // Limit connections for performance
  };

  const connections = getConnections();

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <svg 
        width="100%" 
        height="100%" 
        className="absolute inset-0"
        style={{ filter: 'blur(0.5px)' }}
      >
        <defs>
          {/* Gradient definitions for particles */}
          {colors.map((color, index) => (
            <radialGradient key={`gradient-${index}`} id={`particle-gradient-${index}`}>
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          ))}
          
          {/* Glow filter */}
          <filter id="particle-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {connections.map((connection, index) => {
          const opacity = Math.max(0, (120 - connection.distance) / 120) * 0.3;
          
          return (
            <motion.line
              key={`connection-${index}`}
              x1={connection.from.x}
              y1={connection.from.y}
              x2={connection.to.x}
              y2={connection.to.y}
              stroke="url(#particle-gradient-0)"
              strokeWidth="1"
              opacity={opacity}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}

        {/* Particles */}
        {particles.map((particle, index) => {
          const gradientIndex = colors.findIndex(c => c === particle.color);
          
          return (
            <g key={particle.id}>
              {/* Outer glow */}
              <motion.circle
                cx={particle.x}
                cy={particle.y}
                r={particle.size * 2}
                fill={`url(#particle-gradient-${gradientIndex})`}
                opacity={particle.opacity * 0.5}
                filter="url(#particle-glow)"
                animate={{
                  scale: isMouseActive ? [1, 1.2, 1] : [1, 1.1, 1],
                  opacity: [particle.opacity * 0.5, particle.opacity * 0.8, particle.opacity * 0.5]
                }}
                transition={{
                  duration: 2 + index * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              
              {/* Core particle */}
              <motion.circle
                cx={particle.x}
                cy={particle.y}
                r={particle.size}
                fill={particle.color}
                opacity={particle.opacity}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5 + index * 0.05,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </g>
          );
        })}

        {/* Mouse interaction effect */}
        {interactive && isMouseActive && (
          <motion.circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="50"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 1.2, 1],
              opacity: [0, 0.8, 0.4, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </svg>

      {/* Ambient background gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.05) 0%, transparent 50%)`
        }}
        animate={{
          opacity: isMouseActive ? 1 : 0
        }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}