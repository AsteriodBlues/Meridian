'use client';

import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, TrendingDown, Zap, Star, Eye } from 'lucide-react';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  shares: number;
  price: number;
  sector: string;
  marketCap: number;
  x?: number;
  y?: number;
  constellation?: string;
}

interface ConstellationMapProps {
  holdings: Holding[];
  className?: string;
}

const sectorColors = {
  'Technology': '#3B82F6',
  'Healthcare': '#10B981',
  'Finance': '#F59E0B',
  'Energy': '#EF4444',
  'Consumer': '#8B5CF6',
  'Industrial': '#06B6D4',
  'Real Estate': '#EC4899',
  'Utilities': '#84CC16',
  'Materials': '#F97316',
  'Telecom': '#6366F1'
};

const constellations = [
  'Growth Galaxy',
  'Value Nebula',
  'Dividend Cluster',
  'Tech Constellation',
  'Blue Chip Belt'
];

export default function ConstellationMap({ holdings, className = '' }: ConstellationMapProps) {
  const [selectedHolding, setSelectedHolding] = useState<string | null>(null);
  const [hoveredHolding, setHoveredHolding] = useState<string | null>(null);
  const [connectionLines, setConnectionLines] = useState<Array<{from: Holding, to: Holding}>>([]);
  const [positionedHoldings, setPositionedHoldings] = useState<Holding[]>([]);
  const [viewMode, setViewMode] = useState<'constellation' | 'sector' | 'performance'>('constellation');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Generate deterministic constellation positions
  useEffect(() => {
    if (!holdings.length) return;
    
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Simple deterministic pseudo-random function based on string hash
    const seededRandom = (seed: string) => {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash % 1000) / 1000; // Return value between 0 and 1
    };
    
    const positioned = holdings.map((holding, index) => {
      let x, y;
      
      if (viewMode === 'constellation') {
        // Create constellation patterns
        const constellation = constellations[index % constellations.length];
        const constellationIndex = constellations.indexOf(constellation);
        const angle = (constellationIndex * (360 / constellations.length) + index * 15) * (Math.PI / 180);
        const radius = 150 + (holding.value / Math.max(...holdings.map(h => h.value))) * 100;
        
        // Use deterministic random offset based on holding symbol
        const randomX = (seededRandom(holding.symbol + 'x') - 0.5) * 50;
        const randomY = (seededRandom(holding.symbol + 'y') - 0.5) * 50;
        
        x = centerX + Math.cos(angle) * radius + randomX;
        y = centerY + Math.sin(angle) * radius + randomY;
      } else if (viewMode === 'sector') {
        // Group by sector
        const sectors = Object.keys(sectorColors);
        const sectorIndex = sectors.indexOf(holding.sector);
        const sectorAngle = (sectorIndex * (360 / sectors.length)) * (Math.PI / 180);
        const sectorRadius = 120 + (seededRandom(holding.symbol + 'sector') * 80);
        
        x = centerX + Math.cos(sectorAngle) * sectorRadius;
        y = centerY + Math.sin(sectorAngle) * sectorRadius;
      } else {
        // Performance-based positioning
        const performanceX = (holding.changePercent + 10) * 30; // Scale performance
        const performanceY = (holding.value / 1000) * 2;
        
        x = Math.max(50, Math.min(width - 50, centerX + performanceX));
        y = Math.max(50, Math.min(height - 50, centerY - performanceY));
      }
      
      return {
        ...holding,
        x: Math.round(Math.max(100, Math.min(width - 100, x))),
        y: Math.round(Math.max(120, Math.min(height - 80, y))),
        constellation: constellations[index % constellations.length]
      };
    });
    
    setPositionedHoldings(positioned);
    
    // Generate connection lines for constellation view
    if (viewMode === 'constellation') {
      const lines: Array<{from: Holding, to: Holding}> = [];
      positioned.forEach((holding, i) => {
        const nextIndex = (i + 1) % positioned.length;
        if (holding.constellation === positioned[nextIndex].constellation) {
          lines.push({ from: holding, to: positioned[nextIndex] });
        }
      });
      setConnectionLines(lines);
    } else {
      setConnectionLines([]);
    }
  }, [holdings, viewMode]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }, [mouseX, mouseY]);

  const getHoldingSize = (holding: Holding) => {
    const maxValue = Math.max(...holdings.map(h => h.value));
    const minSize = 20;
    const maxSize = 60;
    return minSize + (holding.value / maxValue) * (maxSize - minSize);
  };

  const getHoldingColor = (holding: Holding) => {
    if (viewMode === 'sector') {
      return sectorColors[holding.sector as keyof typeof sectorColors] || '#6B7280';
    } else if (viewMode === 'performance') {
      return holding.changePercent >= 0 ? '#10B981' : '#EF4444';
    }
    return sectorColors[holding.sector as keyof typeof sectorColors] || '#6B7280';
  };

  // Parallax effect for background stars
  const backgroundX = useTransform(mouseX, [0, 800], [-20, 20]);
  const backgroundY = useTransform(mouseY, [0, 600], [-20, 20]);

  return (
    <div className={`relative w-full h-[600px] bg-black/20 rounded-3xl border border-white/10 ${className}`}>
      {/* Background starfield */}
      <motion.div
        className="absolute inset-0"
        style={{ x: backgroundX, y: backgroundY }}
      >
        {Array.from({ length: 100 }).map((_, i) => {
          // Deterministic positioning based on index
          const left = ((i * 17) % 100);
          const top = ((i * 23) % 100);
          const opacity = 0.2 + ((i * 7) % 50) / 100;
          const duration = 2 + ((i * 11) % 30) / 10;
          const delay = ((i * 13) % 20) / 10;
          
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                opacity: opacity,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
              }}
            />
          );
        })}
      </motion.div>

      {/* View mode selector */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {(['constellation', 'sector', 'performance'] as const).map((mode) => (
          <motion.button
            key={mode}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              viewMode === mode
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            onClick={() => setViewMode(mode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Main constellation container */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredHolding(null)}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.5)" />
              <stop offset="100%" stopColor="rgba(236, 72, 153, 0.3)" />
            </linearGradient>
          </defs>
          
          <AnimatePresence>
            {connectionLines.map((line, index) => (
              <motion.line
                key={`line-${index}-${line.from.id}-${line.to.id}`}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke="url(#connectionGradient)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* Holdings as stars/nodes */}
        <AnimatePresence>
          {positionedHoldings.map((holding, index) => {
            const size = getHoldingSize(holding);
            const color = getHoldingColor(holding);
            const isSelected = selectedHolding === holding.id;
            const isHovered = hoveredHolding === holding.id;
            
            return (
              <motion.div
                key={holding.id}
                className="absolute cursor-pointer group"
                style={{
                  left: Math.round(holding.x - size / 2),
                  top: Math.round(holding.y - size / 2),
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: index * 0.05,
                }}
                whileHover={{ scale: 1.2, z: 100 }}
                onClick={() => setSelectedHolding(isSelected ? null : holding.id)}
                onMouseEnter={() => setHoveredHolding(holding.id)}
              >
                {/* Main star/node */}
                <motion.div
                  className="relative rounded-full flex items-center justify-center"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    boxShadow: `0 0 20px ${color}60`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${color}60`,
                      `0 0 30px ${color}80`,
                      `0 0 20px ${color}60`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Pulse effect for real-time updates */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                  
                  {/* Symbol */}
                  <span className="text-white font-bold text-xs relative z-10">
                    {holding.symbol.slice(0, 3)}
                  </span>
                  
                  {/* Performance indicator */}
                  <motion.div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center ${
                      holding.changePercent >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {holding.changePercent >= 0 ? (
                      <TrendingUp className="w-2 h-2 text-white" />
                    ) : (
                      <TrendingDown className="w-2 h-2 text-white" />
                    )}
                  </motion.div>
                </motion.div>

                {/* Orbit rings for larger holdings */}
                {holding.value > 50000 && (
                  <>
                    <motion.div
                      className="absolute inset-0 border border-white/20 rounded-full"
                      style={{
                        width: size + 20,
                        height: size + 20,
                        left: -10,
                        top: -10,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute inset-0 border border-white/10 rounded-full"
                      style={{
                        width: size + 40,
                        height: size + 40,
                        left: -20,
                        top: -20,
                      }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    />
                  </>
                )}

                {/* Tooltip on hover */}
                <AnimatePresence>
                  {(isHovered || isSelected) && (
                    <motion.div
                      className={`absolute z-50 ${
                        holding.y < 200 
                          ? 'top-full mt-2' 
                          : 'bottom-full mb-2'
                      } ${
                        holding.x < 200 
                          ? 'left-0' 
                          : holding.x > 600 
                            ? 'right-0' 
                            : 'left-1/2 transform -translate-x-1/2'
                      }`}
                      initial={{ opacity: 0, y: holding.y < 200 ? -10 : 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: holding.y < 200 ? -10 : 10, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-center min-w-[150px]">
                        <h4 className="text-white font-bold text-sm mb-1">{holding.symbol}</h4>
                        <p className="text-gray-300 text-xs mb-2">{holding.name}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Value:</span>
                            <span className="text-white font-semibold">
                              ${holding.value.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Change:</span>
                            <span className={`font-semibold ${
                              holding.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {holding.changePercent >= 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Shares:</span>
                            <span className="text-white">{holding.shares}</span>
                          </div>
                        </div>
                        
                        {/* Mini sparkline */}
                        <div className="mt-2 h-8 flex items-end gap-1">
                          {Array.from({ length: 10 }).map((_, i) => {
                            // Deterministic height based on holding symbol and index
                            const seedValue = holding.symbol.charCodeAt(0) + i;
                            const height = 20 + (seedValue % 12);
                            
                            return (
                              <motion.div
                                key={i}
                                className={`w-1 bg-gradient-to-t ${
                                  holding.changePercent >= 0 
                                    ? 'from-green-500 to-green-300' 
                                    : 'from-red-500 to-red-300'
                                }`}
                                style={{
                                  height: `${height}px`,
                                }}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}px` }}
                                transition={{ delay: i * 0.05 }}
                              />
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Tooltip arrow */}
                      <div className={`absolute ${
                        holding.y < 200 
                          ? 'bottom-full left-1/2 transform -translate-x-1/2' 
                          : 'top-full left-1/2 transform -translate-x-1/2'
                      }`}>
                        <div className={`w-0 h-0 border-l-4 border-r-4 border-transparent ${
                          holding.y < 200 
                            ? 'border-b-4 border-b-white/20' 
                            : 'border-t-4 border-t-white/20'
                        }`} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selection highlight */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-400 rounded-full"
                    style={{
                      width: size + 10,
                      height: size + 10,
                      left: -5,
                      top: -5,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Constellation labels */}
        <AnimatePresence>
          {viewMode === 'constellation' && constellations.map((constellation, index) => {
            const angle = (index * (360 / constellations.length)) * (Math.PI / 180);
            const radius = 250;
            const x = Math.round(400 + Math.cos(angle) * radius);
            const y = Math.round(300 + Math.sin(angle) * radius);
            
            return (
              <motion.div
                key={constellation}
                className="absolute pointer-events-none"
                style={{ left: x, top: y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">{constellation}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Portfolio summary overlay */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Portfolio Universe</h3>
            <p className="text-gray-400 text-sm">
              {holdings.length} holdings across {Object.keys(sectorColors).length} sectors
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                ${holdings.reduce((sum, h) => sum + h.value, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Total Value</p>
            </div>
            
            <div className="text-center">
              <p className={`text-2xl font-bold ${
                holdings.reduce((sum, h) => sum + h.change, 0) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {holdings.reduce((sum, h) => sum + h.change, 0) >= 0 ? '+' : ''}
                ${holdings.reduce((sum, h) => sum + h.change, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Today's Change</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}