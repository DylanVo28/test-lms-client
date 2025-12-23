import { useProfile } from '@/store/profile/useProfile';
import { getPublicKeyAsync, signAsync } from '@/utils/noble-ed25519';
import { useQuery } from '@tanstack/react-query';
import { base58 } from 'ethers/lib/utils';

export interface UserVolumeStats {
  perp_volume_ytd: number;
  perp_volume_ltd: number;
  perp_volume_last_7_days: number;
  perp_volume_last_30_days: number;
}

export const useAccountInfo = () => {
  const { profile } = useProfile();

  const orderlyUrlNetwork = 'https://api.orderly.org';

  const getSignature = async (message: string, privateKey: string) => {
    const encoder = new TextEncoder();

    const signature = await signAsync(encoder.encode(message), privateKey);

    const base64 = Buffer.from(signature).toString('base64');
    const orderlySignature = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return orderlySignature;
  };

  const getOrderlyKey = async (privateKey: string) => {
    const orderlyKey = `ed25519:${base58.encode(
      await getPublicKeyAsync(privateKey)
    )}`;
    return orderlyKey;
  };

  const getVolumeStatistics = async (initData?: any) => {
    const { orderlyAccountId, orderlySecretKey, orderlyKey } =
      initData || profile;

    if (!orderlyAccountId || !orderlySecretKey || !orderlyKey) return;

    try {
      const timestamp = Date.now();
      const message = `${String(timestamp)}GET/v1/volume/user/stats`;
      const signature = await getSignature(message, orderlySecretKey);
      const orderlyKey = await getOrderlyKey(orderlySecretKey);

      const res = await fetch(`${orderlyUrlNetwork}/v1/volume/user/stats`, {
        method: 'GET',
        headers: {
          'orderly-account-id': orderlyAccountId || '',
          'orderly-key': orderlyKey,
          'orderly-signature': signature,
          'orderly-timestamp': timestamp.toString(),
        },
      });
      const data = (await res.json()) as { data: UserVolumeStats };

      return data;
    } catch (error) {
      return {
        data: {
          perp_volume_ytd: 0,
          perp_volume_ltd: 0,
          perp_volume_last_7_days: 0,
          perp_volume_last_30_days: 0,
        },
      };
    }
  };

  const { data: volumeData, isLoading: volumeLoading } = useQuery({
    queryKey: ['volume-statistics', profile?.orderlyAccountId],
    queryFn: () => getVolumeStatistics(),
    enabled:
      !!profile?.orderlyAccountId &&
      !!profile?.orderlySecretKey &&
      !!profile?.orderlyKey,

  });

  return {
    volumeData,
    volumeLoading,
    getVolumeStatistics,
  };
};
