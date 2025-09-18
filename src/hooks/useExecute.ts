import { calculateGasMargin } from '@/utils/common';
import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { getUSDCContract, getVaultContract } from './useContract';
import { toast } from '@/components/UI/Toast/toast';
import { API_PATH, CONTRACT_ADDRESS } from '@/api/constant';
import { privateRequest, request } from '@/api/request';

const createTx = async ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  const res = await privateRequest(request.post, API_PATH.CREATE_TX, {
    data: {
      courseId,
      userId,
    },
  });
  return res.data;
};

export const useUSDCOperations = () => {
  const [loading, setLoading] = useState(false);

  const vaultContract = getVaultContract(CONTRACT_ADDRESS.VAULT_ADDRESS);
  const usdcContract = getUSDCContract(CONTRACT_ADDRESS.USDC_ADDRESS);

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
        toast.error(error as string);
        return;
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
      userId,
    }: {
      courseId: string;
      amount: BigNumber;
      kolAddress: string;
      signature: string;
      deadline: number;
      adminSigner: string;
      userId: string;
    }) => {
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

        //create tx
        await createTx({ courseId, userId: userId });

        const receipt = await tx.wait();

        return receipt;
      } catch (error) {
        console.log('ERROR:::', error);
        toast.error((JSON.stringify(error).slice(0, 500) + '...') as string);
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
