'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  DollarSign, Euro, Zap, TrendingUp, TrendingDown,
  MapPin, Globe, Orbit, Star, Sparkles, BarChart3
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

interface RealisticGlobeProps {
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

export default function RealisticGlobe({ 
  onCurrencySelect,
  className = '' 
}: RealisticGlobeProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [showGrid, setShowGrid] = useState(false);
  const [dayNightMode, setDayNightMode] = useState(false);
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
    if (isDragging || !autoRotate) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: prev.y + rotationSpeed
      }));
    }, 16);
    
    return () => clearInterval(interval);
  }, [isDragging, autoRotate, rotationSpeed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const step = 0.1;
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          setRotation(prev => ({ ...prev, y: prev.y - step }));
          break;
        case 'ArrowRight':
          event.preventDefault();
          setRotation(prev => ({ ...prev, y: prev.y + step }));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setRotation(prev => ({ ...prev, x: prev.x - step }));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setRotation(prev => ({ ...prev, x: prev.x + step }));
          break;
        case ' ':
          event.preventDefault();
          setAutoRotate(!autoRotate);
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          setRotation({ x: 0, y: 0 });
          break;
        case 'g':
        case 'G':
          event.preventDefault();
          setShowGrid(!showGrid);
          break;
        case 'd':
        case 'D':
          event.preventDefault();
          setDayNightMode(!dayNightMode);
          break;
        case '+':
        case '=':
          event.preventDefault();
          setZoomLevel(prev => Math.min(prev + 0.1, 2));
          break;
        case '-':
          event.preventDefault();
          setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [autoRotate, showGrid, dayNightMode]);

  // Mouse wheel zoom
  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY * -0.001;
    setZoomLevel(prev => Math.max(0.5, Math.min(2, prev + delta)));
  }, []);

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
        @keyframes earthRotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0px); }
          100% { transform: translateX(20px); }
        }
        @keyframes atmosphericShimmer {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
      `}</style>
      
      {/* Globe Container */}
      <motion.div
        ref={globeRef}
        className="relative w-96 h-96 cursor-grab active:cursor-grabbing focus:outline-none"
        style={{
          perspective: 1000,
          transformStyle: 'preserve-3d',
          scale: zoomLevel
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        tabIndex={0}
        animate={{
          scale: zoomLevel
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
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
          {/* Real NASA Blue Marble Earth */}
          <div 
            className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
            style={{
              background: `
                url("https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/512px-The_Earth_seen_from_Apollo_17.jpg"),
                radial-gradient(circle at 30% 30%, #0a4d6b 0%, #1976d2 50%, #2563eb 100%)
              `,
              backgroundSize: 'cover, 100% 100%',
              backgroundPosition: 'center, center',
              backgroundRepeat: 'no-repeat, no-repeat',
              animation: 'earthRotate 180s linear infinite',
              filter: 'contrast(1.1) saturate(1.15) brightness(0.9)'
            }}
          />
          
          {/* Day/Night Terminator */}
          {dayNightMode && (
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `
                  linear-gradient(135deg, 
                    transparent 0%, 
                    transparent 30%, 
                    rgba(0,0,0,0.2) 45%, 
                    rgba(0,0,0,0.5) 60%, 
                    rgba(0,0,0,0.8) 75%, 
                    rgba(0,0,0,0.95) 90%, 
                    rgba(0,0,0,1) 100%
                  )
                `,
                animation: 'earthRotate 300s linear infinite'
              }}
            />
          )}

          {/* Cloud Layer */}
          <div 
            className="absolute inset-0 w-full h-full rounded-full opacity-25"
            style={{
              background: `
                radial-gradient(ellipse 80px 40px at 25% 30%, rgba(255,255,255,0.9) 0%, transparent 70%),
                radial-gradient(ellipse 120px 50px at 70% 20%, rgba(255,255,255,0.7) 0%, transparent 70%),
                radial-gradient(ellipse 70px 30px at 80% 60%, rgba(255,255,255,0.8) 0%, transparent 70%),
                radial-gradient(ellipse 90px 35px at 15% 70%, rgba(255,255,255,0.6) 0%, transparent 70%),
                radial-gradient(ellipse 100px 45px at 60% 80%, rgba(255,255,255,0.7) 0%, transparent 70%)
              `,
              animation: 'cloudDrift 200s linear infinite'
            }}
          />

          {/* Grid Lines */}
          {showGrid && (
            <svg 
              className="absolute inset-0 w-full h-full rounded-full opacity-30"
              viewBox="0 0 400 400"
            >
              {/* Meridian lines */}
              {Array.from({ length: 12 }).map((_, i) => (
                <path
                  key={`meridian-${i}`}
                  d={`M 200 20 Q ${200 + Math.sin(i * Math.PI / 6) * 180} 200 200 380`}
                  fill="none"
                  stroke="rgba(0,255,255,0.6)"
                  strokeWidth="1"
                  opacity="0.8"
                />
              ))}
              
              {/* Latitude lines */}
              {Array.from({ length: 9 }).map((_, i) => {
                const y = 40 + i * 40;
                const width = Math.sin((i + 1) * Math.PI / 10) * 160;
                return (
                  <ellipse
                    key={`latitude-${i}`}
                    cx="200"
                    cy={y}
                    rx={width}
                    ry="3"
                    fill="none"
                    stroke="rgba(0,255,255,0.6)"
                    strokeWidth="1"
                    opacity="0.8"
                  />
                );
              })}
            </svg>
          )}
          
          {/* Atmospheric effects */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent 78%, rgba(59, 130, 246, 0.4) 85%, rgba(139, 92, 246, 0.3) 92%, rgba(6, 182, 212, 0.2) 98%, rgba(255,255,255,0.1) 100%)',
              filter: 'blur(4px)'
            }}
          />
        </motion.div>

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

                  {/* Pulse Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-1"
                    style={{ 
                      borderColor: pin.color,
                      borderWidth: '1px'
                    }}
                    animate={{
                      scale: [1, 2.5, 1],
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1
                    }}
                  />
                </div>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

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
          title="Reset View (R)"
        >
          <Globe className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          className={`p-2 backdrop-blur-xl border border-white/20 rounded-xl transition-colors ${
            autoRotate ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/60 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Auto-Rotation (Space)"
        >
          <Orbit className="w-4 h-4" />
        </motion.button>

        <motion.button
          className={`p-2 backdrop-blur-xl border border-white/20 rounded-xl transition-colors ${
            showGrid ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white/60 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Grid Lines (G)"
        >
          <BarChart3 className="w-4 h-4" />
        </motion.button>

        <motion.button
          className={`p-2 backdrop-blur-xl border border-white/20 rounded-xl transition-colors ${
            dayNightMode ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10 text-white/60 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDayNightMode(!dayNightMode)}
          title="Toggle Day/Night (D)"
        >
          <Star className="w-4 h-4" />
        </motion.button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-2">
          <motion.button
            className="p-1 text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.5))}
            title="Zoom Out (-)"
          >
            <span className="text-lg font-bold">−</span>
          </motion.button>
          
          <span className="text-white/80 text-xs font-mono min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          
          <motion.button
            className="p-1 text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 2))}
            title="Zoom In (+)"
          >
            <span className="text-lg font-bold">+</span>
          </motion.button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3">
        <div className="text-white text-sm font-medium mb-2">Rotation Speed</div>
        <input
          type="range"
          min="0"
          max="0.02"
          step="0.001"
          value={rotationSpeed}
          onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
          className="w-32 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(rotationSpeed / 0.02) * 100}%, rgba(255,255,255,0.2) ${(rotationSpeed / 0.02) * 100}%, rgba(255,255,255,0.2) 100%)`
          }}
        />
        <div className="text-white/60 text-xs mt-1">
          {rotationSpeed === 0 ? 'Paused' : `${(rotationSpeed * 1000).toFixed(1)}x`}
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3">
        <div className="text-white text-sm font-medium mb-2">Controls</div>
        <div className="text-white/60 text-xs space-y-1">
          <div>Arrow Keys: Rotate</div>
          <div>Mouse Wheel: Zoom</div>
          <div>Space: Auto-rotate</div>
          <div>G: Grid • D: Day/Night</div>
          <div>R: Reset • +/-: Zoom</div>
        </div>
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