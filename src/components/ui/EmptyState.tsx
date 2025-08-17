'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  CreditCard, 
  Building2, 
  Users, 
  Receipt, 
  PieChart,
  FileText,
  Zap,
  Star,
  Shield
} from 'lucide-react';

interface EmptyStateProps {
  type?: 'transactions' | 'investments' | 'budget' | 'cards' | 'accounts' | 'family' | 'receipts' | 'reports' | 'assets' | 'goals' | 'search' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Custom SVG illustrations for each empty state
const EmptyStateIllustrations = {
  transactions: () => (
    <motion.svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Credit card */}
      <motion.rect
        x="40"
        y="60"
        width="120"
        height="75"
        rx="8"
        fill="url(#cardGradient)"
        stroke="#3b82f6"
        strokeWidth="2"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
      />
      
      {/* Card details */}
      <motion.rect
        x="50"
        y="75"
        width="40"
        height="8"
        rx="4"
        fill="#ffffff40"
        initial={{ width: 0 }}
        animate={{ width: 40 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      <motion.rect
        x="50"
        y="90"
        width="60"
        height="6"
        rx="3"
        fill="#ffffff60"
        initial={{ width: 0 }}
        animate={{ width: 60 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      />
      
      {/* Floating dollar signs */}
      {[...Array(3)].map((_, i) => (
        <motion.text
          key={i}
          x={60 + i * 30}
          y={45 - i * 10}
          fill="#10b981"
          fontSize="16"
          fontWeight="bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 0], y: [20, -10, -40] }}
          transition={{ 
            delay: 1 + i * 0.2, 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3 
          }}
        >
          $
        </motion.text>
      ))}
      
      <defs>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </motion.svg>
  ),

  investments: () => (
    <motion.svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Chart bars */}
      {[60, 80, 45, 95, 70].map((height, i) => (
        <motion.rect
          key={i}
          x={30 + i * 25}
          y={120 - height}
          width="15"
          height={height}
          rx="2"
          fill={`hsl(${210 + i * 30}, 70%, 60%)`}
          initial={{ height: 0, y: 120 }}
          animate={{ height, y: 120 - height }}
          transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
        />
      ))}
      
      {/* Trend line */}
      <motion.path
        d="M 35 90 Q 70 60 105 75 T 175 45"
        stroke="#10b981"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 1.5, ease: 'easeInOut' }}
      />
      
      {/* Trending up arrow */}
      <motion.polygon
        points="170,50 175,45 180,50 175,40 170,50"
        fill="#10b981"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 300 }}
      />
    </motion.svg>
  ),

  budget: () => (
    <motion.svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Pie chart */}
      <motion.circle
        cx="100"
        cy="80"
        r="50"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      
      {/* Pie slices */}
      {[
        { color: '#3b82f6', offset: 0, length: 25 },
        { color: '#10b981', offset: 25, length: 30 },
        { color: '#f59e0b', offset: 55, length: 20 },
        { color: '#ef4444', offset: 75, length: 25 }
      ].map((slice, i) => (
        <motion.circle
          key={i}
          cx="100"
          cy="80"
          r="50"
          fill="none"
          stroke={slice.color}
          strokeWidth="8"
          strokeDasharray={`${slice.length} ${100 - slice.length}`}
          strokeDashoffset={-slice.offset}
          initial={{ strokeDasharray: '0 100' }}
          animate={{ strokeDasharray: `${slice.length} ${100 - slice.length}` }}
          transition={{ delay: 0.5 + i * 0.2, duration: 0.8, ease: 'easeOut' }}
          transform="rotate(-90 100 80)"
        />
      ))}
      
      {/* Center amount */}
      <motion.text
        x="100"
        y="85"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="16"
        fontWeight="bold"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
      >
        $2,500
      </motion.text>
    </motion.svg>
  ),

  search: () => (
    <motion.svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Magnifying glass */}
      <motion.circle
        cx="80"
        cy="70"
        r="25"
        fill="none"
        stroke="#6b7280"
        strokeWidth="4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
      />
      
      {/* Handle */}
      <motion.line
        x1="100"
        y1="90"
        x2="120"
        y2="110"
        stroke="#6b7280"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      
      {/* Search particles */}
      {[...Array(6)].map((_, i) => (
        <motion.circle
          key={i}
          cx={60 + Math.cos(i * 60 * Math.PI / 180) * 40}
          cy={50 + Math.sin(i * 60 * Math.PI / 180) * 40}
          r="3"
          fill="#3b82f6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 0], 
            opacity: [0, 1, 0] 
          }}
          transition={{ 
            delay: 1 + i * 0.1, 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3 
          }}
        />
      ))}
    </motion.svg>
  ),

  generic: () => (
    <motion.svg
      viewBox="0 0 200 160"
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Empty folder */}
      <motion.path
        d="M 60 50 L 60 120 L 140 120 L 140 60 L 120 60 L 110 50 Z"
        fill="none"
        stroke="#6b7280"
        strokeWidth="3"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      />
      
      {/* Floating plus icon */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 300 }}
      >
        <circle cx="100" cy="85" r="15" fill="#3b82f6" />
        <line x1="95" y1="85" x2="105" y2="85" stroke="white" strokeWidth="2" />
        <line x1="100" y1="80" x2="100" y2="90" stroke="white" strokeWidth="2" />
      </motion.g>
    </motion.svg>
  )
};

