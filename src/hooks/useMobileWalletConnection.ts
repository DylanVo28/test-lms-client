import { useEffect, useCallback, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import {
  saveConnectionState,
  getConnectionState,
  clearConnectionState,
} from '@/utils/connectionPersistence';
import {
  isMobile,
  isMetaMaskInAppBrowser,
  getOptimalConnectionMethod,
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

export const useMobileWalletConnection =
  (): UseMobileWalletConnectionReturn => {
    const {
      address,
      isConnected,
      isConnecting,
      connector: currentConnector,
    } = useAccount();
    const { connect, connectAsync, connectors } = useConnect();
    const { disconnect: wagmiDisconnect } = useDisconnect();
    const chainId = useChainId();

    const [connectionMethod] = useState(getOptimalConnectionMethod());
    const [isMobileDevice] = useState(isMobile());

    const saveCurrentConnection = useCallback(() => {
      if (address && chainId) {
        const connectorId =
          currentConnector?.id === 'walletConnect'
            ? 'walletConnect'
            : 'injected';
        saveConnectionState({
          address,
          chainId,
          connector: connectorId,
        });
      }
    }, [address, chainId, currentConnector]);

    const clearCurrentConnection = useCallback(() => {
      clearConnectionState();
    }, []);

    const autoReconnect = useCallback(async () => {
      if (isConnected) return;

      const savedState = getConnectionState();
      if (!savedState) return;

      try {
        const wantedId =
          savedState.connector === 'walletConnect'
            ? 'walletConnect'
            : 'injected';
        const connector = connectors.find((c) => c.id === wantedId);

        if (connector) {
          await connectAsync({ connector });
        }
      } catch (error) {
        console.warn('Auto-reconnection failed:', error);
        clearCurrentConnection();
      }
    }, [isConnected, connectors, connectAsync, clearCurrentConnection]);

    const connectWallet = useCallback(async () => {
      try {
        let connector;

        if (isMobileDevice && !isMetaMaskInAppBrowser()) {
          connector = connectors.find((c) => c.id === 'walletConnect');
        } else {
          connector = connectors.find((c) => c.id === 'injected');
        }

        if (!connector) {
          throw new Error('No suitable connector found');
        }

        const result = await connectAsync({ connector });
        const connectedAddress = result?.accounts?.[0] || address;
        const connectedChainId = (result as any)?.chainId || chainId;
        const connectorId =
          connector.id === 'walletConnect' ? 'walletConnect' : 'injected';

        if (connectedAddress && connectedChainId) {
          saveConnectionState({
            address: connectedAddress,
            chainId: connectedChainId,
            connector: connectorId,
          });
        }
      } catch (error) {
        console.error('Connection failed:', error);
        throw error;
      }
    }, [isMobileDevice, connectors, connectAsync, address, chainId]);

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
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
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
