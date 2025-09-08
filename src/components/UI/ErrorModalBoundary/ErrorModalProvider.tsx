import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type ErrorModalContextValue = {
  open: (error: Error) => void;
  close: () => void;
};

const ErrorModalContext = createContext<ErrorModalContextValue | undefined>(
  undefined
);

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

function ErrorModal({ error, onClose }: { error: Error; onClose: () => void }) {
  const friendly = getFriendlyMessage(error);
  const details = error?.message || '';
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
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
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="w-1/2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<Error | null>(null);

  const open = useCallback((e: Error) => setError(e), []);
  const close = useCallback(() => setError(null), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ErrorModalContext.Provider value={value}>
      {children}
      {error && <ErrorModal error={error} onClose={close} />}
    </ErrorModalContext.Provider>
  );
}

export function useErrorModal() {
  const ctx = useContext(ErrorModalContext);
  if (!ctx)
    throw new Error('useErrorModal must be used within ErrorModalProvider');
  return ctx;
}
