'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CorrelationData {
  symbol1: string;
  symbol2: string;
  correlation: number;
  strength: 'weak' | 'moderate' | 'strong';
  direction: 'positive' | 'negative' | 'neutral';
}

interface CorrelationMatrixProps {
  symbols: string[];
  correlations: CorrelationData[];
  className?: string;
}

export default function CorrelationMatrix({ symbols, correlations, className = '' }: CorrelationMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Create correlation matrix from data
  const matrix = symbols.map(symbol1 => 
    symbols.map(symbol2 => {
      if (symbol1 === symbol2) return 1; // Perfect correlation with itself
      
      const correlation = correlations.find(
        c => (c.symbol1 === symbol1 && c.symbol2 === symbol2) ||
             (c.symbol1 === symbol2 && c.symbol2 === symbol1)
      );
      
      return correlation ? correlation.correlation : 0;
    })
  );

  // Animation phases
  useEffect(() => {
    const phases = [0, 1, 2, 3];
    let currentPhase = 0;
    
    const interval = setInterval(() => {
      currentPhase = (currentPhase + 1) % phases.length;
      setAnimationPhase(phases[currentPhase]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const getCorrelationColor = (value: number, opacity = 1) => {
    const absValue = Math.abs(value);
    
    if (value > 0.7) return `rgba(34, 197, 94, ${opacity})`; // Strong positive - green
    if (value > 0.3) return `rgba(59, 130, 246, ${opacity})`; // Moderate positive - blue
    if (value > 0.1) return `rgba(168, 85, 247, ${opacity})`; // Weak positive - purple
    if (value > -0.1) return `rgba(107, 114, 128, ${opacity})`; // Neutral - gray
    if (value > -0.3) return `rgba(245, 158, 11, ${opacity})`; // Weak negative - amber
    if (value > -0.7) return `rgba(249, 115, 22, ${opacity})`; // Moderate negative - orange
    return `rgba(239, 68, 68, ${opacity})`; // Strong negative - red
  };

  const getCorrelationIntensity = (value: number) => {
    return Math.abs(value) * 0.8 + 0.2; // Minimum 20% opacity
  };

  const getCorrelationIcon = (value: number) => {
    if (value > 0.1) return TrendingUp;
    if (value < -0.1) return TrendingDown;
    return Minus;
  };

  const getCorrelationStrength = (value: number) => {
    const abs = Math.abs(value);
    if (abs > 0.7) return 'Strong';
    if (abs > 0.3) return 'Moderate';
    if (abs > 0.1) return 'Weak';
    return 'Neutral';
  };

  const cellSize = 60;
  const gap = 2;

  return (
    <div className={`relative p-6 bg-black/20 rounded-2xl border border-white/10 ${className}`}>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Correlation Matrix</h3>
        <p className="text-gray-400 text-sm">Asset correlation heat map with real-time updates</p>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="mb-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Correlation:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: getCorrelationColor(-1) }} />
            <span className="text-xs text-gray-400">-1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: getCorrelationColor(0) }} />
            <span className="text-xs text-gray-400">0</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: getCorrelationColor(1) }} />
            <span className="text-xs text-gray-400">+1</span>
          </div>
        </div>
        
        {/* Animation mode indicator */}
        <motion.div
          className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg"
          animate={{
            boxShadow: [
              '0 0 0px rgba(59, 130, 246, 0)',
              '0 0 20px rgba(59, 130, 246, 0.5)',
              '0 0 0px rgba(59, 130, 246, 0)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Live</span>
        </motion.div>
      </motion.div>

      {/* Matrix container */}
      <div className="relative">
        {/* Column headers */}
        <div className="flex mb-2" style={{ marginLeft: cellSize + gap }}>
          {symbols.map((symbol, index) => (
            <motion.div
              key={`col-header-${symbol}`}
              className="flex items-center justify-center text-xs text-gray-400 font-medium"
              style={{ 
                width: cellSize, 
                height: 30,
                marginRight: index < symbols.length - 1 ? gap : 0 
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>

        {/* Matrix grid */}
        <div className="flex flex-col">
          {symbols.map((rowSymbol, rowIndex) => (
            <motion.div
              key={`row-${rowSymbol}`}
              className="flex items-center mb-2 last:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + rowIndex * 0.05 }}
            >
              {/* Row header */}
              <div
                className="flex items-center justify-center text-xs text-gray-400 font-medium mr-2"
                style={{ width: cellSize, height: cellSize }}
              >
                {rowSymbol}
              </div>

              {/* Correlation cells */}
              {symbols.map((colSymbol, colIndex) => {
                const correlation = matrix[rowIndex][colIndex];
                const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
                const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                const isDiagonal = rowIndex === colIndex;
                const Icon = getCorrelationIcon(correlation);
                
                return (
                  <motion.div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="relative cursor-pointer"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      marginRight: colIndex < symbols.length - 1 ? gap : 0,
                    }}
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => setSelectedCell(
                      isSelected ? null : { row: rowIndex, col: colIndex }
                    )}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotateY: animationPhase === 1 && !isDiagonal ? [0, 180, 0] : 0,
                    }}
                    transition={{
                      delay: 0.5 + (rowIndex + colIndex) * 0.02,
                      scale: { type: 'spring', stiffness: 200 },
                      rotateY: { duration: 1, delay: (rowIndex + colIndex) * 0.1 }
                    }}
                    whileHover={{ scale: 1.1, z: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden"
                      style={{
                        backgroundColor: getCorrelationColor(
                          correlation, 
                          getCorrelationIntensity(correlation)
                        ),
                        border: isDiagonal 
                          ? '2px solid rgba(255, 255, 255, 0.5)' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      animate={{
                        backgroundColor: animationPhase === 2 ? [
                          getCorrelationColor(correlation, getCorrelationIntensity(correlation)),
                          getCorrelationColor(correlation, 1),
                          getCorrelationColor(correlation, getCorrelationIntensity(correlation)),
                        ] : getCorrelationColor(correlation, getCorrelationIntensity(correlation)),
                        boxShadow: isHovered || isSelected ? [
                          '0 0 0px rgba(255, 255, 255, 0)',
                          '0 0 20px rgba(255, 255, 255, 0.8)',
                          '0 0 0px rgba(255, 255, 255, 0)',
                        ] : '0 0 0px rgba(255, 255, 255, 0)',
                      }}
                      transition={{
                        backgroundColor: { duration: 1 },
                        boxShadow: { duration: 1, repeat: isHovered || isSelected ? Infinity : 0 }
                      }}
                    >
                      {/* Diagonal pattern for self-correlation */}
                      {isDiagonal && (
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px)',
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        />
                      )}

                      {/* Correlation value */}
                      <motion.span
                        className="text-white font-bold text-xs relative z-10"
                        animate={{
                          scale: animationPhase === 3 ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {correlation.toFixed(2)}
                      </motion.span>

                      {/* Icon indicator */}
                      {!isDiagonal && Math.abs(correlation) > 0.1 && (
                        <motion.div
                          className="absolute top-1 right-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1 }}
                        >
                          <Icon className="w-3 h-3 text-white opacity-70" />
                        </motion.div>
                      )}

                      {/* Pulse effect for strong correlations */}
                      {Math.abs(correlation) > 0.7 && (
                        <motion.div
                          className="absolute inset-0 rounded-lg"
                          style={{
                            backgroundColor: getCorrelationColor(correlation, 0.3),
                          }}
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0, 0.5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: (rowIndex + colIndex) * 0.1,
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {(isHovered || isSelected) && !isDiagonal && (
                        <motion.div
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.8 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 text-center min-w-[120px]">
                            <h4 className="text-white font-bold text-sm mb-1">
                              {rowSymbol} × {colSymbol}
                            </h4>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Correlation:</span>
                                <span className="text-white font-semibold">
                                  {correlation.toFixed(3)}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Strength:</span>
                                <span className={`font-semibold ${
                                  Math.abs(correlation) > 0.7 ? 'text-green-400' :
                                  Math.abs(correlation) > 0.3 ? 'text-yellow-400' :
                                  'text-gray-400'
                                }`}>
                                  {getCorrelationStrength(correlation)}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Direction:</span>
                                <span className={`font-semibold ${
                                  correlation > 0.1 ? 'text-green-400' :
                                  correlation < -0.1 ? 'text-red-400' :
                                  'text-gray-400'
                                }`}>
                                  {correlation > 0.1 ? 'Positive' :
                                   correlation < -0.1 ? 'Negative' : 'Neutral'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Tooltip arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <motion.div
        className="mt-6 grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">
            {correlations.filter(c => c.correlation > 0.3).length}
          </p>
          <p className="text-xs text-gray-400">Positive Correlations</p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">
            {correlations.filter(c => c.correlation < -0.3).length}
          </p>
          <p className="text-xs text-gray-400">Negative Correlations</p>
        </div>
        
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {(correlations.reduce((sum, c) => sum + Math.abs(c.correlation), 0) / correlations.length).toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">Average Strength</p>
        </div>
      </motion.div>
    </div>
  );
}