import React, { type ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '../../ui/Button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-darkest text-brand-lightest p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel max-w-md w-full p-10 text-center flex flex-col items-center"
          >
            <AlertTriangle size={64} className="text-red-500 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
            <p className="text-neutral-400 mb-8">
              {this.state.error?.message || 'An unexpected error occurred in our system.'}
            </p>
            <Button onClick={() => window.location.reload()} fullWidth>
              <RefreshCcw size={18} className="mr-2" />
              Refresh Page
            </Button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
