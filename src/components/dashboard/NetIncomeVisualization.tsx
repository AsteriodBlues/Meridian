'use client';

import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar, Zap, 
  BarChart3, PieChart, Activity, Target, Star, Sparkles,
  ArrowUp, ArrowDown, Eye, Brain, Gem, Layers,
  ChevronRight, ChevronLeft, RotateCcw
} from 'lucide-react';

// Aurora Blossom Color Palette
const AURORA_COLORS = {
  rose: '#f9d4e0',
  purple: '#eb96ff', 
  teal: '#0b5777',
  navy: '#193153'
};

// Net Income Data Interface
interface NetIncomeData {
  month: string;
  income: number;
  expenses: number;
  netIncome: number;
  growthRate: number;
  category: string;
}

interface IncomeBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

// Advanced Particle System for Aurora Effects
const AuroraParticleSystem = memo(({ isActive, intensity = 1 }: { 
  isActive: boolean; 
  intensity?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);

  const initParticles = useCallback(() => {
    const count = Math.floor(80 * intensity);
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 800,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 60 + 280, // Purple to pink range
      life: Math.random() * 100 + 50,
      maxLife: Math.random() * 100 + 50
    }));
  }, [intensity]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary wrapping
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Aurora wave effect
      particle.vy += Math.sin(particle.x * 0.01) * 0.001;
      particle.vx += Math.cos(particle.y * 0.01) * 0.001;

      // Render particle with aurora effect
      const lifeRatio = particle.life / particle.maxLife;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * lifeRatio, 0, Math.PI * 2);
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      );
      gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * lifeRatio})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Life cycle
      particle.life -= 0.5;
      if (particle.life <= 0) {
        particle.life = particle.maxLife;
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
      }
    });

    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isActive]);

  useEffect(() => {
    initParticles();
    if (isActive) {
      animate();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, initParticles, animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-60"
      style={{ width: '100%', height: '100%' }}
    />
  );
});

