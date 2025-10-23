import { coursePaymentVaultAbi } from '@/abis/coursePaymentVault';
import { usdcAbi } from '@/abis/usdc';
import { Contract } from '@ethersproject/contracts';
import { useQuery } from '@tanstack/react-query';
import { useEthersSigner } from './useEthersSigner';
import { ethers } from 'ethers';
import { base } from '@/config/viem';
import { mintNFTAbi } from '@/abis/mintNFT';

// Optimized RPC provider using specific chain import
export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(
  base.rpcUrls.default.http[0]
);

export const useContract = (
  address: string | undefined,
  ABI: any
): Contract | null => {
  const signer = useEthersSigner();

  const { data } = useQuery<Contract | null>({
    queryKey: ['contract', address, ABI, signer],
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
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return data || null;
};

export const getUSDCContract = (address: string) =>
  useContract(address, usdcAbi);

export const getVaultContract = (address: string) =>
  useContract(address, coursePaymentVaultAbi);

export const getMintNFTContract = (address: string) =>
  useContract(address, mintNFTAbi);
