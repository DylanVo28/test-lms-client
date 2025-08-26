// Production-ready viem client factory with caching and error handling
// This prevents EMFILE errors by managing file handles efficiently

import type { PublicClient, WalletClient, Chain } from 'viem';

interface ClientCache {
  public: Map<number, PublicClient>;
  wallet: Map<number, WalletClient>;
  chains: Map<number, Chain>;
}

// Global cache for clients and chains
const clientCache: ClientCache = {
  public: new Map(),
  wallet: new Map(),
  chains: new Map(),
};

// Supported chain IDs for this application
const SUPPORTED_CHAIN_IDS = [1, 137, 42161, 4002] as const;

// Lazy load chain definitions with error handling
const loadChain = async (chainId: number): Promise<Chain | null> => {
  try {
    // Check cache first
    if (clientCache.chains.has(chainId)) {
      return clientCache.chains.get(chainId)!;
    }

    // Only import specific chains to prevent EMFILE errors
    const { mainnet, polygon, arbitrum, fantomTestnet } = await import('viem/chains');
    
    const chainMap: Record<number, Chain> = {
      1: mainnet,
      137: polygon,
      42161: arbitrum,
      4002: fantomTestnet,
    };
    
    const chain = chainMap[chainId];
    if (chain) {
      clientCache.chains.set(chainId, chain);
      return chain;
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to load chain ${chainId}:`, error);
    return null;
  }
};

// Create public client with caching
export const createPublicClient = async (chainId: number): Promise<PublicClient | null> => {
  try {
    // Check cache first
    if (clientCache.public.has(chainId)) {
      return clientCache.public.get(chainId)!;
    }

    const chain = await loadChain(chainId);
    if (!chain) return null;

    // Lazy import viem functions
    const { createPublicClient: createClient, http } = await import('viem');
    
    const client = createClient({
      chain,
      transport: http(),
    });

    // Cache the client
    clientCache.public.set(chainId, client);
    return client;
  } catch (error) {
    console.error(`Failed to create public client for chain ${chainId}:`, error);
    return null;
  }
};

// Create wallet client with caching
export const createWalletClient = async (chainId: number): Promise<WalletClient | null> => {
  try {
    // Check cache first
    if (clientCache.wallet.has(chainId)) {
      return clientCache.wallet.get(chainId)!;
    }

    const chain = await loadChain(chainId);
    if (!chain) return null;

    // Check if window.ethereum exists
    if (typeof window === 'undefined' || !window.ethereum) {
      console.warn('Window ethereum not available');
      return null;
    }

    // Lazy import viem functions
    const { createWalletClient: createClient, custom } = await import('viem');
    
    const client = createClient({
      chain,
      transport: custom(window.ethereum),
    });

    // Cache the client
    clientCache.wallet.set(chainId, client);
    return client;
  } catch (error) {
    console.error(`Failed to create wallet client for chain ${chainId}:`, error);
    return null;
  }
};

// Get cached client or create new one
export const getOrCreatePublicClient = async (chainId: number): Promise<PublicClient | null> => {
  if (clientCache.public.has(chainId)) {
    return clientCache.public.get(chainId)!;
  }
  return createPublicClient(chainId);
};

export const getOrCreateWalletClient = async (chainId: number): Promise<WalletClient | null> => {
  if (clientCache.wallet.has(chainId)) {
    return clientCache.wallet.get(chainId)!;
  }
  return createWalletClient(chainId);
};

// Clear cache for specific chain or all chains
export const clearCache = (chainId?: number) => {
  if (chainId) {
    clientCache.public.delete(chainId);
    clientCache.wallet.delete(chainId);
    clientCache.chains.delete(chainId);
  } else {
    clientCache.public.clear();
    clientCache.wallet.clear();
    clientCache.chains.clear();
  }
};

// Get all supported chain IDs
export const getSupportedChainIds = () => SUPPORTED_CHAIN_IDS;

// Check if chain is supported
export const isChainSupported = (chainId: number): boolean => {
  return SUPPORTED_CHAIN_IDS.includes(chainId as any);
};
