import React, { useEffect, useState } from 'react';
import Text from '../UI/Text';
import Overview from './Overview';
import Information from './Information';
import Avatar from './Avatar';
import { referralRequest, userRequest } from './service';
import { useTranslation } from 'next-i18next';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import Earnings from './Earnings';
import { useProfile } from '@/store/profile/useProfile';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
enum TAB {
  INFORMATION = 'information',
  AVATAR = 'avatar',
  EARNINGS = 'earnings',
}

const tabs = [
  {
    title: 'Information',
    key: TAB.INFORMATION,
  },
  {
    title: 'Avatar',
    key: TAB.AVATAR,
  },
  {
    title: 'Earnings ',
    key: TAB.EARNINGS,
  },
];

interface Summary {
  totalNetwork: number;
  f1: number;
  f2: number;
  f3: number;
}

const MyProfile = () => {
  const { t } = useTranslation('common');
  const [tabSelected, setTabSelected] = useState<TAB>(TAB.INFORMATION);
  // const [user, setUser] = useState<any>({});
  const [summary, setSummary] = useState<Summary>();
  const accessToken = useAccessToken();
  const { profile } = useProfile();
  const { requestGetProfile } = useProfileInitial();

  const getReferral = async () => {
    try {
      const res = await referralRequest.getSummary();

      const data = {
        totalNetwork: res.data.totalNetwork || 0,
        f1: res.data.totalF1 || 0,
        f2: res.data.totalF2 || 0,
        f3: res.data.totalF3 || 0,
      };
      setSummary(data);
    } catch (error) {
      console.log(error);
    }
  };

  const reload = () => {
    requestGetProfile();
  };

  return (
    <div className="flex flex-col gap-[50px]">
      <div className="pl-5 border-l-4 border-l-main">
        <Text type="font-28-700">{t('My Profile')}</Text>
      </div>

      <div className="flex flex-col md:flex-row gap-[24px] box-border">
        <Overview
          data={{
            avatar:
              profile?.avatar ||
              'https://i1.sndcdn.com/avatars-000225974941-3icznp-t500x500.jpg',
            fullname: profile?.fullName || '--',
            email: profile?.email || '--',
            verify: true,
            role: profile?.role || 'USER',
            customers: {
              f1: summary?.f1 ? Number(summary?.f1) : 0,
              f2: summary?.f2 ? Number(summary?.f2) : 0,
              f3: summary?.f3 ? Number(summary?.f3) : 0,
              total: summary?.totalNetwork ? Number(summary?.totalNetwork) : 0,
            },
          }}
        />
        <div className="bg-gray-70 w-full p-[20px] rounded-[4px] box-border">
          <div className="flex gap-[12px] mb-[32px] border-b border-[#2B3032]">
            {tabs.map((item) => (
              <div
                onClick={() => setTabSelected(item.key)}
                className={`px-[8px] pb-[16px] text-base font-medium cursor-pointer ${
                  tabSelected === item.key
                    ? 'border-b text-main border-main'
                    : ''
                }`}
                key={item.key}
              >
                <span
                  className={`${tabSelected === item.key ? '' : 'opacity-50'}`}
                >
                  {t(item.title)}
                </span>
              </div>
            ))}
          </div>
          {tabSelected === TAB.INFORMATION && <Information reload={reload} />}
          {tabSelected === TAB.AVATAR && <Avatar reload={reload} />}
          {tabSelected === TAB.EARNINGS && <Earnings reload={reload} />}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
