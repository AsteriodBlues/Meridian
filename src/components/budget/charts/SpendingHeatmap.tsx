'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Flame, Snowflake } from 'lucide-react';

interface DayData {
  date: string;
  amount: number;
  transactions: number;
  category?: string;
  dayOfWeek: number;
  week: number;
}

interface SpendingHeatmapProps {
  data: DayData[];
  year?: number;
  showTooltip?: boolean;
  animated?: boolean;
  className?: string;
}

export default function SpendingHeatmap({
  data,
  year = new Date().getFullYear(),
  showTooltip = true,
  animated = true,
  className = ''
}: SpendingHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Animation phases
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate year grid (52 weeks x 7 days)
  const generateYearGrid = () => {
    const grid: (DayData | null)[][] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Start from the first Sunday of the year or before
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());
    
    let currentDate = new Date(firstSunday);
    let weekIndex = 0;
    
    while (currentDate <= endDate || weekIndex < 52) {
      const week: (DayData | null)[] = [];
      
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const dateString = currentDate.toISOString().split('T')[0];
        const dayData = data.find(d => d.date === dateString);
        
        if (currentDate.getFullYear() === year) {
          week.push(dayData ? {
            ...dayData,
            dayOfWeek,
            week: weekIndex
          } : {
            date: dateString,
            amount: 0,
            transactions: 0,
            dayOfWeek,
            week: weekIndex
          });
        } else {
          week.push(null);
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      grid.push(week);
      weekIndex++;
      
      if (weekIndex >= 53) break;
    }
    
    return grid;
  };

  const yearGrid = generateYearGrid();
  
  // Calculate intensity levels
  const allAmounts = data.map(d => d.amount).filter(a => a > 0);
  const maxAmount = Math.max(...allAmounts, 1);
  const minAmount = Math.min(...allAmounts, 0);
  
  const getIntensity = (amount: number) => {
    if (amount === 0) return 0;
    return Math.min(Math.max((amount - minAmount) / (maxAmount - minAmount), 0.1), 1);
  };

  const getHeatColor = (intensity: number, isHovered: boolean = false) => {
    if (intensity === 0) return 'rgba(255, 255, 255, 0.05)';
    
    const alpha = isHovered ? Math.min(intensity + 0.3, 1) : intensity;
    
    if (intensity < 0.25) return `rgba(34, 197, 94, ${alpha})`; // Green - low spending
    if (intensity < 0.5) return `rgba(59, 130, 246, ${alpha})`; // Blue - moderate
    if (intensity < 0.75) return `rgba(245, 158, 11, ${alpha})`; // Amber - high
    return `rgba(239, 68, 68, ${alpha})`; // Red - very high
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity === 0) return 'No spending';
    if (intensity < 0.25) return 'Low spending';
    if (intensity < 0.5) return 'Moderate spending';
    if (intensity < 0.75) return 'High spending';
    return 'Very high spending';
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  // Calculate monthly totals
  const monthlyTotals = months.map((_, monthIndex) => {
    const monthData = data.filter(d => {
      const date = new Date(d.date);
      return date.getMonth() === monthIndex && date.getFullYear() === year;
    });
    return monthData.reduce((sum, d) => sum + d.amount, 0);
  });

  const cellSize = 12;
  const cellGap = 2;

  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Spending Patterns</h3>
            <p className="text-gray-400 text-sm">Daily spending heat map for {year}</p>
          </div>
          
          <motion.div
            className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2"
            animate={{
              boxShadow: [
                '0 0 0px rgba(59, 130, 246, 0)',
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 0px rgba(59, 130, 246, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-white font-semibold">{year}</span>
          </motion.div>
        </div>

        {/* Intensity Legend */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm text-gray-400">Less</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, index) => (
              <motion.div
                key={index}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getHeatColor(intensity) }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">More</span>
          
          <div className="ml-4 flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Low</span>
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">High</span>
          </div>
        </motion.div>
      </motion.div>

      <div className="space-y-6">
        {/* Monthly Summary Bar */}
        <motion.div
          className="grid grid-cols-12 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {months.map((month, index) => {
            const total = monthlyTotals[index];
            const maxMonthly = Math.max(...monthlyTotals);
            const height = Math.max(4, (total / maxMonthly) * 40);
            const isSelected = selectedMonth === index;
            
            return (
              <motion.div
                key={month}
                className="text-center cursor-pointer"
                onClick={() => setSelectedMonth(isSelected ? null : index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="mx-auto mb-2 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                  style={{ 
                    width: 20, 
                    height: height,
                    background: isSelected 
                      ? 'linear-gradient(to top, #ef4444, #f87171)'
                      : 'linear-gradient(to top, #3b82f6, #60a5fa)'
                  }}
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ delay: 0.5 + index * 0.05, type: 'spring' }}
                  whileHover={{
                    background: 'linear-gradient(to top, #10b981, #34d399)'
                  }}
                />
                <div className="text-xs text-gray-400">{month}</div>
                <div className="text-xs text-white font-semibold">
                  ${(total / 1000).toFixed(0)}k
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Heat Map Grid */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredDay(null)}
        >
          {/* Day labels */}
          <div className="flex flex-col gap-1 absolute left-0 top-6">
            {daysOfWeek.map((day, index) => (
              index % 2 === 1 && (
                <motion.div
                  key={day}
                  className="text-xs text-gray-400 h-3 flex items-center"
                  style={{ lineHeight: `${cellSize + cellGap}px` }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  {day}
                </motion.div>
              )
            ))}
          </div>

          {/* Month labels */}
          <div className="flex gap-0 ml-8 mb-2">
            {months.map((month, index) => (
              <motion.div
                key={month}
                className="text-xs text-gray-400"
                style={{ 
                  width: `${(cellSize + cellGap) * 4.33}px`,
                  textAlign: 'center'
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.03 }}
              >
                {month}
              </motion.div>
            ))}
          </div>

          {/* Heat map grid */}
          <div className="ml-8 grid grid-cols-53 gap-1">
            {yearGrid.map((week, weekIndex) => (
              week.map((day, dayIndex) => {
                if (!day) return (
                  <div
                    key={`empty-${weekIndex}-${dayIndex}`}
                    style={{ width: cellSize, height: cellSize }}
                  />
                );

                const intensity = getIntensity(day.amount);
                const isHovered = hoveredDay?.date === day.date;
                const isCurrentMonth = selectedMonth !== null && 
                  new Date(day.date).getMonth() === selectedMonth;
                const dayOfMonth = new Date(day.date).getDate();
                
                return (
                  <motion.div
                    key={day.date}
                    className="relative cursor-pointer rounded-sm"
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getHeatColor(intensity, isHovered),
                      border: isCurrentMonth ? '1px solid rgba(255,255,255,0.5)' : 'none'
                    }}
                    initial={{ 
                      scale: 0, 
                      opacity: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      backgroundColor: getHeatColor(intensity, isHovered)
                    }}
                    transition={{ 
                      delay: 0.9 + (weekIndex * 7 + dayIndex) * 0.001,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ 
                      scale: 1.2,
                      z: 10,
                      boxShadow: `0 0 20px ${getHeatColor(intensity, true)}80`
                    }}
                    onMouseEnter={() => setHoveredDay(day)}
                  >
                    {/* Day number for first of month */}
                    {dayOfMonth === 1 && (
                      <motion.div
                        className="absolute -top-4 left-0 text-xs text-gray-400 text-center"
                        style={{ width: cellSize }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        1
                      </motion.div>
                    )}

                    {/* Pulse effect for high spending days */}
                    {intensity > 0.75 && (
                      <motion.div
                        className="absolute inset-0 rounded-sm"
                        style={{ backgroundColor: getHeatColor(intensity) }}
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: weekIndex * 0.1
                        }}
                      />
                    )}

                    {/* Streak indicators */}
                    {animated && animationPhase === 1 && intensity > 0 && (
                      <motion.div
                        className="absolute inset-0 rounded-sm border border-white/50"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: [0, 1, 0] }}
                        transition={{ duration: 1 }}
                      />
                    )}
                  </motion.div>
                );
              })
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && showTooltip && (
          <motion.div
            className="fixed z-50 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="min-w-[180px]">
              <h4 className="text-white font-bold text-sm mb-2">
                {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h4>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-semibold">
                    ${hoveredDay.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Transactions:</span>
                  <span className="text-white">{hoveredDay.transactions}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Intensity:</span>
                  <span className="text-white">
                    {getIntensityLabel(getIntensity(hoveredDay.amount))}
                  </span>
                </div>
                
                {hoveredDay.category && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Top Category:</span>
                    <span className="text-white">{hoveredDay.category}</span>
                  </div>
                )}
              </div>
              
              {/* Intensity bar */}
              <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getHeatColor(getIntensity(hoveredDay.amount)) }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${getIntensity(hoveredDay.amount) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Summary */}
      <motion.div
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <motion.div
            className="text-2xl font-bold text-green-400 mb-1"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {data.filter(d => getIntensity(d.amount) < 0.25).length}
          </motion.div>
          <div className="text-xs text-gray-400">Low Spending Days</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {data.filter(d => getIntensity(d.amount) >= 0.25 && getIntensity(d.amount) < 0.75).length}
          </div>
          <div className="text-xs text-gray-400">Moderate Days</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <motion.div
            className="text-2xl font-bold text-red-400 mb-1"
            animate={{ 
              scale: data.filter(d => getIntensity(d.amount) >= 0.75).length > 30 ? [1, 1.1, 1] : 1 
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {data.filter(d => getIntensity(d.amount) >= 0.75).length}
          </motion.div>
          <div className="text-xs text-gray-400">High Spending Days</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            ${(data.reduce((sum, d) => sum + d.amount, 0) / data.length).toFixed(0)}
          </div>
          <div className="text-xs text-gray-400">Daily Average</div>
        </div>
      </motion.div>
    </div>
  );
}