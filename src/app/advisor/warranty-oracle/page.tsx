'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import { 
  Shield, Zap, AlertTriangle, CheckCircle, XCircle, 
  ArrowLeft, Search, Upload, Camera, Sparkles,
  Gem, Eye, Star, Clock, DollarSign, TrendingDown,
  Wrench, Heart, Brain, Target, Award, Lightbulb,
  Wand2, Telescope, Radar, Scan, Atom,
  Layers, Orbit, Workflow, Network
} from 'lucide-react';

// Product and warranty data interfaces
interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'electronics' | 'appliances' | 'automotive' | 'home' | 'tools';
  price: number;
  purchaseDate: Date;
  warrantyPeriod: number; // months
  reliability: number; // 0-100
  commonFailures: FailurePoint[];
  repairCosts: RepairCost[];
  image?: string;
}

interface FailurePoint {
  component: string;
  probability: number; // 0-1
  timeframe: number; // months when likely to fail
  severity: 'minor' | 'major' | 'critical';
  description: string;
}

interface RepairCost {
  type: string;
  cost: number;
  probability: number;
  timeframe: number;
  covered: boolean; // by extended warranty
}

interface WarrantyAnalysis {
  recommendation: 'buy' | 'skip' | 'consider';
  confidence: number;
  expectedSavings: number;
  breakEvenPoint: number; // months
  riskScore: number;
  reasons: string[];
  timeline: WarrantyEvent[];
}

interface WarrantyEvent {
  month: number;
  type: 'failure' | 'repair' | 'warranty_expires' | 'extended_expires';
  description: string;
  cost: number;
  probability: number;
  covered: boolean;
}

// Enhanced product database with more realistic data
const mockProducts: Product[] = [
  {
    id: 'iphone-15',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'electronics',
    price: 999,
    purchaseDate: new Date(),
    warrantyPeriod: 12,
    reliability: 85,
    commonFailures: [
      {
        component: 'Battery',
        probability: 0.15,
        timeframe: 24,
        severity: 'minor',
        description: 'Battery capacity degradation below 80%'
      },
      {
        component: 'Screen',
        probability: 0.08,
        timeframe: 18,
        severity: 'major',
        description: 'Cracked or unresponsive display'
      },
      {
        component: 'Camera System',
        probability: 0.05,
        timeframe: 30,
        severity: 'major',
        description: 'Camera module failure or focus issues'
      }
    ],
    repairCosts: [
      { type: 'Battery Replacement', cost: 99, probability: 0.15, timeframe: 24, covered: true },
      { type: 'Screen Repair', cost: 329, probability: 0.08, timeframe: 18, covered: true },
      { type: 'Camera Repair', cost: 199, probability: 0.05, timeframe: 30, covered: true }
    ]
  },
  {
    id: 'macbook-pro',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    category: 'electronics',
    price: 2499,
    purchaseDate: new Date(),
    warrantyPeriod: 12,
    reliability: 90,
    commonFailures: [
      {
        component: 'Keyboard',
        probability: 0.12,
        timeframe: 20,
        severity: 'minor',
        description: 'Key sticking or butterfly mechanism failure'
      },
      {
        component: 'Logic Board',
        probability: 0.03,
        timeframe: 36,
        severity: 'critical',
        description: 'Motherboard component failure'
      }
    ],
    repairCosts: [
      { type: 'Keyboard Replacement', cost: 349, probability: 0.12, timeframe: 20, covered: true },
      { type: 'Logic Board Repair', cost: 899, probability: 0.03, timeframe: 36, covered: true }
    ]
  },
  {
    id: 'samsung-tv',
    name: 'Samsung QLED 65"',
    brand: 'Samsung',
    category: 'electronics',
    price: 1299,
    purchaseDate: new Date(),
    warrantyPeriod: 12,
    reliability: 88,
    commonFailures: [
      {
        component: 'Backlight',
        probability: 0.18,
        timeframe: 28,
        severity: 'major',
        description: 'LED backlight strip failure causing dark spots'
      },
      {
        component: 'Power Supply',
        probability: 0.11,
        timeframe: 34,
        severity: 'critical',
        description: 'Power board component failure'
      }
    ],
    repairCosts: [
      { type: 'Backlight Repair', cost: 450, probability: 0.18, timeframe: 28, covered: true },
      { type: 'Power Supply Replacement', cost: 299, probability: 0.11, timeframe: 34, covered: true }
    ]
  },
  {
    id: 'dyson-vacuum',
    name: 'Dyson V15 Detect',
    brand: 'Dyson',
    category: 'appliances',
    price: 649,
    purchaseDate: new Date(),
    warrantyPeriod: 24,
    reliability: 82,
    commonFailures: [
      {
        component: 'Battery Pack',
        probability: 0.22,
        timeframe: 26,
        severity: 'major',
        description: 'Li-ion battery degradation affecting runtime'
      },
      {
        component: 'Motor Assembly',
        probability: 0.09,
        timeframe: 40,
        severity: 'critical',
        description: 'Digital motor bearing failure'
      }
    ],
    repairCosts: [
      { type: 'Battery Replacement', cost: 149, probability: 0.22, timeframe: 26, covered: true },
      { type: 'Motor Repair', cost: 289, probability: 0.09, timeframe: 40, covered: true }
    ]
  }
];

