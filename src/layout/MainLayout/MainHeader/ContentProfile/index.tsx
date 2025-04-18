import Text from '@/components/UI/Text';
import { toast } from '@/components/UI/Toast/toast';
import { setAuthCookies } from '@/store/auth';
import { useProfile } from '@/store/profile/useProfile';
import { ROUTE_PATH } from '@/utils/const';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import LanguageModal from '../LanguageModal';
import { useTranslation } from 'next-i18next';
import { notificationAtom } from '@/store/notification/notification';
import { useAtom } from 'jotai';
import { formatWalletAddress } from '@/utils/common';
import useNavigate from '@/hooks/useNavigate';
import { useLogout } from '../service';
import { initialTheme, themeAtom } from '@/store/theme/theme';
import { initialProfile } from '@/store/profile/profile';

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
  {
    id: 3,
    label: 'English',
    href: '',
  },
];

const ContentProfile = ({
  disconnect,
  onClosePopover,
}: {
  disconnect: any;
  onClosePopover: VoidFunction;
}) => {
  const { t } = useTranslation('common');
  const { profile, setProfile } = useProfile();
  const router = useRouter();
  const [, setNotifications] = useAtom(notificationAtom);
  const { navigate } = useNavigate();
  const handleRedirectPage = (link: string) => {
    navigate(link);
    onClosePopover();
  };
  const [_, setTheme] = useAtom(themeAtom);

  const { run: runLogout } = useLogout({
    onSuccess(res) {},
  });
  const handleLogout = () => {
    disconnect();
    setNotifications({});
    runLogout();
    setTheme(initialTheme);
    document.body.setAttribute('data-theme', '');

    setAuthCookies({
      token: '',
    });
    setProfile(initialProfile);
    // toast.success(t('Logout successfully'));
  };

  const generateName = (): any => {
    if (profile?.fullName) {
      return profile?.fullName;
    }
    return formatWalletAddress(profile?.walletAddress);
  };

  return (
    <div>
      <div className="p-4 border-b-1 border-solid border-[#F0F0F01A] flex gap-1 justify-between items-center">
        <div className="flex flex-col  gap-[2px]">
          <Text
            className="text-black-7 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap truncate w-full"
            type="font-14-400"
          >
            {generateName()}
          </Text>
        </div>
        <div className="py-[2px] px-2 rounded-[50px] bg-green/10 flex justify-center items-center">
          <Text type="font-12-500" className="text-green">
            {t('Verified')}
          </Text>
        </div>
      </div>
      <div className="border-b-1 border-solid border-b-[#F0F0F01A]">
        {MENUS?.map((item) => {
          if (item.id === 3) {
            return <LanguageModal onClosePopover={onClosePopover} />;
          }
          return (
            <div
              key={item?.id}
              onClick={() => handleRedirectPage(item?.href)}
              className="py-3 transition-all flex justify-between items-center cursor-pointer px-4 hover:bg-green-10"
            >
              <Text type="font-14-500" className="text-white">
                {t(item?.label)}
              </Text>
            </div>
          );
        })}
      </div>
      <div
        onClick={handleLogout}
        className="cursor-pointer transition-all rounded-b-[4px] hover:bg-error-10 py-3 px-4 flex items-center gap-3"
      >
        <Image src={'/images/ig-logout.png'} width={24} height={24} alt="" />
        <Text type="font-14-500" className="text-error">
          {t('Logout')}
        </Text>
      </div>
    </div>
  );
};
export default ContentProfile;
