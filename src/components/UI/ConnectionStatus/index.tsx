import React from 'react';
import { useMobileWalletConnection } from '@/hooks/useMobileWalletConnection';
import { isMobile, isMetaMaskInAppBrowser } from '@/utils/mobileDetection';
import Text from '../Text';

const ConnectionStatus: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    address,
    chainId,
    connectionMethod,
    isMobileDevice,
  } = useMobileWalletConnection();

  if (!isConnected && !isConnecting) return null;

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusColor = () => {
    if (isConnecting) return 'text-yellow-400';
    if (isConnected) return 'text-green-400';
    return 'text-red-400';
  };

  const getConnectionInfo = () => {
    if (!isConnected) return null;

    return (
      <div className="text-xs text-gray-400 space-y-1">
        <div>
          Address: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <div>Chain ID: {chainId}</div>
        <div>
          Method:{' '}
          {connectionMethod === 'walletConnect' ? 'WalletConnect' : 'Injected'}
        </div>
        {isMobileDevice && (
          <div className="text-blue-400">
            {isMetaMaskInAppBrowser()
              ? 'MetaMask In-App Browser'
              : 'Mobile Browser (WalletConnect)'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg z-50 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <Text className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </Text>
        <div
          className={`w-2 h-2 rounded-full ${
            isConnecting
              ? 'bg-yellow-400'
              : isConnected
              ? 'bg-green-400'
              : 'bg-red-400'
          }`}
        />
      </div>

      {getConnectionInfo()}

      {isMobileDevice && !isMetaMaskInAppBrowser() && (
        <div className="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-400">
          💡 Using WalletConnect for optimal mobile experience
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
