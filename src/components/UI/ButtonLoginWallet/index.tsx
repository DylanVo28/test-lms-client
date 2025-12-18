import ContentProfile from '@/layout/MainLayout/MainHeader/ContentProfile';
import { useProfile } from '@/store/profile/useProfile';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { useState } from 'react';
import {useAccount, useDisconnect} from 'wagmi';
import IconUser from '../Icons/IconUser';
import Text from '../Text';
import { usePrivy } from '@privy-io/react-auth';
import {formatAddress} from "@/utils/common";

const ButtonLoginWallet = ({ setVisible }: any) => {
  const { disconnect } = useDisconnect();
  const { profile } = useProfile();
  const { login } = usePrivy();
  const { address } = useAccount();

  const [isOpen, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    if (setVisible) {
      setVisible(false);
    }
  };

  const onOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {!profile.id ? (
        <Button
          onPress={()=>login()}
          className="bg-main w-full min-h-[40px] rounded"
        >
          <Text className="text-letter" type="font-16-600">
            Connect Wallet
          </Text>
        </Button>
      ) : (
        <div className={'flex gap-3'}>

          <Button
              onPress={()=>window.openModalPrivyWallet()}
              isIconOnly
              className="bg-gray-10 font-16-500 border-1 border-gray-10 rounded-[4px] gap-2 px-2 w-auto h-10"
          >
            {formatAddress(address || "")}
          </Button>

          <Popover
              isOpen={isOpen}
              onClose={onClose}
              classNames={{
                content:
                    'rounded border-1 p-0 !bg-gray border-[#F0F0F01A] shadow-dropdown',
              }}
              color="default"
              placement="bottom-end"
              onOpenChange={onOpen}
          >
            <PopoverTrigger>
              <Button
                  isIconOnly
                  className="bg-gray-10 font-16-500 border-1 border-gray-10 rounded-[4px] gap-2 px-2 w-10 h-10"
              >
                <IconUser />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="rounded-lg">
              <ContentProfile onClosePopover={onClose} disconnect={disconnect} />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default ButtonLoginWallet;
