'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Upload, Scan, Camera, FileImage, CheckCircle, AlertCircle, 
  Loader, Brain, Zap, Target, Eye, Edit, Trash2, Download,
  Calendar, DollarSign, MapPin, Building, Tag, Star,
  RefreshCw, Sparkles, Wand2, Bot, Search, Filter
} from 'lucide-react';

interface ReceiptData {
  id: string;
  imageUrl: string;
  status: 'processing' | 'completed' | 'error' | 'manual_review';
  confidence: number;
  extractedData: {
    vendor: string;
    amount: number;
    date: string;
    category: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      category?: string;
    }>;
    paymentMethod?: string;
    location?: string;
    tax?: number;
    tip?: number;
    total: number;
  };
  suggestions: {
    category: Array<{ name: string; confidence: number }>;
    deductible: boolean;
    deductibleAmount: number;
    taxTips: string[];
  };
  processingTime: number;
  uploadedAt: string;
}

interface ReceiptAIProps {
  receipts: ReceiptData[];
  className?: string;
  onUploadReceipt?: (file: File) => void;
  onCameraCapture?: () => void;
  onApproveData?: (receiptId: string, data: any) => void;
  onRejectData?: (receiptId: string) => void;
  onEditData?: (receiptId: string, data: any) => void;
}

