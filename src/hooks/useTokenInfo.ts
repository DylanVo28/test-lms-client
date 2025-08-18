import { BIG_TEN } from '@/utils/bigNumber';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { getUSDCContract } from './useContract';
import { USDC_ADDRESS } from './useExecute';

export const useTokenInfo = () => {
  const { address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState(0);

  const usdcContract = getUSDCContract(USDC_ADDRESS);

  useEffect(() => {
    if (!usdcContract) {
      return;
    }
    const getBalance = async () => {
      const balance = await usdcContract.balanceOf(address);
      setBalance(balance);
    };

    const getTokenInfo = async () => {
      const [symbol, decimals] = await Promise.all([
        usdcContract.symbol(),
        usdcContract.decimals(),
      ]);

      setSymbol(symbol);
      setDecimals(decimals);
    };

    getBalance();
    getTokenInfo();
  }, [usdcContract, address]);

  const formattedBalance = useMemo(() => {
    return new BigNumber(balance.toString())
      .dividedBy(BIG_TEN.pow(decimals))
      .toFixed();
  }, [balance, decimals]);

  return {
    balance: formattedBalance,
    symbol,
    decimals,
  };
};
