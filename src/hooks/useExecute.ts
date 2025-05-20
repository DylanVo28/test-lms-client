import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { getUSDCContract, getVaultContract } from './useContract';
import { calculateGasMargin } from '@/utils/common';
import { BIG_TEN } from '@/utils/bigNumber';

const USDC_ADDRESS = '0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F';
const VAULT_ADDRESS = '0x6F6D49bBcBfBdb41851D9A7754012e56a702a2b1';

const parseAmount = (amount: string | number) => {
  return BigNumber(amount).multipliedBy(BIG_TEN.pow(18)).toFixed(0);
};

export const useUSDCOperations = () => {
  const [loading, setLoading] = useState(false);

  const usdcContract = getUSDCContract(USDC_ADDRESS);
  const vaultContract = getVaultContract(VAULT_ADDRESS);

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
        console.log('Approval tx sent:', tx.hash);
        await tx.wait();
        console.log('Approval successful');
      } catch (error) {
        console.error('Approval failed:', error);
      } finally {
        setLoading(false);
      }
    },
    [usdcContract]
  );

  const buyCourse = useCallback(
    async (courseId: string, amount: string | number) => {
      if (!vaultContract) {
        console.error('Vault contract not initialized');
        return;
      }
      try {
        setLoading(true);

        const estimatedGas = await vaultContract.estimateGas.pay(
          courseId,
          parseAmount(amount)
        );
        const tx = await vaultContract.pay(courseId, parseAmount(amount), {
          gasLimit: calculateGasMargin(estimatedGas),
        });
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

  const withdraw = useCallback(
    async (
      txId: string,
      amount: string,
      deadline: number,
      signature: string
    ) => {
      if (!vaultContract) {
        console.error('Vault contract not initialized');
        return;
      }
      try {
        setLoading(true);

        const estimatedGas = await vaultContract.estimateGas.withdraw(
          txId,
          amount,
          deadline,
          signature
        );
        const tx = await vaultContract.withdraw(
          txId,
          amount,
          deadline,
          signature,
          {
            gasLimit: calculateGasMargin(estimatedGas),
          }
        );
        await tx.wait();
        return tx.hash;
      } catch (error) {
        console.error('Transfer failed:', error);
      } finally {
        setLoading(false);
      }
    },
    [vaultContract]
  );

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

  return { approveUSDC, buyCourse, loading, withdraw, execute };
};
