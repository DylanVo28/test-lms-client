import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
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

  const usdcContract = getUSDCContract(USDC_ADDRESS);
  const vaultContract = getVaultContract(VAULT_ADDRESS);

  const approveUSDC = useCallback(
    async (spender: string, amount: string | number) => {
      if (!usdcContract) {
        console.error('USDC contract chưa được khởi tạo');
        return;
      }
      try {
        const message = `Approve ${spender} to spend ${amount} USDC`;
        const sig = await signMessageAsync({ message });
        console.log('Signature created:', sig);
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
      }
    },
    [usdcContract, signMessageAsync]
  );

  const transferUSDC = useCallback(
    async (courseId: string, amount: string | number) => {
      if (!vaultContract) {
        console.error('USDC contract chưa được khởi tạo');
        return;
      }
      try {
        const message = `Buy course ${courseId} with ${amount} USDC`;
        const sig = await signMessageAsync({ message });
        console.log('Signature created:', sig);
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
      } catch (error) {
        console.error('Transfer failed:', error);
      }
    },
    [vaultContract, signMessageAsync]
  );

  return { approveUSDC, transferUSDC };
};
