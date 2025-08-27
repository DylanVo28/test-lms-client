import { useEffect, useCallback, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { 
  saveConnectionState, 
  getConnectionState, 
  clearConnectionState,
  updateConnectionTimestamp 
} from '@/utils/connectionPersistence';
import { 
  isMobile, 
  isMetaMaskInAppBrowser, 
  getOptimalConnectionMethod 
} from '@/utils/mobileDetection';

interface UseMobileWalletConnectionReturn {
  isConnecting: boolean;
  isConnected: boolean;
  address: string | undefined;
  chainId: number | undefined;
  connect: () => Promise<void>;
  disconnect: () => void;
  autoReconnect: () => Promise<void>;
  connectionMethod: 'injected' | 'walletConnect' | 'both';
  isMobileDevice: boolean;
}

export const useMobileWalletConnection = (): UseMobileWalletConnectionReturn => {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const chainId = useChainId();
  
  const [connectionMethod] = useState(getOptimalConnectionMethod());
  const [isMobileDevice] = useState(isMobile());

  const saveCurrentConnection = useCallback(() => {
    if (address && chainId) {
      saveConnectionState({
        address,
        chainId,
        connector: connectionMethod,
      });
    }
  }, [address, chainId, connectionMethod]);

  const clearCurrentConnection = useCallback(() => {
    clearConnectionState();
  }, []);

  const autoReconnect = useCallback(async () => {
    if (isConnected) return;

    const savedState = getConnectionState();
    if (!savedState) return;

    try {
      const connector = connectors.find(c => 
        c.id === (savedState.connector === 'walletConnect' ? 'walletConnect' : 'injected')
      );

      if (connector) {
        await connect({ connector });
      }
    } catch (error) {
      console.warn('Auto-reconnection failed:', error);
      clearCurrentConnection();
    }
  }, [isConnected, connectors, connect, clearCurrentConnection]);

  const connectWallet = useCallback(async () => {
    try {
      let connector;
      
      if (isMobileDevice && !isMetaMaskInAppBrowser()) {
        connector = connectors.find(c => c.id === 'walletConnect');
      } else {
        connector = connectors.find(c => c.id === 'injected');
      }

      if (!connector) {
        throw new Error('No suitable connector found');
      }

      await connect({ connector });
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }, [isMobileDevice, connectors, connect]);

  const disconnectWallet = useCallback(() => {
    wagmiDisconnect();
    clearCurrentConnection();
  }, [wagmiDisconnect, clearCurrentConnection]);

  useEffect(() => {
    if (isConnected && address && chainId) {
      saveCurrentConnection();
    }
  }, [isConnected, address, chainId, saveCurrentConnection]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isConnected) {
        autoReconnect();
      }
    };

    const handleFocus = () => {
      if (!isConnected) {
        autoReconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isConnected, autoReconnect]);

  useEffect(() => {
    if (!isConnected) {
      autoReconnect();
    }
  }, [isConnected, autoReconnect]);

  return {
    isConnecting,
    isConnected,
    address,
    chainId,
    connect: connectWallet,
    disconnect: disconnectWallet,
    autoReconnect,
    connectionMethod,
    isMobileDevice,
  };
};