// Advanced particle system for magical effects
const ParticleSystem = ({ isActive, type = 'sparkle' }: { isActive: boolean; type?: 'sparkle' | 'energy' | 'quantum' }) => {
  const particles = useMemo(() => {
    return Array.from({ length: type === 'quantum' ? 30 : 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      scale: 0.3 + Math.random() * 0.7
    }));
  }, [type]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute w-1 h-1 rounded-full ${
            type === 'energy' ? 'bg-cyan-400/80' :
            type === 'quantum' ? 'bg-purple-400/60' :
            'bg-white/70'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            scale: [0, particle.scale, 0],
            opacity: [0, 1, 0],
            rotate: type === 'quantum' ? [0, 360] : 0,
            x: type === 'energy' ? [-20, 20] : 0,
            y: type === 'energy' ? [-10, 10] : type === 'quantum' ? [-30, 30] : 0,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: type === 'quantum' ? 'easeInOut' : 'linear'
          }}
        />
      ))}
    </div>
  );
};

// Enhanced 3D-like crystal ball rings
const CrystalRings = ({ isAnalyzing }: { isAnalyzing: boolean }) => {
  const rings = useMemo(() => [
    { size: '120%', delay: 0, speed: 8, opacity: 0.3 },
    { size: '140%', delay: 0.5, speed: 12, opacity: 0.2 },
    { size: '160%', delay: 1, speed: 16, opacity: 0.15 },
    { size: '180%', delay: 1.5, speed: 20, opacity: 0.1 }
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          className="absolute border border-cyan-400/40 rounded-full"
          style={{
            width: ring.size,
            height: ring.size,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: ring.opacity
          }}
          animate={isAnalyzing ? {
            rotate: 360,
            scale: [1, 1.1, 1],
            borderColor: [
              'rgba(34, 211, 238, 0.4)',
              'rgba(168, 85, 247, 0.4)',
              'rgba(236, 72, 153, 0.4)',
              'rgba(34, 211, 238, 0.4)'
            ]
          } : {
            rotate: 360
          }}
          transition={{
            rotate: { duration: ring.speed, repeat: Infinity, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, delay: ring.delay },
            borderColor: { duration: 4, repeat: Infinity, delay: ring.delay }
          }}
        />
      ))}
    </div>
  );
};

