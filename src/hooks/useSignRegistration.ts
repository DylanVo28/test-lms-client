import { useEthersSigner } from './useEthersSigner';

const useSignRegistration = () => {
  const signer = useEthersSigner();
  const handleSign = async ({ messageNonce }: { messageNonce: string }) => {
    const OFF_CHAIN_DOMAIN = {
      name: 'Orderly',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    };

    const message = {
      brokerId: 'what_exchange',
      chainId: 1,
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
