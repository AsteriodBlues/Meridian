'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TimeTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  particles: string;
}

interface ThemeContextType {
  currentTheme: TimeTheme;
  timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night';
  isTransitioning: boolean;
}

const themes: Record<string, TimeTheme> = {
  dawn: {
    name: 'Dawn Serenity',
    primary: 'hsla(15, 80%, 60%, 0.9)',      // Soft orange
    secondary: 'hsla(45, 70%, 70%, 0.8)',    // Warm yellow
    accent: 'hsla(200, 60%, 80%, 0.7)',      // Light blue
    background: 'linear-gradient(135deg, hsla(15, 40%, 15%, 0.95), hsla(200, 30%, 10%, 0.98))',
    text: 'hsla(30, 20%, 90%, 0.95)',
    particles: 'hsla(25, 70%, 65%, 0.6)'
  },
  morning: {
    name: 'Morning Clarity',
    primary: 'hsla(200, 85%, 65%, 0.9)',     // Bright blue
    secondary: 'hsla(45, 85%, 75%, 0.8)',    // Golden yellow
    accent: 'hsla(120, 60%, 70%, 0.7)',      // Fresh green
    background: 'linear-gradient(135deg, hsla(200, 50%, 20%, 0.95), hsla(45, 40%, 15%, 0.98))',
    text: 'hsla(200, 15%, 95%, 0.95)',
    particles: 'hsla(200, 80%, 70%, 0.6)'
  },
  afternoon: {
    name: 'Afternoon Energy',
    primary: 'hsla(280, 80%, 65%, 0.9)',     // Vibrant purple
    secondary: 'hsla(320, 70%, 70%, 0.8)',   // Magenta
    accent: 'hsla(180, 60%, 75%, 0.7)',      // Cyan
    background: 'linear-gradient(135deg, hsla(280, 40%, 18%, 0.95), hsla(320, 35%, 12%, 0.98))',
    text: 'hsla(280, 10%, 95%, 0.95)',
    particles: 'hsla(300, 75%, 70%, 0.6)'
  },
  dusk: {
    name: 'Dusk Romance',
    primary: 'hsla(330, 75%, 65%, 0.9)',     // Pink-purple
    secondary: 'hsla(25, 80%, 70%, 0.8)',    // Warm orange
    accent: 'hsla(250, 70%, 75%, 0.7)',      // Lavender
    background: 'linear-gradient(135deg, hsla(330, 45%, 16%, 0.95), hsla(25, 40%, 12%, 0.98))',
    text: 'hsla(330, 15%, 92%, 0.95)',
    particles: 'hsla(340, 70%, 68%, 0.6)'
  },
  night: {
    name: 'Night Mystery',
    primary: 'hsla(240, 90%, 70%, 0.9)',     // Deep blue
    secondary: 'hsla(280, 80%, 65%, 0.8)',   // Purple
    accent: 'hsla(180, 70%, 80%, 0.7)',      // Light cyan
    background: 'linear-gradient(135deg, hsla(240, 60%, 8%, 0.98), hsla(280, 50%, 5%, 0.99))',
    text: 'hsla(240, 20%, 95%, 0.95)',
    particles: 'hsla(260, 85%, 72%, 0.6)'
  }
};

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes.night,
  timeOfDay: 'night',
  isTransitioning: false
});

export const useTheme = () => useContext(ThemeContext);

export function DynamicThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<TimeTheme>(themes.night);
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night'>('night');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 12) return 'morning';  
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  };

  const updateTheme = () => {
    const newTimeOfDay = getTimeOfDay();
    if (newTimeOfDay !== timeOfDay) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setTimeOfDay(newTimeOfDay);
        setCurrentTheme(themes[newTimeOfDay]);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
      }, 500);
    }
  };

  useEffect(() => {
    // Initial theme setup
    const initialTimeOfDay = getTimeOfDay();
    setTimeOfDay(initialTimeOfDay);
    setCurrentTheme(themes[initialTimeOfDay]);

    // Update theme every minute
    const interval = setInterval(updateTheme, 60000);
    
    return () => clearInterval(interval);
  }, [timeOfDay]);

  // Apply CSS custom properties for theme
  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--theme-primary', currentTheme.primary);
    root.style.setProperty('--theme-secondary', currentTheme.secondary);
    root.style.setProperty('--theme-accent', currentTheme.accent);
    root.style.setProperty('--theme-background', currentTheme.background);
    root.style.setProperty('--theme-text', currentTheme.text);
    root.style.setProperty('--theme-particles', currentTheme.particles);
    
    // Add theme class to body
    document.body.className = `theme-${timeOfDay} ${isTransitioning ? 'theme-transitioning' : ''}`;
  }, [currentTheme, timeOfDay, isTransitioning]);

  return (
    <ThemeContext.Provider value={{ currentTheme, timeOfDay, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Theme-aware components
export const ThemedBackground = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const { currentTheme } = useTheme();
  
  return (
    <div 
      className={`min-h-screen transition-all duration-1000 ease-in-out ${className}`}
      style={{ background: currentTheme.background }}
    >
      {children}
    </div>
  );
};

export const ThemedText = ({ 
  children, 
  className = '', 
  variant = 'primary' 
}: { 
  children: ReactNode; 
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent';
}) => {
  const { currentTheme } = useTheme();
  
  const color = variant === 'primary' ? currentTheme.primary :
               variant === 'secondary' ? currentTheme.secondary :
               currentTheme.accent;
  
  return (
    <span 
      className={`transition-colors duration-1000 ease-in-out ${className}`}
      style={{ color }}
    >
      {children}
    </span>
  );
};

export const ThemedGradient = ({ 
  className = '',
  direction = '135deg'
}: { 
  className?: string;
  direction?: string;
}) => {
  const { currentTheme } = useTheme();
  
  return (
    <div 
      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${className}`}
      style={{
        background: `linear-gradient(${direction}, ${currentTheme.primary}, ${currentTheme.secondary})`
      }}
    />
  );
};