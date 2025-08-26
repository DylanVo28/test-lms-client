import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Error boundary specifically for viem operations
// This prevents viem-related errors from crashing the entire app
export class ViemErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('ViemErrorBoundary caught an error:', error, errorInfo);

    // Check if it's a viem-related error
    if (error.message.includes('EMFILE') || error.message.includes('viem')) {
      console.warn('Viem operation failed, attempting recovery...');

      // Try to recover by clearing any cached state
      if (typeof window !== 'undefined') {
        // Clear any cached chain configurations
        if (window.__VIEM_CACHE__) {
          delete window.__VIEM_CACHE__;
        }
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI for viem errors
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium mb-2">
            Wallet Connection Error
          </h3>
          <p className="text-red-600 text-sm mb-3">
            There was an issue with the wallet connection. Please try refreshing
            the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
