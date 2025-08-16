'use client';

import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Cpu, Heart, DollarSign, Zap, ShoppingBag, Factory, Building, Plug, Hammer, Phone } from 'lucide-react';

interface SectorData {
  sector: string;
  value: number;
  percentage: number;
  color: string;
  icon: React.ElementType;
  holdings: number;
}

interface SectorPieChartProps {
  data: SectorData[];
  className?: string;
}

const sectorIcons = {
  'Technology': Cpu,
  'Healthcare': Heart,
  'Finance': DollarSign,
  'Energy': Zap,
  'Consumer': ShoppingBag,
  'Industrial': Factory,
  'Real Estate': Building,
  'Utilities': Plug,
  'Materials': Hammer,
  'Telecom': Phone
};

export default function SectorPieChart({ data, className = '' }: SectorPieChartProps) {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [is3D, setIs3D] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // 3D tilt effect
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-15, 15]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredSector(null);
  };

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate cumulative percentages for pie slices
  const slices = data.reduce((acc, sector, index) => {
    const startAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : 0;
    const endAngle = startAngle + (sector.percentage / 100) * 360;
    
    acc.push({
      ...sector,
      startAngle,
      endAngle,
      midAngle: (startAngle + endAngle) / 2,
      index
    });
    
    return acc;
  }, [] as Array<SectorData & { startAngle: number; endAngle: number; midAngle: number; index: number }>);

  const createPath = (centerX: number, centerY: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
    const start1 = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const end1 = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const start2 = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const end2 = polarToCartesian(centerX, centerY, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', start1.x, start1.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, end1.x, end1.y,
      'L', end2.x, end2.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, start2.x, start2.y,
      'L', start1.x, start1.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const centerX = 200;
  const centerY = 200;
  const innerRadius = 60;
  const outerRadius = 150;

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      {/* 3D Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <motion.button
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            is3D ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'
          }`}
          onClick={() => setIs3D(!is3D)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          3D View
        </motion.button>
      </div>

      {/* Main pie chart container */}
      <motion.div
        ref={containerRef}
        className="relative w-[400px] h-[400px] mx-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1000,
        }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            rotateX: is3D ? rotateX : 0,
            rotateY: is3D ? rotateY : 0,
            transformStyle: 'preserve-3d',
          }}
          animate={{ rotateZ: rotation }}
          transition={{ duration: 0.1, ease: 'linear' }}
        >
          {/* 3D Base/Shadow */}
          {is3D && (
            <motion.div
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                translateZ: -20,
              }}
            >
              <svg width="400" height="400" className="absolute inset-0">
                {slices.map((slice) => (
                  <motion.path
                    key={`shadow-${slice.sector}`}
                    d={createPath(centerX, centerY, innerRadius, outerRadius, slice.startAngle, slice.endAngle)}
                    fill={slice.color}
                    opacity={0.3}
                    style={{ filter: 'blur(2px)' }}
                  />
                ))}
              </svg>
            </motion.div>
          )}

          {/* Main pie chart */}
          <svg width="400" height="400" className="relative z-10">
            <defs>
              {slices.map((slice) => (
                <linearGradient key={`gradient-${slice.sector}`} id={`gradient-${slice.sector}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={slice.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={slice.color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            
            {/* Pie slices */}
            {slices.map((slice) => {
              const isHovered = hoveredSector === slice.sector;
              const isSelected = selectedSector === slice.sector;
              const scale = isHovered || isSelected ? 1.1 : 1;
              const translateDistance = isHovered || isSelected ? 10 : 0;
              
              // Calculate translation for slice expansion
              const midAngleRad = (slice.midAngle - 90) * Math.PI / 180;
              const translateX = Math.cos(midAngleRad) * translateDistance;
              const translateY = Math.sin(midAngleRad) * translateDistance;
              
              return (
                <motion.g
                  key={slice.sector}
                  style={{
                    transformOrigin: `${centerX}px ${centerY}px`,
                  }}
                  animate={{
                    scale,
                    x: translateX,
                    y: translateY,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.path
                    d={createPath(centerX, centerY, innerRadius, outerRadius, slice.startAngle, slice.endAngle)}
                    fill={`url(#gradient-${slice.sector})`}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSector(slice.sector)}
                    onClick={() => setSelectedSector(isSelected ? null : slice.sector)}
                    animate={{
                      filter: isHovered || isSelected 
                        ? `drop-shadow(0 0 20px ${slice.color}80)` 
                        : 'drop-shadow(0 0 0px transparent)',
                    }}
                  />
                  
                  {/* Slice border glow */}
                  {(isHovered || isSelected) && (
                    <motion.path
                      d={createPath(centerX, centerY, innerRadius, outerRadius, slice.startAngle, slice.endAngle)}
                      fill="none"
                      stroke={slice.color}
                      strokeWidth="4"
                      strokeOpacity={0.8}
                      initial={{ strokeOpacity: 0 }}
                      animate={{ strokeOpacity: 0.8 }}
                      style={{ filter: `drop-shadow(0 0 10px ${slice.color})` }}
                    />
                  )}
                </motion.g>
              );
            })}

            {/* Center circle */}
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={innerRadius}
              fill="url(#centerGradient)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              animate={{
                r: hoveredSector ? innerRadius + 5 : innerRadius,
              }}
            />
            
            <defs>
              <radialGradient id="centerGradient">
                <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
              </radialGradient>
            </defs>

            {/* Sector labels */}
            {slices.map((slice) => {
              const labelRadius = (innerRadius + outerRadius) / 2;
              const labelPos = polarToCartesian(centerX, centerY, labelRadius, slice.midAngle);
              const Icon = slice.icon;
              
              return (
                <motion.g
                  key={`label-${slice.sector}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: slice.index * 0.1 }}
                >
                  <motion.circle
                    cx={labelPos.x}
                    cy={labelPos.y}
                    r="20"
                    fill="rgba(0,0,0,0.8)"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    animate={{
                      r: hoveredSector === slice.sector ? 25 : 20,
                      fill: hoveredSector === slice.sector ? slice.color : 'rgba(0,0,0,0.8)',
                    }}
                  />
                  
                  <motion.foreignObject
                    x={labelPos.x - 12}
                    y={labelPos.y - 12}
                    width="24"
                    height="24"
                    animate={{
                      scale: hoveredSector === slice.sector ? 1.2 : 1,
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.foreignObject>
                </motion.g>
              );
            })}
          </svg>

          {/* Floating sector info */}
          <AnimatePresence>
            {(hoveredSector || selectedSector) && (() => {
              const activeSector = slices.find(s => s.sector === (selectedSector || hoveredSector));
              if (!activeSector) return null;
              
              const infoRadius = outerRadius + 60;
              const infoPos = polarToCartesian(centerX, centerY, infoRadius, activeSector.midAngle);
              
              return (
                <motion.div
                  key={`info-${activeSector.sector}`}
                  className="absolute z-20 pointer-events-none"
                  style={{
                    left: infoPos.x,
                    top: infoPos.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div 
                    className="bg-black/90 backdrop-blur-xl border rounded-2xl p-4 min-w-[180px]"
                    style={{ borderColor: `${activeSector.color}40` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: activeSector.color }}
                      >
                        <activeSector.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">{activeSector.sector}</h4>
                        <p className="text-gray-400 text-xs">{activeSector.holdings} holdings</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Allocation:</span>
                        <span className="text-white font-bold">{activeSector.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Value:</span>
                        <span className="text-white font-bold">${activeSector.value.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Performance bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: activeSector.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${activeSector.percentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </motion.div>

        {/* Center total value */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <motion.p 
              className="text-2xl font-bold text-white"
              animate={{ 
                textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ${data.reduce((sum, sector) => sum + sector.value, 0).toLocaleString()}
            </motion.p>
            <p className="text-gray-400 text-sm">Total Portfolio</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="mt-6 grid grid-cols-2 gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {data.map((sector, index) => (
          <motion.div
            key={sector.sector}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
              hoveredSector === sector.sector || selectedSector === sector.sector
                ? 'bg-white/10' 
                : 'bg-white/5 hover:bg-white/8'
            }`}
            onMouseEnter={() => setHoveredSector(sector.sector)}
            onMouseLeave={() => setHoveredSector(null)}
            onClick={() => setSelectedSector(selectedSector === sector.sector ? null : sector.sector)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: sector.color }}
              animate={{
                boxShadow: hoveredSector === sector.sector 
                  ? `0 0 15px ${sector.color}80`
                  : '0 0 0px transparent',
              }}
            />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{sector.sector}</p>
              <p className="text-gray-400 text-xs">{sector.percentage.toFixed(1)}%</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}