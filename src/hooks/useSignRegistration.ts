import { useAccount, useConfig } from 'wagmi';
// @ts-ignore - @wagmi/core may need to be installed separately
import { signTypedData } from '@wagmi/core';

// todo apply mutiple chain
const useSignRegistration = () => {
  const { chainId } = useAccount();
  const config = useConfig();

  const handleSign = async ({ messageNonce }: { messageNonce: string }) => {
    if (!chainId) {
      throw new Error('Chain ID not available. Please ensure you are connected to a network.');
    }

    if (!config) {
      throw new Error('Wagmi config not available.');
    }

    const domain = {
      name: 'Orderly',
      version: '1',
      chainId: chainId,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC' as `0x${string}`,
    };

    const types = {
      Registration: [
        { name: 'brokerId', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'timestamp', type: 'uint64' },
        { name: 'registrationNonce', type: 'uint256' },
      ],
    } as const;

    // Create message with BigInt for signing
    const messageForSigning = {
      brokerId: 'what_exchange',
      chainId: BigInt(chainId),
      timestamp: BigInt(Date.now()),
      registrationNonce: BigInt(messageNonce),
    };

    // Use signTypedData action from @wagmi/core
    // Note: If you get an error, install @wagmi/core: pnpm add @wagmi/core
    const signature = await signTypedData(config, {
      domain,
      types,
      primaryType: 'Registration',
      message: messageForSigning,
    });

    // Convert BigInt to string for JSON serialization
    const messageForResponse = {
      brokerId: messageForSigning.brokerId,
      chainId: messageForSigning.chainId.toString(),
      timestamp: messageForSigning.timestamp.toString(),
      registrationNonce: messageForSigning.registrationNonce.toString(),
    };

    return {
      signature,
      message: messageForResponse,
    };
  };

  return handleSign;
};

export default useSignRegistration;
