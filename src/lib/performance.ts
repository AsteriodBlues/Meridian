'use client';

import { ComponentType, lazy, LazyExoticComponent } from 'react';

// Code splitting utility with loading states
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ComponentType
): LazyExoticComponent<T> {
  return lazy(importFunc);
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();
  
  static startMeasure(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`);
    }
  }
  
  static endMeasure(name: string): number {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);
      
      const entries = window.performance.getEntriesByName(name, 'measure');
      if (entries.length > 0) {
        const duration = entries[entries.length - 1].duration;
        this.metrics.set(name, duration);
        return duration;
      }
    }
    return 0;
  }
  
  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
  
  static logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.table(this.getMetrics());
    }
  }
}

// WebAssembly loader utility
export class WasmLoader {
  private static cache: Map<string, WebAssembly.Module> = new Map();
  
  static async loadModule(wasmPath: string): Promise<WebAssembly.Module> {
    if (this.cache.has(wasmPath)) {
      return this.cache.get(wasmPath)!;
    }
    
    const wasmModule = await WebAssembly.compileStreaming(fetch(wasmPath));
    this.cache.set(wasmPath, wasmModule);
    return wasmModule;
  }
  
  static async instantiate(
    module: WebAssembly.Module, 
    imports?: WebAssembly.Imports
  ): Promise<WebAssembly.Instance> {
    return await WebAssembly.instantiate(module, imports);
  }
}

// GPU acceleration utilities
export class GPUAcceleration {
  private static canvas: HTMLCanvasElement | null = null;
  private static gl: WebGL2RenderingContext | null = null;
  
  static initializeWebGL(): WebGL2RenderingContext | null {
    if (typeof window === 'undefined') return null;
    
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.style.display = 'none';
      document.body.appendChild(this.canvas);
    }
    
    if (!this.gl) {
      this.gl = this.canvas.getContext('webgl2');
    }
    
    return this.gl;
  }
  
  static isWebGLSupported(): boolean {
    return this.initializeWebGL() !== null;
  }
  
  static enableHardwareAcceleration(element: HTMLElement): void {
    if (typeof window === 'undefined') return;
    
    element.style.willChange = 'transform, opacity';
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
  }
  
  static disableHardwareAcceleration(element: HTMLElement): void {
    if (typeof window === 'undefined') return;
    
    element.style.willChange = 'auto';
    element.style.transform = '';
    element.style.backfaceVisibility = '';
  }
}

// Viewport optimization for animations
export class ViewportOptimizer {
  private static observer: IntersectionObserver | null = null;
  private static animationCallbacks: Map<Element, () => void> = new Map();
  
  static initializeObserver(): void {
    if (typeof window === 'undefined' || this.observer) return;
    
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = this.animationCallbacks.get(entry.target);
          if (callback) {
            if (entry.isIntersecting) {
              callback();
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );
  }
  
  static observeElement(element: Element, animationCallback: () => void): void {
    this.initializeObserver();
    
    if (this.observer) {
      this.animationCallbacks.set(element, animationCallback);
      this.observer.observe(element);
    }
  }
  
  static unobserveElement(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
      this.animationCallbacks.delete(element);
    }
  }
}

// Image optimization utilities
export interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1f2937');
  gradient.addColorStop(0.5, '#374151');
  gradient.addColorStop(1, '#4b5563');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

// Bundle analyzer utility
export class BundleAnalyzer {
  static logChunkSizes(): void {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;
    
    const chunks = document.querySelectorAll('script[src*="chunks"]');
    console.group('📦 Bundle Analysis');
    
    chunks.forEach((script) => {
      const src = (script as HTMLScriptElement).src;
      const filename = src.split('/').pop();
      console.log(`📄 ${filename}`);
    });
    
    console.groupEnd();
  }
}