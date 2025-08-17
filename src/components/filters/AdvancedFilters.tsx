'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Calendar, Filter, Search, X, Check, ChevronDown, ChevronUp,
  DollarSign, Tag, MapPin, Building, User, Clock, Star,
  TrendingUp, TrendingDown, BarChart3, Zap, Target, Settings
} from 'lucide-react';

interface DateRange {
  start: Date;
  end: Date;
  preset?: string;
}

interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'search' | 'boolean';
  options?: Array<{ value: string; label: string; count?: number }>;
  value?: any;
  icon?: React.ElementType;
  color?: string;
}

interface AdvancedFiltersProps {
  dateRange: DateRange;
  filters: FilterOption[];
  className?: string;
  onDateRangeChange?: (range: DateRange) => void;
  onFilterChange?: (filterId: string, value: any) => void;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
  onSavePreset?: (name: string) => void;
  savedPresets?: Array<{ id: string; name: string; filters: any }>;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function AdvancedFilters({ 
  dateRange,
  filters,
  className = '',
  onDateRangeChange,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onSavePreset,
  savedPresets = [],
  isOpen = false,
  onToggle 
}: AdvancedFiltersProps) {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('dateRange');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Date presets
  const datePresets = [
    { id: 'today', label: 'Today', days: 0 },
    { id: 'yesterday', label: 'Yesterday', days: 1 },
    { id: 'last_7_days', label: 'Last 7 days', days: 7 },
    { id: 'last_30_days', label: 'Last 30 days', days: 30 },
    { id: 'last_90_days', label: 'Last 90 days', days: 90 },
    { id: 'this_month', label: 'This month', special: 'this_month' },
    { id: 'last_month', label: 'Last month', special: 'last_month' },
    { id: 'this_quarter', label: 'This quarter', special: 'this_quarter' },
    { id: 'last_quarter', label: 'Last quarter', special: 'last_quarter' },
    { id: 'this_year', label: 'This year', special: 'this_year' },
    { id: 'last_year', label: 'Last year', special: 'last_year' },
    { id: 'custom', label: 'Custom range', special: 'custom' }
  ];

  // Default filters if none provided
  const defaultFilters: FilterOption[] = [
    {
      id: 'categories',
      label: 'Categories',
      type: 'multiselect',
      icon: Tag,
      color: '#3b82f6',
      options: [
        { value: 'office_supplies', label: 'Office Supplies', count: 45 },
        { value: 'travel', label: 'Travel & Transport', count: 23 },
        { value: 'meals', label: 'Meals & Entertainment', count: 67 },
        { value: 'equipment', label: 'Equipment & Software', count: 12 },
        { value: 'professional', label: 'Professional Services', count: 18 },
        { value: 'marketing', label: 'Marketing & Advertising', count: 9 },
        { value: 'utilities', label: 'Utilities & Internet', count: 34 },
        { value: 'insurance', label: 'Insurance', count: 6 }
      ],
      value: []
    },
    {
      id: 'amount_range',
      label: 'Amount Range',
      type: 'range',
      icon: DollarSign,
      color: '#10b981',
      value: { min: 0, max: 10000 }
    },
    {
      id: 'vendors',
      label: 'Vendors',
      type: 'search',
      icon: Building,
      color: '#8b5cf6',
      value: ''
    },
    {
      id: 'payment_methods',
      label: 'Payment Methods',
      type: 'multiselect',
      icon: Target,
      color: '#f59e0b',
      options: [
        { value: 'credit_card', label: 'Credit Card', count: 124 },
        { value: 'debit_card', label: 'Debit Card', count: 45 },
        { value: 'cash', label: 'Cash', count: 23 },
        { value: 'check', label: 'Check', count: 12 },
        { value: 'bank_transfer', label: 'Bank Transfer', count: 34 }
      ],
      value: []
    },
    {
      id: 'tax_deductible',
      label: 'Tax Deductible Only',
      type: 'boolean',
      icon: Star,
      color: '#ef4444',
      value: false
    },
    {
      id: 'confidence_score',
      label: 'AI Confidence Score',
      type: 'range',
      icon: Zap,
      color: '#06b6d4',
      value: { min: 0, max: 100 }
    }
  ];

  const filterData = filters.length > 0 ? filters : defaultFilters;

  // Calculate date range from preset
  const calculateDateRange = (preset: any) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    if (preset.days !== undefined) {
      start = new Date(today.getTime() - preset.days * 24 * 60 * 60 * 1000);
      end = today;
    } else {
      switch (preset.special) {
        case 'this_month':
          start = new Date(today.getFullYear(), today.getMonth(), 1);
          end = today;
          break;
        case 'last_month':
          start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          end = new Date(today.getFullYear(), today.getMonth(), 0);
          break;
        case 'this_quarter':
          const quarter = Math.floor(today.getMonth() / 3);
          start = new Date(today.getFullYear(), quarter * 3, 1);
          end = today;
          break;
        case 'this_year':
          start = new Date(today.getFullYear(), 0, 1);
          end = today;
          break;
        default:
          start = today;
          end = today;
      }
    }

    return { start, end, preset: preset.id };
  };

