import { coursePaymentVaultAbi } from '@/abis/coursePaymentVault';
import { usdcAbi } from '@/abis/usdc';
import { BrowserProvider, Contract } from 'ethers';

import { useEffect, useState } from 'react';

const getProvider = () => new BrowserProvider(window.ethereum);

export const useContract = (
  address: string | undefined,
  ABI: any
): Contract | null => {
  const [contract, setContract] = useState<Contract | null>(null);
  const provider = getProvider();

  useEffect(() => {
    const loadContract = async () => {
      if (!address || !ABI) {
        setContract(null);
        return;
      }
      try {
        const signer = await provider.getSigner();
        setContract(new Contract(address, ABI, signer));
      } catch (error) {
        console.error('Failed to get contract', error);
        setContract(null);
      }
    };

    loadContract();
  }, [address, ABI, provider]);

  return contract;
};

export const getUSDCContract = (address: string) =>
  useContract(address, usdcAbi);

export const getVaultContract = (address: string) =>
  useContract(address, coursePaymentVaultAbi);
