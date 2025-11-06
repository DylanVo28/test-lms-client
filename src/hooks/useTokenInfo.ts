import { BIG_TEN } from '@/utils/bigNumber';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { getUSDCContract } from './useContract';
import { CONTRACT_ADDRESS } from '@/api/constant';
import { useQuery } from '@tanstack/react-query';

export const useTokenInfo = () => {
  const { address } = useAccount();
  const usdcContract = getUSDCContract(CONTRACT_ADDRESS.USDC_ADDRESS);

  // Use React Query for caching and preventing duplicate calls
  const { data: balanceData } = useQuery({
    queryKey: ['tokenBalance', CONTRACT_ADDRESS.USDC_ADDRESS, address],
    queryFn: async () => {
      if (!usdcContract || !address) return null;
      try {
        const balance = await usdcContract.balanceOf(address);
        return balance;
      } catch (error) {
        console.error('Error fetching balance:', error);
        return null;
      }
    },
    enabled: !!usdcContract && !!address,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const { data: tokenInfo } = useQuery({
    queryKey: ['tokenInfo', CONTRACT_ADDRESS.USDC_ADDRESS],
    queryFn: async () => {
      if (!usdcContract) return null;
      try {
        const [symbol, decimals] = await Promise.all([
          usdcContract.symbol(),
          usdcContract.decimals(),
        ]);
        return { symbol, decimals };
      } catch (error) {
        console.error('Error fetching token info:', error);
        return null;
      }
    },
    enabled: !!usdcContract,
    staleTime: 1000 * 60 * 10, // 10 minutes - token info rarely changes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const formattedBalance = useMemo(() => {
    if (!balanceData || !tokenInfo?.decimals) return '0';
    return new BigNumber(balanceData.toString())
      .dividedBy(BIG_TEN.pow(tokenInfo.decimals))
      .toFixed();
  }, [balanceData, tokenInfo?.decimals]);

  return {
    balance: formattedBalance,
    symbol: tokenInfo?.symbol || '',
    decimals: tokenInfo?.decimals || 0,
  };
};
