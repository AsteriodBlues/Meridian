'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import TimeBasedBackground from '@/components/dashboard/TimeBasedBackground';
import PageLayout from '@/components/layout/PageLayout';
import MagneticCursor from '@/components/ui/MagneticCursor';
import { 
  Brain, Sparkles, Car, Shield, TrendingUp, Clock, 
  MessageSquare, FileText, Search, Zap, Target, 
  Gem, Compass, Map, Route, ChevronRight,
  Play, Pause, RotateCcw, Settings, Eye,
  Bot, User, Star, Award, Lightbulb, Heart
} from 'lucide-react';

// Advisor Module Interface
interface AdvisorModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  category: 'purchase' | 'finance' | 'timing' | 'legal';
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedTime: string;
  isPopular: boolean;
  confidence: number;
}

const advisorModules: AdvisorModule[] = [
  {
    id: 'buy-vs-lease',
    title: 'Buy vs Lease',
    subtitle: 'The Car Journey Simulator',
    description: 'Watch two parallel universes unfold as you drive through time. See depreciation, equity, and total costs in a cinematic split-screen experience.',
    icon: Car,
    color: '#3B82F6',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500',
    category: 'purchase',
    complexity: 'moderate',
    estimatedTime: '3-5 min',
    isPopular: true,
    confidence: 92
  },
  {
    id: 'warranty-oracle',
    title: 'Extended Warranty',
    subtitle: 'Crystal Ball Oracle',
    description: 'Peer into the future of your products. See visions of potential failures, repair costs, and warranty coverage in mystical clarity.',
    icon: Shield,
    color: '#8B5CF6',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-500',
    category: 'purchase',
    complexity: 'simple',
    estimatedTime: '2-3 min',
    isPopular: true,
    confidence: 89
  },
  {
    id: 'rate-navigator',
    title: 'Fixed vs Variable',
    subtitle: 'Rate Timeline Navigator',
    description: 'Navigate the interest rate rapids. Choose between calm, predictable waters or thrilling variable currents with economic weather forecasts.',
    icon: TrendingUp,
    color: '#10B981',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-500',
    category: 'finance',
    complexity: 'complex',
    estimatedTime: '4-6 min',
    isPopular: false,
    confidence: 87
  },
  {
    id: 'timing-oracle',
    title: 'Now or Wait?',
    subtitle: 'Market Time Machine',
    description: 'Travel through time to see investment outcomes. Split timelines show opportunity costs and compound interest growing like enchanted forests.',
    icon: Clock,
    color: '#F59E0B',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-orange-500',
    category: 'timing',
    complexity: 'complex',
    estimatedTime: '5-7 min',
    isPopular: true,
    confidence: 84
  },
  {
    id: 'negotiation-dojo',
    title: 'Negotiation Theater',
    subtitle: 'AI Training Dojo',
    description: 'Master the art of negotiation with AI-powered practice sessions. Build confidence, learn tactics, and unlock your bargaining power.',
    icon: MessageSquare,
    color: '#EF4444',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-rose-500',
    category: 'purchase',
    complexity: 'moderate',
    estimatedTime: '10-15 min',
    isPopular: false,
    confidence: 91
  },
  {
    id: 'contract-detector',
    title: 'Contract Red Flags',
    subtitle: 'Legal Lighthouse',
    description: 'Scan contracts like a forensic investigator. X-ray vision reveals hidden dangers, problematic terms, and escape clauses.',
    icon: FileText,
    color: '#6366F1',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-blue-500',
    category: 'legal',
    complexity: 'complex',
    estimatedTime: '3-8 min',
    isPopular: true,
    confidence: 95
  },
  {
    id: 'fine-print-translator',
    title: 'Fine Print Translator',
    subtitle: 'Jargon Decoder Ring',
    description: 'Ancient decoder meets modern AI. Transform legal gibberish into plain English with mystical translation powers.',
    icon: Search,
    color: '#EC4899',
    gradientFrom: 'from-pink-500',
    gradientTo: 'to-purple-500',
    category: 'legal',
    complexity: 'simple',
    estimatedTime: '1-3 min',
    isPopular: true,
    confidence: 93
  },
  {
    id: 'price-analyzer',
    title: 'Price Analyzer',
    subtitle: 'Value Detection System',
    description: 'AI-powered price intelligence that scans markets in real-time. Discover if you\'re getting a deal or being taken for a ride.',
    icon: Target,
    color: '#0EA5E9',
    gradientFrom: 'from-sky-500',
    gradientTo: 'to-blue-500',
    category: 'purchase',
    complexity: 'simple',
    estimatedTime: '1-2 min',
    isPopular: false,
    confidence: 88
  }
];

