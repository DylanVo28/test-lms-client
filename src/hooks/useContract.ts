import { coursePaymentVaultAbi } from '@/abis/coursePaymentVault';
import { usdcAbi } from '@/abis/usdc';
import { Contract } from '@ethersproject/contracts';
import { useMemo } from 'react';
import { useEthersSigner } from './useEthersSigner';
import { ethers } from 'ethers';
import { fantomTestnet } from 'wagmi/chains';
import { mintNFTAbi } from '@/abis/mintNFT';

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(
  fantomTestnet.rpcUrls.default.http[0]
);

export const useContract = (
  address: string | undefined,
  ABI: any
): Contract | null => {
  const signer = useEthersSigner();

  return useMemo(() => {
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
  }, [address, ABI, signer, simpleRpcProvider]);
};

export const getUSDCContract = (address: string) =>
  useContract(address, usdcAbi);

export const getVaultContract = (address: string) =>
  useContract(address, coursePaymentVaultAbi);

export const getMintNFTContract = (address: string) =>
  useContract(address, mintNFTAbi);