export default function ReceiptAI({ 
  receipts,
  className = '',
  onUploadReceipt,
  onCameraCapture,
  onApproveData,
  onRejectData,
  onEditData 
}: ReceiptAIProps) {
  const [mounted, setMounted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'processing' | 'completed' | 'needs_review'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default data if none provided
  const defaultReceipts: ReceiptData[] = [
    {
      id: 'receipt-001',
      imageUrl: '/receipt-placeholder.jpg',
      status: 'completed',
      confidence: 95,
      extractedData: {
        vendor: 'Staples Business Center',
        amount: 247.85,
        date: '2024-08-15',
        category: 'office_supplies',
        items: [
          { name: 'Printer Paper (500 sheets)', quantity: 5, price: 12.99 },
          { name: 'Ink Cartridge HP 564XL', quantity: 2, price: 89.99 },
          { name: 'File Folders Letter Size', quantity: 1, price: 24.99 },
          { name: 'Ballpoint Pens (12 pack)', quantity: 3, price: 15.99 }
        ],
        paymentMethod: 'Credit Card ***4532',
        location: 'San Francisco, CA',
        tax: 22.14,
        total: 247.85
      },
      suggestions: {
        category: [
          { name: 'Business Expenses', confidence: 98 },
          { name: 'Office Supplies', confidence: 95 },
          { name: 'Equipment', confidence: 72 }
        ],
        deductible: true,
        deductibleAmount: 247.85,
        taxTips: [
          'Fully deductible as business expense',
          'Keep receipt for at least 3 years',
          'Consider bulk purchasing for better rates'
        ]
      },
      processingTime: 2.4,
      uploadedAt: '2024-08-15T10:30:00Z'
    },
    {
      id: 'receipt-002',
      imageUrl: '/receipt-placeholder.jpg',
      status: 'processing',
      confidence: 0,
      extractedData: {
        vendor: '',
        amount: 0,
        date: '',
        category: '',
        items: [],
        total: 0
      },
      suggestions: {
        category: [],
        deductible: false,
        deductibleAmount: 0,
        taxTips: []
      },
      processingTime: 0,
      uploadedAt: '2024-08-15T14:20:00Z'
    },
    {
      id: 'receipt-003',
      imageUrl: '/receipt-placeholder.jpg',
      status: 'manual_review',
      confidence: 68,
      extractedData: {
        vendor: 'City Medical Center',
        amount: 185.00,
        date: '2024-08-13',
        category: 'medical',
        items: [
          { name: 'Annual Physical Exam', quantity: 1, price: 150.00 },
          { name: 'Blood Work Panel', quantity: 1, price: 35.00 }
        ],
        paymentMethod: 'Insurance + Cash',
        location: 'San Francisco, CA',
        total: 185.00
      },
      suggestions: {
        category: [
          { name: 'Medical Expenses', confidence: 89 },
          { name: 'Health & Wellness', confidence: 76 },
          { name: 'Personal Care', confidence: 45 }
        ],
        deductible: true,
        deductibleAmount: 185.00,
        taxTips: [
          'Medical expenses are deductible if they exceed 7.5% of AGI',
          'Include insurance premiums if self-employed',
          'Keep all medical receipts organized by year'
        ]
      },
      processingTime: 3.8,
      uploadedAt: '2024-08-13T16:45:00Z'
    }
  ];

  const receiptData = receipts.length > 0 ? receipts : defaultReceipts;

  // Filter receipts
  const filteredReceipts = receiptData.filter(receipt => {
    if (filter === 'processing') return receipt.status === 'processing';
    if (filter === 'completed') return receipt.status === 'completed';
    if (filter === 'needs_review') return receipt.status === 'manual_review' || receipt.status === 'error';
    return true;
  });

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (files && files[0]) {
      onUploadReceipt?.(files[0]);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'processing': return '#3b82f6';
      case 'manual_review': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10b981';
    if (confidence >= 70) return '#f59e0b';
    return '#ef4444';
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
          Receipt AI Scanner
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Intelligent receipt processing with AI-powered data extraction
        </motion.p>
      </div>

      {/* Upload Area */}
      <motion.div
        className={`group relative p-12 border-2 border-dashed rounded-3xl backdrop-blur-2xl transition-all mb-12 overflow-hidden ${
          dragOver 
            ? 'border-cyan-400/60 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20' 
            : 'border-white/20 bg-gradient-to-br from-slate-800/30 via-slate-700/30 to-slate-800/30 hover:border-cyan-400/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        whileHover={{ y: -8, scale: 1.02 }}
        style={{
          boxShadow: dragOver 
            ? '0 25px 50px rgba(6, 182, 212, 0.4)' 
            : '0 10px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          <motion.div
            className="relative w-32 h-32 mx-auto mb-8"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Middle Ring */}
            <motion.div
              className="absolute inset-4 rounded-full border border-purple-400/40"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Circle */}
            <motion.div
              className="absolute inset-8 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.5)',
                  '0 0 40px rgba(168, 85, 247, 0.7)',
                  '0 0 20px rgba(6, 182, 212, 0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-12 h-12 text-white filter drop-shadow-lg" />
              </motion.div>
            </motion.div>

            {/* Orbiting Elements */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0'
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  rotate: { duration: 6 + i * 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, delay: i * 0.7 }
                }}
                initial={{
                  x: `${60 + i * 20}px`,
                  y: `-${60 + i * 20}px`
                }}
              />
            ))}
          </motion.div>
          
          <motion.h4 
            className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            AI-Powered Receipt Processing
          </motion.h4>
          
          <motion.p 
            className="text-slate-300 text-lg mb-8 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Drop your receipt images here or click to upload. Our AI will extract all the data automatically with{' '}
            <span className="text-cyan-400 font-semibold">95%+ accuracy</span>.
          </motion.p>

          <motion.div 
            className="flex items-center justify-center gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 rounded-2xl text-cyan-300 font-semibold transition-all duration-300"
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: '0 10px 40px rgba(6, 182, 212, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Upload className="w-6 h-6" />
                </motion.div>
                <span className="text-lg">Upload Images</span>
              </div>
            </motion.button>

            <motion.button
              className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/30 rounded-2xl text-emerald-300 font-semibold transition-all duration-300"
              onClick={onCameraCapture}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Camera className="w-6 h-6" />
                </motion.div>
                <span className="text-lg">Take Photo</span>
              </div>
            </motion.button>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            {[
              { icon: Zap, label: 'Lightning Fast', color: 'from-yellow-400 to-orange-400', bgColor: 'yellow-500/20' },
              { icon: Target, label: '95%+ Accuracy', color: 'from-emerald-400 to-green-400', bgColor: 'emerald-500/20' },
              { icon: Bot, label: 'AI Powered', color: 'from-blue-400 to-cyan-400', bgColor: 'blue-500/20' }
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                className={`group relative p-4 bg-${feature.bgColor} border border-white/20 rounded-2xl backdrop-blur-xl hover:scale-105 transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`p-2 bg-gradient-to-r ${feature.color} rounded-xl shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className={`font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.label}
                  </span>
                </div>
                
                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color?.split(' ')[1]?.replace('to-', '') || '#3b82f6'}10, transparent)`
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { key: 'all', label: 'All Receipts', count: receiptData.length },
          { key: 'processing', label: 'Processing', count: receiptData.filter(r => r.status === 'processing').length },
          { key: 'completed', label: 'Completed', count: receiptData.filter(r => r.status === 'completed').length },
          { key: 'needs_review', label: 'Needs Review', count: receiptData.filter(r => r.status === 'manual_review' || r.status === 'error').length }
        ].map((tab) => (
          <motion.button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab.key
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            onClick={() => setFilter(tab.key as any)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label} ({tab.count})
          </motion.button>
        ))}
      </motion.div>

      {/* Receipts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReceipts.map((receipt, index) => (
          <motion.div
            key={receipt.id}
            className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                  <FileImage className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="text-white font-bold">
                    {receipt.extractedData.vendor || 'Processing...'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Uploaded {new Date(receipt.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div 
                className="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1"
                style={{ 
                  backgroundColor: `${getStatusColor(receipt.status)}20`,
                  color: getStatusColor(receipt.status),
                  borderColor: getStatusColor(receipt.status)
                }}
              >
                {receipt.status === 'processing' && <Loader className="w-3 h-3 animate-spin" />}
                {receipt.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                {receipt.status === 'manual_review' && <AlertCircle className="w-3 h-3" />}
                {receipt.status === 'error' && <AlertCircle className="w-3 h-3" />}
                {receipt.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            {/* Processing State */}
            {receipt.status === 'processing' && (
              <div className="text-center py-8">
                <motion.div
                  className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Scan className="w-8 h-8 text-blue-400" />
                </motion.div>
                <div className="text-white font-medium mb-2">Processing Receipt...</div>
                <div className="text-gray-400 text-sm">
                  AI is extracting data from your receipt
                </div>
                <motion.div 
                  className="w-full bg-gray-700 rounded-full h-2 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  />
                </motion.div>
              </div>
            )}

            {/* Completed/Review State */}
            {(receipt.status === 'completed' || receipt.status === 'manual_review') && (
              <div className="space-y-4">
                {/* Confidence Score */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Confidence Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: getConfidenceColor(receipt.confidence) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${receipt.confidence}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: getConfidenceColor(receipt.confidence) }}
                    >
                      {receipt.confidence}%
                    </span>
                  </div>
                </div>

                {/* Extracted Data */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400 text-sm">Amount</span>
                    </div>
                    <div className="text-white font-bold text-lg">
                      ${receipt.extractedData.amount.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400 text-sm">Date</span>
                    </div>
                    <div className="text-white font-bold">
                      {receipt.extractedData.date}
                    </div>
                  </div>
                </div>

                {/* Category Suggestions */}
                {receipt.suggestions.category.length > 0 && (
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Category Suggestions</div>
                    <div className="flex flex-wrap gap-2">
                      {receipt.suggestions.category.slice(0, 3).map((category, catIndex) => (
                        <div
                          key={catIndex}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-xs flex items-center gap-1"
                        >
                          <span>{category.name}</span>
                          <span className="text-purple-300">({category.confidence}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deductible Info */}
                {receipt.suggestions.deductible && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Tax Deductible</span>
                    </div>
                    <div className="text-white font-bold text-lg mb-2">
                      ${receipt.suggestions.deductibleAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-300">
                      {receipt.suggestions.taxTips[0]}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {receipt.status === 'completed' && (
                    <>
                      <motion.button
                        className="flex-1 p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium transition-colors"
                        onClick={() => onApproveData?.(receipt.id, receipt.extractedData)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                  
                  {receipt.status === 'manual_review' && (
                    <>
                      <motion.button
                        className="flex-1 p-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Review & Edit
                      </motion.button>
                      <motion.button
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
                        onClick={() => onRejectData?.(receipt.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                  
                  <motion.button
                    className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* AI Processing Stats */}
      <motion.div
        className="mt-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <h4 className="text-white font-bold text-lg">AI Processing Statistics</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Receipts Processed', value: '1,247', icon: Scan },
            { label: 'Average Accuracy', value: '94.7%', icon: Target },
            { label: 'Processing Time', value: '2.3s', icon: Zap },
            { label: 'Data Points Extracted', value: '12,890', icon: Brain }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <Icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}