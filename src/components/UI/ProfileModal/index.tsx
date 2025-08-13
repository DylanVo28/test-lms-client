import Text from '@/components/UI/Text';
import { deleteAuthCookies } from '@/store/auth';
import { useProfile } from '@/store/profile/useProfile';
import { ROUTE_PATH } from '@/utils/const';
import { formatWalletAddress } from '@/utils/common';
import Image from 'next/image';
import { useDisconnect } from 'wagmi';
import { notificationAtom } from '@/store/notification/notification';
import { useAtom } from 'jotai';
import useNavigate from '@/hooks/useNavigate';
import { useLogout } from '@/layout/MainLayout/MainHeader/service';
import { initialTheme, themeAtom } from '@/store/theme/theme';
import { initialProfile } from '@/store/profile/profile';
import CustomModal from '@/components/UI/CustomModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { profile, setProfile } = useProfile();
  const { disconnect } = useDisconnect();
  const [, setNotifications] = useAtom(notificationAtom);
  const [_, setTheme] = useAtom(themeAtom);
  const { navigate } = useNavigate();

  const { run: runLogout } = useLogout({
    onSuccess(res) {},
  });

  const handleLogout = () => {
    setNotifications({});
    runLogout();
    setTheme(initialTheme);
    document.body.setAttribute('data-theme', '');

    deleteAuthCookies();
    setProfile(initialProfile);
    disconnect();
    onClose();
  };

  const handleRedirectPage = (link: string) => {
    navigate(link);
    onClose();
  };

  const generateName = (): string => {
    if (profile?.fullName) {
      return profile?.fullName;
    }
    return formatWalletAddress(profile?.walletAddress);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      placementMoblie="center"
      size="sm"
    >
      <div className="p-0">
        {/* Profile Header */}
        <div className="p-4 border-b border-white-10 flex gap-3 justify-between items-center">
          <div className="flex flex-col gap-1">
            <Text
              className="text-letter max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap truncate w-full"
              type="font-14-400"
            >
              {generateName()}
            </Text>
          </div>
          <div className="py-1 px-3 rounded-full bg-green/10 flex justify-center items-center">
            <Text type="font-12-500" className="text-green">
              Verified
            </Text>
          </div>
        </div>

        {/* Menu Items */}
        <div className="border-b border-white-10">
          <div
            onClick={() => handleRedirectPage(ROUTE_PATH.MY_PROFILE)}
            className="py-3 transition-all flex justify-between items-center cursor-pointer px-4 hover:bg-green-10"
          >
            <Text type="font-14-500" className="text-letter">
              My Profile
            </Text>
          </div>
          <div
            onClick={() => handleRedirectPage(ROUTE_PATH.MY_LEARNING)}
            className="py-3 transition-all flex justify-between items-center cursor-pointer px-4 hover:bg-green-10"
          >
            <Text type="font-14-500" className="text-letter">
              My Learning
            </Text>
          </div>
        </div>

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="cursor-pointer transition-all rounded-b-lg hover:bg-error-10 py-3 px-4 flex items-center gap-3"
        >
          <Image
            src={'/images/ig-logout.png'}
            width={24}
            height={24}
            alt="Logout"
          />
          <Text type="font-14-500" className="text-error">
            Logout
          </Text>
        </div>
      </div>
    </CustomModal>
  );
};

export default ProfileModal;
