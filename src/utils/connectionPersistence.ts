interface ConnectionState {
  address: string;
  chainId: number;
  connector: string;
  timestamp: number;
}

const CONNECTION_STORAGE_KEY = 'lms_wallet_connection';
const CONNECTION_EXPIRY_HOURS = 24;

export const saveConnectionState = (
  state: Omit<ConnectionState, 'timestamp'>
): void => {
  if (typeof window === 'undefined') return;

  const connectionState: ConnectionState = {
    ...state,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(
      CONNECTION_STORAGE_KEY,
      JSON.stringify(connectionState)
    );
  } catch (error) {
    console.warn('Failed to save connection state:', error);
  }
};

export const getConnectionState = (): ConnectionState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONNECTION_STORAGE_KEY);
    if (!stored) return null;

    const state: ConnectionState = JSON.parse(stored);

    const isExpired =
      Date.now() - state.timestamp > CONNECTION_EXPIRY_HOURS * 60 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem(CONNECTION_STORAGE_KEY);
      return null;
    }

    return state;
  } catch (error) {
    console.warn('Failed to get connection state:', error);
    return null;
  }
};

export const clearConnectionState = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONNECTION_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear connection state:', error);
  }
};

export const isConnectionStateValid = (state: ConnectionState): boolean => {
  const now = Date.now();
  const expiryTime = CONNECTION_EXPIRY_HOURS * 60 * 60 * 1000;

  return now - state.timestamp < expiryTime;
};

export const updateConnectionTimestamp = (): void => {
  const state = getConnectionState();
  if (state) {
    saveConnectionState({
      address: state.address,
      chainId: state.chainId,
      connector: state.connector,
    });
  }
};