// Crystal Ball Component with mystical animations
const CrystalBall = ({ 
  product, 
  isAnalyzing, 
  analysis,
  onDrop 
}: { 
  product: Product | null;
  isAnalyzing: boolean;
  analysis: WarrantyAnalysis | null;
  onDrop: (files: FileList) => void;
}) => {
  const [visions, setVisions] = useState<WarrantyEvent[]>([]);
  const [currentVision, setCurrentVision] = useState(0);
  const ballRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const rotateY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  useEffect(() => {
    if (analysis?.timeline) {
      setVisions(analysis.timeline);
      setCurrentVision(0);
      
      const interval = setInterval(() => {
        setCurrentVision(prev => (prev + 1) % analysis.timeline.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [analysis]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ballRef.current) return;
    
    const rect = ballRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) * 0.1);
    mouseY.set((e.clientY - centerY) * 0.1);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files) {
      onDrop(e.dataTransfer.files);
    }
  };

  return (
    <div 
      className="relative w-80 h-80 mx-auto"
      onMouseMove={handleMouseMove}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Mystical base */}
      <div className="absolute bottom-0 w-full h-8 bg-gradient-to-r from-purple-900/50 via-indigo-800/50 to-purple-900/50 rounded-full blur-sm" />
      
      {/* Crystal ball */}
      <motion.div
        ref={ballRef}
        className="relative w-64 h-64 mx-auto"
        style={{ 
          rotateX: rotateY,
          rotateY: rotateX,
          transformStyle: 'preserve-3d'
        }}
        animate={isAnalyzing ? {
          scale: [1, 1.05, 1],
          rotateZ: [0, 360]
        } : {}}
        transition={isAnalyzing ? {
          scale: { duration: 2, repeat: Infinity },
          rotateZ: { duration: 20, repeat: Infinity, ease: 'linear' }
        } : {}}
      >
        {/* Main crystal sphere */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-400/20 via-blue-500/30 to-purple-600/20 border-2 border-white/20 backdrop-blur-xl overflow-hidden">
          {/* Inner swirling mist */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-transparent">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: [
                  'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
          
          {/* Product reflection if available */}
          {product && !isAnalyzing && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                <p className="text-white/70 text-xs">{product.brand}</p>
              </div>
            </motion.div>
          )}
          
          {/* Mystical visions during analysis */}
          {isAnalyzing && visions.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVision}
                className="absolute inset-0 flex items-center justify-center p-6"
                initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center">
                  <motion.div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      visions[currentVision]?.type === 'failure' ? 'bg-red-500/30' :
                      visions[currentVision]?.type === 'repair' ? 'bg-yellow-500/30' :
                      'bg-blue-500/30'
                    }`}
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {visions[currentVision]?.type === 'failure' ? <AlertTriangle className="w-6 h-6 text-red-400" /> :
                     visions[currentVision]?.type === 'repair' ? <Wrench className="w-6 h-6 text-yellow-400" /> :
                     <Shield className="w-6 h-6 text-blue-400" />}
                  </motion.div>
                  <p className="text-white text-xs leading-relaxed">
                    {visions[currentVision]?.description}
                  </p>
                  <div className="text-white/60 text-xs mt-2">
                    Month {visions[currentVision]?.month} • ${visions[currentVision]?.cost}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          
          {/* Floating sparkles */}
          <div className="absolute inset-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + (i % 4) * 20}%`,
                  top: `${20 + Math.floor(i / 4) * 20}%`
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: 360
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
          
          {/* Drop zone indicator */}
          {!product && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 text-sm font-medium">Drop product image</p>
                <p className="text-white/60 text-xs">or click to upload</p>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Mystical glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-600/20 blur-xl"
          animate={isAnalyzing ? {
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          } : {
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Floating runes around the crystal ball */}
      <div className="absolute inset-0">
        {['$', '%', '⚡', '🛡️', '⚠️', '✨'].map((rune, i) => (
          <motion.div
            key={i}
            className="absolute text-white/40 text-lg"
            style={{
              left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 45}%`,
              top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 45}%`
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {rune}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Warranty Shield Visualizer
const WarrantyShield = ({ 
  product, 
  analysis 
}: { 
  product: Product | null;
  analysis: WarrantyAnalysis | null;
}) => {
  if (!product || !analysis) return null;

  const shieldStrength = Math.min(100, analysis.confidence);
  const coverage = analysis.recommendation === 'buy' ? 85 : analysis.recommendation === 'consider' ? 60 : 30;

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Product silhouette */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center">
          <Shield className="w-16 h-16 text-white/40" />
        </div>
      </div>
      
      {/* Shield layers */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-blue-500/30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: coverage > 70 ? 0.8 : coverage > 40 ? 0.5 : 0.2,
          rotate: 360 
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-green-500/40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: coverage > 60 ? 0.6 : 0,
          rotate: -360 
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Failure points as cracks */}
      {product.commonFailures.map((failure, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 bg-gradient-to-t ${
            failure.severity === 'critical' ? 'from-red-500 to-red-300 h-16' :
            failure.severity === 'major' ? 'from-orange-500 to-orange-300 h-12' :
            'from-yellow-500 to-yellow-300 h-8'
          }`}
          style={{
            left: `${40 + i * 20}%`,
            top: `${30 + i * 15}%`,
            transform: `rotate(${i * 45}deg)`
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scaleY: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
      
      {/* Shield strength indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {coverage}%
          </div>
          <div className="text-sm text-gray-400">Protection</div>
        </div>
      </div>
    </div>
  );
};

// Analysis Results Display
const AnalysisResults = ({ 
  product, 
  analysis 
}: { 
  product: Product | null;
  analysis: WarrantyAnalysis | null;
}) => {
  if (!product || !analysis) return null;

  const getRecommendationColor = () => {
    switch (analysis.recommendation) {
      case 'buy': return 'from-green-500 to-emerald-500';
      case 'skip': return 'from-red-500 to-rose-500';
      case 'consider': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRecommendationIcon = () => {
    switch (analysis.recommendation) {
      case 'buy': return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'skip': return <XCircle className="w-8 h-8 text-red-400" />;
      case 'consider': return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      default: return <Eye className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Main Recommendation */}
      <div className={`p-8 rounded-3xl bg-gradient-to-br ${getRecommendationColor()}/10 border border-white/10`}>
        <div className="text-center mb-6">
          {getRecommendationIcon()}
          <h2 className="text-3xl font-bold text-white mt-4 mb-2">
            {analysis.recommendation === 'buy' ? 'Buy Extended Warranty' :
             analysis.recommendation === 'skip' ? 'Skip the Warranty' :
             'Consider Your Options'}
          </h2>
          <div className="text-xl text-white/80">
            {Math.round(analysis.confidence * 100)}% Confidence
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              ${Math.abs(analysis.expectedSavings)}
            </div>
            <div className="text-sm text-gray-400">
              {analysis.expectedSavings > 0 ? 'Potential Savings' : 'Potential Cost'}
            </div>
          </div>
          
          <div className="text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {analysis.breakEvenPoint} mo
            </div>
            <div className="text-sm text-gray-400">Break-even Point</div>
          </div>
          
          <div className="text-center">
            <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {Math.round(analysis.riskScore * 10)}/10
            </div>
            <div className="text-sm text-gray-400">Risk Score</div>
          </div>
        </div>
      </div>
      
      {/* Reasoning */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          Oracle's Wisdom
        </h3>
        <div className="space-y-4">
          {analysis.reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-300">{reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Timeline Visualization */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Gem className="w-6 h-6 text-cyan-400" />
          Future Timeline
        </h3>
        <div className="space-y-4">
          {analysis.timeline.slice(0, 5).map((event, idx) => (
            <motion.div
              key={idx}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                event.type === 'failure' ? 'bg-red-500/20' :
                event.type === 'repair' ? 'bg-yellow-500/20' :
                'bg-blue-500/20'
              }`}>
                {event.type === 'failure' ? <AlertTriangle className="w-5 h-5 text-red-400" /> :
                 event.type === 'repair' ? <Wrench className="w-5 h-5 text-yellow-400" /> :
                 <Shield className="w-5 h-5 text-blue-400" />}
              </div>
              
              <div className="flex-1">
                <div className="text-white font-medium">{event.description}</div>
                <div className="text-gray-400 text-sm">
                  Month {event.month} • {Math.round(event.probability * 100)}% likely
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${event.covered ? 'text-green-400' : 'text-red-400'}`}>
                  ${event.cost}
                </div>
                <div className={`text-xs ${event.covered ? 'text-green-400' : 'text-red-400'}`}>
                  {event.covered ? 'Covered' : 'Out of pocket'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function WarrantyOraclePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<WarrantyAnalysis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock warranty analysis calculation
  const analyzeWarranty = (product: Product): WarrantyAnalysis => {
    const warrantyPrice = product.price * 0.15; // 15% of product price
    const expectedRepairCosts = product.repairCosts.reduce((sum, repair) => 
      sum + (repair.cost * repair.probability), 0
    );
    
    const expectedSavings = expectedRepairCosts - warrantyPrice;
    const breakEvenPoint = Math.ceil(warrantyPrice / (expectedRepairCosts / 36));
    const riskScore = 1 - (product.reliability / 100);
    
    let recommendation: 'buy' | 'skip' | 'consider' = 'consider';
    if (expectedSavings > warrantyPrice * 0.2) recommendation = 'buy';
    else if (expectedSavings < -warrantyPrice * 0.2) recommendation = 'skip';
    
    const confidence = Math.min(0.95, 0.6 + (Math.abs(expectedSavings) / warrantyPrice) * 0.3);
    
    const reasons = [];
    if (recommendation === 'buy') {
      reasons.push('Expected repair costs exceed warranty price');
      reasons.push('Product has known reliability issues');
      reasons.push('Warranty covers most common failures');
    } else if (recommendation === 'skip') {
      reasons.push('Product is highly reliable');
      reasons.push('Warranty cost is too high for expected repairs');
      reasons.push('Self-insurance would be more cost-effective');
    } else {
      reasons.push('Marginal cost-benefit difference');
      reasons.push('Consider your risk tolerance');
      reasons.push('Warranty may provide peace of mind');
    }
    
    // Generate timeline events
    const timeline: WarrantyEvent[] = [];
    timeline.push({
      month: product.warrantyPeriod,
      type: 'warranty_expires',
      description: 'Manufacturer warranty expires',
      cost: 0,
      probability: 1,
      covered: false
    });
    
    product.repairCosts.forEach(repair => {
      if (repair.probability > 0.05) {
        timeline.push({
          month: repair.timeframe,
          type: 'failure',
          description: `Potential ${repair.type.toLowerCase()}`,
          cost: repair.cost,
          probability: repair.probability,
          covered: repair.covered
        });
      }
    });
    
    timeline.push({
      month: 48,
      type: 'extended_expires',
      description: 'Extended warranty expires',
      cost: 0,
      probability: 1,
      covered: false
    });
    
    timeline.sort((a, b) => a.month - b.month);
    
    return {
      recommendation,
      confidence,
      expectedSavings,
      breakEvenPoint,
      riskScore,
      reasons,
      timeline
    };
  };

  const handleProductSelection = (product: Product) => {
    setSelectedProduct(product);
    setIsAnalyzing(true);
    setAnalysis(null);
    
    // Simulate analysis time
    setTimeout(() => {
      const result = analyzeWarranty(product);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleFileUpload = (files: FileList) => {
    // In a real app, this would process the image and identify the product
    // For now, we'll simulate by selecting a random product
    const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    handleProductSelection(randomProduct);
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout>
      <TimeBasedBackground>
        <MagneticCursor />
        
        <div className="min-h-screen">
          {/* Header */}
          <motion.div
            className="max-w-7xl mx-auto px-6 py-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.button
                className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                onClick={() => window.history.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div>
                <h1 className="text-3xl font-bold text-white">Extended Warranty Oracle</h1>
                <p className="text-gray-400">Peer into the crystal ball of product futures</p>
              </div>
            </div>

            {/* Mystical atmosphere */}
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/40 mb-4"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.3)',
                    '0 0 30px rgba(168, 85, 247, 0.5)',
                    '0 0 20px rgba(168, 85, 247, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Gem className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 font-medium">Mystical Product Analysis</span>
              </motion.div>
            </div>
          </motion.div>

          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Crystal Ball */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">The Crystal Ball</h2>
                  <p className="text-gray-400 mb-8">
                    Drop your product into the mystical sphere to reveal its warranty destiny
                  </p>
                </div>
                
                <CrystalBall
                  product={selectedProduct}
                  isAnalyzing={isAnalyzing}
                  analysis={analysis}
                  onDrop={handleFileUpload}
                />
                
                {/* Product search */}
                <div className="max-w-md mx-auto">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filteredProducts.map(product => (
                      <motion.button
                        key={product.id}
                        className="w-full p-3 text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                        onClick={() => handleProductSelection(product)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-sm text-gray-400">{product.brand} • ${product.price}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Analysis Results */}
              <div>
                {!selectedProduct ? (
                  <div className="text-center py-20">
                    <Eye className="w-24 h-24 text-gray-400 mx-auto mb-6 opacity-50" />
                    <h3 className="text-xl font-semibold text-white mb-4">
                      The Oracle Awaits
                    </h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Select a product or drop an image into the crystal ball to begin your warranty destiny reading.
                    </p>
                  </div>
                ) : isAnalyzing ? (
                  <div className="text-center py-20">
                    <motion.div
                      className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Consulting the Oracle...
                    </h3>
                    <p className="text-gray-400">
                      Peering through time to see your product's future
                    </p>
                  </div>
                ) : (
                  <AnalysisResults product={selectedProduct} analysis={analysis} />
                )}
              </div>
            </div>
          </div>
          
          {/* Enhanced floating action button */}
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 2, duration: 0.8, type: 'spring', stiffness: 200 }}
          >
            <motion.button
              className="group relative w-16 h-16 bg-gradient-to-br from-purple-500 via-cyan-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
              whileHover={{ 
                scale: 1.1,
                rotate: 180,
                boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)'
              }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.4)',
                  '0 0 30px rgba(6, 182, 212, 0.6)',
                  '0 0 20px rgba(236, 72, 153, 0.4)',
                  '0 0 20px rgba(168, 85, 247, 0.4)'
                ]
              }}
              transition={{ 
                boxShadow: { duration: 3, repeat: Infinity }
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              
              <motion.div
                className="relative z-10"
                animate={{ rotate: -180 }}
                transition={{ duration: 0.5 }}
                whileHover={{ rotate: 0 }}
              >
                <Wand2 className="w-6 h-6 text-white drop-shadow-lg" />
              </motion.div>
              
              {/* Magic particles */}
              <div className="absolute inset-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/80 rounded-full"
                    animate={{
                      x: [0, Math.cos(i * 60 * Math.PI / 180) * 30],
                      y: [0, Math.sin(i * 60 * Math.PI / 180) * 30],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            </motion.button>
            
            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
            >
              Return to Oracle's Chamber
            </motion.div>
          </motion.div>
        </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}