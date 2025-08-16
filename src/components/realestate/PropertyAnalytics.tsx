'use client';

import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Calculator, MapPin, Calendar,
  ChevronUp, ChevronDown, Percent, Target, BarChart3,
  PieChart, LineChart, Activity, Zap, Award
} from 'lucide-react';

interface AnalyticsData {
  appreciation: {
    data: { month: string; value: number; appreciation: number }[];
    currentValue: number;
    totalAppreciation: number;
    yearOverYear: number;
  };
  cashFlow: {
    rental: number;
    expenses: number;
    maintenance: number;
    taxes: number;
    insurance: number;
    management: number;
    net: number;
  };
  roi: {
    cashOnCash: number;
    cap: number;
    totalReturn: number;
    appreciation: number;
  };
  marketComps: {
    id: string;
    address: string;
    price: number;
    pricePerSqft: number;
    sqft: number;
    sold: string;
    distance: number;
    lat: number;
    lng: number;
  }[];
  taxHistory: {
    year: number;
    assessment: number;
    tax: number;
    rate: number;
    change: number;
  }[];
}

interface PropertyAnalyticsProps {
  data: AnalyticsData;
  className?: string;
}

export default function PropertyAnalytics({ data, className = '' }: PropertyAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'appreciation' | 'cashflow' | 'roi' | 'comps' | 'taxes'>('appreciation');
  const [roiInputs, setRoiInputs] = useState({
    downPayment: 20,
    loanAmount: 400000,
    interestRate: 6.5,
    rental: 3500,
    expenses: 800
  });

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <motion.div
        className="flex gap-2 mb-8 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { key: 'appreciation', label: 'Appreciation', icon: TrendingUp },
          { key: 'cashflow', label: 'Cash Flow', icon: BarChart3 },
          { key: 'roi', label: 'ROI Calculator', icon: Calculator },
          { key: 'comps', label: 'Market Comps', icon: MapPin },
          { key: 'taxes', label: 'Tax History', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:block">{tab.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'appreciation' && (
          <AppreciationChart key="appreciation" data={data.appreciation} />
        )}
        {activeTab === 'cashflow' && (
          <CashFlowWaterfall key="cashflow" data={data.cashFlow} />
        )}
        {activeTab === 'roi' && (
          <ROICalculator key="roi" inputs={roiInputs} onChange={setRoiInputs} />
        )}
        {activeTab === 'comps' && (
          <MarketComps key="comps" data={data.marketComps} />
        )}
        {activeTab === 'taxes' && (
          <TaxHistory key="taxes" data={data.taxHistory} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Appreciation Chart Component
const AppreciationChart = ({ data }: { data: AnalyticsData['appreciation'] }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  const generatePath = () => {
    const width = 800;
    const height = 300;
    const padding = 40;
    
    const maxValue = Math.max(...data.data.map(d => d.value));
    const minValue = Math.min(...data.data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;
    
    let path = '';
    let areaPath = '';
    
    data.data.forEach((point, i) => {
      const x = padding + (i / (data.data.length - 1)) * (width - 2 * padding);
      const y = padding + (1 - (point.value - minValue) / valueRange) * (height - 2 * padding);
      
      if (i === 0) {
        path = `M ${x} ${y}`;
        areaPath = `M ${x} ${height - padding} L ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
        areaPath += ` L ${x} ${y}`;
      }
      
      if (i === data.data.length - 1) {
        areaPath += ` L ${x} ${height - padding} Z`;
      }
    });
    
    return { path, areaPath };
  };

  const { path, areaPath } = generatePath();

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-gray-400">Current Value</span>
          </div>
          <p className="text-2xl font-bold text-white">${data.currentValue.toLocaleString()}</p>
          <p className="text-sm text-green-400">+${data.totalAppreciation.toLocaleString()} total</p>
        </motion.div>

        <motion.div
          className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
              <Percent className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-gray-400">Year over Year</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.yearOverYear}%</p>
          <p className="text-sm text-blue-400">Annual appreciation</p>
        </motion.div>

        <motion.div
          className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-2xl"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/30 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-gray-400">ROI</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {((data.totalAppreciation / (data.currentValue - data.totalAppreciation)) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-purple-400">Total return</p>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Property Value Appreciation</h3>
        
        <div className="relative">
          <svg viewBox="0 0 800 300" className="w-full h-64">
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <line
                key={i}
                x1="40"
                y1={60 + i * 48}
                x2="760"
                y2={60 + i * 48}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="appreciationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="50%" stopColor="rgba(139, 92, 246, 0.2)" />
                <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
              </linearGradient>
              
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            
            {/* Area fill */}
            <motion.path
              d={areaPath}
              fill="url(#appreciationGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {/* Line */}
            <motion.path
              d={path}
              stroke="url(#lineGradient)"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Data points */}
            {data.data.map((point, i) => {
              const x = 40 + (i / (data.data.length - 1)) * 720;
              const maxValue = Math.max(...data.data.map(d => d.value));
              const minValue = Math.min(...data.data.map(d => d.value));
              const valueRange = maxValue - minValue || 1;
              const y = 40 + (1 - (point.value - minValue) / valueRange) * 220;
              
              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={hoveredPoint === i ? 6 : 4}
                  fill="#fff"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.5 }}
                />
              );
            })}
          </svg>
          
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredPoint !== null && (
              <motion.div
                className="absolute bg-black/90 text-white p-3 rounded-lg pointer-events-none z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  left: `${(hoveredPoint / (data.data.length - 1)) * 100}%`,
                  top: '20px',
                  transform: 'translateX(-50%)',
                }}
              >
                <p className="font-semibold">{data.data[hoveredPoint].month}</p>
                <p>${data.data[hoveredPoint].value.toLocaleString()}</p>
                <p className="text-green-400 text-sm">
                  +{data.data[hoveredPoint].appreciation}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Cash Flow Waterfall Component
const CashFlowWaterfall = ({ data }: { data: AnalyticsData['cashFlow'] }) => {
  const items = [
    { label: 'Rental Income', value: data.rental, color: '#10B981', positive: true },
    { label: 'Operating Expenses', value: -data.expenses, color: '#EF4444', positive: false },
    { label: 'Maintenance', value: -data.maintenance, color: '#F59E0B', positive: false },
    { label: 'Property Taxes', value: -data.taxes, color: '#EC4899', positive: false },
    { label: 'Insurance', value: -data.insurance, color: '#8B5CF6', positive: false },
    { label: 'Management', value: -data.management, color: '#06B6D4', positive: false },
  ];

  let runningTotal = 0;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Monthly Cash Flow Waterfall</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Waterfall Chart */}
          <div className="space-y-4">
            {items.map((item, index) => {
              const previousTotal = runningTotal;
              runningTotal += item.value;
              
              return (
                <motion.div
                  key={item.label}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{item.label}</span>
                    <span className={`text-sm font-semibold ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {item.positive ? '+' : ''}${Math.abs(item.value).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden">
                    <motion.div
                      className="absolute top-0 h-full rounded-lg"
                      style={{
                        backgroundColor: item.color,
                        left: item.positive ? '0%' : `${Math.max(0, (Math.abs(item.value) / data.rental) * 100 - 100)}%`,
                        width: `${(Math.abs(item.value) / data.rental) * 100}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(Math.abs(item.value) / data.rental) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                    
                    {/* Flowing animation */}
                    <motion.div
                      className="absolute top-0 h-full w-full opacity-30"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${item.color} 50%, transparent 100%)`,
                      }}
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
            
            {/* Net Cash Flow */}
            <motion.div
              className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Net Cash Flow</span>
                <span className={`text-xl font-bold ${data.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {data.net >= 0 ? '+' : ''}${data.net.toLocaleString()}
                </span>
              </div>
            </motion.div>
          </div>
          
          {/* Summary Stats */}
          <div className="space-y-4">
            <motion.div
              className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">Gross Income</span>
              </div>
              <p className="text-xl font-bold text-white">${data.rental.toLocaleString()}</p>
            </motion.div>
            
            <motion.div
              className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <ChevronDown className="w-5 h-5 text-red-400" />
                <span className="text-sm text-gray-400">Total Expenses</span>
              </div>
              <p className="text-xl font-bold text-white">
                ${(data.expenses + data.maintenance + data.taxes + data.insurance + data.management).toLocaleString()}
              </p>
            </motion.div>
            
            <motion.div
              className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Percent className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">Profit Margin</span>
              </div>
              <p className="text-xl font-bold text-white">
                {((data.net / data.rental) * 100).toFixed(1)}%
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ROI Calculator Component
const ROICalculator = ({ 
  inputs, 
  onChange 
}: { 
  inputs: any; 
  onChange: (inputs: any) => void;
}) => {
  const [results, setResults] = useState({
    monthlyPayment: 0,
    cashFlow: 0,
    cashOnCash: 0,
    cap: 0,
    totalReturn: 0
  });

  useEffect(() => {
    // Calculate ROI metrics
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = 30 * 12;
    const monthlyPayment = inputs.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const cashFlow = inputs.rental - monthlyPayment - inputs.expenses;
    const annualCashFlow = cashFlow * 12;
    const downPaymentAmount = (inputs.downPayment / 100) * (inputs.loanAmount / (1 - inputs.downPayment / 100));
    const cashOnCash = (annualCashFlow / downPaymentAmount) * 100;
    const propertyValue = inputs.loanAmount / (1 - inputs.downPayment / 100);
    const cap = ((inputs.rental * 12 - inputs.expenses * 12) / propertyValue) * 100;

    setResults({
      monthlyPayment,
      cashFlow,
      cashOnCash,
      cap,
      totalReturn: cashOnCash + 3 // Assuming 3% appreciation
    });
  }, [inputs]);

  const Slider = ({ label, value, min, max, step, suffix = '', onChange }: any) => {
    const mouseX = useMotionValue(0);
    const progress = useTransform(mouseX, [0, 300], [min, max]);
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-400">{label}</label>
          <span className="text-sm font-semibold text-white">{value.toLocaleString()}{suffix}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <motion.div
            className="absolute top-0 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg pointer-events-none"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Controls */}
        <motion.div
          className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Investment Parameters</h3>
          
          <Slider
            label="Down Payment"
            value={inputs.downPayment}
            min={5}
            max={50}
            step={5}
            suffix="%"
            onChange={(value: number) => onChange({ ...inputs, downPayment: value })}
          />
          
          <Slider
            label="Loan Amount"
            value={inputs.loanAmount}
            min={100000}
            max={2000000}
            step={10000}
            suffix=""
            onChange={(value: number) => onChange({ ...inputs, loanAmount: value })}
          />
          
          <Slider
            label="Interest Rate"
            value={inputs.interestRate}
            min={3}
            max={12}
            step={0.25}
            suffix="%"
            onChange={(value: number) => onChange({ ...inputs, interestRate: value })}
          />
          
          <Slider
            label="Monthly Rental"
            value={inputs.rental}
            min={1000}
            max={10000}
            step={100}
            suffix=""
            onChange={(value: number) => onChange({ ...inputs, rental: value })}
          />
          
          <Slider
            label="Monthly Expenses"
            value={inputs.expenses}
            min={200}
            max={3000}
            step={50}
            suffix=""
            onChange={(value: number) => onChange({ ...inputs, expenses: value })}
          />
        </motion.div>
        
        {/* Results */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">ROI Analysis</h3>
          
          {[
            { label: 'Monthly Payment', value: results.monthlyPayment, format: 'currency', color: 'red' },
            { label: 'Monthly Cash Flow', value: results.cashFlow, format: 'currency', color: results.cashFlow >= 0 ? 'green' : 'red' },
            { label: 'Cash-on-Cash ROI', value: results.cashOnCash, format: 'percentage', color: 'blue' },
            { label: 'Cap Rate', value: results.cap, format: 'percentage', color: 'purple' },
            { label: 'Total Return', value: results.totalReturn, format: 'percentage', color: 'green' },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              className={`p-4 bg-gradient-to-r from-${metric.color}-500/20 to-${metric.color}-600/20 border border-${metric.color}-500/30 rounded-xl`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{metric.label}</span>
                <span className={`text-lg font-bold text-${metric.color}-400`}>
                  {metric.format === 'currency' ? '$' : ''}
                  {Math.abs(metric.value).toLocaleString()}
                  {metric.format === 'percentage' ? '%' : ''}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Market Comps Component
const MarketComps = ({ data }: { data: AnalyticsData['marketComps'] }) => {
  const [selectedComp, setSelectedComp] = useState<string | null>(null);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Market Comparables</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((comp, index) => (
            <motion.div
              key={comp.id}
              className={`p-4 border rounded-xl cursor-pointer transition-all ${
                selectedComp === comp.id
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setSelectedComp(selectedComp === comp.id ? null : comp.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-white text-sm">{comp.address}</h4>
                <span className="text-xs text-gray-400">{comp.distance} mi</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Price</span>
                  <span className="text-sm font-semibold text-white">${comp.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Price/sqft</span>
                  <span className="text-sm font-semibold text-white">${comp.pricePerSqft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Sold</span>
                  <span className="text-sm font-semibold text-white">{comp.sold}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Map placeholder */}
        <motion.div
          className="mt-6 h-64 bg-gray-800/50 rounded-xl flex items-center justify-center border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400">Interactive Map Coming Soon</p>
            <p className="text-xs text-gray-500">Market comps visualization</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Tax History Timeline Component
const TaxHistory = ({ data }: { data: AnalyticsData['taxHistory'] }) => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-xl font-bold text-white mb-6">Property Tax History</h3>
        
        <div className="space-y-4">
          {data.map((entry, index) => (
            <motion.div
              key={entry.year}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ bg: 'rgba(255,255,255,0.1)' }}
            >
              {/* Timeline dot */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Year</p>
                  <p className="font-semibold text-white">{entry.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Assessment</p>
                  <p className="font-semibold text-white">${entry.assessment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tax Paid</p>
                  <p className="font-semibold text-white">${entry.tax.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Change</p>
                  <p className={`font-semibold ${entry.change >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {entry.change >= 0 ? '+' : ''}{entry.change}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};