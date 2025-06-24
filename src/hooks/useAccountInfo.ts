import { useProfile } from '@/store/profile/useProfile';
import { signAsync } from '@/utils/noble-ed25519';
import { useQuery } from '@tanstack/react-query';

export interface UserVolumeStats {
  perp_volume_ytd: number;
  perp_volume_ltd: number;
  perp_volume_last_7_days: number;
  perp_volume_last_30_days: number;
}

const mock = {
  accountId:
    '0xa445a35bf3bd80dde946832373a074fdd7f5d5771884893b477f94e049d6342a',
  orderlyKey: 'ed25519:D4mUJmcD1uaqMcpxEhi4ymqt9n3BGmbSwCtm7h6ntDhm',
  orderlySecretKey:
    '8a6c0d59347cb680f4f1d9fc963dd76089844ff0d0d21faaf76052a65ab436d1',
};

const mock1 = {
  accountId:
    '0x9fe55818a81c6b49fbf6c2d9a0c6ebe645c2e0f0db7365a2fe123c69c736c2de',
  orderlyKey: 'ed25519:GLZVD2mWv7Knkjz2jq678bwvZ237EoTc3qw7BWAFBqam',
  orderlySecretKey:
    '9cb8bda10d14b85bc3b53e2cc40acc95053548b1490a1a7dce174031c0bf232e',
};

export const useAccountInfo = () => {
  const { profile } = useProfile();

  const orderlyUrlNetwork = 'https://api.orderly.org';
  // const orderlyUrlNetwork = 'https://testnet-api.orderly.org';

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
  const getVolumeStatistics = async () => {
    const { orderlyAccountId, orderlySecretKey, orderlyKey } = profile;

    if (!orderlyAccountId || !orderlySecretKey || !orderlyKey) return;

    try {
      const timestamp = Date.now();
      const message = `${String(timestamp)}GET/v1/volume/user/stats`;
      const signature = await getSignature(message, orderlySecretKey);

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
    refetchInterval: 30000,
    staleTime: 30000,
  });

  return {
    volumeData,
    volumeLoading,
  };
};