// Floating particles component
const FloatingParticles = ({ count = 50 }: { count?: number }) => {
  const particlesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const particles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const animate = () => {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
      });
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          animate={{
            x: Math.sin(Date.now() * 0.001 + i) * 100 + window.innerWidth * 0.5,
            y: Math.cos(Date.now() * 0.001 + i * 0.5) * 100 + window.innerHeight * 0.5,
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i * 0.1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Module Card Component
const AdvisorModuleCard = ({ module, index, onSelect }: { 
  module: AdvisorModule; 
  index: number;
  onSelect: (moduleId: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const Icon = module.icon;
  
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div 
        className={`relative p-8 rounded-3xl border border-white/10 backdrop-blur-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
          isHovered ? 'bg-white/10 border-white/20' : 'bg-white/5'
        }`}
        onClick={() => onSelect(module.id)}
        style={{
          background: isHovered 
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${module.color}20, transparent 40%)`
            : undefined
        }}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${module.gradientFrom}/10 ${module.gradientTo}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Popular badge */}
        {module.isPopular && (
          <motion.div
            className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-300 font-medium">Popular</span>
            </div>
          </motion.div>
        )}
        
        {/* Icon with magical glow */}
        <motion.div
          className="relative mb-6"
          animate={isHovered ? { 
            rotateY: 360,
            scale: 1.1
          } : {
            rotateY: 0,
            scale: 1
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradientFrom} ${module.gradientTo} p-4 relative overflow-hidden`}>
            {/* Magical shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              animate={isHovered ? {
                x: ['-100%', '200%']
              } : {}}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
            <Icon className="w-full h-full text-white relative z-10" />
          </div>
          
          {/* Floating particles around icon */}
          <AnimatePresence>
            {isHovered && (
              <div className="absolute inset-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/60 rounded-full"
                    initial={{ 
                      opacity: 0,
                      x: 32,
                      y: 32,
                      scale: 0
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: 32 + Math.cos(i * 60 * Math.PI / 180) * 40,
                      y: 32 + Math.sin(i * 60 * Math.PI / 180) * 40,
                      scale: [0, 1, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
            {module.title}
          </h3>
          <p className="text-sm font-medium text-gray-400 mb-3">
            {module.subtitle}
          </p>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {module.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">{module.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-400">{module.confidence}% confidence</span>
              </div>
            </div>
            
            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
              module.complexity === 'simple' ? 'bg-green-500/20 text-green-400' :
              module.complexity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {module.complexity}
            </div>
          </div>
          
          {/* Action button */}
          <motion.button
            className="relative w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium transition-all duration-300 overflow-hidden group-hover:bg-white/10 group-hover:border-white/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              <span>Start Analysis</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Button shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              animate={isHovered ? {
                x: ['-100%', '200%']
              } : {}}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.button>
        </div>
        
        {/* Magical border glow */}
        <motion.div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${module.gradientFrom} ${module.gradientTo} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`}
          animate={isHovered ? {
            scale: [1, 1.02, 1],
            opacity: [0.2, 0.3, 0.2]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

export default function RealTimeAdvisorPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isGridView, setIsGridView] = useState(true);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // Filter modules based on search and category
  const filteredModules = advisorModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || module.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Advisors', icon: Sparkles },
    { id: 'purchase', label: 'Purchases', icon: Car },
    { id: 'finance', label: 'Finance', icon: TrendingUp },
    { id: 'timing', label: 'Timing', icon: Clock },
    { id: 'legal', label: 'Legal', icon: FileText }
  ];

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModule(moduleId);
    // In a real implementation, this would navigate to the specific advisor
    console.log('Opening advisor:', moduleId);
  };

  return (
    <PageLayout>
      <TimeBasedBackground>
        <MagneticCursor />
        <FloatingParticles count={30} />
        
        <div className="min-h-screen relative">
          {/* Hero Section */}
          <motion.div
            className="relative max-w-7xl mx-auto px-6 py-12"
            style={{ y, opacity }}
          >
            <div className="text-center mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">AI-Powered Decision Intelligence</span>
              </motion.div>
              
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Real-Time
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">
                  Advisor ✨
                </span>
              </motion.h1>
              
              <motion.p
                className="text-gray-400 text-xl max-w-4xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Transform complex financial decisions into magical, interactive experiences. 
                Your personal team of AI advisors makes every choice feel like an adventure.
              </motion.p>
              
              {/* Quick stats */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm text-gray-300">Instant Analysis</span>
                  </div>
                  <div className="text-3xl font-bold text-white">2.3s</div>
                  <div className="text-xs text-yellow-400">Average response time</div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-300">Accuracy Rate</span>
                  </div>
                  <div className="text-3xl font-bold text-white">94.7%</div>
                  <div className="text-xs text-green-400">Prediction success</div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <span className="text-sm text-gray-300">User Satisfaction</span>
                  </div>
                  <div className="text-3xl font-bold text-white">4.9★</div>
                  <div className="text-xs text-pink-400">Based on 50K+ decisions</div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">Money Saved</span>
                  </div>
                  <div className="text-3xl font-bold text-white">$2.8B</div>
                  <div className="text-xs text-blue-400">Community total</div>
                </div>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <motion.div
              className="max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {/* Search Bar */}
              <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="What decision do you need help with?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              
              {/* Category filters */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                        filterCategory === category.id
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setFilterCategory(category.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Advisor Modules Grid */}
          <div className="max-w-7xl mx-auto px-6 pb-20">
            <motion.div
              className={`grid gap-8 ${
                isGridView 
                  ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}
              layout
            >
              <AnimatePresence mode="wait">
                {filteredModules.map((module, index) => (
                  <AdvisorModuleCard
                    key={module.id}
                    module={module}
                    index={index}
                    onSelect={handleModuleSelect}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            
            {/* No results */}
            {filteredModules.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No advisors found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Try adjusting your search terms or explore different categories to find the perfect advisor for your decision.
                </p>
              </motion.div>
            )}
          </div>

          {/* Floating Action Button */}
          <motion.button
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-2xl flex items-center justify-center z-50"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.button>
        </div>
      </TimeBasedBackground>
    </PageLayout>
  );
}