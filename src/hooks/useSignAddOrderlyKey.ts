import { utils } from '@noble/ed25519';
import { getPublicKey } from '@noble/ed25519';
import { randomBytes } from 'crypto';
import { useAccount as useWagmiAccount, useConfig } from 'wagmi';
// @ts-ignore - @wagmi/core may need to be installed separately
import { signTypedData } from '@wagmi/core';
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
  const { chainId } = useWagmiAccount();
  const config = useConfig();

  const handleSign = async () => {
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

    // Generate private key using SHA-256
    // Use SHA-256 to generate private key or fallback to random
    const privKey = await generatePrivateKey();

    // Convert private key to string for storage or transmission
    const privKeyString = Buffer.from(privKey).toString('hex');

    // You can convert it back to Uint8Array when needed
    // const backToUint8Array = new Uint8Array(Buffer.from(privKeyString, 'hex'));
    const orderlyKey = `ed25519:${bs58.encode(await getPublicKey(privKey))}`;

    const timestamp = Date.now();
    const expiration = timestamp + 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

    const types = {
      AddOrderlyKey: [
        { name: 'brokerId', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'orderlyKey', type: 'string' },
        { name: 'scope', type: 'string' },
        { name: 'timestamp', type: 'uint64' },
        { name: 'expiration', type: 'uint64' },
      ],
    } as const;

    // Create message with BigInt for signing
    const messageForSigning = {
      brokerId: 'what_exchange',
      chainId: BigInt(chainId),
      orderlyKey: orderlyKey,
      scope: 'read',
      timestamp: BigInt(timestamp),
      expiration: BigInt(expiration),
    };

    // Use signTypedData action from @wagmi/core
    // Note: If you get an error, install @wagmi/core: pnpm add @wagmi/core
    const signature = await signTypedData(config, {
      domain,
      types,
      primaryType: 'AddOrderlyKey',
      message: messageForSigning,
    });

    // Convert BigInt to string for JSON serialization
    const messageForResponse = {
      brokerId: messageForSigning.brokerId,
      chainId: messageForSigning.chainId.toString(),
      orderlyKey: messageForSigning.orderlyKey,
      scope: messageForSigning.scope,
      timestamp: messageForSigning.timestamp.toString(),
      expiration: messageForSigning.expiration.toString(),
    };

    return {
      signature,
      message: messageForResponse,
      orderlyKey,
      privKey: privKeyString,
    };
  };

  return handleSign;
};

export default useSignAddOrderlyKey;
