import InputText from '@/components/UI/InputText';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import Image from 'next/image';
import Menubar from '../Menubar';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/utils/const';
import { use, useEffect, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { getAccessToken, setAuthCookies } from '@/store/auth';
import { useGetUserNonce, useLoginWeb3 } from './service';
import { toast } from '@/components/UI/Toast/toast';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import { initialProfile } from '@/store/profile/profile';
import ButtonLoginWallet from '@/components/UI/ButtonLoginWallet';
const MainHeader = () => {
  const router = useRouter();
  const [valueSearch, setValueSearch] = useState('');
  const { isConnected, address } = useAccount();
  const token = getAccessToken();
  const { signMessageAsync } = useSignMessage();
  const { requestGetProfile, setProfile } = useProfileInitial();

  const handleChangeSearch = (e: any) => {
    setValueSearch(e.target.value);
  };

  const { run: runLoginWeb3 } = useLoginWeb3({
    onSuccess(res) {
      toast.success('Login successfully');
      requestGetProfile();
      setAuthCookies({
        token: res?.data?.accessToken,
      });
    },
  });
  const { run: runGetUserNonce } = useGetUserNonce({
    onSuccess(res) {
      handleSignMessage(res?.data);
    },
  });

  const handleSignMessage = async (messageNonce: string) => {
    try {
      const sig = await signMessageAsync({ message: messageNonce });
      runLoginWeb3({
        address: address as string,
        signature: sig,
        refCode: (router.query.refCode as string) || '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isConnected && address && !token) {
      runGetUserNonce(address);
    }
    if (!isConnected && !token) {
      setAuthCookies({
        token: '',
      });
      setProfile(initialProfile);
    }
  }, [token, isConnected, address]);

  const handleKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      router.push({
        pathname: ROUTE_PATH.COURSE_SEARCH,
        query: { keySearch: valueSearch },
      });
    }
  };

  return (
    <div className="w-full sticky z-[1000] top-0 backdrop-blur-sm border-b border-black-10 py-5 px-10">
      <div className="max-w-[1440px]  mx-auto flex justify-between items-center">
        <Image
          onClick={() => router.push(ROUTE_PATH.HOME)}
          alt="logo"
          width={125}
          height={46}
          className="cursor-pointer"
          src={'/logo.png'}
        />

        <div className="flex items-center gap-4">
          <Menubar />

          <div className="flex items-center gap-4">
            <InputText
              onChange={handleChangeSearch}
              onKeyUp={handleKeyUp}
              startContent={
                <Image
                  width={20}
                  height={20}
                  alt=""
                  src={'/images/img-search.png'}
                />
              }
              className="min-w-[470px]"
              radius="sm"
              placeholder="Search"
            />
            <div className="border-1 border-gray-20 h-8" />
            <Button
              isIconOnly
              className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10"
            >
              <Image
                src={'/icons/ic-notification.svg'}
                height={20}
                width={20}
                alt=""
              />
            </Button>
            {/* <Button
              isIconOnly
              className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10"
            >
              <Image src={'/icons/ic-user.svg'} height={20} width={20} alt="" />
            </Button> */}

            <ButtonLoginWallet />

            {/* <div className="w-full">
              <ConnectButton />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainHeader;
