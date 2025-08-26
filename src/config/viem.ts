// Optimized viem configuration to prevent EMFILE errors
// Only import specific chains and utilities instead of entire packages

import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { fantomTestnet } from 'viem/chains';

// Only import the specific chain we use instead of all chain definitions
export const supportedChains = [fantomTestnet] as const;

// Create optimized public client with minimal configuration
export const createOptimizedPublicClient = () => {
  return createPublicClient({
    chain: fantomTestnet,
    transport: http(),
  });
};

// Create optimized wallet client
export const createOptimizedWalletClient = () => {
  return createWalletClient({
    chain: fantomTestnet,
    transport: custom(window.ethereum),
  });
};

// Export only what we need
export { fantomTestnet };
export type { PublicClient, WalletClient } from 'viem';
