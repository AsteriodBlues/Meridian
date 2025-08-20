'use client';

import { useEffect } from 'react';

export default function HydrationFix() {
  useEffect(() => {
    // More comprehensive hydration warning suppression
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Override console.error
    console.error = (...args) => {
      const errorMessage = args[0]?.toString() || '';
      
      // Suppress all hydration-related warnings
      if (
        errorMessage.includes('hydrated but some attributes') ||
        errorMessage.includes('data-darkreader') ||
        errorMessage.includes('browser extension') ||
        errorMessage.includes('Hydration failed') ||
        errorMessage.includes('server rendered HTML') ||
        errorMessage.includes('client properties')
      ) {
        return;
      }
      
      originalConsoleError.apply(console, args);
    };

    // Override console.warn as well
    console.warn = (...args) => {
      const warnMessage = args[0]?.toString() || '';
      
      if (
        warnMessage.includes('hydrated but some attributes') ||
        warnMessage.includes('data-darkreader') ||
        warnMessage.includes('Hydration failed')
      ) {
        return;
      }
      
      originalConsoleWarn.apply(console, args);
    };

    // Also override window.onerror for React's internal errors
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      const errorStr = message?.toString() || '';
      
      if (
        errorStr.includes('hydrated but some attributes') ||
        errorStr.includes('data-darkreader') ||
        errorStr.includes('Hydration failed')
      ) {
        return true; // Prevent default handling
      }
      
      if (originalOnError) {
        return originalOnError.call(window, message, source, lineno, colno, error);
      }
      return false;
    };

    // Cleanup on unmount
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.onerror = originalOnError;
    };
  }, []);

  return null;
}