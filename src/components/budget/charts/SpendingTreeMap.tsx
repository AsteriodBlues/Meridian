'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Zap, Target, ShoppingBag, Home, Car, Coffee, Gamepad2 } from 'lucide-react';

interface TreeMapNode {
  id: string;
  name: string;
  value: number;
  color: string;
  icon?: React.ElementType;
  category?: string;
  children?: TreeMapNode[];
  change?: number; // Percentage change from previous period
}

interface TreeMapRect {
  x: number;
  y: number;
  width: number;
  height: number;
  node: TreeMapNode;
  depth: number;
}

interface SpendingTreeMapProps {
  data: TreeMapNode[];
  width?: number;
  height?: number;
  animated?: boolean;
  showLabels?: boolean;
  showTooltips?: boolean;
  className?: string;
}

export default function SpendingTreeMap({
  data,
  width = 800,
  height = 500,
  animated = true,
  showLabels = true,
  showTooltips = true,
  className = ''
}: SpendingTreeMapProps) {
  const [hoveredRect, setHoveredRect] = useState<TreeMapRect | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // TreeMap layout algorithm (squarified treemap)
  const calculateTreeMap = (nodes: TreeMapNode[], x: number, y: number, width: number, height: number, depth: number = 0): TreeMapRect[] => {
    if (!nodes.length) return [];
    
    const totalValue = nodes.reduce((sum, node) => sum + node.value, 0);
    const rects: TreeMapRect[] = [];
    
    // Sort nodes by value (largest first)
    const sortedNodes = [...nodes].sort((a, b) => b.value - a.value);
    
    // Simple strip layout for demo (can be enhanced with squarified algorithm)
    let currentX = x;
    let currentY = y;
    
    sortedNodes.forEach((node, index) => {
      const ratio = node.value / totalValue;
      let rectWidth, rectHeight;
      
      if (width > height) {
        rectWidth = width * ratio;
        rectHeight = height;
      } else {
        rectWidth = width;
        rectHeight = height * ratio;
      }
      
      // Ensure minimum size for visibility
      rectWidth = Math.max(rectWidth, 40);
      rectHeight = Math.max(rectHeight, 30);
      
      rects.push({
        x: currentX,
        y: currentY,
        width: rectWidth,
        height: rectHeight,
        node,
        depth
      });
      
      if (width > height) {
        currentX += rectWidth;
      } else {
        currentY += rectHeight;
      }
      
      // Add children if they exist
      if (node.children && node.children.length > 0) {
        const childRects = calculateTreeMap(
          node.children,
          currentX - rectWidth + 2,
          currentY - rectHeight + 2,
          rectWidth - 4,
          rectHeight - 4,
          depth + 1
        );
        rects.push(...childRects);
      }
    });
    
    return rects;
  };

  const treeMapRects = useMemo(() => 
    calculateTreeMap(data, 0, 0, width, height),
    [data, width, height]
  );

  // Animation phases
  useEffect(() => {
    if (!animated) return;
    
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [animated]);

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-gray-400';
    return change > 0 ? 'text-red-400' : 'text-green-400';
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    return change > 0 ? TrendingUp : TrendingDown;
  };

  const handleRectClick = (rect: TreeMapRect) => {
    setSelectedCategory(rect.node.id === selectedCategory ? null : rect.node.id);
  };

  const totalValue = data.reduce((sum, node) => sum + node.value, 0);

  return (
    <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Category Breakdown</h3>
              <p className="text-gray-400 text-sm">Hierarchical spending visualization</p>
            </div>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                −
              </motion.div>
            </button>
            <span className="text-xs text-white px-2">{(zoomLevel * 100).toFixed(0)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                +
              </motion.div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* TreeMap Container */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-black/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        style={{ height }}
      >
        <motion.svg
          width={width}
          height={height}
          className="overflow-visible"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          <defs>
            {/* Gradients for each category */}
            {data.map(node => (
              <linearGradient key={`gradient-${node.id}`} id={`gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={node.color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={node.color} stopOpacity={0.4} />
              </linearGradient>
            ))}

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Pattern for selected rectangles */}
            <pattern id="selected-pattern" patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill="rgba(255,255,255,0.1)"/>
              <path d="M0,8 L8,0 M-2,2 L2,-2 M6,10 L10,6" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            </pattern>
          </defs>

          {/* TreeMap Rectangles */}
          {treeMapRects.map((rect, index) => {
            const isHovered = hoveredRect?.node.id === rect.node.id;
            const isSelected = selectedCategory === rect.node.id;
            const Icon = rect.node.icon || ShoppingBag;
            const percentage = (rect.node.value / totalValue) * 100;
            const ChangeIcon = getChangeIcon(rect.node.change);

            return (
              <motion.g
                key={`${rect.node.id}-${rect.depth}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
              >
                {/* Main Rectangle */}
                <motion.rect
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={isSelected ? 'url(#selected-pattern)' : `url(#gradient-${rect.node.id})`}
                  stroke={isHovered || isSelected ? rect.node.color : 'rgba(255, 255, 255, 0.1)'}
                  strokeWidth={isHovered || isSelected ? 3 : 1}
                  rx="8"
                  ry="8"
                  className="cursor-pointer"
                  animate={{
                    fill: isHovered ? [
                      `url(#gradient-${rect.node.id})`,
                      rect.node.color,
                      `url(#gradient-${rect.node.id})`
                    ] : (isSelected ? 'url(#selected-pattern)' : `url(#gradient-${rect.node.id})`),
                    scale: isHovered ? 1.02 : 1,
                    filter: isHovered ? 'url(#glow)' : 'none'
                  }}
                  transition={{
                    fill: { duration: 1, repeat: isHovered ? Infinity : 0 },
                    scale: { duration: 0.2 },
                    filter: { duration: 0.2 }
                  }}
                  onMouseEnter={() => setHoveredRect(rect)}
                  onMouseLeave={() => setHoveredRect(null)}
                  onClick={() => handleRectClick(rect)}
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 15px ${rect.node.color}60)` : 'none'
                  }}
                />

                {/* Category Icon */}
                {rect.width > 60 && rect.height > 40 && (
                  <motion.g
                    transform={`translate(${rect.x + 8}, ${rect.y + 8})`}
                    animate={{
                      scale: isHovered ? [1, 1.2, 1] : 1,
                      rotate: isHovered ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <circle cx="12" cy="12" r="12" fill="rgba(255, 255, 255, 0.2)" />
                    <foreignObject x="4" y="4" width="16" height="16">
                      <Icon className="w-4 h-4 text-white" />
                    </foreignObject>
                  </motion.g>
                )}

                {/* Labels */}
                {showLabels && rect.width > 80 && rect.height > 60 && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.02 }}
                  >
                    {/* Category Name */}
                    <text
                      x={rect.x + rect.width / 2}
                      y={rect.y + rect.height / 2}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {rect.node.name}
                    </text>

                    {/* Value */}
                    <text
                      x={rect.x + rect.width / 2}
                      y={rect.y + rect.height / 2 + 16}
                      fill="rgba(255, 255, 255, 0.8)"
                      fontSize="10"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      ${rect.node.value.toLocaleString()}
                    </text>

                    {/* Percentage */}
                    <text
                      x={rect.x + rect.width / 2}
                      y={rect.y + rect.height / 2 + 28}
                      fill="rgba(255, 255, 255, 0.6)"
                      fontSize="9"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {percentage.toFixed(1)}%
                    </text>
                  </motion.g>
                )}

                {/* Change Indicator */}
                {rect.node.change && rect.width > 40 && rect.height > 30 && (
                  <motion.g
                    transform={`translate(${rect.x + rect.width - 20}, ${rect.y + 8})`}
                    animate={{
                      y: [0, -2, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.1
                    }}
                  >
                    <circle cx="8" cy="8" r="8" fill={rect.node.change > 0 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)'} />
                    {ChangeIcon && (
                      <foreignObject x="2" y="2" width="12" height="12">
                        <ChangeIcon className="w-3 h-3 text-white" />
                      </foreignObject>
                    )}
                  </motion.g>
                )}

                {/* Pulse animation for high-value categories */}
                {animated && rect.node.value > totalValue * 0.2 && (
                  <motion.rect
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill="none"
                    stroke={rect.node.color}
                    strokeWidth="2"
                    rx="8"
                    ry="8"
                    animate={{
                      strokeOpacity: [0, 0.8, 0],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                )}

                {/* Spending particles for very active categories */}
                {animated && rect.node.value > totalValue * 0.3 && Array.from({ length: 3 }).map((_, particleIndex) => (
                  <motion.circle
                    key={`particle-${rect.node.id}-${particleIndex}`}
                    cx={rect.x + rect.width * 0.2 + (particleIndex * rect.width * 0.3)}
                    cy={rect.y + rect.height * 0.2 + (particleIndex * rect.height * 0.3)}
                    r="2"
                    fill={rect.node.color}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [1, 0.8, 0],
                      y: [0, -20]
                    }}
                    transition={{
                      duration: 2,
                      delay: particleIndex * 0.5 + index * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                ))}
              </motion.g>
            );
          })}
        </motion.svg>

        {/* Floating Tooltip */}
        <AnimatePresence>
          {hoveredRect && showTooltips && (
            <motion.div
              className="absolute z-30 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 pointer-events-none"
              style={{
                left: '50%',
                top: '10px',
                transform: 'translateX(-50%)'
              }}
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="text-center min-w-[200px]">
                <div className="flex items-center gap-2 justify-center mb-3">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: hoveredRect.node.color }}
                  >
                    {hoveredRect.node.icon && <hoveredRect.node.icon className="w-4 h-4 text-white" />}
                  </div>
                  <h4 className="text-white font-bold">{hoveredRect.node.name}</h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-semibold">${hoveredRect.node.value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Percentage:</span>
                    <span className="text-blue-400 font-semibold">
                      {((hoveredRect.node.value / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  {hoveredRect.node.change && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Change:</span>
                      <span className={`font-semibold ${getChangeColor(hoveredRect.node.change)}`}>
                        {hoveredRect.node.change > 0 ? '+' : ''}{hoveredRect.node.change.toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {hoveredRect.node.category && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Group:</span>
                      <span className="text-white capitalize">{hoveredRect.node.category}</span>
                    </div>
                  )}
                </div>

                {/* Mini progress bar */}
                <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: hoveredRect.node.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${(hoveredRect.node.value / totalValue) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        className="mt-6 grid grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-lg font-bold text-blue-400">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total Spending</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-lg font-bold text-green-400">
            {data.length}
          </div>
          <div className="text-xs text-gray-400">Categories</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-lg font-bold text-purple-400">
            {data.filter(node => node.change && node.change > 0).length}
          </div>
          <div className="text-xs text-gray-400">Increased</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-lg font-bold text-orange-400">
            ${Math.max(...data.map(node => node.value)).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Largest</div>
        </div>
      </motion.div>

      {/* Category Legend */}
      <motion.div
        className="mt-4 flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {data.map((node, index) => (
          <motion.div
            key={node.id}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs cursor-pointer transition-all ${
              selectedCategory === node.id ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => setSelectedCategory(selectedCategory === node.id ? null : node.id)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: node.color }}
            />
            <span className="text-white">{node.name}</span>
            <span className="text-gray-400">
              {((node.value / totalValue) * 100).toFixed(0)}%
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}