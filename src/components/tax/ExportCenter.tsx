'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Download, FileText, Printer, Mail, Share, Calendar, Filter,
  Image, FileSpreadsheet, FileImage, Package, Crown, Sparkles,
  Check, Clock, AlertCircle, Star, Zap, Settings, Eye,
  Palette, Layout, Type, Grid, BarChart3, PieChart
} from 'lucide-react';

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'pdf' | 'excel' | 'image' | 'csv';
  category: 'tax' | 'reports' | 'receipts' | 'custom';
  preview: string;
  isPremium: boolean;
  features: string[];
  icon: React.ElementType;
  color: string;
}

interface ExportJob {
  id: string;
  templateId: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  fileName: string;
  dateRange: string;
  createdAt: string;
  downloadUrl?: string;
  size?: string;
}

interface ExportCenterProps {
  className?: string;
  onExport?: (templateId: string, options: any) => void;
  onDownload?: (jobId: string) => void;
  onShare?: (jobId: string, method: string) => void;
  onSchedule?: (templateId: string, schedule: any) => void;
}

export default function ExportCenter({ 
  className = '',
  onExport,
  onDownload,
  onShare,
  onSchedule 
}: ExportCenterProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'jobs' | 'scheduled'>('templates');
  const [filterCategory, setFilterCategory] = useState<'all' | 'tax' | 'reports' | 'receipts' | 'custom'>('all');
  const [exportOptions, setExportOptions] = useState({
    dateRange: 'current_year',
    includeCharts: true,
    includeBranding: true,
    colorScheme: 'professional',
    format: 'A4'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Export templates
  const exportTemplates: ExportTemplate[] = [
    {
      id: 'tax-summary-premium',
      name: 'Premium Tax Summary',
      description: 'Comprehensive tax report with branded design and interactive charts',
      type: 'pdf',
      category: 'tax',
      preview: '/previews/tax-summary-premium.jpg',
      isPremium: true,
      features: ['Branded Design', 'Interactive Charts', 'Deduction Details', 'Tax Opportunities'],
      icon: Crown,
      color: '#fbbf24'
    },
    {
      id: 'receipt-collection',
      name: 'Receipt Collection',
      description: 'Organized receipt compilation with AI-extracted data',
      type: 'pdf',
      category: 'receipts',
      preview: '/previews/receipt-collection.jpg',
      isPremium: false,
      features: ['AI Data Extraction', 'Category Organization', 'Search Function'],
      icon: FileText,
      color: '#3b82f6'
    },
    {
      id: 'monthly-magazine',
      name: 'Monthly Magazine Report',
      description: 'Beautiful magazine-style monthly financial review',
      type: 'pdf',
      category: 'reports',
      preview: '/previews/monthly-magazine.jpg',
      isPremium: true,
      features: ['Magazine Layout', 'Custom Branding', 'Visual Stories', 'Data Insights'],
      icon: Layout,
      color: '#8b5cf6'
    },
    {
      id: 'annual-wrapped',
      name: 'Annual Wrapped Report',
      description: 'Spotify-style annual financial summary with animations',
      type: 'pdf',
      category: 'reports',
      preview: '/previews/annual-wrapped.jpg',
      isPremium: true,
      features: ['Interactive Design', 'Personal Insights', 'Achievement Highlights', 'Shareable'],
      icon: Star,
      color: '#ef4444'
    },
    {
      id: 'quarterly-estimates',
      name: 'Quarterly Tax Estimates',
      description: 'Professional quarterly tax planning document',
      type: 'pdf',
      category: 'tax',
      preview: '/previews/quarterly-estimates.jpg',
      isPremium: false,
      features: ['Payment Timeline', 'Calculation Details', 'Planning Tools'],
      icon: Calendar,
      color: '#10b981'
    },
    {
      id: 'excel-export',
      name: 'Data Export (Excel)',
      description: 'Complete financial data in Excel format for analysis',
      type: 'excel',
      category: 'custom',
      preview: '/previews/excel-export.jpg',
      isPremium: false,
      features: ['Raw Data', 'Pivot Tables', 'Formulas', 'Charts'],
      icon: FileSpreadsheet,
      color: '#059669'
    },
    {
      id: 'instagram-cards',
      name: 'Instagram Story Cards',
      description: 'Social media ready financial achievement cards',
      type: 'image',
      category: 'custom',
      preview: '/previews/instagram-cards.jpg',
      isPremium: true,
      features: ['Multiple Formats', 'Custom Branding', 'Achievement Focus', 'High Resolution'],
      icon: Image,
      color: '#ec4899'
    },
    {
      id: 'tax-package',
      name: 'Complete Tax Package',
      description: 'Everything you need for tax season in one package',
      type: 'pdf',
      category: 'tax',
      preview: '/previews/tax-package.jpg',
      isPremium: true,
      features: ['All Documents', 'Professional Formatting', 'CPA Ready', 'Digital Signatures'],
      icon: Package,
      color: '#7c3aed'
    }
  ];

  // Export jobs (mock data)
  const exportJobs: ExportJob[] = [
    {
      id: 'job-001',
      templateId: 'tax-summary-premium',
      status: 'completed',
      progress: 100,
      fileName: 'Tax_Summary_2024_August.pdf',
      dateRange: 'January - August 2024',
      createdAt: '2024-08-15T10:30:00Z',
      downloadUrl: '/exports/tax_summary_2024_august.pdf',
      size: '2.4 MB'
    },
    {
      id: 'job-002',
      templateId: 'monthly-magazine',
      status: 'processing',
      progress: 65,
      fileName: 'Monthly_Review_August_2024.pdf',
      dateRange: 'August 2024',
      createdAt: '2024-08-15T14:20:00Z'
    },
    {
      id: 'job-003',
      templateId: 'receipt-collection',
      status: 'pending',
      progress: 0,
      fileName: 'Receipts_Q3_2024.pdf',
      dateRange: 'Q3 2024',
      createdAt: '2024-08-15T16:45:00Z'
    }
  ];

  // Filter templates
  const filteredTemplates = exportTemplates.filter(template => 
    filterCategory === 'all' || template.category === filterCategory
  );

  // Handle export
  const handleExport = (templateId: string) => {
    onExport?.(templateId, exportOptions);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'processing': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Export Center
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Create beautiful, branded reports and exports from your financial data
        </motion.p>
      </div>

      {/* Tabs */}
      <motion.div
        className="flex gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { key: 'templates', label: 'Templates', icon: Layout },
          { key: 'jobs', label: 'Export Jobs', icon: Clock },
          { key: 'scheduled', label: 'Scheduled', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.key}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filters */}
            <div className="flex gap-2 mb-6">
              <span className="text-gray-400 text-sm self-center">Category:</span>
              {[
                { key: 'all', label: 'All' },
                { key: 'tax', label: 'Tax' },
                { key: 'reports', label: 'Reports' },
                { key: 'receipts', label: 'Receipts' },
                { key: 'custom', label: 'Custom' }
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filterCategory === filter.key
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setFilterCategory(filter.key as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;
                
                return (
                  <motion.div
                    key={template.id}
                    className={`relative p-6 bg-white/5 backdrop-blur-xl border rounded-2xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-white/30 bg-white/10' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedTemplate(isSelected ? null : template.id)}
                  >
                    {/* Preview Image */}
                    <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `linear-gradient(135deg, ${template.color}40, ${template.color}10)`
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-12 h-12" style={{ color: template.color }} />
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${template.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: template.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold">{template.name}</h4>
                          {template.isPremium && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{template.description}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {template.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-3 h-3 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center justify-between">
                      <div 
                        className="px-2 py-1 rounded-full text-xs font-bold uppercase"
                        style={{ 
                          backgroundColor: `${template.color}20`,
                          color: template.color
                        }}
                      >
                        {template.type}
                      </div>
                      
                      <motion.button
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport(template.id);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Export
                      </motion.button>
                    </div>

                    {/* Premium Overlay */}
                    {template.isPremium && (
                      <div className="absolute top-4 right-4">
                        <motion.div
                          className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-bold flex items-center gap-1"
                          animate={{
                            boxShadow: ['0 0 0px #fbbf24', '0 0 20px #fbbf2460', '0 0 0px #fbbf24']
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Crown className="w-3 h-3" />
                          PRO
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'jobs' && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Export Jobs List */}
            <div className="space-y-4">
              {exportJobs.map((job, index) => {
                const template = exportTemplates.find(t => t.id === job.templateId);
                const statusColor = getStatusColor(job.status);
                
                return (
                  <motion.div
                    key={job.id}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Template Icon */}
                      {template && (
                        <div 
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${template.color}20` }}
                        >
                          <template.icon className="w-6 h-6" style={{ color: template.color }} />
                        </div>
                      )}

                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-bold">{job.fileName}</h4>
                          <div 
                            className="px-2 py-1 rounded-full text-xs font-bold uppercase border"
                            style={{ 
                              backgroundColor: `${statusColor}20`,
                              color: statusColor,
                              borderColor: statusColor
                            }}
                          >
                            {job.status}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{job.dateRange}</p>
                        <p className="text-gray-500 text-xs">
                          Created {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Progress/Actions */}
                      <div className="text-right">
                        {job.status === 'processing' && (
                          <div className="mb-2">
                            <div className="text-white font-bold text-sm mb-1">{job.progress}%</div>
                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-blue-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${job.progress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {job.status === 'completed' && (
                          <div className="flex gap-2">
                            <motion.button
                              className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors"
                              onClick={() => onDownload?.(job.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
                              onClick={() => onShare?.(job.id, 'email')}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Share className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}
                        
                        {job.size && (
                          <div className="text-gray-400 text-xs mt-1">{job.size}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'scheduled' && (
          <motion.div
            key="scheduled"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Scheduled Exports */}
            <div className="text-center py-12">
              <motion.div
                className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Calendar className="w-10 h-10 text-blue-400" />
              </motion.div>
              <h4 className="text-white font-bold text-xl mb-2">Schedule Automatic Exports</h4>
              <p className="text-gray-400 mb-6">
                Set up recurring exports to be generated and delivered automatically
              </p>
              <motion.button
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Set Up Schedule
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Options Panel */}
      {selectedTemplate && (
        <motion.div
          className="fixed right-6 top-6 bottom-6 w-80 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 z-50"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-white font-bold text-lg">Export Options</h4>
            <motion.button
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              onClick={() => setSelectedTemplate(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>
          </div>

          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <label className="text-white font-medium mb-2 block">Date Range</label>
              <select 
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                value={exportOptions.dateRange}
                onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e.target.value }))}
              >
                <option value="current_year">Current Year</option>
                <option value="last_year">Last Year</option>
                <option value="ytd">Year to Date</option>
                <option value="last_quarter">Last Quarter</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={exportOptions.includeCharts}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-white">Include Charts & Visualizations</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={exportOptions.includeBranding}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeBranding: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-white">Include Meridian Branding</span>
              </label>
            </div>

            {/* Export Button */}
            <motion.button
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg text-white font-medium transition-all"
              onClick={() => handleExport(selectedTemplate)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Generate Export
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/10 text-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.5, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            <Download />
          </motion.div>
        ))}
      </div>
    </div>
  );
}