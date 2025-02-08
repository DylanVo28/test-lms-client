import React, { useEffect, useState } from 'react';
import Text from '../UI/Text';
import Overview from './Overview';
import Information from './Information';
import Avatar from './Avatar';
import Security from './Security';
import { userRequest, TUser, referralRequest } from './service';

enum TAB {
  INFORMATION = 'information',
  AVATAR = 'avatar',
  SECURITY = 'security',
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
    title: 'Security',
    key: TAB.SECURITY,
  },
];

interface Summary {
  totalNetwork: number;
  f1: number;
  f2: number;
  f3: number;
}

const MyProfile = () => {
  const [tabSelected, setTabSelected] = useState<TAB>(TAB.INFORMATION);
  const [user, setUser] = useState<TUser>();
  const [summary, setSummary] = useState<Summary>();

  const getMe = async () => {
    try {
      const response = await userRequest.getMe();
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getReferral = async () => {
    try {
      const res = await referralRequest.getSummary();
      const data = {
        totalNetwork: res.data.totalNetwork || 0,
        f1: res.data.f1 || 0,
        f2: res.data.f2 || 0,
        f3: res.data.f3 || 0,
      };
      setSummary(data);
    } catch (error) {
      console.log(error);
    }
  };

  const reload = () => {
    getMe();
  };

  useEffect(() => {
    getMe();
    getReferral();
  }, []);

  return (
    <div className="flex flex-col gap-[50px]">
      <div className="pl-5 border-l-4 border-l-main">
        <Text type="font-28-700">My Profile</Text>
      </div>

      <div className="flex flex-col md:flex-row gap-[24px] box-border">
        <Overview
          data={{
            avatar:
              user?.avatar ||
              'https://i1.sndcdn.com/avatars-000225974941-3icznp-t500x500.jpg',
            fullname: `${user?.firstName || '-'} ${user?.lastName || '-'}`,
            email: user?.email || '--',
            verify: true,
            customers: {
              total: summary
                ? Number(summary.f1) +
                    Number(summary.f2) +
                    Number(summary.f3) +
                    Number(summary.totalNetwork) || 0
                : 0,
              f1: summary?.f1 || 0,
              f2: summary?.f2 || 0,
              f3: summary?.f3 || 0,
              o: summary?.totalNetwork || 0,
            },
          }}
        />
        <div className="bg-[#181F25] w-full p-[20px] rounded-[4px] box-border">
          <div className="flex gap-[12px] mb-[32px] border-b border-[#2B3032]">
            {tabs.map((item) => (
              <div
                onClick={() => setTabSelected(item.key)}
                className={`px-[8px] pb-[16px] text-base font-medium cursor-pointer ${
                  tabSelected === item.key
                    ? 'border-b text-[#02A6C2] border-[#02A6C2]'
                    : ''
                }`}
                key={item.key}
              >
                <span
                  className={`${tabSelected === item.key ? '' : 'opacity-50'}`}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </div>
          {tabSelected === TAB.INFORMATION && (
            <Information user={user} reload={reload} />
          )}
          {tabSelected === TAB.AVATAR && <Avatar user={user} reload={reload} />}
          {tabSelected === TAB.SECURITY && <Security />}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
