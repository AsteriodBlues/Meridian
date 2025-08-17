'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Upload, Camera, Image, Video, File, X, Eye, Download,
  Edit, Trash2, Star, Share, Maximize, ZoomIn, ZoomOut,
  RotateCw, Crop, Filter, Palette, Grid, List, Search,
  Tag, Clock, User, MapPin, Info, Heart, Award,
  Plus, Minus, ArrowLeft, ArrowRight, Play, Pause
} from 'lucide-react';

interface AssetPhoto {
  id: string;
  assetId: string;
  assetName: string;
  url: string;
  thumbnail: string;
  filename: string;
  size: number;
  type: 'image' | 'video' | 'document';
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  metadata?: {
    dimensions?: { width: number; height: number };
    duration?: number; // for videos
    camera?: string;
    settings?: string;
  };
  isFavorite: boolean;
  isPublic: boolean;
}

interface AssetGalleryProps {
  photos?: AssetPhoto[];
  assetId?: string;
  assetName?: string;
  className?: string;
  onUpload?: (files: FileList, assetId: string) => void;
  onDelete?: (photoId: string) => void;
  onEdit?: (photoId: string, updates: Partial<AssetPhoto>) => void;
  onToggleFavorite?: (photoId: string) => void;
  onShare?: (photoId: string, method: string) => void;
  maxFiles?: number;
  allowedTypes?: string[];
  maxFileSize?: number; // in MB
}

