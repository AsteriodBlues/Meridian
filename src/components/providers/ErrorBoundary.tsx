'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  maxRetries?: number;
  showReportButton?: boolean;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Report error to monitoring service
    this.reportError(error, errorInfo);
  }

  componentWillUnmount() {
    // Clear any pending retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In a real app, you would send this to your error reporting service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: 'current_user_id', // Replace with actual user ID
        errorId: this.state.errorId
      };

      // Example: Send to monitoring service
      console.log('Error report:', errorReport);
      
      // You could send to services like Sentry, LogRocket, etc.
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    // Implement exponential backoff
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    
    const timeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
        showDetails: false
      });
    }, delay);

    this.retryTimeouts.push(timeout);
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private handleReportIssue = () => {
    const { error, errorInfo, errorId } = this.state;
    
    const issueBody = encodeURIComponent(`
**Error ID:** ${errorId}

**Error Message:** ${error?.message || 'Unknown error'}

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Additional Context:**
- Browser: ${navigator.userAgent}
- URL: ${window.location.href}
- Timestamp: ${new Date().toISOString()}

**Technical Details:**
\`\`\`
${error?.stack || 'No stack trace available'}
\`\`\`

\`\`\`
${errorInfo?.componentStack || 'No component stack available'}
\`\`\`
    `);

    const url = `https://github.com/your-repo/issues/new?title=${encodeURIComponent(`Error: ${error?.message || 'Unknown error'}`)}&body=${issueBody}`;
    window.open(url, '_blank');
  };

  private copyErrorDetails = async () => {
    const { error, errorInfo, errorId } = this.state;
    
    const errorDetails = `
Error ID: ${errorId}
Message: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace'}
Component Stack: ${errorInfo?.componentStack || 'No component stack'}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      // You could show a toast notification here
      console.log('Error details copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    const { children, fallback, enableRetry = true, maxRetries = 3, showReportButton = true } = this.props;
    const { hasError, error, errorInfo, errorId, retryCount, showDetails } = this.state;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      const canRetry = enableRetry && retryCount < maxRetries;
      const isRetrying = this.retryTimeouts.length > 0;

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <motion.div
            className="max-w-2xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-8 text-center border-b border-white/10">
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.4)',
                    '0 0 0 20px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-white mb-3">
                Oops! Something went wrong
              </h1>
              
              <p className="text-gray-400 mb-2">
                We encountered an unexpected error. Don't worry, we're on it!
              </p>
              
              <p className="text-sm text-gray-500">
                Error ID: <span className="font-mono">{errorId}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="p-8">
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                {canRetry && (
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={this.handleRetry}
                    disabled={isRetrying}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                    {isRetrying ? 'Retrying...' : `Retry (${maxRetries - retryCount} left)`}
                  </motion.button>
                )}

                <motion.button
                  className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-400 font-semibold transition-colors"
                  onClick={this.handleGoHome}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </motion.button>

                {showReportButton && (
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-400 font-semibold transition-colors"
                    onClick={this.handleReportIssue}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Bug className="w-5 h-5" />
                    Report Issue
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Error Details Toggle */}
              <div className="border-t border-white/10 pt-6">
                <motion.button
                  className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  onClick={this.toggleDetails}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-gray-400 font-medium">Technical Details</span>
                  {showDetails ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      className="mt-4 p-4 bg-black/30 rounded-xl border border-white/10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-semibold">Error Information</h4>
                        <motion.button
                          className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-gray-400 text-sm transition-colors"
                          onClick={this.copyErrorDetails}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </motion.button>
                      </div>

                      <div className="space-y-4 text-sm">
                        <div>
                          <div className="text-gray-400 mb-1">Message:</div>
                          <div className="text-red-400 font-mono text-xs p-2 bg-red-500/10 rounded border border-red-500/20">
                            {error?.message || 'Unknown error'}
                          </div>
                        </div>

                        {error?.stack && (
                          <div>
                            <div className="text-gray-400 mb-1">Stack Trace:</div>
                            <pre className="text-gray-300 font-mono text-xs p-2 bg-black/20 rounded border border-white/10 overflow-x-auto whitespace-pre-wrap">
                              {error.stack}
                            </pre>
                          </div>
                        )}

                        {errorInfo?.componentStack && (
                          <div>
                            <div className="text-gray-400 mb-1">Component Stack:</div>
                            <pre className="text-gray-300 font-mono text-xs p-2 bg-black/20 rounded border border-white/10 overflow-x-auto whitespace-pre-wrap">
                              {errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return children;
  }
}

// HOC for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryClass {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryClass>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error reporting from components
export function useErrorHandler() {
  const reportError = (error: Error, context?: string) => {
    console.error(`Error in ${context || 'component'}:`, error);
    
    // Report to monitoring service
    // This could be enhanced to integrate with services like Sentry
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('unhandledError', {
        detail: { error, context }
      }));
    }
  };

  const handleAsyncError = (asyncFn: () => Promise<any>, context?: string) => {
    return asyncFn().catch(error => {
      reportError(error, context);
      throw error; // Re-throw to allow component-level handling
    });
  };

  return { reportError, handleAsyncError };
}

export default ErrorBoundaryClass;