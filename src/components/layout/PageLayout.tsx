'use client';

import { ReactNode } from 'react';
import EnhancedNavigation from '@/components/navigation/EnhancedNavigation';
import { PageTransitionProvider, PageWrapper } from '@/components/navigation/PageTransitions';
import { DynamicThemeProvider } from '@/components/theme/DynamicTheme';

interface PageLayoutProps {
  children: ReactNode;
  showHero?: boolean;
  className?: string;
}

export default function PageLayout({ 
  children, 
  showHero = false, 
  className = '' 
}: PageLayoutProps) {
  return (
    <PageTransitionProvider>
      <DynamicThemeProvider>
        <PageWrapper>
          <div className={`min-h-screen bg-gradient-to-br from-black via-gray-900 to-black ${className}`}>
            <EnhancedNavigation />
            
            {/* Content with proper top spacing to account for fixed header */}
            <div className={showHero ? '' : 'pt-20'}>
              {children}
            </div>
          </div>
        </PageWrapper>
      </DynamicThemeProvider>
    </PageTransitionProvider>
  );
}