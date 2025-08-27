import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { fantomTestnet } from './viem';
import {
  shouldUseWalletConnect,
  shouldUseInjected,
} from '@/utils/mobileDetection';

export const createWagmiConfig = () => {
  const projectId =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

  const config = getDefaultConfig({
    appName: 'What Exchange',
    projectId,
    chains: [fantomTestnet],
    ssr: false,
  });

  return config;
};

export const getPreferredConnector = () => {
  if (shouldUseWalletConnect()) {
    return 'walletConnect';
  }
  if (shouldUseInjected()) {
    return 'injected';
  }
  return 'walletConnect';
};

export const getConnectorOptions = () => {
  const isMobile = shouldUseWalletConnect();

  return {
    walletConnect: {
      showQrModal: isMobile,
      qrModalOptions: {
        themeMode: 'dark' as const,
        themeVariables: {
          '--w3m-accent-color': '#02A6C2',
          '--w3m-background-color': '#1a1a1a',
          '--w3m-overlay-background-color': 'rgba(0, 0, 0, 0.8)',
        },
      },
    },
    injected: {
      shimDisconnect: true,
      target: 'metaMask',
    },
  };
};
