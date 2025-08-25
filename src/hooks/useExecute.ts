import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { getUSDCContract, getVaultContract } from './useContract';
import { calculateGasMargin } from '@/utils/common';
import { BIG_TEN } from '@/utils/bigNumber';

export const USDC_ADDRESS = '0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F';
export const VAULT_ADDRESS = '0xF1Ecbe1Cbc767fd074ccDD0A4c22B3Cc4adedA70';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const parseAmount = (amount: string | number) => {
  return BigNumber(amount).multipliedBy(BIG_TEN.pow(18)).toFixed(0);
};
export const useUSDCOperations = () => {
  const [loading, setLoading] = useState(false);

  const vaultContract = getVaultContract(VAULT_ADDRESS);
  const usdcContract = getUSDCContract(USDC_ADDRESS);

  const approveUSDC = useCallback(
    async (spender: string, amount: string | number) => {
      if (!usdcContract) {
        console.error('USDC contract not initialized');
        return;
      }
      try {
        setLoading(true);
        const estimatedGas = await usdcContract.estimateGas.approve(
          spender,
          parseAmount(amount)
        );
        const tx = await usdcContract.approve(spender, parseAmount(amount), {
          gasLimit: calculateGasMargin(estimatedGas),
        });
        await tx.wait();
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [usdcContract]
  );

  const buyCourse = useCallback(
    async (
      courseId: string,
      amount: BigNumber,
      kolAddress: string,
      signature: string
    ) => {
      if (!vaultContract) {
        console.error('Vault contract not initialized');
        return;
      }
      try {
        setLoading(true);
        const estimatedGas = await vaultContract.estimateGas.pay(
          courseId,
          amount,
          kolAddress,
          signature
        );

        console.log('estimatedGas:::', estimatedGas);
        const tx = await vaultContract.pay(
          courseId,
          amount,
          kolAddress,
          signature,
          {
            gasLimit: calculateGasMargin(estimatedGas),
          }
        );
        await tx.wait();
        return tx.hash;
      } catch (error) {
        console.log('Transfer failed:', error);
      } finally {
        setLoading(false);
      }
    },
    [vaultContract]
  );

  const withdraw = useCallback(async () => {
    if (!vaultContract) {
      console.error('Vault contract not initialized');
      return;
    }
    try {
      const estimatedGas = await vaultContract.estimateGas.withdraw();
      const tx = await vaultContract.withdraw({
        gasLimit: calculateGasMargin(estimatedGas),
      });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [vaultContract]);

  const execute = useCallback(async () => {
    if (!vaultContract) {
      console.error('Vault contract not initialized');
      return;
    }
    try {
      setLoading(true);
      const estimatedGas = await vaultContract.estimateGas.execute();
      const tx = await vaultContract.execute({
        gasLimit: calculateGasMargin(estimatedGas),
      });
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [vaultContract]);

  const isTxIdUsed = useCallback(
    async (txId: string) => {
      if (!vaultContract) {
        console.error('Vault contract not initialized');
        return;
      }
      try {
        const isUsed = await vaultContract.isTxIdUsed(txId);
        return isUsed;
      } catch (error) {
        console.error('Error checking transaction ID:', error);
      }
    },
    [vaultContract]
  );

  return { approveUSDC, buyCourse, loading, withdraw, execute, isTxIdUsed };
};
