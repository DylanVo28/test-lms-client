import CopyIcon from '@/icons/CopyIcon';
import { useThemeInitial } from '@/store/theme/useThemeInitial';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Text from '../UI/Text';
import { toast } from '../UI/Toast/toast';
import { referralRequest } from './service';
import { useAccountInfo } from '@/hooks/useAccountInfo';
import FormatNumberDecimal from '../Commons/FormatNumberDecimal';

const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) {
    return 0;
  }
  return (value / total) * 100;
};

const Overview = ({
  data,
}: {
  data: {
    avatar: string;
    fullname: string;
    email: string;
    verify: boolean;
    role: any;
    customers: {
      total: number;
      f1: number;
      f2: number;
      f3: number;
    };
  };
}) => {
  const { t } = useTranslation('common');
  const [origin, setOrigin] = useState('');
  const [refCode, setRefCode] = useState('');
  const { theme: dataThemeConfig } = useThemeInitial();

  // const { address } = useAccount();
  // const {
  //   data: volumnData,
  //   loading,
  //   totalPoint,
  // } = useVolumnData({
  //   address: '0x73332479db4259f786b9bdac8dc4dcb3dc8259e8' as string,
  //   // address: address as string,
  // });

  const { volumeData, getVolumeStatistics } = useAccountInfo();

  const getProfile = async () => {
    try {
      const res = await referralRequest.getProfile();
      setRefCode(res.data.code);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const onCopy = (text: string) => {
    window.navigator.clipboard.writeText(text);
    toast.success(t('Copied!'));
  };

  return (
    <div className="w-full h-fit max-w-[460px] flex flex-col gap-[20px]">
      <div className="p-[20px] bg-gray-70 rounded-[4px] w-full h-fit flex flex-col gap-[12px]">
        <div className="flex flex-col justify-center items-center gap-[4px]">
          <div className="w-[64px] h-[64px] rounded-full relative overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              alt="avatar"
              fill
              src={data.avatar}
            />
          </div>
          <Text type="font-20-700">{data.fullname}</Text>
          <div className="opacity-50">{data.email}</div>
        </div>

        <Divided />

        <div className="flex justify-between items-center py-[8px]">
          <Text type="font-16-700">{t('Verified Account')}</Text>
          <Image src={'/icons/ic-kyc.svg'} alt="kyc" width={24} height={24} />
        </div>

        {data?.role === 'KOL' && (
          <>
            <Divided />

            <div className="flex gap-x-2 items-center">
              <Text type="font-16-600">Referral code:</Text>
              <Text type="font-16-600">{refCode}</Text>

              <div
                className="cursor-pointer"
                onClick={() => {
                  onCopy(refCode);
                }}
              >
                <CopyIcon />
              </div>
            </div>

            <div className="">
              <Text type="font-16-600">Platform link:</Text>
              <div className="flex items-center gap-x-2">
                <Text type="font-16-600">
                  {origin}/{dataThemeConfig.code}
                </Text>

                <div
                  className="cursor-pointer"
                  onClick={() => {
                    onCopy(`${origin}/${dataThemeConfig.code}`);
                  }}
                >
                  <CopyIcon />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-[8px] py-[8px] bg-gray-70 rounded-[4px] w-full h-fit p-6">
        <div className="flex justify-between items-center">
          <Text type="font-16-600">What Exchange Volumn Statistics</Text>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex justify-between">
            <Text type="font-14-400" className="opacity-50">
              Last 7 days
            </Text>

            <FormatNumberDecimal
              value={volumeData?.data?.perp_volume_last_7_days}
              decimalPlaces={6}
              fractionDigits={6}
              abbreviate={true}
              className="text-white"
              prefix="$"
            />
          </div>

          <div className="flex justify-between">
            <Text type="font-14-400" className="opacity-50">
              Last 30 days
            </Text>
            <FormatNumberDecimal
              value={volumeData?.data?.perp_volume_last_30_days}
              decimalPlaces={6}
              fractionDigits={6}
              abbreviate={true}
              className="text-white"
              prefix="$"
            />
          </div>

          <div className="flex justify-between">
            <Text type="font-14-400" className="opacity-50">
              Year to date
            </Text>
            <FormatNumberDecimal
              value={volumeData?.data?.perp_volume_ytd}
              decimalPlaces={6}
              fractionDigits={6}
              abbreviate={true}
              className="text-white"
              prefix="$"
            />
          </div>

          <div className="flex justify-between">
            <Text type="font-14-400" className="opacity-50">
              Life time
            </Text>
            <FormatNumberDecimal
              value={volumeData?.data?.perp_volume_ltd}
              decimalPlaces={6}
              fractionDigits={6}
              abbreviate={true}
              className="text-white"
              prefix="$"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Divided = () => <div className="w-full h-[1px] opacity-10 bg-[#fff]" />;

export default Overview;
