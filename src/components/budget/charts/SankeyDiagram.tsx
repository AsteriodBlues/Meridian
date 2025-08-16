'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, ArrowDown, DollarSign, TrendingUp, 
  TrendingDown, Activity, Zap, Target 
} from 'lucide-react';

interface SankeyNode {
  id: string;
  label: string;
  category: 'income' | 'expense' | 'savings' | 'investment';
  color: string;
  icon?: React.ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color: string;
  label?: string;
}

interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  animated?: boolean;
  showValues?: boolean;
  className?: string;
}

export default function SankeyDiagram({
  nodes: inputNodes,
  links: inputLinks,
  width = 800,
  height = 500,
  animated = true,
  showValues = true,
  className = ''
}: SankeyDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [flowPhase, setFlowPhase] = useState(0);

  // Flow animation phases
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowPhase(prev => (prev + 1) % 100);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // General animation phases
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Process nodes and links for layout
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map(inputNodes.map(node => [node.id, { ...node }]));
    
    // Calculate node positions if not provided
    const processedNodes = inputNodes.map((node, index) => {
      if (node.x === undefined || node.y === undefined) {
        // Auto-layout based on category
        const categoryPositions = {
          income: { x: 50, baseY: 100 },
          expense: { x: 650, baseY: 100 },
          savings: { x: 650, baseY: 300 },
          investment: { x: 650, baseY: 400 }
        };
        
        const pos = categoryPositions[node.category];
        const categoryNodes = inputNodes.filter(n => n.category === node.category);
        const categoryIndex = categoryNodes.findIndex(n => n.id === node.id);
        
        return {
          ...node,
          x: pos.x,
          y: pos.baseY + categoryIndex * 80,
          width: node.width || 120,
          height: node.height || 60
        };
      }
      return node;
    });

    // Calculate link paths
    const processedLinks = inputLinks.map(link => ({
      ...link,
      id: `${link.source}-${link.target}`
    }));

    return { nodes: processedNodes, links: processedLinks };
  }, [inputNodes, inputLinks]);

  // Generate curved path for link
  const generateLinkPath = (link: SankeyLink) => {
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);
    
    if (!sourceNode || !targetNode) return '';

    const sourceX = sourceNode.x + sourceNode.width;
    const sourceY = sourceNode.y + sourceNode.height / 2;
    const targetX = targetNode.x;
    const targetY = targetNode.y + targetNode.height / 2;

    const curvature = 0.5;
    const controlX1 = sourceX + (targetX - sourceX) * curvature;
    const controlY1 = sourceY;
    const controlX2 = targetX - (targetX - sourceX) * curvature;
    const controlY2 = targetY;

    return `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;
  };

  // Generate flow particles path
  const generateFlowPath = (link: SankeyLink, offset: number = 0) => {
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);
    
    if (!sourceNode || !targetNode) return { x: 0, y: 0 };

    const sourceX = sourceNode.x + sourceNode.width;
    const sourceY = sourceNode.y + sourceNode.height / 2;
    const targetX = targetNode.x;
    const targetY = targetNode.y + targetNode.height / 2;

    const t = (offset % 100) / 100;
    const curvature = 0.5;
    
    // Bezier curve calculation
    const controlX1 = sourceX + (targetX - sourceX) * curvature;
    const controlY1 = sourceY;
    const controlX2 = targetX - (targetX - sourceX) * curvature;
    const controlY2 = targetY;

    const x = Math.pow(1-t, 3) * sourceX + 
              3 * Math.pow(1-t, 2) * t * controlX1 + 
              3 * (1-t) * Math.pow(t, 2) * controlX2 + 
              Math.pow(t, 3) * targetX;

    const y = Math.pow(1-t, 3) * sourceY + 
              3 * Math.pow(1-t, 2) * t * controlY1 + 
              3 * (1-t) * Math.pow(t, 2) * controlY2 + 
              Math.pow(t, 3) * targetY;

    return { x, y };
  };

  const getNodeCategoryIcon = (category: string) => {
    switch (category) {
      case 'income': return DollarSign;
      case 'expense': return TrendingDown;
      case 'savings': return Target;
      case 'investment': return TrendingUp;
      default: return Activity;
    }
  };

  const getNodeCategoryColor = (category: string) => {
    switch (category) {
      case 'income': return '#10b981';
      case 'expense': return '#ef4444';
      case 'savings': return '#3b82f6';
      case 'investment': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Cash Flow Analysis</h3>
        <p className="text-gray-400 text-sm">Interactive Sankey diagram showing money flow patterns</p>
      </motion.div>

      {/* Flow Legend */}
      <motion.div
        className="flex items-center gap-6 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {['income', 'expense', 'savings', 'investment'].map((category, index) => {
          const Icon = getNodeCategoryIcon(category);
          const color = getNodeCategoryColor(category);
          
          return (
            <motion.div
              key={category}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <motion.div
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color }}
                animate={{
                  boxShadow: [
                    `0 0 0px ${color}`,
                    `0 0 10px ${color}60`,
                    `0 0 0px ${color}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="w-2 h-2 text-white" />
              </motion.div>
              <span className="text-sm text-gray-300 capitalize">{category}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* SVG Container */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-black/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            {/* Gradients for links */}
            {links.map(link => (
              <linearGradient 
                key={`gradient-${link.id}`} 
                id={`link-gradient-${link.id}`} 
                x1="0%" y1="0%" x2="100%" y2="0%"
              >
                <stop offset="0%" stopColor={link.color} stopOpacity={0.8} />
                <stop offset="50%" stopColor={link.color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={link.color} stopOpacity={0.8} />
              </linearGradient>
            ))}

            {/* Flow animation pattern */}
            <pattern id="flow-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.6)" />
            </pattern>

            {/* Glow filter */}
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Links */}
          {links.map((link, index) => {
            const isHovered = hoveredLink === link.id;
            const strokeWidth = Math.max(2, (link.value / 1000) * 10);
            
            return (
              <motion.g
                key={link.id}
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Main link path */}
                <motion.path
                  d={generateLinkPath(link)}
                  stroke={`url(#link-gradient-${link.id})`}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  opacity={isHovered ? 1 : 0.8}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isHovered ? 1 : 0.8,
                    strokeWidth: isHovered ? strokeWidth * 1.2 : strokeWidth
                  }}
                  transition={{ 
                    pathLength: { delay: 1 + index * 0.1, duration: 1.5 },
                    opacity: { duration: 0.3 },
                    strokeWidth: { duration: 0.3 }
                  }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${link.color}40)`
                  }}
                />

                {/* Flow particles */}
                <AnimatePresence>
                  {animated && Array.from({ length: 3 }).map((_, particleIndex) => {
                    const particleOffset = (flowPhase + particleIndex * 33) % 100;
                    const position = generateFlowPath(link, particleOffset);
                    
                    return (
                      <motion.circle
                        key={`particle-${particleIndex}`}
                        cx={position.x}
                        cy={position.y}
                        r={2 + strokeWidth * 0.1}
                        fill={link.color}
                        opacity={0.8}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: particleIndex * 0.3
                        }}
                        style={{
                          filter: `drop-shadow(0 0 4px ${link.color}80)`
                        }}
                      />
                    );
                  })}
                </AnimatePresence>

                {/* Link value label */}
                {showValues && isHovered && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {(() => {
                      const midPosition = generateFlowPath(link, 50);
                      return (
                        <g>
                          <rect
                            x={midPosition.x - 30}
                            y={midPosition.y - 15}
                            width="60"
                            height="20"
                            rx="10"
                            fill="rgba(0, 0, 0, 0.8)"
                            stroke="rgba(255, 255, 255, 0.2)"
                          />
                          <text
                            x={midPosition.x}
                            y={midPosition.y - 2}
                            fill="white"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            ${link.value.toLocaleString()}
                          </text>
                        </g>
                      );
                    })()}
                  </motion.g>
                )}
              </motion.g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, index) => {
            const Icon = node.icon || getNodeCategoryIcon(node.category);
            const isHovered = hoveredNode === node.id;
            const categoryColor = node.color || getNodeCategoryColor(node.category);
            
            // Calculate total inflow and outflow
            const inflow = links
              .filter(link => link.target === node.id)
              .reduce((sum, link) => sum + link.value, 0);
            const outflow = links
              .filter(link => link.source === node.id)
              .reduce((sum, link) => sum + link.value, 0);
            
            return (
              <motion.g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
                transition={{ 
                  opacity: { delay: 1.5 + index * 0.1 },
                  scale: { delay: 1.5 + index * 0.1, type: 'spring' }
                }}
              >
                {/* Node background */}
                <motion.rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  rx="12"
                  fill={`url(#node-gradient-${node.id})`}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1"
                  filter="url(#node-glow)"
                  animate={{
                    fill: isHovered ? categoryColor : `url(#node-gradient-${node.id})`,
                    boxShadow: isHovered ? [
                      `0 0 0px ${categoryColor}`,
                      `0 0 20px ${categoryColor}60`,
                      `0 0 0px ${categoryColor}`
                    ] : `0 0 0px ${categoryColor}`
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Node gradient definition */}
                <defs>
                  <linearGradient id={`node-gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={categoryColor} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={categoryColor} stopOpacity={0.6} />
                  </linearGradient>
                </defs>

                {/* Node icon */}
                <motion.g
                  transform={`translate(${node.x + 15}, ${node.y + 15})`}
                  animate={{
                    scale: isHovered ? [1, 1.2, 1] : 1,
                    rotate: isHovered ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <circle r="12" fill="rgba(255, 255, 255, 0.2)" />
                  <foreignObject x="-8" y="-8" width="16" height="16">
                    <Icon className="w-4 h-4 text-white" />
                  </foreignObject>
                </motion.g>

                {/* Node label */}
                <text
                  x={node.x + node.width / 2}
                  y={node.y + 35}
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {node.label}
                </text>

                {/* Node values */}
                <motion.g
                  opacity={isHovered ? 1 : 0.7}
                  transition={{ duration: 0.3 }}
                >
                  {inflow > 0 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + 48}
                      fill="rgba(255, 255, 255, 0.8)"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      In: ${inflow.toLocaleString()}
                    </text>
                  )}
                  {outflow > 0 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + 58}
                      fill="rgba(255, 255, 255, 0.8)"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      Out: ${outflow.toLocaleString()}
                    </text>
                  )}
                </motion.g>

                {/* Activity indicator */}
                <motion.circle
                  cx={node.x + node.width - 8}
                  cy={node.y + 8}
                  r="3"
                  fill={categoryColor}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />
              </motion.g>
            );
          })}

          {/* Flow direction indicators */}
          {links.map((link, index) => {
            const midPosition = generateFlowPath(link, 50);
            
            return (
              <motion.g
                key={`arrow-${link.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 2 + index * 0.1 }}
              >
                <motion.polygon
                  points={`${midPosition.x-5},${midPosition.y-3} ${midPosition.x+5},${midPosition.y} ${midPosition.x-5},${midPosition.y+3}`}
                  fill={link.color}
                  animate={{
                    x: [0, 5, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
              </motion.g>
            );
          })}
        </svg>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        {(['income', 'expense', 'savings', 'investment'] as const).map((category, index) => {
          const categoryNodes = nodes.filter(node => node.category === category);
          const totalValue = categoryNodes.reduce((sum, node) => {
            const nodeLinks = links.filter(link => 
              (category === 'income' && link.source === node.id) ||
              (category !== 'income' && link.target === node.id)
            );
            return sum + nodeLinks.reduce((linkSum, link) => linkSum + link.value, 0);
          }, 0);
          
          const Icon = getNodeCategoryIcon(category);
          const color = getNodeCategoryColor(category);
          
          return (
            <motion.div
              key={category}
              className="bg-white/5 rounded-xl p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 + index * 0.1 }}
            >
              <motion.div
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: color }}
                animate={{
                  boxShadow: [
                    `0 0 0px ${color}`,
                    `0 0 15px ${color}40`,
                    `0 0 0px ${color}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="w-4 h-4 text-white" />
              </motion.div>
              <div className="text-lg font-bold text-white">
                ${totalValue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 capitalize">{category}</div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}