// Net Income Chart Component
const NetIncomeChart = memo(({ data, isActive }: { 
  data: NetIncomeData[]; 
  isActive: boolean;
}) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expenses)));
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={chartRef} className="relative h-64 p-4">
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => {
          const incomeHeight = (item.income / maxValue) * 200;
          const expenseHeight = (item.expenses / maxValue) * 200;
          const netHeight = (item.netIncome / maxValue) * 200;

          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              {/* Net Income Bar */}
              <motion.div
                className="relative w-full rounded-t-lg overflow-hidden"
                style={{
                  background: item.netIncome > 0 
                    ? `linear-gradient(135deg, ${AURORA_COLORS.purple}40, ${AURORA_COLORS.rose}40)`
                    : `linear-gradient(135deg, ${AURORA_COLORS.teal}40, ${AURORA_COLORS.navy}40)`
                }}
                initial={{ height: 0, opacity: 0.5 }}
                animate={{ 
                  height: isActive ? Math.abs(netHeight) : 8,
                  opacity: isActive ? 1 : 0.3,
                  boxShadow: isActive ? [
                    `0 0 20px ${AURORA_COLORS.purple}30`,
                    `0 0 40px ${AURORA_COLORS.rose}20`,
                    `0 0 20px ${AURORA_COLORS.purple}30`
                  ] : '0 0 0px transparent'
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  boxShadow: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 0 30px ${AURORA_COLORS.purple}50`
                }}
              >
                {/* Aurora Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{
                    x: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.2
                  }}
                />
                
                {/* Value Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ${Math.abs(item.netIncome).toLocaleString()}
                  </span>
                </div>
              </motion.div>

              {/* Month Label */}
              <span className="text-xs text-gray-400 font-medium">
                {item.month}
              </span>

              {/* Growth Indicator */}
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {item.growthRate > 0 ? (
                  <ArrowUp className="w-3 h-3 text-green-400" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs font-semibold ${
                  item.growthRate > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {Math.abs(item.growthRate)}%
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// Income Breakdown Pie Chart
const IncomeBreakdownChart = memo(({ data }: { data: IncomeBreakdown[] }) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  let currentAngle = 0;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background Circle */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        
        {/* Pie Segments */}
        {data.map((item, index) => {
          const percentage = (item.amount / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const x1 = 100 + 70 * Math.cos((startAngle - 90) * Math.PI / 180);
          const y1 = 100 + 70 * Math.sin((startAngle - 90) * Math.PI / 180);
          const x2 = 100 + 70 * Math.cos((endAngle - 90) * Math.PI / 180);
          const y2 = 100 + 70 * Math.sin((endAngle - 90) * Math.PI / 180);
          
          const largeArc = angle > 180 ? 1 : 0;
          
          currentAngle += angle;
          
          return (
            <motion.path
              key={item.category}
              d={`M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={`url(#aurora-gradient-${index})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
            />
          );
        })}
        
        {/* Gradient Definitions */}
        <defs>
          {data.map((item, index) => (
            <radialGradient key={index} id={`aurora-gradient-${index}`}>
              <stop offset="0%" stopColor={AURORA_COLORS.purple} stopOpacity="0.8" />
              <stop offset="100%" stopColor={AURORA_COLORS.rose} stopOpacity="0.4" />
            </radialGradient>
          ))}
        </defs>
      </svg>
      
      {/* Center Value */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-bold text-white">
          ${total.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400">Total Income</span>
      </div>
    </div>
  );
});

// Main Net Income Visualization Component
export default function NetIncomeVisualization() {
  const [isActive, setIsActive] = useState(false);
  const [currentView, setCurrentView] = useState<'chart' | 'breakdown' | 'trends'>('chart');
  const [selectedPeriod, setSelectedPeriod] = useState<'6m' | '1y' | '2y'>('1y');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Mock data - in real app this would come from API
  const netIncomeData: NetIncomeData[] = useMemo(() => [
    { month: 'Jul', income: 12500, expenses: 8200, netIncome: 4300, growthRate: 8.5, category: 'strong' },
    { month: 'Aug', income: 13200, expenses: 8800, netIncome: 4400, growthRate: 2.3, category: 'strong' },
    { month: 'Sep', income: 11800, expenses: 9200, netIncome: 2600, growthRate: -40.9, category: 'moderate' },
    { month: 'Oct', income: 14100, expenses: 8900, netIncome: 5200, growthRate: 100.0, category: 'strong' },
    { month: 'Nov', income: 13800, expenses: 9100, netIncome: 4700, growthRate: -9.6, category: 'strong' },
    { month: 'Dec', income: 15200, expenses: 9800, netIncome: 5400, growthRate: 14.9, category: 'excellent' },
  ], []);

  const incomeBreakdown: IncomeBreakdown[] = useMemo(() => [
    { category: 'Salary', amount: 8500, percentage: 68, color: AURORA_COLORS.purple, trend: 'up' },
    { category: 'Investments', amount: 2100, percentage: 17, color: AURORA_COLORS.rose, trend: 'up' },
    { category: 'Rental', amount: 1200, percentage: 10, color: AURORA_COLORS.teal, trend: 'stable' },
    { category: 'Side Business', amount: 650, percentage: 5, color: AURORA_COLORS.navy, trend: 'up' },
  ], []);

  const totalNetIncome = netIncomeData.reduce((sum, item) => sum + item.netIncome, 0);
  const avgMonthlyNet = totalNetIncome / netIncomeData.length;
  const bestMonth = netIncomeData.reduce((max, item) => item.netIncome > max.netIncome ? item : max);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress) => {
      setIsActive(progress > 0.2 && progress < 0.8);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <motion.div
      ref={containerRef}
      className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Aurora Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl`} 
             style={{ background: `radial-gradient(circle, ${AURORA_COLORS.purple}20, transparent 70%)` }} />
        <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl`}
             style={{ background: `radial-gradient(circle, ${AURORA_COLORS.rose}15, transparent 70%)` }} />
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl`}
             style={{ background: `radial-gradient(circle, ${AURORA_COLORS.teal}10, transparent 60%)` }} />
      </div>

      <AuroraParticleSystem isActive={isActive} intensity={0.8} />

      {/* Header Section */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            className="p-3 rounded-2xl"
            style={{ background: `linear-gradient(135deg, ${AURORA_COLORS.purple}30, ${AURORA_COLORS.rose}20)` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <DollarSign className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Net Income Analytics</h3>
            <p className="text-gray-400">Track your financial performance with Aurora insights</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {[
            { id: 'chart', icon: BarChart3, label: 'Chart' },
            { id: 'breakdown', icon: PieChart, label: 'Breakdown' },
            { id: 'trends', icon: Activity, label: 'Trends' }
          ].map((view) => (
            <motion.button
              key={view.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === view.id
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => setCurrentView(view.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            title: 'Total Net Income',
            value: `$${totalNetIncome.toLocaleString()}`,
            subtext: '6 months',
            icon: DollarSign,
            color: AURORA_COLORS.purple
          },
          {
            title: 'Monthly Average',
            value: `$${Math.round(avgMonthlyNet).toLocaleString()}`,
            subtext: 'per month',
            icon: TrendingUp,
            color: AURORA_COLORS.rose
          },
          {
            title: 'Best Month',
            value: `$${bestMonth.netIncome.toLocaleString()}`,
            subtext: bestMonth.month,
            icon: Star,
            color: AURORA_COLORS.teal
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            className="relative p-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: `0 10px 30px ${metric.color}20` }}
          >
            {/* Aurora Glow */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(circle at center, ${metric.color}10, transparent 70%)` }}
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <metric.icon className="w-8 h-8" style={{ color: metric.color }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-gray-400">{metric.title}</div>
              <div className="text-xs text-gray-500">{metric.subtext}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Visualization Area */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'chart' && (
            <motion.div
              key="chart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <h4 className="text-lg font-semibold text-white">Monthly Net Income Trend</h4>
                <p className="text-sm text-gray-400">Income minus expenses over time</p>
              </div>
              <NetIncomeChart data={netIncomeData} isActive={isActive} />
            </motion.div>
          )}

          {currentView === 'breakdown' && (
            <motion.div
              key="breakdown"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-4">Income Sources</h4>
                  <IncomeBreakdownChart data={incomeBreakdown} />
                </div>
                <div className="flex-1 space-y-4">
                  {incomeBreakdown.map((item, index) => (
                    <motion.div
                      key={item.category}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">${item.amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">{item.percentage}%</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <h4 className="text-lg font-semibold text-white mb-6">Performance Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add trend analysis content here */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">AI Insights</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    Your net income shows strong growth with a 15% increase over the last quarter. 
                    October was your best performing month.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Goal Progress</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    You're 87% towards your annual net income goal of $60,000. 
                    Keep up the excellent progress!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}