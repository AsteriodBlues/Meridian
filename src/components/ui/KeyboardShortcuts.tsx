'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Command, 
  Search, 
  Plus, 
  Home, 
  CreditCard, 
  TrendingUp, 
  Calculator,
  Settings,
  HelpCircle,
  Keyboard,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface Shortcut {
  key: string;
  combination: string[];
  description: string;
  category: 'navigation' | 'actions' | 'ui' | 'editing';
  icon?: React.ElementType;
  action?: () => void;
}

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts: Shortcut[] = [
  // Navigation
  {
    key: 'dashboard',
    combination: ['Cmd', 'D'],
    description: 'Go to Dashboard',
    category: 'navigation',
    icon: Home,
    action: () => window.location.href = '/dashboard'
  },
  {
    key: 'transactions',
    combination: ['Cmd', 'T'],
    description: 'View Transactions',
    category: 'navigation',
    icon: CreditCard,
    action: () => window.location.href = '/transactions'
  },
  {
    key: 'investments',
    combination: ['Cmd', 'I'],
    description: 'View Investments',
    category: 'navigation',
    icon: TrendingUp,
    action: () => window.location.href = '/investments'
  },
  {
    key: 'budget',
    combination: ['Cmd', 'B'],
    description: 'View Budget',
    category: 'navigation',
    icon: Calculator,
    action: () => window.location.href = '/budget'
  },
  {
    key: 'settings',
    combination: ['Cmd', ','],
    description: 'Open Settings',
    category: 'navigation',
    icon: Settings
  },

  // Actions
  {
    key: 'search',
    combination: ['Cmd', 'K'],
    description: 'Open Search',
    category: 'actions',
    icon: Search
  },
  {
    key: 'new-transaction',
    combination: ['Cmd', 'N'],
    description: 'New Transaction',
    category: 'actions',
    icon: Plus
  },
  {
    key: 'quick-add',
    combination: ['Cmd', 'Shift', 'N'],
    description: 'Quick Add Menu',
    category: 'actions',
    icon: Plus
  },

  // UI
  {
    key: 'shortcuts',
    combination: ['Cmd', '/'],
    description: 'Show Shortcuts',
    category: 'ui',
    icon: Keyboard
  },
  {
    key: 'help',
    combination: ['Cmd', 'Shift', '?'],
    description: 'Help & Support',
    category: 'ui',
    icon: HelpCircle
  },
  {
    key: 'close',
    combination: ['Escape'],
    description: 'Close Modal/Menu',
    category: 'ui',
    icon: X
  },

  // Editing
  {
    key: 'save',
    combination: ['Cmd', 'S'],
    description: 'Save Changes',
    category: 'editing'
  },
  {
    key: 'undo',
    combination: ['Cmd', 'Z'],
    description: 'Undo Action',
    category: 'editing'
  },
  {
    key: 'redo',
    combination: ['Cmd', 'Shift', 'Z'],
    description: 'Redo Action',
    category: 'editing'
  }
];

// Key combination display components
const KeyIcon = ({ keyName }: { keyName: string }) => {
  const keyIcons: Record<string, React.ElementType> = {
    Cmd: Command,
    Ctrl: Command,
    Shift: ArrowUp,
    Alt: Command,
    Option: Command,
    ArrowUp: ArrowUp,
    ArrowDown: ArrowDown,
    ArrowLeft: ArrowLeft,
    ArrowRight: ArrowRight
  };

  const IconComponent = keyIcons[keyName];

  if (IconComponent) {
    return <IconComponent className="w-3 h-3" />;
  }

  return (
    <span className="font-mono text-xs font-bold">
      {keyName.length === 1 ? keyName.toUpperCase() : keyName}
    </span>
  );
};

