'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Briefcase, Home, TrendingUp, DollarSign, Zap, Star } from 'lucide-react';

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  color: string;
  icon: React.ElementType;
  particles: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  source: string;
}

const incomeSources: IncomeSource[] = [
  {
    id: 'salary',
    name: 'Salary',
    amount: 8500,
    color: '#3B82F6',
    icon: Briefcase,
    particles: 25,
  },
  {
    id: 'rental',
    name: 'Rental Income',
    amount: 2300,
    color: '#10B981',
    icon: Home,
    particles: 15,
  },
  {
    id: 'investments',
    name: 'Investments',
    amount: 1850,
    color: '#8B5CF6',
    icon: TrendingUp,
    particles: 12,
  },
  {
    id: 'freelance',
    name: 'Freelance',
    amount: 980,
    color: '#F59E0B',
    icon: Zap,
    particles: 8,
  },
];

export default function IncomeStreams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const newParticles: Particle[] = [];
      
      incomeSources.forEach((source, sourceIndex) => {
        const sourceY = 50 + sourceIndex * 80;
        
        for (let i = 0; i < source.particles; i++) {
          newParticles.push({
            id: `${source.id}-${i}`,
            x: Math.random() * canvas.offsetWidth,
            y: sourceY + (Math.random() - 0.5) * 40,
            vx: 0.5 + Math.random() * 1.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: 1 + Math.random() * 3,
            color: source.color,
            source: source.id,
          });
        }
      });
      
      setParticles(newParticles);
    };

    initParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          // Update position
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          
          // Reset particle if it goes off screen
          if (newX > canvas.offsetWidth + 10) {
            newX = -10;
            newY = 50 + incomeSources.findIndex(s => s.id === particle.source) * 80 + (Math.random() - 0.5) * 40;
          }
          
          // Draw particle with glow effect
          const gradient = ctx.createRadialGradient(newX, newY, 0, newX, newY, particle.size * 2);
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          
          ctx.globalAlpha = 0.8;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(newX, newY, particle.size * 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw core particle
          ctx.globalAlpha = 1;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(newX, newY, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          return {
            ...particle,
            x: newX,
            y: newY,
          };
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mounted]);

  const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);

  return (
    <div className="relative bg-gradient-to-br from-luxury-900/50 to-luxury-800/30 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-wisdom-500/5 via-trust-500/5 to-growth-500/5" />
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Income Streams</h2>
            <p className="text-gray-400">Real-time cash flow visualization</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Total Monthly</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-growth-400 to-growth-600 bg-clip-text text-transparent">
              ${totalIncome.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Canvas for particles */}
        <div className="relative h-72 mb-6">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Income source labels */}
          <div className="absolute inset-0 pointer-events-none">
            {incomeSources.map((source, index) => {
              const Icon = source.icon;
              return (
                <motion.div
                  key={source.id}
                  className="absolute left-0 flex items-center"
                  style={{ top: `${30 + index * 80}px` }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <div 
                    className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border border-white/20"
                    style={{ backgroundColor: `${source.color}20` }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: source.color }}
                    />
                    <span className="text-white font-medium">{source.name}</span>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: source.color }}
                    >
                      ${source.amount.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Collection point */}
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5, type: 'spring' }}
          >
            <div className="relative">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-r from-wisdom-500 to-trust-500 flex items-center justify-center"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.5)',
                    '0 0 40px rgba(168, 85, 247, 0.8)',
                    '0 0 20px rgba(168, 85, 247, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <DollarSign className="w-8 h-8 text-white" />
              </motion.div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-wisdom-500/20 to-trust-500/20 blur-lg" />
            </div>
          </motion.div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Active Streams</p>
            <p className="text-2xl font-bold text-white">{incomeSources.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Growth Rate</p>
            <p className="text-2xl font-bold text-growth-400">+12.5%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Diversity Score</p>
            <p className="text-2xl font-bold text-wisdom-400">8.7/10</p>
          </div>
        </div>
      </div>
    </div>
  );
}