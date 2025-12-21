import { coursePaymentVaultAbi } from '@/abis/coursePaymentVault';
import { usdcAbi } from '@/abis/usdc';
import { useQuery } from '@tanstack/react-query';
import { useEthersSigner } from './useEthersSigner';
import { ethers, Contract } from 'ethers';
import { base } from '@/config/viem';
import { mintNFTAbi } from '@/abis/mintNFT';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';

// Optimized RPC provider using specific chain import - memoized to prevent recreation
let simpleRpcProviderInstance: ethers.providers.JsonRpcProvider | null = null;

export const getSimpleRpcProvider = () => {
  if (!simpleRpcProviderInstance) {
    simpleRpcProviderInstance = new ethers.providers.JsonRpcProvider(
      base.rpcUrls.default.http[0]
    );
  }
  return simpleRpcProviderInstance;
};

// Export for backward compatibility
export const simpleRpcProvider = getSimpleRpcProvider();

export const useContract = (
  address: string | undefined,
  ABI: any
): Contract | null => {
  const signer = useEthersSigner();
  const { address: accountAddress } = useAccount();
  const simpleRpcProvider = getSimpleRpcProvider();

  // Use account address instead of signer object to prevent unnecessary re-creation
  const signerAddress = useMemo(() => {
    return signer ? accountAddress : null;
  }, [signer, accountAddress]);

  const { data } = useQuery<Contract | null>({
    queryKey: ['contract', address, ABI, signerAddress],
    queryFn: () => {
      if (!address || !ABI || !simpleRpcProvider) {
        return null;
      }

      try {
        const library = signer ?? simpleRpcProvider;
        return new Contract(address, ABI, library);
      } catch (error) {
        console.error('Failed To Get Contract', error);
        return null;
      }
    },
    enabled: !!address && !!ABI && !!simpleRpcProvider,
    staleTime: 1000 * 60 * 5, // 5 minutes - prevent unnecessary refetches
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return data || null;
};

export const getUSDCContract = (address: string) =>
  useContract(address, usdcAbi);

export const getVaultContract = (address: string) =>
  useContract(address, coursePaymentVaultAbi);

export const getMintNFTContract = (address: string) =>
  useContract(address, mintNFTAbi);
