import { utils } from '@noble/ed25519';
import { getPublicKey } from '@noble/ed25519';
import { randomBytes } from 'crypto';
import { useEthersSigner } from './useEthersSigner';
import { useAccount as useWagmiAccount } from 'wagmi';
import bs58 from 'bs58';

const generatePrivateKey = async () => {
  try {
    // Create a random array of bytes as seed
    const seed = randomBytes(32);
    // Use the browser's crypto API to hash the seed with SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', new Uint8Array(seed));
    // Convert the hash to Uint8Array
    return new Uint8Array(hashBuffer);
  } catch (error) {
    console.error('Error generating private key:', error);
    // Fallback to the default random private key generation
    return utils.randomPrivateKey();
  }
};

const useSignAddOrderlyKey = () => {
  const signer = useEthersSigner();
  const { chainId } = useWagmiAccount();
  const handleSign = async () => {
    const OFF_CHAIN_DOMAIN = {
      name: 'Orderly',
      version: '1',
      chainId: chainId,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    };

    // Generate private key using SHA-256

    // Use SHA-256 to generate private key or fallback to random
    const privKey = await generatePrivateKey();

    // Convert private key to string for storage or transmission
    const privKeyString = Buffer.from(privKey).toString('hex');

    // You can convert it back to Uint8Array when needed
    // const backToUint8Array = new Uint8Array(Buffer.from(privKeyString, 'hex'));
    const orderlyKey = `ed25519:${bs58.encode(await getPublicKey(privKey))}`;

    const timestamp = Date.now();

    const message = {
      brokerId: 'what_exchange',
      chainId: chainId,
      orderlyKey: orderlyKey,
      scope: 'read',
      timestamp: timestamp, //1 day ago
      expiration: timestamp + 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    };

    const signature = await signer?._signTypedData(
      OFF_CHAIN_DOMAIN,
      {
        AddOrderlyKey: [
          { name: 'brokerId', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'orderlyKey', type: 'string' },
          { name: 'scope', type: 'string' },
          { name: 'timestamp', type: 'uint64' },
          { name: 'expiration', type: 'uint64' },
        ],
      },
      {
        ...message,
      }
    );

    return {
      signature,
      message,
      orderlyKey,
      privKey: privKeyString,
    };
  };

  return handleSign;
};

export default useSignAddOrderlyKey;