const getEmptyStateConfig = (type: EmptyStateProps['type']) => {
  const configs = {
    transactions: {
      title: 'No transactions yet',
      description: 'Start tracking your financial activity by connecting your accounts or adding transactions manually.',
      actionLabel: 'Add Transaction',
      icon: Receipt,
      illustration: 'transactions'
    },
    investments: {
      title: 'No investments tracked',
      description: 'Begin your investment journey by adding your portfolio holdings and tracking performance.',
      actionLabel: 'Add Investment',
      icon: TrendingUp,
      illustration: 'investments'
    },
    budget: {
      title: 'No budget created',
      description: 'Take control of your finances by setting up budget categories and spending limits.',
      actionLabel: 'Create Budget',
      icon: PieChart,
      illustration: 'budget'
    },
    cards: {
      title: 'No cards added',
      description: 'Add your credit and debit cards to track spending and manage your accounts.',
      actionLabel: 'Add Card',
      icon: CreditCard,
      illustration: 'transactions'
    },
    accounts: {
      title: 'No accounts connected',
      description: 'Connect your bank accounts to automatically sync transactions and balances.',
      actionLabel: 'Connect Account',
      icon: Building2,
      illustration: 'generic'
    },
    family: {
      title: 'No family members',
      description: 'Add family members to share financial goals and track household spending together.',
      actionLabel: 'Add Member',
      icon: Users,
      illustration: 'generic'
    },
    receipts: {
      title: 'No receipts scanned',
      description: 'Scan receipts to automatically categorize expenses and track tax deductions.',
      actionLabel: 'Scan Receipt',
      icon: Receipt,
      illustration: 'generic'
    },
    reports: {
      title: 'No reports generated',
      description: 'Generate detailed financial reports to analyze your spending patterns and trends.',
      actionLabel: 'Create Report',
      icon: FileText,
      illustration: 'generic'
    },
    assets: {
      title: 'No assets tracked',
      description: 'Add your valuable assets like vehicles, real estate, and investments to track net worth.',
      actionLabel: 'Add Asset',
      icon: Star,
      illustration: 'generic'
    },
    goals: {
      title: 'No goals set',
      description: 'Set financial goals to stay motivated and track your progress towards financial freedom.',
      actionLabel: 'Create Goal',
      icon: Zap,
      illustration: 'generic'
    },
    search: {
      title: 'No results found',
      description: 'Try adjusting your search terms or browse our categories to find what you\'re looking for.',
      actionLabel: 'Clear Search',
      icon: Search,
      illustration: 'search'
    },
    generic: {
      title: 'Nothing here yet',
      description: 'Get started by adding your first item.',
      actionLabel: 'Get Started',
      icon: Plus,
      illustration: 'generic'
    }
  };

  return configs[type || 'generic'];
};

export default function EmptyState({
  type = 'generic',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  size = 'md'
}: EmptyStateProps) {
  const config = getEmptyStateConfig(type);
  const Icon = config.icon;
  const Illustration = EmptyStateIllustrations[config.illustration as keyof typeof EmptyStateIllustrations];

  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 ${sizeClasses[size]} mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Illustration */}
      <motion.div
        className="w-48 h-32 mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
      >
        <Illustration />
      </motion.div>

      {/* Content */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-3">
          {title || config.title}
        </h3>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {description || config.description}
        </p>

        {/* Action button */}
        {onAction && (
          <motion.button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl"
            onClick={onAction}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          >
            <Icon className="w-5 h-5" />
            {actionLabel || config.actionLabel}
          </motion.button>
        )}
      </motion.div>

      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + Math.sin(i) * 20}%`
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Specialized empty states for common scenarios
export function TransactionsEmptyState({ onAction }: { onAction?: () => void }) {
  return <EmptyState type="transactions" onAction={onAction} />;
}

export function InvestmentsEmptyState({ onAction }: { onAction?: () => void }) {
  return <EmptyState type="investments" onAction={onAction} />;
}

export function BudgetEmptyState({ onAction }: { onAction?: () => void }) {
  return <EmptyState type="budget" onAction={onAction} />;
}

export function SearchEmptyState({ onAction }: { onAction?: () => void }) {
  return <EmptyState type="search" onAction={onAction} />;
}