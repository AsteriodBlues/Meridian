'use client';

import React from 'react';
import AccessibilityProvider from './AccessibilityProvider';
import ErrorBoundary from './ErrorBoundary';
import KeyboardShortcuts, { useKeyboardShortcuts } from '../ui/KeyboardShortcuts';

function KeyboardShortcutsWrapper({ children }: { children: React.ReactNode }) {
  const { isShortcutsOpen, setIsShortcutsOpen } = useKeyboardShortcuts();

  return (
    <>
      {children}
      <KeyboardShortcuts
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      enableRetry={true}
      maxRetries={3}
      showReportButton={true}
      onError={(error, errorInfo) => {
        console.error('Application error:', error, errorInfo);
        // Here you could send to your error reporting service
      }}
    >
      <AccessibilityProvider>
        <KeyboardShortcutsWrapper>
          <main id="main-content" role="main" tabIndex={-1}>
            {children}
          </main>
        </KeyboardShortcutsWrapper>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}