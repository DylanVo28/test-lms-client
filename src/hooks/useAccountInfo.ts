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

export interface ReferralCodeInfo {
  code: string;
  max_rebate_rate: number;
  referrer_rebate_rate: number;
  referee_rebate_rate: number;
  total_invites: number;
  total_traded: number;
}

export interface ReferrerInfo {
  '1d_invites': number;
  '7d_invites': number;
  '30d_invites': number;
  total_invites: number;
  '1d_traded': number;
  '7d_traded': number;
  '30d_traded': number;
  total_traded: number;
  '1d_referee_volume': number;
  '7d_referee_volume': number;
  '30d_referee_volume': number;
  total_referee_volume: number;
  '1d_referrer_rebate': number;
  '7d_referrer_rebate': number;
  '30d_referrer_rebate': number;
  total_referrer_rebate: number;
  referral_codes: ReferralCodeInfo[];
}

export interface RefereeInfo {
  referer_code: string;
  referee_rebate_rate: number;
  '1d_referee_rebate': number;
  '7d_referee_rebate': number;
  '30d_referee_rebate': number;
  total_referee_rebate: number;
}

export interface ReferralInfoResponse {
  success: boolean;
  data: {
    referrer_info: ReferrerInfo;
    referee_info: RefereeInfo;
  };
  timestamp: number;
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

  const getReferralInfo = async (initData:any) => {

    const { orderlyAccountId, orderlySecretKey, orderlyKey: providedOrderlyKey } =initData || profile;

    if (!orderlyAccountId || !orderlySecretKey) return;

    try {
      const timestamp = Date.now();
      const message = `${String(timestamp)}GET/v1/referral/info`;
      const signature = await getSignature(message, orderlySecretKey);
      // Use provided orderlyKey if available, otherwise calculate from secretKey
      const orderlyKey = providedOrderlyKey || await getOrderlyKey(orderlySecretKey);

      const res = await fetch(`${orderlyUrlNetwork}/v1/referral/info`, {
        method: 'GET',
        headers: {
          'orderly-account-id': orderlyAccountId || '',
          'orderly-key': orderlyKey,
          'orderly-signature': signature,
          'orderly-timestamp': timestamp.toString(),
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch referral info: ${res.statusText}`);
      }

      const data = (await res.json()) as ReferralInfoResponse;
      return data;
    } catch (error) {
      console.error('Error fetching referral info:', error);
      throw error;
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
    getReferralInfo,
  };
};
