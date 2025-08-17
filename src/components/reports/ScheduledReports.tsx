'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Mail, Calendar, Clock, Settings, Users, Bell, Send,
  FileText, BarChart3, TrendingUp, Star, Crown, Zap,
  Edit, Trash2, Play, Pause, Copy, Eye, Plus,
  Check, X, AlertCircle, Sparkles, Target, Award
} from 'lucide-react';

interface EmailSchedule {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM format
  timezone: string;
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused' | 'failed';
  recipients: string[];
  reportType: string;
  template: string;
  filters: any;
  isActive: boolean;
  createdAt: string;
  runCount: number;
  successRate: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  type: 'tax' | 'financial' | 'performance' | 'custom';
  preview: string;
  isPremium: boolean;
  features: string[];
  icon: React.ElementType;
  color: string;
}

interface ScheduledReportsProps {
  schedules?: EmailSchedule[];
  templates?: EmailTemplate[];
  className?: string;
  onCreateSchedule?: (schedule: Partial<EmailSchedule>) => void;
  onUpdateSchedule?: (id: string, updates: Partial<EmailSchedule>) => void;
  onDeleteSchedule?: (id: string) => void;
  onToggleSchedule?: (id: string, active: boolean) => void;
  onRunNow?: (id: string) => void;
  onTestEmail?: (id: string, email: string) => void;
}

