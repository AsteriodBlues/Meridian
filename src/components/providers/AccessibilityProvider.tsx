'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Type, 
  Contrast,
  MousePointer,
  Keyboard,
  Settings
} from 'lucide-react';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  announcements: boolean;
  focusIndicators: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  isAccessibilityMenuOpen: boolean;
  setIsAccessibilityMenuOpen: (open: boolean) => void;
}

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  keyboardNavigation: true,
  announcements: true,
  focusIndicators: true,
  colorBlindMode: 'none'
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

// Screen reader announcer component
function ScreenReaderAnnouncer() {
  const [announcements, setAnnouncements] = useState<Array<{ id: string; message: string; priority: 'polite' | 'assertive' }>>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const handleAnnouncement = (event: CustomEvent) => {
      const { message, priority = 'polite' } = event.detail;
      const id = `announcement-${counterRef.current++}`;
      
      setAnnouncements(prev => [...prev, { id, message, priority }]);
      
      // Remove announcement after a delay
      setTimeout(() => {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      }, 5000);
    };

    window.addEventListener('accessibility-announce' as any, handleAnnouncement);
    return () => window.removeEventListener('accessibility-announce' as any, handleAnnouncement);
  }, []);

  return (
    <>
      {/* Polite announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements
          .filter(a => a.priority === 'polite')
          .map(announcement => (
            <div key={announcement.id}>{announcement.message}</div>
          ))
        }
      </div>

      {/* Assertive announcements */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements
          .filter(a => a.priority === 'assertive')
          .map(announcement => (
            <div key={announcement.id}>{announcement.message}</div>
          ))
        }
      </div>
    </>
  );
}

// Skip to content link
function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
      onFocus={() => {
        window.dispatchEvent(new CustomEvent('accessibility-announce', {
          detail: { message: 'Skip to main content link focused. Press Enter to jump to main content.' }
        }));
      }}
    >
      Skip to main content
    </a>
  );
}

// Accessibility menu
function AccessibilityMenu({ 
  isOpen, 
  onClose, 
  settings, 
  updateSetting 
}: {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={menuRef}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            role="dialog"
            aria-labelledby="accessibility-menu-title"
            aria-describedby="accessibility-menu-description"
          >
            {/* Header */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="accessibility-menu-title" className="text-xl font-bold text-gray-900 dark:text-white">
                    Accessibility Settings
                  </h2>
                  <p id="accessibility-menu-description" className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Customize your experience for better accessibility
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  aria-label="Close accessibility settings"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Motion */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Motion & Animation</h3>
                
                <label className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Reduce motion</span>
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    aria-describedby="reduce-motion-desc"
                  />
                </label>
                <p id="reduce-motion-desc" className="text-xs text-gray-500 dark:text-gray-400">
                  Reduces animations and transitions for better comfort
                </p>
              </div>

              {/* Visual */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Visual</h3>
                
                <label className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">High contrast</span>
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => updateSetting('highContrast', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    aria-describedby="high-contrast-desc"
                  />
                </label>
                <p id="high-contrast-desc" className="text-xs text-gray-500 dark:text-gray-400">
                  Increases contrast for better visibility
                </p>

                <label className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Large text</span>
                  <input
                    type="checkbox"
                    checked={settings.largeText}
                    onChange={(e) => updateSetting('largeText', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    aria-describedby="large-text-desc"
                  />
                </label>
                <p id="large-text-desc" className="text-xs text-gray-500 dark:text-gray-400">
                  Increases font size throughout the application
                </p>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Color blind support</label>
                  <select
                    value={settings.colorBlindMode}
                    onChange={(e) => updateSetting('colorBlindMode', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    aria-describedby="colorblind-desc"
                  >
                    <option value="none">None</option>
                    <option value="protanopia">Protanopia (Red-blind)</option>
                    <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                    <option value="tritanopia">Tritanopia (Blue-blind)</option>
                  </select>
                  <p id="colorblind-desc" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Adjusts colors for different types of color blindness
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h3>
                
                <label className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Enhanced focus indicators</span>
                  <input
                    type="checkbox"
                    checked={settings.focusIndicators}
                    onChange={(e) => updateSetting('focusIndicators', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    aria-describedby="focus-desc"
                  />
                </label>
                <p id="focus-desc" className="text-xs text-gray-500 dark:text-gray-400">
                  Makes focus indicators more visible for keyboard navigation
                </p>

                <label className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Keyboard navigation</span>
                  <input
                    type="checkbox"
                    checked={settings.keyboardNavigation}
                    onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    aria-describedby="keyboard-nav-desc"
                  />
                </label>
                <p id="keyboard-nav-desc" className="text-xs text-gray-500 dark:text-gray-400">
                  Enables full keyboard navigation support
                </p>
              </div>

              {/* Screen Reader */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Screen Reader</h3>
                
                <label className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Screen reader optimizations</span>
                  <input
                    type="checkbox"
                    checked={settings.screenReader}
                    onChange={(e) => updateSetting('screenReader', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    aria-describedby="screen-reader-desc"
                  />
                </label>
                <p id="screen-reader-desc" className="text-xs text-gray-500 dark:text-gray-400">
                  Optimizes interface for screen reader users
                </p>

                <label className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Live announcements</span>
                  <input
                    type="checkbox"
                    checked={settings.announcements}
                    onChange={(e) => updateSetting('announcements', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    aria-describedby="announcements-desc"
                  />
                </label>
                <p id="announcements-desc" className="text-xs text-gray-500 dark:text-gray-400">
                  Provides audio announcements for important changes
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Apply Settings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.warn('Failed to parse accessibility settings:', error);
      }
    }

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }

    // Check for prefers-contrast
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    if (contrastQuery.matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply CSS custom properties based on settings
  useEffect(() => {
    const root = document.documentElement;

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (settings.largeText) {
      root.style.setProperty('--font-size-multiplier', '1.25');
    } else {
      root.style.removeProperty('--font-size-multiplier');
    }

    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Color blind mode
    if (settings.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${settings.colorBlindMode}`);
    } else {
      root.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia');
    }
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Announce setting change
    announce(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
  };

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (settings.announcements) {
      window.dispatchEvent(new CustomEvent('accessibility-announce', {
        detail: { message, priority }
      }));
    }
  };

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + A to open accessibility menu
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setIsAccessibilityMenuOpen(true);
        announce('Accessibility menu opened', 'assertive');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [announce]);

  const value: AccessibilityContextType = {
    settings,
    updateSetting,
    announce,
    isAccessibilityMenuOpen,
    setIsAccessibilityMenuOpen
  };

  return (
    <AccessibilityContext.Provider value={value}>
      <SkipToContent />
      <ScreenReaderAnnouncer />
      
      {children}
      
      <AccessibilityMenu
        isOpen={isAccessibilityMenuOpen}
        onClose={() => setIsAccessibilityMenuOpen(false)}
        settings={settings}
        updateSetting={updateSetting}
      />

      {/* Accessibility button (floating) */}
      <motion.button
        className="fixed bottom-4 right-4 z-40 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => setIsAccessibilityMenuOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open accessibility settings"
        title="Accessibility Settings (Alt + A)"
      >
        <Eye className="w-5 h-5" />
      </motion.button>
    </AccessibilityContext.Provider>
  );
}