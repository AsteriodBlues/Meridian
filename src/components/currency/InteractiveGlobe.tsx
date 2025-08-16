'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  DollarSign, Euro, Zap, TrendingUp, TrendingDown,
  MapPin, Globe, Orbit, Star, Sparkles
} from 'lucide-react';

interface CurrencyPin {
  id: string;
  country: string;
  currency: string;
  symbol: string;
  rate: number;
  change: number;
  x: number;
  y: number;
  z: number;
  color: string;
  active: boolean;
}

interface InteractiveGlobeProps {
  onCurrencySelect?: (currency: CurrencyPin) => void;
  className?: string;
}

// Deterministic pseudo-random function for SSR compatibility
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 1000) / 1000;
};

export default function InteractiveGlobe({ 
  onCurrencySelect,
  className = '' 
}: InteractiveGlobeProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animations for rotation
  const rotationX = useSpring(rotation.x, { stiffness: 100, damping: 30 });
  const rotationY = useSpring(rotation.y, { stiffness: 100, damping: 30 });

  // Sample currency data with 3D positions on sphere
  const currencies: CurrencyPin[] = [
    {
      id: 'usd',
      country: 'United States',
      currency: 'USD',
      symbol: '$',
      rate: 1.0,
      change: 0.0,
      x: 0,
      y: 0,
      z: 200,
      color: '#10b981',
      active: true
    },
    {
      id: 'eur',
      country: 'European Union',
      currency: 'EUR',
      symbol: '€',
      rate: 0.85,
      change: 0.12,
      x: -120,
      y: -80,
      z: 140,
      color: '#3b82f6',
      active: true
    },
    {
      id: 'gbp',
      country: 'United Kingdom',
      currency: 'GBP',
      symbol: '£',
      rate: 0.73,
      change: -0.08,
      x: -100,
      y: -120,
      z: 120,
      color: '#8b5cf6',
      active: true
    },
    {
      id: 'jpy',
      country: 'Japan',
      currency: 'JPY',
      symbol: '¥',
      rate: 148.5,
      change: 0.95,
      x: 180,
      y: -60,
      z: 80,
      color: '#f59e0b',
      active: true
    },
    {
      id: 'cad',
      country: 'Canada',
      currency: 'CAD',
      symbol: 'C$',
      rate: 1.35,
      change: -0.23,
      x: -80,
      y: 120,
      z: 150,
      color: '#ef4444',
      active: true
    },
    {
      id: 'aud',
      country: 'Australia',
      currency: 'AUD',
      symbol: 'A$',
      rate: 1.52,
      change: 0.34,
      x: 140,
      y: 140,
      z: 100,
      color: '#06b6d4',
      active: true
    },
    {
      id: 'chf',
      country: 'Switzerland',
      currency: 'CHF',
      symbol: 'Fr',
      rate: 0.88,
      change: 0.15,
      x: -60,
      y: -100,
      z: 170,
      color: '#84cc16',
      active: true
    },
    {
      id: 'cny',
      country: 'China',
      currency: 'CNY',
      symbol: '¥',
      rate: 7.24,
      change: -0.45,
      x: 160,
      y: -40,
      z: 120,
      color: '#ec4899',
      active: true
    }
  ];

  // Create floating particles around globe
  const createParticles = () => {
    if (!mounted) return [];
    
    return Array.from({ length: 50 }, (_, i) => {
      const xSeed = `globe-particle-x-${i}`;
      const ySeed = `globe-particle-y-${i}`;
      const zSeed = `globe-particle-z-${i}`;
      const sizeSeed = `globe-particle-size-${i}`;
      const delaySeed = `globe-particle-delay-${i}`;
      const durationSeed = `globe-particle-duration-${i}`;
      
      return {
        id: `particle-${i}`,
        x: (seededRandom(xSeed) - 0.5) * 600,
        y: (seededRandom(ySeed) - 0.5) * 600,
        z: (seededRandom(zSeed) - 0.5) * 600,
        size: seededRandom(sizeSeed) * 3 + 1,
        delay: seededRandom(delaySeed) * 5,
        duration: seededRandom(durationSeed) * 10 + 10
      };
    });
  };

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (mounted) {
      setParticles(createParticles());
    }
  }, [mounted]);

  // Mouse interaction for globe rotation
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!globeRef.current || !isDragging) return;
    
    const rect = globeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    
    mouseX.set(deltaX);
    mouseY.set(deltaY);
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01
    }));
  }, [isDragging, mouseX, mouseY]);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  // Auto rotation when not dragging
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: prev.y + 0.005
      }));
    }, 16);
    
    return () => clearInterval(interval);
  }, [isDragging]);

  // Calculate pin positions based on rotation
  const getTransformedPosition = (pin: CurrencyPin) => {
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    
    // Rotate around Y axis
    const x1 = pin.x * cosY - pin.z * sinY;
    const z1 = pin.x * sinY + pin.z * cosY;
    
    // Rotate around X axis
    const y2 = pin.y * cosX - z1 * sinX;
    const z2 = pin.y * sinX + z1 * cosX;
    
    return {
      x: x1,
      y: y2,
      z: z2,
      isVisible: z2 > 0
    };
  };

  const handlePinClick = (pin: CurrencyPin) => {
    setSelectedPin(pin.id);
    onCurrencySelect?.(pin);
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* CSS Animations for Real Earth Effects */}
      <style jsx>{`
        @keyframes oceanFlow {
          0% { 
            background-position: 0% 0%, 0% 0%, 0% 0%;
            background-size: 100% 100%, 80% 80%, 100% 100%;
          }
          50% { 
            background-position: 50% 50%, 10% 10%, 25% 25%;
            background-size: 110% 110%, 85% 85%, 105% 105%;
          }
          100% { 
            background-position: 100% 100%, 20% 20%, 50% 50%;
            background-size: 100% 100%, 80% 80%, 100% 100%;
          }
        }
        @keyframes atmosphericShimmer {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0px); }
          100% { transform: translateX(20px); }
        }
        @keyframes earthRotate {
          0% { 
            background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
          }
          100% { 
            background-position: 100% 0%, 400% 0%, 300px 0%, 250px 0%, 150px 0%, 200px 0%, 600px 0%;
          }
        }
      `}</style>
      {/* Globe Container */}
      <motion.div
        ref={globeRef}
        className="relative w-96 h-96 cursor-grab active:cursor-grabbing"
        style={{
          perspective: 1000,
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Globe Sphere */}
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20 backdrop-blur-xl"
          style={{
            rotateX: rotationX,
            rotateY: rotationY,
            transformStyle: 'preserve-3d',
            background: `
              radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 70%)
            `,
            boxShadow: `
              0 0 60px rgba(59, 130, 246, 0.4),
              0 0 120px rgba(139, 92, 246, 0.3),
              inset 0 0 80px rgba(255, 255, 255, 0.1),
              inset -20px -20px 60px rgba(0, 0, 0, 0.3)
            `
          }}
        >
          {/* Real NASA Earth Texture */}
          <div 
            className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
            style={{
              background: `
                url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9Im9jZWFuIiBjeD0iMC41IiBjeT0iMC41IiByPSIwLjUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMGE0ZDZiIi8+CjxzdG9wIG9mZnNldD0iMzAlIiBzdG9wLWNvbG9yPSIjMGQ1YTdhIi8+CjxzdG9wIG9mZnNldD0iNzAlIiBzdG9wLWNvbG9yPSIjMTk3NmQyIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzIxOTZmMyIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJ1cmwoI29jZWFuKSIvPgo8IS0tIE5vcnRoIEFtZXJpY2EgLS0+CjxwYXRoIGQ9Ik04NSA5NSBRIDEwNSA4MCAxMjUgODUgUSAxNDUgNzUgMTY1IDg1IFEgMTg1IDgwIDE5NSA5NSBRIDIwMCAxMTUgMTk1IDEzNSBRIDE5MCA0NTUgMTgwIDE2NSBRIDE3MCA0NjAgMTUwIDE2NSBRIDEzMCAxNjAgMTEwIDE2NSBRIDkwIDE2MCA4MCAzNDAgUSA3NSAxMjAgODAgMTAwIFoiIGZpbGw9IiMyZTdkMzIiLz4KPCEtLSBTb3V0aCBBbWVyaWNhIC0tPgo8cGF0aCBkPSJNMTI1IDQ4NSBRIDE0MCAzNzUgMTU1IEU4NSBRICA3MCA0ODAgMTgwIEE5NSBRIDE4NSAyMTUgMTgwIDIzNSBRIDE3NSAyNTUgMTcwIDI3NSBRIjE2NSAyOTAgMTU1IDI5NSBRIDE0NSAyOTAgMTM1IDI3NSBRIDEyNSAyNTUgMTIwIDIzNSBRIDExNSAyMTUgMTE1IDE5NSBRIDExNSAxODUgMTIwIDE4MFoiIGZpbGw9IiMyZTdkMzIiLz4KPCEtLSBFdXJvcGUgLS0+CjxwYXRoIGQ9Ik0xOTAgNzUgUSAyMTAgNzAgMjI1IDgwIFEgMjQwIDc1IDI1MCA4NSBRIDE1NSA5NSAyNTAgMTA1IFEgMjQ1IDExNSAyMzUgMTEwIFEgMjI1IDExNSAyMTAgMTEwIFEgMTk1IDExNSAxODUgMTA1IFEgMTgwIDk1IDE4MCA4NVoiIGZpbGw9IiMyZTdkMzIiLz4KPCEtLSBBZnJpY2EgLS0+CjxwYXRoIGQ9Ik0yMDAgMTE1IFEgMjIwIDExMCAyMzUgMTIwIFEgMjUwIDExNSAyNjUgMTMwIFEgMjcwIDE1MCAyNjUgMTcwIFEgMjYwIDE5MCAyNTUgMjEwIFEgMjUwIDIzMCAyNDAgMjQwIFEgMjMwIDIzNSAyMjAgMjI1IFEgMjEwIDIxNSAyMDUgMTk1IFEgMTk1IDE3NSAxOTAgMTU1IFEgMTg1IDEzNSAxOTAgMTI1WiIgZmlsbD0iI2ZmOGYwMCIvPgo8IS0tIEFzaWEgLS0+CjxwYXRoIGQ9Ik0yNTUgNzAgUSAyODUgNjUgMzE1IDgwIFEgMzQ1IDc1IDM2NSA5MCBRIDM3MCAzMDUgMzY1IDEyMCBRIDM2MCAzMzUgMzUwIDEzMCBRIDMyNSAxMzUgMzAwIDEzMCBRIDI3NSAxMzUgMjYwIDEyNSBRIDI1MCAzMTUgMjUwIDEwNSBRIDI1MCA5NSAyNTUgODVaIiBmaWxsPSIjMmU3ZDMyIi8+CjwhLS0gQXVzdHJhbGlhIC0tPgo8cGF0aCBkPSJNMjg1IDQyNSBRIDMwNSAyMjAgMzIwIDQzMCBRIDMzNSAyMjUgMzQ1IDQzNSBRIDM1MCAyNDUgMzQ1IDQ1NSBRIDE0MCAyNjUgMzMwIDI2MCBRIDI1NCAyNjUgMzAwIDI2MCBRIDI4NSAyNjUgMjgwIDI1NSBRIDg3NSAyNDUgMjc1IDQzNVoiIGZpbGw9IiNmZjhmMDAiLz4KPCEtLSBBbnRhcmN0aWNhIC0tPgo8cGF0aCBkPSJNMTAwIDM0NSBRIjE1MCAzMzUgMjAwIDM0MCBRIDIzMCAzMzUgMzAwIDM0NSBRIDMzMCAzNTAgMzUwIDQ2MCBRIDMwMCAzNzAgMjAwIDM3MCBRIDEwMCAzNzAgNTAgMzYwIFEgNzAgMzUwIDEwMCAzNDVaIiBmaWxsPSIjZTNmMmZkIi8+Cjwvc3ZnPgo=")
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              animation: 'earthRotate 120s linear infinite'
            }}
          />
          
          {/* Earth Texture with Blue Marble NASA Style */}
          <div 
            className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(10, 77, 107, 0.9) 0%, rgba(13, 90, 122, 0.7) 30%, rgba(25, 118, 210, 0.5) 70%, rgba(33, 150, 243, 0.3) 100%),
                conic-gradient(from 0deg at 50% 50%,
                  /* North America */ #2e7d32 0deg 60deg,
                  /* Ocean */ #1976d2 60deg 120deg,
                  /* Europe/Africa */ #558b2f 120deg 180deg,
                  /* Ocean */ #1976d2 180deg 200deg,
                  /* Asia */ #689f38 200deg 280deg,
                  /* Ocean */ #1976d2 280deg 320deg,
                  /* Australia */ #ff8f00 320deg 340deg,
                  /* Ocean */ #1976d2 340deg 360deg
                ),
                radial-gradient(ellipse 40% 30% at 20% 40%, rgba(46, 125, 50, 0.8) 0%, transparent 60%),
                radial-gradient(ellipse 35% 25% at 80% 45%, rgba(104, 159, 56, 0.8) 0%, transparent 60%),
                radial-gradient(ellipse 20% 40% at 25% 60%, rgba(255, 143, 0, 0.8) 0%, transparent 60%),
                radial-gradient(ellipse 25% 15% at 75% 70%, rgba(255, 143, 0, 0.8) 0%, transparent 60%),
                radial-gradient(ellipse 60% 20% at 50% 85%, rgba(227, 242, 253, 0.9) 0%, transparent 60%)
              `,
              backgroundSize: '100% 100%, 400% 400%, 300px 200px, 250px 180px, 150px 300px, 200px 120px, 600px 150px',
              backgroundPosition: '0% 0%, 0% 0%, 8% 30%, 65% 35%, 25% 55%, 72% 68%, 30% 88%',
              animation: 'earthRotate 180s linear infinite'
            }}
          />
          
          {/* Realistic Cloud Layer */}
          <div 
            className="absolute inset-0 w-full h-full rounded-full opacity-25"
            style={{
              background: `
                radial-gradient(ellipse 80px 40px at 25% 30%, rgba(255,255,255,0.9) 0%, transparent 70%),
                radial-gradient(ellipse 120px 50px at 70% 20%, rgba(255,255,255,0.7) 0%, transparent 70%),
                radial-gradient(ellipse 70px 30px at 80% 60%, rgba(255,255,255,0.8) 0%, transparent 70%),
                radial-gradient(ellipse 90px 35px at 15% 70%, rgba(255,255,255,0.6) 0%, transparent 70%),
                radial-gradient(ellipse 100px 45px at 60% 80%, rgba(255,255,255,0.7) 0%, transparent 70%),
                radial-gradient(ellipse 60px 25px at 85% 25%, rgba(255,255,255,0.5) 0%, transparent 70%),
                radial-gradient(ellipse 75px 35px at 35% 15%, rgba(255,255,255,0.6) 0%, transparent 70%)
              `,
              animation: 'cloudDrift 200s linear infinite'
            }}
          />
          
          {/* Simple Grid Lines for Reference */}
          <svg 
            className="absolute inset-0 w-full h-full rounded-full opacity-20"
            viewBox="0 0 400 400"
          >
            {/* Meridian lines */}
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={`meridian-${i}`}
                d={`M 200 20 Q ${200 + Math.sin(i * Math.PI / 6) * 180} 200 200 380`}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.5"
                opacity="0.6"
              />
            ))}
            
            {/* Latitude lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 60 + i * 50;
              const width = Math.sin((i + 1) * Math.PI / 8) * 160;
              return (
                <ellipse
                  key={`latitude-${i}`}
                  cx="200"
                  cy={y}
                  rx={width}
                  ry="3"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
              );
            })}
          </svg>

          {/* Day/Night Terminator */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                linear-gradient(135deg, 
                  transparent 0%, 
                  transparent 30%, 
                  rgba(0,0,0,0.1) 45%, 
                  rgba(0,0,0,0.3) 60%, 
                  rgba(0,0,0,0.6) 75%, 
                  rgba(0,0,0,0.8) 90%, 
                  rgba(0,0,0,0.9) 100%
                )
              `,
              animation: 'atmosphericShimmer 8s ease-in-out infinite'
            }}
          />
          
          {/* Atmospheric glow effects */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent 78%, rgba(59, 130, 246, 0.4) 85%, rgba(139, 92, 246, 0.3) 92%, rgba(6, 182, 212, 0.2) 98%, rgba(255,255,255,0.1) 100%)',
              filter: 'blur(4px)'
            }}
          />
          
          {/* Inner atmospheric layer */}
          <div 
            className="absolute inset-1 rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent 85%, rgba(135, 206, 235, 0.2) 90%, rgba(255, 255, 255, 0.1) 95%, transparent 100%)',
              filter: 'blur(2px)'
            }}
          />
          
          {/* Subtle Aurora effect */}
          <div 
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `
                conic-gradient(from 45deg, 
                  transparent 0deg, 
                  rgba(16, 185, 129, 0.3) 60deg, 
                  transparent 120deg,
                  rgba(139, 92, 246, 0.3) 180deg,
                  transparent 240deg,
                  rgba(59, 130, 246, 0.3) 300deg,
                  transparent 360deg
                )
              `,
              animation: 'spin 120s linear infinite',
              filter: 'blur(6px)'
            }}
          />
          
          {/* Surface lighting highlight */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(ellipse 60% 40% at 35% 30%, 
                  rgba(255,255,255,0.15) 0%, 
                  rgba(255,255,255,0.08) 40%, 
                  transparent 70%
                )
              `,
              filter: 'blur(1px)'
            }}
          />
        </motion.div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              translateX: particle.x,
              translateY: particle.y,
              translateZ: particle.z,
              transformStyle: 'preserve-3d',
              rotateX: rotationX,
              rotateY: rotationY
            }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* Currency Pins */}
        {currencies.map((pin) => {
          const pos = getTransformedPosition(pin);
          const isHovered = hoveredPin === pin.id;
          const isSelected = selectedPin === pin.id;
          
          if (!pos.isVisible) return null;
          
          return (
            <motion.div
              key={pin.id}
              className="absolute cursor-pointer"
              style={{
                left: '50%',
                top: '50%',
                translateX: pos.x,
                translateY: pos.y,
                translateZ: pos.z,
                transformStyle: 'preserve-3d',
                zIndex: Math.round(pos.z)
              }}
              whileHover={{ scale: 1.2 }}
              onMouseEnter={() => setHoveredPin(pin.id)}
              onMouseLeave={() => setHoveredPin(null)}
              onClick={() => handlePinClick(pin)}
            >
              {/* Pin Base */}
              <motion.div
                className="relative flex items-center justify-center"
                animate={{
                  scale: isSelected ? 1.3 : isHovered ? 1.1 : 1,
                  y: isHovered ? -5 : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Pin Shadow */}
                <div 
                  className="absolute top-8 w-6 h-3 rounded-full bg-black/20 blur-sm"
                  style={{ transform: 'rotateX(90deg) translateZ(-10px)' }}
                />
                
                {/* Pin Body */}
                <div
                  className="w-8 h-8 rounded-full border-2 border-white/20 backdrop-blur-xl flex items-center justify-center relative overflow-hidden"
                  style={{ 
                    backgroundColor: pin.color,
                    boxShadow: `0 0 20px ${pin.color}40, 0 4px 12px rgba(0,0,0,0.3)`
                  }}
                >
                  {/* Currency Symbol */}
                  <span className="text-white text-xs font-bold relative z-10">
                    {pin.symbol}
                  </span>
                  
                  {/* Ripple Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: pin.color }}
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                  
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                    animate={{
                      x: isHovered ? ['-100%', '100%'] : '-100%'
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                </div>

                {/* Connecting Line */}
                <div 
                  className="absolute top-8 w-0.5 h-4 bg-gradient-to-b from-white/60 to-transparent"
                  style={{ left: '50%', marginLeft: '-1px' }}
                />
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 min-w-max z-50"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <div className="text-center">
                      <div className="text-white text-sm font-medium">
                        {pin.currency}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {pin.country}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-white text-xs font-mono">
                          {pin.rate.toFixed(4)}
                        </span>
                        {pin.change !== 0 && (
                          <div className={`flex items-center gap-1 ${pin.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {pin.change > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            <span className="text-xs">
                              {Math.abs(pin.change).toFixed(2)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Orbit Rings */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute inset-0 rounded-full border border-white/5"
            style={{
              transform: `scale(${1.1 + i * 0.15})`,
              transformStyle: 'preserve-3d',
              rotateX: rotationX,
              rotateY: rotationY
            }}
            animate={{
              rotateZ: 360
            }}
            transition={{
              duration: 20 + i * 10,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </motion.div>

      {/* Interactive Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <motion.button
          className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white/60 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRotation({ x: 0, y: 0 })}
        >
          <Globe className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white/60 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setRotation(prev => ({ ...prev, y: prev.y + Math.PI / 2 }))}
        >
          <Orbit className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}