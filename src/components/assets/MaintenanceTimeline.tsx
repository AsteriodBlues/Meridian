'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Wrench, Calendar, Clock, CheckCircle, AlertTriangle, 
  Car, DollarSign, User, MapPin, Plus, Edit, Trash2,
  Star, Shield, Zap, Settings, Phone, Mail,
  TrendingUp, Award, Target, Bell, Filter, Search
} from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  type: 'scheduled' | 'repair' | 'inspection' | 'upgrade';
  category: 'oil_change' | 'tires' | 'brakes' | 'engine' | 'transmission' | 'electrical' | 'bodywork' | 'other';
  title: string;
  description: string;
  cost: number;
  scheduledDate: string;
  completedDate?: string;
  status: 'upcoming' | 'overdue' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  serviceProvider?: {
    name: string;
    phone: string;
    email: string;
    address: string;
    rating: number;
  };
  mileage?: number;
  notes?: string;
  photos?: string[];
  warranty?: {
    duration: string;
    expiryDate: string;
  };
}

interface UpcomingMaintenance {
  id: string;
  assetId: string;
  assetName: string;
  maintenanceType: string;
  dueDate: string;
  dueMileage?: number;
  currentMileage?: number;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface MaintenanceTimelineProps {
  records?: MaintenanceRecord[];
  upcoming?: UpcomingMaintenance[];
  className?: string;
  onSchedule?: (record: Partial<MaintenanceRecord>) => void;
  onComplete?: (id: string, data: any) => void;
  onCancel?: (id: string) => void;
  onAddRecord?: (record: Partial<MaintenanceRecord>) => void;
}

export default function MaintenanceTimeline({ 
  records = [],
  upcoming = [],
  className = '',
  onSchedule,
  onComplete,
  onCancel,
  onAddRecord 
}: MaintenanceTimelineProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'upcoming' | 'schedule' | 'providers'>('timeline');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default maintenance records
  const defaultRecords: MaintenanceRecord[] = [
    {
      id: 'maint-001',
      assetId: 'vehicle-001',
      assetName: '2022 Tesla Model 3',
      type: 'scheduled',
      category: 'inspection',
      title: 'Annual Safety Inspection',
      description: 'Comprehensive vehicle safety and emissions inspection',
      cost: 89,
      scheduledDate: '2024-09-15',
      completedDate: '2024-09-15',
      status: 'completed',
      priority: 'medium',
      serviceProvider: {
        name: 'Tesla Service Center',
        phone: '(555) 123-4567',
        email: 'service@tesla.com',
        address: '123 Electric Ave, San Francisco, CA',
        rating: 4.8
      },
      mileage: 15420,
      notes: 'All systems passed inspection. Recommended tire rotation in 5,000 miles.',
      warranty: {
        duration: '12 months',
        expiryDate: '2025-09-15'
      }
    },
    {
      id: 'maint-002',
      assetId: 'vehicle-002',
      assetName: '2021 BMW X5',
      type: 'scheduled',
      category: 'oil_change',
      title: 'Oil Change & Filter Replacement',
      description: 'Synthetic oil change with premium filter replacement',
      cost: 145,
      scheduledDate: '2024-08-20',
      status: 'overdue',
      priority: 'high',
      serviceProvider: {
        name: 'BMW Service Center',
        phone: '(555) 987-6543',
        email: 'service@bmw.com',
        address: '456 Luxury Blvd, San Francisco, CA',
        rating: 4.9
      },
      mileage: 28650,
      notes: 'Vehicle is 500 miles overdue for service'
    },
    {
      id: 'maint-003',
      assetId: 'vehicle-001',
      assetName: '2022 Tesla Model 3',
      type: 'repair',
      category: 'tires',
      title: 'Tire Rotation & Alignment',
      description: 'Rotate all four tires and check wheel alignment',
      cost: 120,
      scheduledDate: '2024-08-25',
      status: 'upcoming',
      priority: 'medium',
      serviceProvider: {
        name: 'Discount Tire',
        phone: '(555) 456-7890',
        email: 'service@discounttire.com',
        address: '789 Tire Street, San Francisco, CA',
        rating: 4.6
      },
      mileage: 15420
    },
    {
      id: 'maint-004',
      assetId: 'vehicle-003',
      assetName: '2020 Toyota Camry',
      type: 'scheduled',
      category: 'brakes',
      title: 'Brake Pad Replacement',
      description: 'Replace front brake pads and resurface rotors',
      cost: 285,
      scheduledDate: '2024-08-30',
      status: 'in_progress',
      priority: 'high',
      serviceProvider: {
        name: 'Toyota Service Center',
        phone: '(555) 234-5678',
        email: 'service@toyota.com',
        address: '321 Reliable Road, San Francisco, CA',
        rating: 4.7
      },
      mileage: 42300,
      notes: 'Brake pad wear at 80%. Front rotors showing minor scoring.'
    }
  ];

  // Default upcoming maintenance
  const defaultUpcoming: UpcomingMaintenance[] = [
    {
      id: 'upcoming-001',
      assetId: 'vehicle-001',
      assetName: '2022 Tesla Model 3',
      maintenanceType: 'Cabin Air Filter Replacement',
      dueDate: '2024-10-01',
      dueMileage: 20000,
      currentMileage: 15420,
      estimatedCost: 45,
      priority: 'low',
      description: 'Replace cabin air filter for optimal air quality'
    },
    {
      id: 'upcoming-002',
      assetId: 'vehicle-002',
      assetName: '2021 BMW X5',
      maintenanceType: 'Brake Fluid Replacement',
      dueDate: '2024-09-30',
      dueMileage: 30000,
      currentMileage: 28650,
      estimatedCost: 180,
      priority: 'medium',
      description: 'Replace brake fluid as part of scheduled maintenance'
    },
    {
      id: 'upcoming-003',
      assetId: 'vehicle-003',
      assetName: '2020 Toyota Camry',
      maintenanceType: 'Transmission Service',
      dueDate: '2024-11-15',
      dueMileage: 45000,
      currentMileage: 42300,
      estimatedCost: 320,
      priority: 'high',
      description: 'Transmission fluid change and filter replacement'
    }
  ];

  const recordData = records.length > 0 ? records : defaultRecords;
  const upcomingData = upcoming.length > 0 ? upcoming : defaultUpcoming;

  // Filter records
  const filteredRecords = recordData.filter(record => {
    if (filterStatus === 'all') return true;
    return record.status === filterStatus;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'upcoming': return '#f59e0b';
      case 'overdue': return '#ef4444';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'oil_change': return Settings;
      case 'tires': return Target;
      case 'brakes': return Shield;
      case 'engine': return Zap;
      case 'transmission': return Wrench;
      case 'electrical': return Bell;
      case 'bodywork': return Star;
      default: return Wrench;
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
          Maintenance Timeline
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Track maintenance schedules, costs, and service history for all your assets
        </motion.p>
      </div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          {
            label: 'Overdue',
            value: recordData.filter(r => r.status === 'overdue').length.toString(),
            icon: AlertTriangle,
            color: '#ef4444',
            change: 'Need attention'
          },
          {
            label: 'Upcoming',
            value: upcomingData.length.toString(),
            icon: Calendar,
            color: '#f59e0b',
            change: 'Next 30 days'
          },
          {
            label: 'This Month',
            value: `$${recordData.filter(r => {
              const date = new Date(r.scheduledDate);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).reduce((sum, r) => sum + r.cost, 0).toLocaleString()}`,
            icon: DollarSign,
            color: '#3b82f6',
            change: 'Total spent'
          },
          {
            label: 'Completed',
            value: recordData.filter(r => r.status === 'completed').length.toString(),
            icon: CheckCircle,
            color: '#10b981',
            change: 'This year'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className="text-gray-400 text-sm">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { key: 'timeline', label: 'Timeline', icon: Clock },
          { key: 'upcoming', label: 'Upcoming', icon: Calendar },
          { key: 'schedule', label: 'Schedule', icon: Plus },
          { key: 'providers', label: 'Service Providers', icon: User }
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
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400 text-sm">Filter:</span>
              {[
                { key: 'all', label: 'All' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'overdue', label: 'Overdue' },
                { key: 'completed', label: 'Completed' }
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === filter.key
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setFilterStatus(filter.key as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              {filteredRecords.map((record, index) => {
                const Icon = getCategoryIcon(record.category);
                const statusColor = getStatusColor(record.status);
                const priorityColor = getPriorityColor(record.priority);
                const isSelected = selectedRecord === record.id;
                
                return (
                  <motion.div
                    key={record.id}
                    className={`relative p-6 bg-white/5 backdrop-blur-xl border rounded-2xl transition-all cursor-pointer ${
                      isSelected ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedRecord(isSelected ? null : record.id)}
                  >
                    {/* Timeline Connector */}
                    {index < filteredRecords.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-12 bg-gray-600" />
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon & Status */}
                      <div className="relative">
                        <div 
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${statusColor}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: statusColor }} />
                        </div>
                        
                        {/* Priority Indicator */}
                        <div 
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900"
                          style={{ backgroundColor: priorityColor }}
                        />
                      </div>

                      {/* Record Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-bold text-lg">{record.title}</h4>
                            <p className="text-gray-400 text-sm">{record.assetName}</p>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-white font-bold">${record.cost}</div>
                            <div 
                              className="px-2 py-1 rounded-full text-xs font-bold uppercase"
                              style={{ 
                                backgroundColor: `${statusColor}20`,
                                color: statusColor
                              }}
                            >
                              {record.status.replace('_', ' ')}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-3">{record.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(record.scheduledDate).toLocaleDateString()}
                          </span>
                          {record.mileage && (
                            <span className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              {record.mileage.toLocaleString()} miles
                            </span>
                          )}
                          {record.serviceProvider && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {record.serviceProvider.name}
                            </span>
                          )}
                        </div>
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
                            {/* Service Provider Details */}
                            {record.serviceProvider && (
                              <div>
                                <h5 className="text-white font-medium mb-3">Service Provider</h5>
                                <div className="p-4 bg-white/5 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white font-medium">{record.serviceProvider.name}</span>
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 text-yellow-400" />
                                      <span className="text-yellow-400">{record.serviceProvider.rating}</span>
                                    </div>
                                  </div>
                                  <div className="text-gray-400 text-sm space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-3 h-3" />
                                      {record.serviceProvider.phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-3 h-3" />
                                      {record.serviceProvider.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-3 h-3" />
                                      {record.serviceProvider.address}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Additional Details */}
                            <div>
                              <h5 className="text-white font-medium mb-3">Details</h5>
                              <div className="space-y-2">
                                {record.notes && (
                                  <div className="p-3 bg-white/5 rounded-lg">
                                    <div className="text-gray-400 text-xs mb-1">Notes</div>
                                    <div className="text-white text-sm">{record.notes}</div>
                                  </div>
                                )}
                                {record.warranty && (
                                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <div className="text-green-400 text-xs mb-1">Warranty</div>
                                    <div className="text-white text-sm">
                                      {record.warranty.duration} - Expires {new Date(record.warranty.expiryDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 mt-6">
                            {record.status === 'upcoming' && (
                              <motion.button
                                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Mark Completed
                              </motion.button>
                            )}
                            <motion.button
                              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Edit className="w-4 h-4 inline mr-2" />
                              Edit
                            </motion.button>
                            <motion.button
                              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 className="w-4 h-4 inline mr-2" />
                              Cancel
                            </motion.button>
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

        {activeTab === 'upcoming' && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Upcoming Maintenance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingData.map((item, index) => {
                const priorityColor = getPriorityColor(item.priority);
                const daysUntilDue = Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const mileageRemaining = item.dueMileage ? item.dueMileage - (item.currentMileage || 0) : null;
                
                return (
                  <motion.div
                    key={item.id}
                    className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Priority Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                        style={{ 
                          backgroundColor: `${priorityColor}20`,
                          color: priorityColor
                        }}
                      >
                        {item.priority} priority
                      </div>
                      <div className="text-white font-bold text-lg">
                        ${item.estimatedCost}
                      </div>
                    </div>

                    {/* Maintenance Info */}
                    <div className="mb-4">
                      <h4 className="text-white font-bold mb-1">{item.maintenanceType}</h4>
                      <p className="text-gray-400 text-sm mb-2">{item.assetName}</p>
                      <p className="text-gray-300 text-sm">{item.description}</p>
                    </div>

                    {/* Due Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Due Date:</span>
                        <span className={`font-medium ${daysUntilDue <= 7 ? 'text-red-400' : 'text-white'}`}>
                          {daysUntilDue > 0 ? `${daysUntilDue} days` : 'Overdue'}
                        </span>
                      </div>
                      {mileageRemaining && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Miles Remaining:</span>
                          <span className={`font-medium ${mileageRemaining <= 1000 ? 'text-red-400' : 'text-white'}`}>
                            {mileageRemaining.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {mileageRemaining && item.dueMileage && item.currentMileage && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Mileage Progress</span>
                          <span>{Math.round((item.currentMileage / item.dueMileage) * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: priorityColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.currentMileage / item.dueMileage) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Schedule
                      </motion.button>
                      <motion.button
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Bell className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400/10 text-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0, 0.5, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 6
            }}
          >
            <Wrench />
          </motion.div>
        ))}
      </div>
    </div>
  );
}