export default function AssetGallery({ 
  photos = [],
  assetId,
  assetName,
  className = '',
  onUpload,
  onDelete,
  onEdit,
  onToggleFavorite,
  onShare,
  maxFiles = 50,
  allowedTypes = ['image/*', 'video/*', '.pdf', '.doc', '.docx'],
  maxFileSize = 50
}: AssetGalleryProps) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'type'>('date');
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default photos data
  const defaultPhotos: AssetPhoto[] = [
    {
      id: 'photo-001',
      assetId: 'vehicle-001',
      assetName: '2022 Tesla Model 3',
      url: '/asset-photos/tesla-exterior-1.jpg',
      thumbnail: '/asset-photos/tesla-exterior-1-thumb.jpg',
      filename: 'tesla_exterior_front.jpg',
      size: 2456789,
      type: 'image',
      mimeType: 'image/jpeg',
      uploadedAt: '2024-08-15T10:30:00Z',
      uploadedBy: 'John Doe',
      tags: ['exterior', 'front', 'purchase'],
      description: 'Front view of the Tesla Model 3 on purchase date',
      location: {
        lat: 37.7749,
        lng: -122.4194,
        address: 'Tesla Service Center, San Francisco, CA'
      },
      metadata: {
        dimensions: { width: 4032, height: 3024 },
        camera: 'iPhone 14 Pro',
        settings: 'f/1.78, 1/120s, ISO 32'
      },
      isFavorite: true,
      isPublic: false
    },
    {
      id: 'photo-002',
      assetId: 'vehicle-001',
      assetName: '2022 Tesla Model 3',
      url: '/asset-photos/tesla-interior-1.jpg',
      thumbnail: '/asset-photos/tesla-interior-1-thumb.jpg',
      filename: 'tesla_interior_dashboard.jpg',
      size: 1834567,
      type: 'image',
      mimeType: 'image/jpeg',
      uploadedAt: '2024-08-15T10:35:00Z',
      uploadedBy: 'John Doe',
      tags: ['interior', 'dashboard', 'technology'],
      description: 'Dashboard and touchscreen interface',
      metadata: {
        dimensions: { width: 3024, height: 4032 },
        camera: 'iPhone 14 Pro',
        settings: 'f/1.78, 1/60s, ISO 64'
      },
      isFavorite: false,
      isPublic: true
    },
    {
      id: 'photo-003',
      assetId: 'asset-002',
      assetName: 'MacBook Pro 16"',
      url: '/asset-photos/macbook-setup.jpg',
      thumbnail: '/asset-photos/macbook-setup-thumb.jpg',
      filename: 'macbook_workspace_setup.jpg',
      size: 3245678,
      type: 'image',
      mimeType: 'image/jpeg',
      uploadedAt: '2024-08-10T14:20:00Z',
      uploadedBy: 'John Doe',
      tags: ['workspace', 'setup', 'technology'],
      description: 'Complete workspace setup with MacBook Pro',
      metadata: {
        dimensions: { width: 5472, height: 3648 },
        camera: 'Canon EOS R5',
        settings: 'f/2.8, 1/125s, ISO 100'
      },
      isFavorite: true,
      isPublic: false
    },
    {
      id: 'photo-004',
      assetId: 'vehicle-001',
      assetName: '2022 Tesla Model 3',
      url: '/asset-photos/tesla-charge.mp4',
      thumbnail: '/asset-photos/tesla-charge-thumb.jpg',
      filename: 'tesla_supercharging.mp4',
      size: 15678901,
      type: 'video',
      mimeType: 'video/mp4',
      uploadedAt: '2024-08-12T16:45:00Z',
      uploadedBy: 'John Doe',
      tags: ['charging', 'supercharger', 'electric'],
      description: 'Time-lapse of supercharging session',
      metadata: {
        dimensions: { width: 1920, height: 1080 },
        duration: 30,
        camera: 'iPhone 14 Pro'
      },
      isFavorite: false,
      isPublic: true
    },
    {
      id: 'photo-005',
      assetId: 'asset-001',
      assetName: 'Rolex Submariner',
      url: '/asset-photos/rolex-certificate.pdf',
      thumbnail: '/asset-photos/document-thumb.png',
      filename: 'rolex_authenticity_certificate.pdf',
      size: 1234567,
      type: 'document',
      mimeType: 'application/pdf',
      uploadedAt: '2024-07-20T09:15:00Z',
      uploadedBy: 'John Doe',
      tags: ['certificate', 'authenticity', 'documentation'],
      description: 'Official Rolex authenticity certificate',
      isFavorite: true,
      isPublic: false
    }
  ];

  const photoData = photos.length > 0 ? photos : defaultPhotos;

  // Filter and sort photos
  const filteredPhotos = photoData.filter(photo => {
    const matchesAsset = !assetId || photo.assetId === assetId;
    const matchesType = filterType === 'all' || photo.type === filterType;
    const matchesSearch = searchQuery === '' || 
      photo.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      photo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAsset && matchesType && matchesSearch;
  });

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      case 'name':
        return a.filename.localeCompare(b.filename);
      case 'size':
        return b.size - a.size;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && assetId) {
      handleFileUpload(files);
    }
  }, [assetId]);

  // File upload handler
  const handleFileUpload = useCallback((files: FileList) => {
    if (!assetId) return;
    
    const validFiles = Array.from(files).filter(file => {
      // Check file type
      const isValidType = allowedTypes.some(type => {
        if (type.includes('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      });
      
      // Check file size
      const isValidSize = file.size <= maxFileSize * 1024 * 1024;
      
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert(`Some files were rejected. Please ensure files are under ${maxFileSize}MB and of supported types.`);
    }

    if (validFiles.length > 0) {
      setUploading(true);
      
      // Simulate upload progress
      validFiles.forEach((file, index) => {
        const fileId = `upload-${Date.now()}-${index}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[fileId] || 0;
            const next = Math.min(100, current + Math.random() * 20);
            
            if (next >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setUploadProgress(prev => {
                  const { [fileId]: removed, ...rest } = prev;
                  return rest;
                });
              }, 1000);
            }
            
            return { ...prev, [fileId]: next };
          });
        }, 200);
      });

      // Call parent upload handler
      onUpload?.(files, assetId);
      
      setTimeout(() => {
        setUploading(false);
      }, 3000);
    }
  }, [assetId, allowedTypes, maxFileSize, onUpload]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file icon
  const getFileIcon = (photo: AssetPhoto) => {
    switch (photo.type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'document': return File;
      default: return File;
    }
  };

  // Navigate lightbox
  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    
    const newIndex = direction === 'prev' 
      ? Math.max(0, lightboxIndex - 1)
      : Math.min(sortedPhotos.length - 1, lightboxIndex + 1);
    
    setLightboxIndex(newIndex);
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
          Asset Gallery
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {assetName ? `Photos and documents for ${assetName}` : 'Manage photos and documents for all your assets'}
        </motion.p>
      </div>

      {/* Upload Area */}
      <motion.div
        ref={dropZoneRef}
        className={`group relative p-8 border-2 border-dashed rounded-3xl backdrop-blur-2xl transition-all mb-8 overflow-hidden cursor-pointer ${
          dragOver 
            ? 'border-cyan-400/60 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20' 
            : 'border-white/20 bg-gradient-to-br from-slate-800/30 via-slate-700/30 to-slate-800/30 hover:border-cyan-400/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        whileHover={{ y: -5, scale: 1.02 }}
      >
        <div className="text-center">
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(6, 182, 212, 0.5)',
                '0 0 40px rgba(59, 130, 246, 0.7)',
                '0 0 20px rgba(6, 182, 212, 0.5)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Upload className="w-10 h-10 text-white" />
          </motion.div>
          
          <h4 className="text-2xl font-bold text-white mb-2">
            {dragOver ? 'Drop files here' : 'Upload Photos & Documents'}
          </h4>
          
          <p className="text-gray-400 mb-6">
            Drag & drop files or click to browse • Max {maxFileSize}MB • {photoData.length}/{maxFiles} files
          </p>

          <div className="flex items-center justify-center gap-4">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image className="w-5 h-5" />
              Photos
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Video className="w-5 h-5" />
              Videos
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <File className="w-5 h-5" />
              Documents
            </motion.button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {Object.keys(uploadProgress).length > 0 && (
          <motion.div
            className="mb-6 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h5 className="text-white font-medium mb-3">Uploading Files...</h5>
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Upload className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm">File {fileId.split('-')[2]}</span>
                      <span className="text-blue-400 text-sm">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search photos, tags, descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: 'All', icon: Grid },
            { key: 'image', label: 'Images', icon: Image },
            { key: 'video', label: 'Videos', icon: Video },
            { key: 'document', label: 'Docs', icon: File }
          ].map((filter) => {
            const Icon = filter.icon;
            return (
              <motion.button
                key={filter.key}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === filter.key
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
                onClick={() => setFilterType(filter.key as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
              </motion.button>
            );
          })}
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-1 p-1 bg-white/10 rounded-lg">
          {[
            { key: 'grid', icon: Grid },
            { key: 'list', icon: List },
            { key: 'timeline', icon: Clock }
          ].map((view) => {
            const Icon = view.icon;
            return (
              <motion.button
                key={view.key}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === view.key
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setViewMode(view.key as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            );
          })}
        </div>

        {/* Sort */}
        <select 
          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="size">Sort by Size</option>
          <option value="type">Sort by Type</option>
        </select>
      </motion.div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sortedPhotos.map((photo, index) => {
              const Icon = getFileIcon(photo);
              const isSelected = selectedPhoto === photo.id;
              
              return (
                <motion.div
                  key={photo.id}
                  className={`group relative aspect-square bg-gray-700 rounded-xl overflow-hidden cursor-pointer ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setSelectedPhoto(isSelected ? null : photo.id)}
                >
                  {/* Image/Video Preview */}
                  {photo.type === 'image' || photo.type === 'video' ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <motion.button
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxIndex(index);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite?.(photo.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className={`w-4 h-4 ${photo.isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
                      </motion.button>
                      <motion.button
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShare?.(photo.id, 'link');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Share className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium">
                      {photo.type.toUpperCase()}
                    </div>
                  </div>

                  {/* Favorite Badge */}
                  {photo.isFavorite && (
                    <div className="absolute top-2 right-2">
                      <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                    </div>
                  )}

                  {/* File Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-white text-sm font-medium truncate">{photo.filename}</div>
                    <div className="text-gray-300 text-xs">{formatFileSize(photo.size)}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full h-full flex items-center justify-center p-8">
              {/* Navigation */}
              <motion.button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                onClick={() => navigateLightbox('prev')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={lightboxIndex === 0}
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                onClick={() => navigateLightbox('next')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={lightboxIndex === sortedPhotos.length - 1}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.button>

              {/* Close Button */}
              <motion.button
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                onClick={() => setLightboxIndex(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Image/Content */}
              <div className="max-w-4xl max-h-full">
                {sortedPhotos[lightboxIndex] && (
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: zoomLevel, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {sortedPhotos[lightboxIndex].type === 'image' ? (
                      <div className="w-full max-w-3xl max-h-[80vh] bg-gray-800 rounded-lg flex items-center justify-center">
                        <Image className="w-32 h-32 text-gray-400" />
                      </div>
                    ) : sortedPhotos[lightboxIndex].type === 'video' ? (
                      <div className="w-full max-w-3xl max-h-[80vh] bg-gray-800 rounded-lg flex items-center justify-center">
                        <Video className="w-32 h-32 text-gray-400" />
                      </div>
                    ) : (
                      <div className="w-full max-w-lg h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                        <File className="w-32 h-32 text-gray-400" />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Info Panel */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/60 backdrop-blur-md rounded-xl">
                {sortedPhotos[lightboxIndex] && (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{sortedPhotos[lightboxIndex].filename}</div>
                      <div className="text-gray-300 text-sm">
                        {formatFileSize(sortedPhotos[lightboxIndex].size)} • 
                        {new Date(sortedPhotos[lightboxIndex].uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Zoom Controls */}
                      <motion.button
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </motion.button>
                      
                      <span className="text-white text-sm min-w-[3rem] text-center">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      
                      <motion.button
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                        onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              y: [0, -25, 0],
              opacity: [0, 0.4, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
          >
            <Camera />
          </motion.div>
        ))}
      </div>
    </div>
  );
}