  // Handle date preset selection
  const handleDatePreset = (preset: any) => {
    if (preset.special === 'custom') {
      setActiveSection('customDate');
    } else {
      const range = calculateDateRange(preset);
      onDateRangeChange?.(range);
    }
  };

  // Handle custom date range
  const handleCustomDateRange = () => {
    if (customDateRange.start && customDateRange.end) {
      const range = {
        start: new Date(customDateRange.start),
        end: new Date(customDateRange.end),
        preset: 'custom'
      };
      onDateRangeChange?.(range);
      setActiveSection('dateRange');
    }
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return filterData.filter(filter => {
      if (filter.type === 'multiselect' && Array.isArray(filter.value)) {
        return filter.value.length > 0;
      }
      if (filter.type === 'boolean') {
        return filter.value === true;
      }
      if (filter.type === 'search') {
        return filter.value && filter.value.length > 0;
      }
      if (filter.type === 'range') {
        return filter.value && (filter.value.min > 0 || filter.value.max < 100);
      }
      return false;
    }).length;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Filter Toggle Button */}
      <motion.button
        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
          isOpen 
            ? 'bg-blue-500 text-white' 
            : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
        }`}
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter className="w-5 h-5" />
        <span>Advanced Filters</span>
        {getActiveFilterCount() > 0 && (
          <motion.div
            className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {getActiveFilterCount()}
          </motion.div>
        )}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 p-6 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 min-w-96"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-white font-bold text-lg">Advanced Filters</h4>
              <div className="flex items-center gap-2">
                {savedPresets.length > 0 && (
                  <motion.button
                    className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 text-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  onClick={onToggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Date Range Section */}
            <div className="mb-6">
              <motion.button
                className="flex items-center justify-between w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setActiveSection(activeSection === 'dateRange' ? null : 'dateRange')}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Date Range</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  activeSection === 'dateRange' ? 'rotate-180' : ''
                }`} />
              </motion.button>

              <AnimatePresence>
                {activeSection === 'dateRange' && (
                  <motion.div
                    className="mt-3 p-4 bg-white/5 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {datePresets.map((preset) => (
                        <motion.button
                          key={preset.id}
                          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                            dateRange.preset === preset.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/10 text-gray-400 hover:text-white'
                          }`}
                          onClick={() => handleDatePreset(preset)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {preset.label}
                        </motion.button>
                      ))}
                    </div>

                    {/* Current Date Range Display */}
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-medium">
                        {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Custom Date Range */}
              <AnimatePresence>
                {activeSection === 'customDate' && (
                  <motion.div
                    className="mt-3 p-4 bg-white/5 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-white text-sm mb-2 block">Start Date</label>
                        <input
                          type="date"
                          value={customDateRange.start}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                          className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm mb-2 block">End Date</label>
                        <input
                          type="date"
                          value={customDateRange.end}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                          className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                        onClick={handleCustomDateRange}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Apply Range
                      </motion.button>
                      <motion.button
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        onClick={() => setActiveSection('dateRange')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Filters */}
            <div className="space-y-4 mb-6">
              {filterData.map((filter) => {
                const Icon = filter.icon || Tag;
                const isActive = activeSection === filter.id;
                
                return (
                  <div key={filter.id}>
                    <motion.button
                      className="flex items-center justify-between w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setActiveSection(isActive ? null : filter.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" style={{ color: filter.color }} />
                        <span className="text-white font-medium">{filter.label}</span>
                        {((filter.type === 'multiselect' && Array.isArray(filter.value) && filter.value.length > 0) ||
                          (filter.type === 'boolean' && filter.value) ||
                          (filter.type === 'search' && filter.value)) && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                        isActive ? 'rotate-180' : ''
                      }`} />
                    </motion.button>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="mt-3 p-4 bg-white/5 rounded-lg"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {/* Multiselect */}
                          {filter.type === 'multiselect' && filter.options && (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {filter.options.map((option) => (
                                <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={Array.isArray(filter.value) && filter.value.includes(option.value)}
                                    onChange={(e) => {
                                      const currentValue = Array.isArray(filter.value) ? filter.value : [];
                                      const newValue = e.target.checked
                                        ? [...currentValue, option.value]
                                        : currentValue.filter(v => v !== option.value);
                                      onFilterChange?.(filter.id, newValue);
                                    }}
                                    className="w-4 h-4 rounded border-white/20"
                                  />
                                  <span className="text-white flex-1">{option.label}</span>
                                  {option.count !== undefined && (
                                    <span className="text-gray-400 text-sm">({option.count})</span>
                                  )}
                                </label>
                              ))}
                            </div>
                          )}

                          {/* Boolean */}
                          {filter.type === 'boolean' && (
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filter.value || false}
                                onChange={(e) => onFilterChange?.(filter.id, e.target.checked)}
                                className="w-4 h-4 rounded border-white/20"
                              />
                              <span className="text-white">Enable this filter</span>
                            </label>
                          )}

                          {/* Search */}
                          {filter.type === 'search' && (
                            <input
                              type="text"
                              placeholder={`Search ${filter.label.toLowerCase()}...`}
                              value={filter.value || ''}
                              onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                            />
                          )}

                          {/* Range */}
                          {filter.type === 'range' && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-white text-sm mb-2 block">Min</label>
                                  <input
                                    type="number"
                                    value={filter.value?.min || 0}
                                    onChange={(e) => onFilterChange?.(filter.id, { 
                                      ...filter.value, 
                                      min: Number(e.target.value) 
                                    })}
                                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-white text-sm mb-2 block">Max</label>
                                  <input
                                    type="number"
                                    value={filter.value?.max || 100}
                                    onChange={(e) => onFilterChange?.(filter.id, { 
                                      ...filter.value, 
                                      max: Number(e.target.value) 
                                    })}
                                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                className="flex-1 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                onClick={onApplyFilters}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Filters
              </motion.button>
              
              <motion.button
                className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                onClick={onResetFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>

              <motion.button
                className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors"
                onClick={() => setShowSavePreset(!showSavePreset)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
            </div>

            {/* Save Preset */}
            <AnimatePresence>
              {showSavePreset && (
                <motion.div
                  className="mt-4 p-4 bg-white/5 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-white text-sm mb-2 block">Preset Name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter preset name..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="flex-1 p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    />
                    <motion.button
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors"
                      onClick={() => {
                        if (presetName.trim()) {
                          onSavePreset?.(presetName.trim());
                          setPresetName('');
                          setShowSavePreset(false);
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}