'use client';

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  Heart, Share2, MapPin, Bed, Bath, Square, TrendingUp, 
  Calendar, DollarSign, ArrowLeft, ArrowRight, Play, Pause,
  Star, ChevronUp, ChevronDown, Coins
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  originalPrice?: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  images: string[];
  type: 'house' | 'apartment' | 'condo' | 'townhouse';
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  yearBuilt: number;
  lotSize?: number;
  mortgage: {
    totalAmount: number;
    paidAmount: number;
    monthlyPayment: number;
    remainingYears: number;
  };
  rental: {
    monthlyIncome: number;
    occupancyRate: number;
    yearlyIncome: number;
  };
  valueHistory: { date: string; value: number }[];
  features: string[];
  rating: number;
  lastUpdated: string;
}

interface PropertyCardProps {
  property: Property;
  index: number;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function PropertyCard({ property, index, onFavorite, onShare, onView }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCoinRain, setShowCoinRain] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // 3D tilt effect
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  const springRotateX = useSpring(rotateX, { damping: 20, stiffness: 300 });
  const springRotateY = useSpring(rotateY, { damping: 20, stiffness: 300 });

  // Auto-play carousel
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isPlaying, property.images.length]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleCoinRainClick = () => {
    setShowCoinRain(true);
    setTimeout(() => setShowCoinRain(false), 3000);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.(property.id);
  };

  // Generate value trend path for background
  const generateTrendPath = () => {
    const width = 400;
    const height = 200;
    const points = property.valueHistory.slice(-12); // Last 12 months
    
    if (points.length < 2) return '';
    
    const maxValue = Math.max(...points.map(p => p.value));
    const minValue = Math.min(...points.map(p => p.value));
    const valueRange = maxValue - minValue || 1;
    
    let path = '';
    points.forEach((point, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((point.value - minValue) / valueRange) * height;
      path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    
    return path;
  };

  // Mortgage progress percentage
  const mortgageProgress = (property.mortgage.paidAmount / property.mortgage.totalAmount) * 100;

  // Coin animation components
  const CoinRain = () => (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`coin-${i}`}
          className="absolute w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-24px',
          }}
          initial={{ y: -24, rotate: 0, scale: 0 }}
          animate={{
            y: 400,
            rotate: [0, 180, 360, 540],
            scale: [0, 1, 1, 0.8],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: i * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <DollarSign className="w-3 h-3 text-yellow-900" />
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: 1000,
      }}
    >
      <motion.div
        className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02, z: 50 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onView?.(property.id)}
      >
        {/* Background value trend */}
        <motion.svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 400 200"
          style={{ z: 0 }}
        >
          <motion.path
            d={generateTrendPath()}
            stroke="url(#trendGradient)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isHovered ? 1 : 0.3 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Image carousel with parallax */}
        <div className="relative h-64 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                y: useTransform(mouseY, [-300, 300], [-10, 10]),
              }}
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Image controls */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <motion.button
              className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(prev => 
                  prev === 0 ? property.images.length - 1 : prev - 1
                );
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </motion.button>
            
            <motion.button
              className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </motion.button>
            
            <motion.button
              className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(prev => 
                  prev === property.images.length - 1 ? 0 : prev + 1
                );
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          {/* Image indicators */}
          <div className="absolute bottom-4 right-4 flex gap-1">
            {property.images.map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentImageIndex ? 'bg-white' : 'bg-white/40'
                }`}
                animate={{ scale: i === currentImageIndex ? 1.2 : 1 }}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors ${
                isFavorited ? 'bg-red-500/80 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleFavorite();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isFavorited ? { scale: [1, 1.2, 1] } : {}}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </motion.button>
            
            <motion.button
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors text-white"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(property.id);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Property status badge */}
          <motion.div
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
              property.status === 'for-sale' ? 'bg-green-500/80 text-white' :
              property.status === 'for-rent' ? 'bg-blue-500/80 text-white' :
              property.status === 'sold' ? 'bg-gray-500/80 text-white' :
              'bg-purple-500/80 text-white'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {property.status.replace('-', ' ').toUpperCase()}
          </motion.div>
        </div>

        {/* Property details */}
        <div className="p-6 relative z-10">
          {/* Price and trend */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <motion.h3 
                className="text-xl font-bold text-white mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                ${property.price.toLocaleString()}
              </motion.h3>
              {property.originalPrice && property.originalPrice !== property.price && (
                <motion.p 
                  className="text-sm text-gray-400 line-through"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  ${property.originalPrice.toLocaleString()}
                </motion.p>
              )}
            </div>
            
            <motion.div
              className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-semibold">
                +{((property.price / (property.originalPrice || property.price) - 1) * 100).toFixed(1)}%
              </span>
            </motion.div>
          </div>

          {/* Property title and location */}
          <motion.h4 
            className="text-lg font-semibold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {property.title}
          </motion.h4>
          
          <motion.div 
            className="flex items-center gap-2 text-gray-400 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.address}</span>
          </motion.div>

          {/* Property specs */}
          <motion.div 
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white">{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-white">{property.squareFeet.toLocaleString()} sq ft</span>
            </div>
          </motion.div>

          {/* Mortgage progress - melting bar */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Mortgage Progress</span>
              <span className="text-sm text-white font-semibold">{mortgageProgress.toFixed(1)}%</span>
            </div>
            <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${mortgageProgress}%` }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.8 }}
              />
              {/* Melting drips */}
              {mortgageProgress > 20 && (
                <motion.div
                  className="absolute bottom-0 w-2 h-4 bg-gradient-to-b from-purple-500 to-transparent rounded-b-full"
                  style={{ left: `${mortgageProgress - 10}%` }}
                  animate={{
                    scaleY: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>

          {/* Rental income with coin rain */}
          <motion.div 
            className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleCoinRainClick();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div>
              <p className="text-xs text-yellow-400 mb-1">Monthly Rental Income</p>
              <p className="text-lg font-bold text-white">${property.rental.monthlyIncome.toLocaleString()}</p>
            </div>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Coins className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </motion.div>

          {/* Property rating */}
          <motion.div 
            className="flex items-center justify-between mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(property.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-600'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-400 ml-2">{property.rating}</span>
            </div>
            
            <span className="text-xs text-gray-500">{property.lastUpdated}</span>
          </motion.div>
        </div>

        {/* Coin rain effect */}
        <AnimatePresence>
          {showCoinRain && <CoinRain />}
        </AnimatePresence>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          animate={isHovered ? {
            background: [
              'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
              'linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
              'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))',
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}