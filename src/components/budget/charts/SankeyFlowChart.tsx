'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowRight, DollarSign, TrendingUp, Zap, Drop, Waves } from 'lucide-react';

interface SankeyNode {
  id: string;
  name: string;
  value: number;
  level: number;
  color: string;
  icon?: React.ElementType;
  category: 'source' | 'intermediate' | 'destination';
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

interface SankeyFlowChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  animated?: boolean;
  showLabels?: boolean;
  className?: string;
}

export default function SankeyFlowChart({
  nodes,
  links,
  width = 800,
  height = 500,
  animated = true,
  showLabels = true,
  className = ''
}: SankeyFlowChartProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<{ source: string; target: string } | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate node positions based on levels
  const nodePositions = useMemo(() => {
    const levels = Array.from(new Set(nodes.map(n => n.level))).sort((a, b) => a - b);
    const levelWidth = width / (levels.length + 1);
    const positions: { [key: string]: { x: number; y: number; height: number } } = {};

    levels.forEach((level, levelIndex) => {
      const levelNodes = nodes.filter(n => n.level === level);
      const totalValue = levelNodes.reduce((sum, n) => sum + n.value, 0);
      const levelHeight = height - 100; // Padding
      let currentY = 50; // Starting Y position

      levelNodes.forEach(node => {
        const nodeHeight = (node.value / totalValue) * levelHeight;
        positions[node.id] = {
          x: (levelIndex + 1) * levelWidth,
          y: currentY,
          height: nodeHeight
        };
        currentY += nodeHeight + 10; // Add spacing between nodes
      });
    });

    return positions;
  }, [nodes, width, height]);

  // Generate curved path for links
  const generateLinkPath = (source: string, target: string, value: number) => {
    const sourcePos = nodePositions[source];
    const targetPos = nodePositions[target];
    
    if (!sourcePos || !targetPos) return '';

    const sourceLink = links.find(l => l.source === source && l.target === target);
    const totalSourceValue = links
      .filter(l => l.source === source)
      .reduce((sum, l) => sum + l.value, 0);
    
    const linkHeight = (value / totalSourceValue) * sourcePos.height;
    
    const x1 = sourcePos.x + 80; // Node width
    const y1 = sourcePos.y + sourcePos.height / 2;
    const x2 = targetPos.x;
    const y2 = targetPos.y + targetPos.height / 2;
    
    const cp1x = x1 + (x2 - x1) * 0.5;
    const cp1y = y1;
    const cp2x = x1 + (x2 - x1) * 0.5;
    const cp2y = y2;

    return `M ${x1} ${y1} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x2} ${y2}`;
  };

  // Animation phases for flow effects
  useEffect(() => {
    if (!animated) return;
    
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [animated]);

  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNode(nodeId);
    if (nodeId) {
      // Highlight connected links
      const connectedLinks = links.filter(l => l.source === nodeId || l.target === nodeId);
      if (connectedLinks.length > 0) {
        // Could add additional logic here for highlighting connections
      }
    }
  };

  return (
    <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Waves className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Money Flow Analysis</h3>
          {animated && (
            <motion.div
              className="flex items-center gap-1"
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-xs text-blue-400">FLOWING</span>
            </motion.div>
          )}
        </div>
        <p className="text-gray-400 text-sm">Interactive Sankey diagram showing financial flow patterns</p>
      </motion.div>

      {/* Chart Container */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-black/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
        >
          <defs>
            {/* Flow gradients */}
            {links.map((link, index) => (
              <linearGradient 
                key={`flow-gradient-${index}`} 
                id={`flow-gradient-${link.source}-${link.target}`} 
                x1="0%" 
                y1="0%" 
                x2="100%" 
                y2="0%"
              >
                <stop offset="0%" stopColor={nodes.find(n => n.id === link.source)?.color || '#3b82f6'} stopOpacity={0.8} />
                <stop offset="100%" stopColor={nodes.find(n => n.id === link.target)?.color || '#3b82f6'} stopOpacity={0.4} />
              </linearGradient>
            ))}

            {/* Flow animation patterns */}
            <pattern id="flowPattern" patternUnits="userSpaceOnUse" width="20" height="20">
              <motion.rect
                width="20"
                height="20"
                fill="rgba(255, 255, 255, 0.1)"
                animate={{
                  x: ['-20px', '0px']
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </pattern>

            {/* Glow filters */}
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="flow-glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Flow Links */}
          {links.map((link, index) => {
            const isHovered = hoveredLink?.source === link.source && hoveredLink?.target === link.target;
            const isConnected = hoveredNode && (hoveredNode === link.source || hoveredNode === link.target);
            const strokeWidth = Math.max(3, (link.value / Math.max(...links.map(l => l.value))) * 40);
            
            return (
              <motion.g key={`link-${index}`}>
                {/* Main flow path */}
                <motion.path
                  d={generateLinkPath(link.source, link.target, link.value)}
                  stroke={`url(#flow-gradient-${link.source}-${link.target})`}
                  strokeWidth={strokeWidth}
                  fill="none"
                  filter="url(#flow-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: isConnected ? 1 : 0.6,
                    strokeWidth: isHovered ? strokeWidth * 1.2 : strokeWidth
                  }}
                  transition={{ 
                    pathLength: { duration: 2, delay: 0.5 + index * 0.1 },
                    opacity: { duration: 0.3 },
                    strokeWidth: { duration: 0.3 }
                  }}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredLink({ source: link.source, target: link.target })}
                  onMouseLeave={() => setHoveredLink(null)}
                />

                {/* Flow animation */}
                {animated && (
                  <motion.path
                    d={generateLinkPath(link.source, link.target, link.value)}
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="10 10"
                    animate={{
                      strokeDashoffset: [0, -20]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 0.2
                    }}
                    style={{ opacity: isConnected ? 1 : 0.3 }}
                  />
                )}

                {/* Flow particles */}
                {animated && isConnected && Array.from({ length: 3 }).map((_, particleIndex) => {
                  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                  pathElement.setAttribute('d', generateLinkPath(link.source, link.target, link.value));
                  
                  return (
                    <motion.circle
                      key={`particle-${index}-${particleIndex}`}
                      r="3"
                      fill={nodes.find(n => n.id === link.source)?.color || '#3b82f6'}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: particleIndex * 0.5,
                        ease: 'linear'
                      }}
                    >
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        begin={`${particleIndex * 0.5}s`}
                      >
                        <mpath href={`#flow-${index}`} />
                      </animateMotion>
                    </motion.circle>
                  );
                })}
              </motion.g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, index) => {
            const position = nodePositions[node.id];
            if (!position) return null;
            
            const Icon = node.icon || DollarSign;
            const isHovered = hoveredNode === node.id;
            const connectedLinks = links.filter(l => l.source === node.id || l.target === node.id);
            
            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                onMouseEnter={() => handleNodeHover(node.id)}
                onMouseLeave={() => handleNodeHover(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node background */}
                <motion.rect
                  x={position.x - 40}
                  y={position.y - position.height / 2}
                  width="80"
                  height={position.height}
                  rx="12"
                  fill={node.color}
                  filter={isHovered ? "url(#node-glow)" : undefined}
                  animate={{
                    fill: isHovered ? [node.color, `${node.color}cc`, node.color] : node.color,
                    scale: isHovered ? 1.05 : 1
                  }}
                  transition={{ 
                    fill: { duration: 1, repeat: isHovered ? Infinity : 0 },
                    scale: { duration: 0.3 }
                  }}
                />

                {/* Node border */}
                <motion.rect
                  x={position.x - 40}
                  y={position.y - position.height / 2}
                  width="80"
                  height={position.height}
                  rx="12"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  animate={{
                    stroke: isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
                    strokeWidth: isHovered ? 3 : 2
                  }}
                />

                {/* Node icon */}
                <motion.g
                  transform={`translate(${position.x - 12}, ${position.y - 12})`}
                  animate={{
                    rotate: isHovered ? [0, 5, -5, 0] : 0,
                    scale: isHovered ? 1.2 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <circle cx="12" cy="12" r="12" fill="rgba(255, 255, 255, 0.2)" />
                  <foreignObject x="4" y="4" width="16" height="16">
                    <Icon className="w-4 h-4 text-white" />
                  </foreignObject>
                </motion.g>

                {/* Node labels */}
                {showLabels && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <text
                      x={position.x}
                      y={position.y + position.height / 2 + 20}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.name}
                    </text>
                    <text
                      x={position.x}
                      y={position.y + position.height / 2 + 35}
                      fill="rgba(255, 255, 255, 0.6)"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      ${node.value.toLocaleString()}
                    </text>
                  </motion.g>
                )}

                {/* Value indicator */}
                <motion.circle
                  cx={position.x + 35}
                  cy={position.y - position.height / 2 - 10}
                  r="8"
                  fill={node.color}
                  stroke="white"
                  strokeWidth="2"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />

                <text
                  x={position.x + 35}
                  y={position.y - position.height / 2 - 6}
                  fill="white"
                  fontSize="8"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {connectedLinks.length}
                </text>
              </motion.g>
            );
          })}

          {/* Level indicators */}
          {Array.from(new Set(nodes.map(n => n.level))).sort((a, b) => a - b).map((level, levelIndex) => {
            const levelNodes = nodes.filter(n => n.level === level);
            const levelWidth = width / (Array.from(new Set(nodes.map(n => n.level))).length + 1);
            const x = (levelIndex + 1) * levelWidth;
            
            return (
              <motion.g
                key={`level-${level}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <line
                  x1={x - 40}
                  y1={20}
                  x2={x + 40}
                  y2={20}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={15}
                  fill="rgba(255, 255, 255, 0.6)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  Level {level}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Floating tooltip */}
        <AnimatePresence>
          {(hoveredNode || hoveredLink) && (
            <motion.div
              className="absolute z-20 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 pointer-events-none"
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
              {hoveredNode && (() => {
                const node = nodes.find(n => n.id === hoveredNode);
                if (!node) return null;
                
                const incomingFlow = links.filter(l => l.target === hoveredNode).reduce((sum, l) => sum + l.value, 0);
                const outgoingFlow = links.filter(l => l.source === hoveredNode).reduce((sum, l) => sum + l.value, 0);
                
                return (
                  <div className="text-center min-w-[200px]">
                    <div className="flex items-center gap-2 justify-center mb-3">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: node.color }}
                      >
                        {node.icon && <node.icon className="w-4 h-4 text-white" />}
                      </div>
                      <h4 className="text-white font-bold">{node.name}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Value:</span>
                        <span className="text-white font-semibold">${node.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white capitalize">{node.category}</span>
                      </div>
                      {incomingFlow > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Incoming:</span>
                          <span className="text-green-400 font-semibold">${incomingFlow.toLocaleString()}</span>
                        </div>
                      )}
                      {outgoingFlow > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Outgoing:</span>
                          <span className="text-red-400 font-semibold">${outgoingFlow.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {hoveredLink && (() => {
                const link = hoveredLink;
                const sourceNode = nodes.find(n => n.id === link.source);
                const targetNode = nodes.find(n => n.id === link.target);
                const linkData = links.find(l => l.source === link.source && l.target === link.target);
                
                if (!sourceNode || !targetNode || !linkData) return null;
                
                return (
                  <div className="text-center min-w-[250px]">
                    <div className="flex items-center gap-2 justify-center mb-3">
                      <span className="text-white font-medium">{sourceNode.name}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">{targetNode.name}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Flow Amount:</span>
                        <span className="text-white font-semibold">${linkData.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">% of Source:</span>
                        <span className="text-blue-400 font-semibold">
                          {((linkData.value / sourceNode.value) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Flow Statistics */}
      <motion.div
        className="mt-6 grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
      >
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-blue-400">
            ${nodes.reduce((sum, node) => sum + node.value, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total Volume</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-green-400">
            {links.length}
          </div>
          <div className="text-xs text-gray-400">Active Flows</div>
        </div>
        
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-purple-400">
            {nodes.length}
          </div>
          <div className="text-xs text-gray-400">Flow Points</div>
        </div>
      </motion.div>
    </div>
  );
}