export default function ScheduledReports({ 
  schedules = [],
  templates = [],
  className = '',
  onCreateSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onToggleSchedule,
  onRunNow,
  onTestEmail 
}: ScheduledReportsProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedules' | 'templates' | 'create'>('schedules');
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default templates
  const defaultTemplates: EmailTemplate[] = [
    {
      id: 'monthly-summary',
      name: 'Monthly Financial Summary',
      description: 'Comprehensive monthly financial overview with key metrics',
      type: 'financial',
      preview: '/previews/monthly-summary.jpg',
      isPremium: false,
      features: ['Income/Expense Summary', 'Budget Analysis', 'Goal Progress', 'Key Insights'],
      icon: BarChart3,
      color: '#3b82f6'
    },
    {
      id: 'tax-digest',
      name: 'Tax Planning Digest',
      description: 'Weekly tax planning updates and deduction opportunities',
      type: 'tax',
      preview: '/previews/tax-digest.jpg',
      isPremium: true,
      features: ['New Deductions', 'Tax Opportunities', 'Deadline Reminders', 'AI Recommendations'],
      icon: FileText,
      color: '#10b981'
    },
    {
      id: 'performance-report',
      name: 'Investment Performance',
      description: 'Portfolio performance and market insights',
      type: 'performance',
      preview: '/previews/performance-report.jpg',
      isPremium: true,
      features: ['Portfolio Analytics', 'Market Trends', 'Rebalancing Suggestions', 'Risk Assessment'],
      icon: TrendingUp,
      color: '#8b5cf6'
    },
    {
      id: 'goal-tracker',
      name: 'Goal Progress Tracker',
      description: 'Track progress on financial goals and milestones',
      type: 'financial',
      preview: '/previews/goal-tracker.jpg',
      isPremium: false,
      features: ['Goal Progress', 'Achievement Highlights', 'Next Steps', 'Motivation Boost'],
      icon: Target,
      color: '#f59e0b'
    }
  ];

  // Default schedules
  const defaultSchedules: EmailSchedule[] = [
    {
      id: 'schedule-001',
      name: 'Monthly Financial Summary',
      description: 'Comprehensive monthly overview sent on the 1st of every month',
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '09:00',
      timezone: 'America/New_York',
      nextRun: '2024-09-01T09:00:00Z',
      lastRun: '2024-08-01T09:00:00Z',
      status: 'active',
      recipients: ['john@example.com', 'team@company.com'],
      reportType: 'financial',
      template: 'monthly-summary',
      filters: { dateRange: 'last_month' },
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      runCount: 8,
      successRate: 100
    },
    {
      id: 'schedule-002',
      name: 'Weekly Tax Digest',
      description: 'Tax planning updates and opportunities every Monday',
      frequency: 'weekly',
      dayOfWeek: 1,
      time: '08:00',
      timezone: 'America/New_York',
      nextRun: '2024-08-19T08:00:00Z',
      lastRun: '2024-08-12T08:00:00Z',
      status: 'active',
      recipients: ['tax@company.com'],
      reportType: 'tax',
      template: 'tax-digest',
      filters: { includeOpportunities: true },
      isActive: true,
      createdAt: '2024-02-01T10:00:00Z',
      runCount: 28,
      successRate: 96.4
    },
    {
      id: 'schedule-003',
      name: 'Quarterly Investment Review',
      description: 'Detailed portfolio performance analysis every quarter',
      frequency: 'quarterly',
      time: '10:00',
      timezone: 'America/New_York',
      nextRun: '2024-10-01T10:00:00Z',
      lastRun: '2024-07-01T10:00:00Z',
      status: 'paused',
      recipients: ['investments@company.com', 'cfo@company.com'],
      reportType: 'performance',
      template: 'performance-report',
      filters: { includeRecommendations: true },
      isActive: false,
      createdAt: '2024-01-01T10:00:00Z',
      runCount: 3,
      successRate: 100
    }
  ];

  const scheduleData = schedules.length > 0 ? schedules : defaultSchedules;
  const templateData = templates.length > 0 ? templates : defaultTemplates;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get frequency display
  const getFrequencyDisplay = (schedule: EmailSchedule) => {
    switch (schedule.frequency) {
      case 'daily':
        return `Daily at ${schedule.time}`;
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `Weekly on ${days[schedule.dayOfWeek || 0]} at ${schedule.time}`;
      case 'monthly':
        return `Monthly on the ${schedule.dayOfMonth}${getOrdinalSuffix(schedule.dayOfMonth || 1)} at ${schedule.time}`;
      case 'quarterly':
        return `Quarterly at ${schedule.time}`;
      default:
        return schedule.frequency;
    }
  };

  // Get ordinal suffix
  const getOrdinalSuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
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
          Scheduled Email Reports
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Automate your financial reports and stay informed with scheduled email delivery
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
          { key: 'schedules', label: 'Active Schedules', icon: Calendar },
          { key: 'templates', label: 'Templates', icon: FileText },
          { key: 'create', label: 'Create New', icon: Plus }
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
        {activeTab === 'schedules' && (
          <motion.div
            key="schedules"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Schedules List */}
            <div className="space-y-4">
              {scheduleData.map((schedule, index) => {
                const statusColor = getStatusColor(schedule.status);
                const template = templateData.find(t => t.id === schedule.template);
                const isSelected = selectedSchedule === schedule.id;
                
                return (
                  <motion.div
                    key={schedule.id}
                    className={`p-6 bg-white/5 backdrop-blur-xl border rounded-2xl transition-all ${
                      isSelected ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedSchedule(isSelected ? null : schedule.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Template Icon */}
                      {template && (
                        <div 
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${template.color}20` }}
                        >
                          <template.icon className="w-6 h-6" style={{ color: template.color }} />
                        </div>
                      )}

                      {/* Schedule Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-white font-bold text-lg">{schedule.name}</h4>
                          <div 
                            className="px-2 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-1"
                            style={{ 
                              backgroundColor: `${statusColor}20`,
                              color: statusColor,
                              borderColor: statusColor
                            }}
                          >
                            {schedule.status === 'active' && <Check className="w-3 h-3" />}
                            {schedule.status === 'paused' && <Pause className="w-3 h-3" />}
                            {schedule.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                            {schedule.status}
                          </div>
                          {template?.isPremium && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        
                        <p className="text-gray-400 mb-3">{schedule.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-gray-400 text-sm">Frequency</div>
                            <div className="text-white font-medium">{getFrequencyDisplay(schedule)}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Next Run</div>
                            <div className="text-white font-medium">
                              {new Date(schedule.nextRun).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Recipients</div>
                            <div className="text-white font-medium">{schedule.recipients.length} recipients</div>
                          </div>
                          <div>
                            <div className="text-gray-400 text-sm">Success Rate</div>
                            <div className="text-green-400 font-medium">{schedule.successRate}%</div>
                          </div>
                        </div>

                        {/* Recipients */}
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-wrap gap-2">
                            {schedule.recipients.slice(0, 3).map((email, idx) => (
                              <div key={idx} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                {email}
                              </div>
                            ))}
                            {schedule.recipients.length > 3 && (
                              <div className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                                +{schedule.recipients.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          className={`p-2 rounded-lg border transition-colors ${
                            schedule.isActive 
                              ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                              : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSchedule?.(schedule.id, !schedule.isActive);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {schedule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </motion.button>

                        <motion.button
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRunNow?.(schedule.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSchedule(schedule.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSchedule?.(schedule.id);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="mt-6 pt-6 border-t border-white/10"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="text-white font-medium mb-3">Recent Activity</h5>
                              <div className="space-y-2">
                                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                  <Check className="w-4 h-4 text-green-400" />
                                  <div className="flex-1">
                                    <div className="text-white text-sm">Last sent successfully</div>
                                    <div className="text-gray-400 text-xs">
                                      {schedule.lastRun ? new Date(schedule.lastRun).toLocaleString() : 'Never'}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                  <BarChart3 className="w-4 h-4 text-blue-400" />
                                  <div className="flex-1">
                                    <div className="text-white text-sm">Total runs: {schedule.runCount}</div>
                                    <div className="text-gray-400 text-xs">
                                      Success rate: {schedule.successRate}%
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-white font-medium mb-3">Quick Actions</h5>
                              <div className="space-y-2">
                                <motion.button
                                  className="w-full flex items-center gap-3 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Eye className="w-4 h-4" />
                                  Preview Report
                                </motion.button>
                                <motion.button
                                  className="w-full flex items-center gap-3 p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Mail className="w-4 h-4" />
                                  Send Test Email
                                </motion.button>
                                <motion.button
                                  className="w-full flex items-center gap-3 p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Copy className="w-4 h-4" />
                                  Duplicate Schedule
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templateData.map((template, index) => {
                const Icon = template.icon;
                
                return (
                  <motion.div
                    key={template.id}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Template Preview */}
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
                      {template.isPremium && (
                        <div className="absolute top-2 right-2">
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
                        <h4 className="text-white font-bold">{template.name}</h4>
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

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Use Template
                      </motion.button>
                      <motion.button
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Create Form */}
            <div className="max-w-2xl mx-auto">
              <motion.div
                className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Mail className="w-8 h-8 text-white" />
                  </motion.div>
                  <h4 className="text-white font-bold text-xl mb-2">Create Scheduled Report</h4>
                  <p className="text-gray-400">
                    Set up automated email delivery of your financial reports
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-white font-medium mb-2 block">Report Name</label>
                    <input
                      type="text"
                      placeholder="Enter report name..."
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block">Template</label>
                    <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                      <option value="">Select a template...</option>
                      {templateData.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white font-medium mb-2 block">Frequency</label>
                      <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white">
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white font-medium mb-2 block">Time</label>
                      <input
                        type="time"
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block">Recipients</label>
                    <textarea
                      placeholder="Enter email addresses separated by commas..."
                      rows={3}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      className="flex-1 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Create Schedule
                    </motion.button>
                    <motion.button
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Preview
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      <motion.div
        className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/20 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <h4 className="text-white font-bold text-lg">Email Report Statistics</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Schedules', value: scheduleData.filter(s => s.isActive).length.toString(), icon: Calendar },
            { label: 'Reports Sent', value: scheduleData.reduce((sum, s) => sum + s.runCount, 0).toString(), icon: Send },
            { label: 'Success Rate', value: `${Math.round(scheduleData.reduce((sum, s) => sum + s.successRate, 0) / scheduleData.length)}%`, icon: Target },
            { label: 'Recipients', value: new Set(scheduleData.flatMap(s => s.recipients)).size.toString(), icon: Users }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/10 text-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
          >
            <Mail />
          </motion.div>
        ))}
      </div>
    </div>
  );
}