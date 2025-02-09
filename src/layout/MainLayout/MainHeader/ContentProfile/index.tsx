import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { deleteAuthCookies, setAuthCookies } from '@/store/auth';
import { useProfile } from '@/store/profile/useProfile';
import { ROUTE_PATH } from '@/utils/const';
import { Tooltip } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

const MENUS = [
  {
    id: 1,
    label: 'My Profile',
    href: ROUTE_PATH.MY_PROFILE,

  },
  {
    id: 2,
    label: 'My Learning',
    href: ROUTE_PATH.MY_LEARNING,

  },
  // {
  //   id: 3,
  //   label: 'English',
  //   href: '',

  // },
];

const ContentProfile = ({ disconnect }: { disconnect: any }) => {
  const { address } = useAccount();
  const { profile } = useProfile();
  const router = useRouter()
  const handleRedirectPage = (link: string) => {
    router.push(link)
  }
  const handleLogout = () => {
    disconnect()
    setAuthCookies({
      token: '',
    });
    toast.success('Logout successfully');

  }

  console.log('profile', profile);

  const generateName = () => {
    if (profile?.firstName || profile?.lastName) {
      return `${profile?.firstName} ${profile?.lastName}`
    }
    return profile?.walletAddress
  }
  
  return (
    <div>
      <div className="p-4 border-b-1 border-solid border-[#F0F0F01A] flex gap-1 justify-between items-center">
        <div className="flex flex-col  gap-[2px]">
          <Text className="text-black-7 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap truncate w-full" type="font-14-400">
            {generateName()}
          </Text>

        </div>
        <div className="py-[2px] px-2 rounded-[50px] bg-green/10 flex justify-center items-center">
          <Text type="font-12-500" className="text-green">
            Verified
          </Text>
        </div>
      </div>
      <div className="border-b-1 border-solid border-b-[#F0F0F01A]">
        {MENUS?.map((item) => {
          return (
            <div
              key={item?.id}
              onClick={() => handleRedirectPage(item?.href)}
              className="py-3 transition-all flex justify-between items-center cursor-pointer px-4 hover:bg-green/10"
            >
              <Text type="font-14-500" className="text-white">
                {item?.label}
              </Text>
              {item?.id === 3 && (
                <Image
                  src={'/images/img-arrow-right.png'}
                  width={20}
                  height={20}
                  alt=""
                />
              )}
            </div>
          );
        })}
      </div>
      <div onClick={handleLogout} className="cursor-pointer transition-all rounded-b-[4px] hover:bg-error/10 py-3 px-4 flex items-center gap-3">
        <Image src={'/images/ig-logout.png'} width={24} height={24} alt="" />
        <Text type="font-14-500" className="text-error">
          Logout
        </Text>
      </div>
    </div>
  );
};
export default ContentProfile;
