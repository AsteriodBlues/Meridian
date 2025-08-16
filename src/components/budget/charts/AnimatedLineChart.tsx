'use client';

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Circle } from 'lucide-react';

interface DataPoint {
  x: number;
  y: number;
  date: string;
  value: number;
  label?: string;
}

interface LineChart {
  id: string;
  name: string;
  data: DataPoint[];
  color: string;
  strokeWidth?: number;
  showDots?: boolean;
  showArea?: boolean;
}

interface AnimatedLineChartProps {
  charts: LineChart[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  animated?: boolean;
  className?: string;
}

export default function AnimatedLineChart({
  charts,
  width = 600,
  height = 400,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  animated = true,
  className = ''
}: AnimatedLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ chartId: string; pointIndex: number } | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isDrawing, setIsDrawing] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Chart dimensions with padding
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate chart bounds
  const allData = charts.flatMap(chart => chart.data);
  const xMin = Math.min(...allData.map(d => d.x));
  const xMax = Math.max(...allData.map(d => d.x));
  const yMin = Math.min(...allData.map(d => d.y));
  const yMax = Math.max(...allData.map(d => d.y));

  // Add padding to y-axis
  const yPadding = (yMax - yMin) * 0.1;
  const yMinPadded = yMin - yPadding;
  const yMaxPadded = yMax + yPadding;

  // Scale functions
  const xScale = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * chartWidth;
  const yScale = (y: number) => padding.top + ((yMaxPadded - y) / (yMaxPadded - yMinPadded)) * chartHeight;

  // Animation control
  useEffect(() => {
    if (animated) {
      setIsDrawing(true);
      const timer = setTimeout(() => setIsDrawing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [animated]);

  // Grid lines
  const gridLinesX = 6;
  const gridLinesY = 5;

  // Generate path for line chart
  const generatePath = (data: DataPoint[]) => {
    if (data.length === 0) return '';
    
    let path = `M ${xScale(data[0].x)} ${yScale(data[0].y)}`;
    
    for (let i = 1; i < data.length; i++) {
      const currentPoint = data[i];
      const prevPoint = data[i - 1];
      
      // Create smooth curve using quadratic bezier
      const cpX = xScale(prevPoint.x) + (xScale(currentPoint.x) - xScale(prevPoint.x)) * 0.5;
      const cpY = yScale(prevPoint.y);
      
      path += ` Q ${cpX} ${cpY} ${xScale(currentPoint.x)} ${yScale(currentPoint.y)}`;
    }
    
    return path;
  };

  // Generate area path
  const generateAreaPath = (data: DataPoint[]) => {
    if (data.length === 0) return '';
    
    const linePath = generatePath(data);
    const lastPoint = data[data.length - 1];
    const firstPoint = data[0];
    
    return linePath + 
           ` L ${xScale(lastPoint.x)} ${yScale(yMinPadded)}` +
           ` L ${xScale(firstPoint.x)} ${yScale(yMinPadded)} Z`;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    // Find closest data point
    let closestPoint: { chartId: string; pointIndex: number; distance: number } | null = null;
    
    charts.forEach(chart => {
      chart.data.forEach((point, index) => {
        const pointX = xScale(point.x);
        const pointY = yScale(point.y);
        const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);
        
        if (distance < 20 && (!closestPoint || distance < closestPoint.distance)) {
          closestPoint = { chartId: chart.id, pointIndex: index, distance };
        }
      });
    });
    
    setHoveredPoint(closestPoint ? { chartId: closestPoint.chartId, pointIndex: closestPoint.pointIndex } : null);
  };

  return (
    <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Performance Analytics</h3>
        <p className="text-gray-400 text-sm">Interactive line charts with smooth animations</p>
      </motion.div>

      {/* Legend */}
      {showLegend && (
        <motion.div
          className="flex flex-wrap gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {charts.map((chart, index) => (
            <motion.div
              key={chart.id}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <motion.div
                className="w-4 h-1 rounded-full"
                style={{ backgroundColor: chart.color }}
                animate={{
                  boxShadow: [
                    `0 0 0px ${chart.color}`,
                    `0 0 10px ${chart.color}60`,
                    `0 0 0px ${chart.color}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-gray-300">{chart.name}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Chart Container */}
      <motion.div
        className="relative overflow-hidden rounded-xl bg-black/20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            {/* Gradients for each chart */}
            {charts.map(chart => (
              <linearGradient key={`gradient-${chart.id}`} id={`area-gradient-${chart.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={chart.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={chart.color} stopOpacity={0.05} />
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

            {/* Grid pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>

          {/* Background grid */}
          {showGrid && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Vertical grid lines */}
              {Array.from({ length: gridLinesX }).map((_, i) => {
                const x = padding.left + (i / (gridLinesX - 1)) * chartWidth;
                return (
                  <motion.line
                    key={`grid-v-${i}`}
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                  />
                );
              })}

              {/* Horizontal grid lines */}
              {Array.from({ length: gridLinesY }).map((_, i) => {
                const y = padding.top + (i / (gridLinesY - 1)) * chartHeight;
                const value = yMaxPadded - (i / (gridLinesY - 1)) * (yMaxPadded - yMinPadded);
                
                return (
                  <motion.g key={`grid-h-${i}`}>
                    <motion.line
                      x1={padding.left}
                      y1={y}
                      x2={width - padding.right}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                    />
                    
                    {/* Y-axis labels */}
                    <motion.text
                      x={padding.left - 10}
                      y={y + 4}
                      fill="rgba(255, 255, 255, 0.6)"
                      fontSize="12"
                      textAnchor="end"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.05 }}
                    >
                      {value.toFixed(0)}
                    </motion.text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {/* Chart areas */}
          {charts.map((chart, chartIndex) => (
            chart.showArea && (
              <motion.path
                key={`area-${chart.id}`}
                d={generateAreaPath(chart.data)}
                fill={`url(#area-gradient-${chart.id})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ 
                  duration: 2,
                  delay: 1 + chartIndex * 0.2,
                  ease: 'easeInOut'
                }}
              />
            )
          ))}

          {/* Chart lines */}
          {charts.map((chart, chartIndex) => (
            <motion.path
              key={`line-${chart.id}`}
              d={generatePath(chart.data)}
              stroke={chart.color}
              strokeWidth={chart.strokeWidth || 3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isDrawing ? 1 : 1 }}
              transition={{ 
                duration: 2,
                delay: 1.2 + chartIndex * 0.3,
                ease: 'easeInOut'
              }}
              style={{
                filter: `drop-shadow(0 0 6px ${chart.color}60)`
              }}
            />
          ))}

          {/* Data points */}
          {charts.map((chart, chartIndex) => (
            chart.showDots && chart.data.map((point, pointIndex) => (
              <motion.circle
                key={`dot-${chart.id}-${pointIndex}`}
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r={hoveredPoint?.chartId === chart.id && hoveredPoint?.pointIndex === pointIndex ? 6 : 4}
                fill={chart.color}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 1.5 + chartIndex * 0.3 + pointIndex * 0.05,
                  type: 'spring',
                  stiffness: 300
                }}
                whileHover={{ scale: 1.3 }}
                style={{
                  filter: `drop-shadow(0 0 4px ${chart.color}80)`
                }}
              />
            ))
          ))}

          {/* Hover line */}
          <AnimatePresence>
            {hoveredPoint && (
              <motion.line
                x1={mouseX.get()}
                y1={padding.top}
                x2={mouseX.get()}
                y2={height - padding.bottom}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>

          {/* X-axis labels */}
          {charts[0]?.data.map((point, index) => {
            if (index % Math.max(1, Math.floor(charts[0].data.length / 6)) === 0) {
              return (
                <motion.text
                  key={`x-label-${index}`}
                  x={xScale(point.x)}
                  y={height - padding.bottom + 20}
                  fill="rgba(255, 255, 255, 0.6)"
                  fontSize="12"
                  textAnchor="middle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                >
                  {point.date}
                </motion.text>
              );
            }
            return null;
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredPoint && showTooltip && (
            <motion.div
              className="absolute z-10 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 pointer-events-none"
              style={{
                left: mouseX.get() + 10,
                top: mouseY.get() - 10,
              }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {charts.map(chart => {
                if (chart.id !== hoveredPoint.chartId) return null;
                const point = chart.data[hoveredPoint.pointIndex];
                const prevPoint = chart.data[hoveredPoint.pointIndex - 1];
                const change = prevPoint ? point.value - prevPoint.value : 0;
                const changePercent = prevPoint ? ((change / prevPoint.value) * 100) : 0;
                
                return (
                  <div key={chart.id}>
                    <h4 className="text-white font-bold text-sm mb-1">{chart.name}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{point.date}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Value:</span>
                        <span className="text-white font-semibold">${point.value.toLocaleString()}</span>
                      </div>
                      {prevPoint && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Change:</span>
                          <span className={`font-semibold flex items-center gap-1 ${
                            change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {change >= 0 ? '+' : ''}${change.toLocaleString()} ({changePercent.toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated progress indicator */}
        <motion.div
          className="absolute top-4 right-4 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isDrawing ? 1 : 0 }}
        >
          <motion.div
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          />
          <span className="text-xs text-gray-400">Drawing...</span>
        </motion.div>
      </motion.div>
    </div>
  );
}