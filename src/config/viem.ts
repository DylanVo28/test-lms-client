// Optimized viem configuration to prevent EMFILE errors
// Only import specific chains and utilities instead of entire packages

import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

// Only import the specific chain we use instead of all chain definitions
export const supportedChains = [base] as const;

// Create optimized public client with minimal configuration
export const createOptimizedPublicClient = () => {
  return createPublicClient({
    chain: base,
    transport: http(),
  });
};

// Create optimized wallet client
export const createOptimizedWalletClient = () => {
  return createWalletClient({
    chain: base,
    transport: custom(window.ethereum),
  });
};

// Export only what we need
export { base };
export type { PublicClient, WalletClient } from 'viem';
