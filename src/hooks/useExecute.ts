import { calculateGasMargin } from '@/utils/common';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { getUSDCContract, getVaultContract } from './useContract';

export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const VAULT_ADDRESS = '0xA30E833ce646d01C2eBd71bb5F879B9Fe845F807';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

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
          amount
        );

        const tx = await usdcContract.approve(spender, amount, {
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
    async ({
      adminSigner,
      amount,
      courseId,
      deadline,
      kolAddress,
      signature,
    }: {
      courseId: string;
      amount: BigNumber;
      kolAddress: string;
      signature: string;
      deadline: number;
      adminSigner: string;
    }) => {
      if (!vaultContract) {
        console.error('Vault contract not initialized');
        return;
      }
      try {
        setLoading(true);

        console.log('estimatedGas:::', {
          courseId,
          amount,
          kolAddress,
          adminSigner,
          signature,
          deadline,
        });

        const estimatedGas = await vaultContract.estimateGas.pay(
          courseId,
          amount,
          kolAddress,
          adminSigner,
          signature,
          deadline
        );

        const tx = await vaultContract.pay(
          courseId,
          amount,
          kolAddress,
          adminSigner,
          signature,
          deadline,
          {
            gasLimit: calculateGasMargin(estimatedGas),
          }
        );
        const receipt = await tx.wait();

        return receipt;
      } catch (error) {
        console.log('estimatedGasestimatedGasestimatedGas:', error);
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
