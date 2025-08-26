// Utility functions for lazy loading viem operations
// This prevents loading unnecessary chain definitions and reduces file handles

import type { Chain } from 'viem';

// Lazy load chain definitions only when needed
export const getChainLazy = async (chainId: number): Promise<Chain | null> => {
  try {
    // Only import the specific chain when needed
    const { mainnet, polygon, arbitrum, fantomTestnet } = await import('viem/chains');
    
    const chainMap: Record<number, Chain> = {
      1: mainnet,
      137: polygon,
      42161: arbitrum,
      4002: fantomTestnet,
    };
    
    return chainMap[chainId] || null;
  } catch (error) {
    console.error('Failed to load chain:', error);
    return null;
  }
};

// Lazy load viem clients only when needed
export const createClientLazy = async (chainId: number) => {
  try {
    const chain = await getChainLazy(chainId);
    if (!chain) return null;
    
    const { createPublicClient, http } = await import('viem');
    return createPublicClient({
      chain,
      transport: http(),
    });
  } catch (error) {
    console.error('Failed to create client:', error);
    return null;
  }
};

// Cache for chain configurations to avoid repeated imports
const chainCache = new Map<number, Chain>();

export const getChainCached = async (chainId: number): Promise<Chain | null> => {
  if (chainCache.has(chainId)) {
    return chainCache.get(chainId)!;
  }
  
  const chain = await getChainLazy(chainId);
  if (chain) {
    chainCache.set(chainId, chain);
  }
  
  return chain;
};
