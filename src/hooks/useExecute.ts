import BigNumber from 'bignumber.js';
import { useCallback, useState } from 'react';
import { useSignMessage } from 'wagmi';
import { getUSDCContract, getVaultContract } from './useContract';
import { calculateGasMargin } from '@/utils/common';
import { BIG_TEN } from '@/utils/bigNumber';

const USDC_ADDRESS = '0xfaFedb041c0DD4fA2Dc0d87a6B0979Ee6FA7af5F';
const VAULT_ADDRESS = '0xe9D7daB56CFc0913C93941caFe3d119C7fC3DB35';

const parseAmount = (amount: string | number) => {
  return BigNumber(amount).multipliedBy(BIG_TEN.pow(18)).toFixed(0);
};

export const useUSDCOperations = () => {
  const { signMessageAsync } = useSignMessage();
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
        const message = `Approve ${spender} to spend ${amount} USDC`;
        await signMessageAsync({ message });
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
    [usdcContract, signMessageAsync]
  );

  const buyCourse = useCallback(
    async (courseId: string, amount: string | number) => {
      if (!vaultContract) {
        console.error('Vault contract not initialized');
        return;
      }
      try {
        setLoading(true);
        const message = `Buy course ${courseId} with ${amount} USDC`;
        await signMessageAsync({ message });
        const estimatedGas = await vaultContract.estimateGas.pay(
          courseId,
          parseAmount(amount)
        );
        const tx = await vaultContract.pay(courseId, parseAmount(amount), {
          gasLimit: calculateGasMargin(estimatedGas),
        });
        console.log('Transfer tx sent:', tx.hash);
        await tx.wait();
        console.log('Transfer successful');
        return tx.hash;
      } catch (error) {
        console.error('Transfer failed:', error);
      } finally {
        setLoading(false);
      }
    },
    [vaultContract, signMessageAsync]
  );

  return { approveUSDC, buyCourse, loading };
};
