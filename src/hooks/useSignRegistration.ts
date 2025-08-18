import { useAccount } from 'wagmi';
import { useEthersSigner } from './useEthersSigner';

// todo apply mutiple chain
const useSignRegistration = () => {
  const signer = useEthersSigner();
  const { chainId } = useAccount();

  const handleSign = async ({ messageNonce }: { messageNonce: string }) => {
    const OFF_CHAIN_DOMAIN = {
      name: 'Orderly',
      version: '1',
      chainId: chainId,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    };

    const message = {
      brokerId: 'what_exchange',
      chainId: chainId,
      timestamp: String(Date.now()),
      registrationNonce: messageNonce,
    };

    const signature = await signer?._signTypedData(
      OFF_CHAIN_DOMAIN,
      {
        Registration: [
          { name: 'brokerId', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'timestamp', type: 'uint64' },
          { name: 'registrationNonce', type: 'uint256' },
        ],
      },
      {
        ...message,
      }
    );

    return {
      signature,
      message,
    };
  };

  return handleSign;
};

export default useSignRegistration;