const KeyCombination = ({ combination }: { combination: string[] }) => (
  <div className="flex items-center gap-1">
    {combination.map((key, index) => (
      <React.Fragment key={key}>
        <div className="flex items-center justify-center min-w-[24px] h-6 px-2 bg-white/10 border border-white/20 rounded text-white">
          <KeyIcon keyName={key} />
        </div>
        {index < combination.length - 1 && (
          <span className="text-gray-400 text-xs">+</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Shortcuts' },
    { key: 'navigation', label: 'Navigation' },
    { key: 'actions', label: 'Actions' },
    { key: 'ui', label: 'Interface' },
    { key: 'editing', label: 'Editing' }
  ];

  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesCategory = selectedCategory === 'all' || shortcut.category === selectedCategory;
    const matchesSearch = shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shortcut.combination.some(key => key.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const executeShortcut = useCallback((shortcut: Shortcut) => {
    if (shortcut.action) {
      shortcut.action();
      onClose();
    }
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-4xl max-h-[80vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                  <p className="text-sm text-gray-400">Navigate faster with these shortcuts</p>
                </div>
              </div>
              
              <motion.button
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search shortcuts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <motion.button
                      key={category.key}
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category.key
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                      }`}
                      onClick={() => setSelectedCategory(category.key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {category.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shortcuts Grid */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredShortcuts.map((shortcut, index) => {
                  const Icon = shortcut.icon;
                  
                  return (
                    <motion.div
                      key={shortcut.key}
                      className={`p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group ${
                        shortcut.action ? 'cursor-pointer' : ''
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      onClick={() => shortcut.action && executeShortcut(shortcut)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {Icon && (
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                              <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                          )}
                          <div>
                            <div className="text-white font-medium text-sm">
                              {shortcut.description}
                            </div>
                            <div className="text-xs text-gray-400 capitalize">
                              {shortcut.category}
                            </div>
                          </div>
                        </div>
                        
                        <KeyCombination combination={shortcut.combination} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredShortcuts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">No shortcuts found</h3>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your search or category filter
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-white/5">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-400">
                  Press <KeyCombination combination={['Cmd', '/']} /> to toggle this overlay
                </div>
                <div className="text-gray-400">
                  {filteredShortcuts.length} shortcuts available
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing keyboard shortcuts
export function useKeyboardShortcuts() {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? event.metaKey : event.ctrlKey;

    // Don't trigger shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    // Find matching shortcut
    const matchingShortcut = shortcuts.find(shortcut => {
      const keys = shortcut.combination.map(key => {
        switch (key) {
          case 'Cmd': return isMac ? 'Meta' : 'Control';
          case 'Ctrl': return 'Control';
          case 'Shift': return 'Shift';
          case 'Alt': case 'Option': return 'Alt';
          default: return key.length === 1 ? key.toLowerCase() : key;
        }
      });

      const hasCmd = keys.includes('Meta') || keys.includes('Control');
      const hasShift = keys.includes('Shift');
      const hasAlt = keys.includes('Alt');
      const mainKey = keys.find(key => !['Meta', 'Control', 'Shift', 'Alt'].includes(key));

      return (
        (hasCmd ? cmdKey : !cmdKey) &&
        (hasShift ? event.shiftKey : !event.shiftKey) &&
        (hasAlt ? event.altKey : !event.altKey) &&
        (mainKey ? event.key.toLowerCase() === mainKey.toLowerCase() || event.code === mainKey : true)
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      
      // Special handling for shortcuts overlay
      if (matchingShortcut.key === 'shortcuts') {
        setIsShortcutsOpen(prev => !prev);
        return;
      }

      // Close shortcuts overlay if open
      if (isShortcutsOpen) {
        setIsShortcutsOpen(false);
      }

      // Execute shortcut action
      if (matchingShortcut.action) {
        matchingShortcut.action();
      }
    }

    // Handle escape key
    if (event.key === 'Escape' && isShortcutsOpen) {
      setIsShortcutsOpen(false);
    }
  }, [isShortcutsOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    isShortcutsOpen,
    setIsShortcutsOpen,
    shortcuts
  };
}

// Component to show shortcut hints
export function ShortcutHint({ 
  shortcut, 
  className = '' 
}: { 
  shortcut: string[]; 
  className?: string; 
}) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <KeyCombination combination={shortcut} />
    </div>
  );
}