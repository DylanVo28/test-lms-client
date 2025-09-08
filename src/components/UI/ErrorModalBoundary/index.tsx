import React, { Component } from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function getFriendlyMessage(error?: Error) {
  const message = error?.message || '';
  if (/User rejected|denied/i.test(message))
    return 'User denied transaction signature.';
  if (/insufficient funds|balance/i.test(message))
    return 'Insufficient balance to complete payment.';
  if (/RPC endpoint not found|unavailable|network/i.test(message))
    return 'Network RPC is unavailable. Please try again.';
  return "Your payment couldn't be processed. Please check and try again.";
}

function extractDetails(error?: Error) {
  return error?.message || '';
}

function ErrorFallback({ error }: { error?: Error }) {
  const friendly = getFriendlyMessage(error);
  const details = extractDetails(error);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Payment Failed
          </h3>
          <p className="text-sm text-gray-500 mb-4">{friendly}</p>
          {details && (
            <details className="text-left mb-4">
              <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                Error details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 font-mono whitespace-pre-wrap">
                {details}
              </div>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
