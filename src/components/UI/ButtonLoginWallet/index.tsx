import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@nextui-org/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Text from '../Text';
import Image from 'next/image';
import ContentProfile from '@/layout/MainLayout/MainHeader/ContentProfile';
import { useDisconnect } from 'wagmi';
import { useState } from 'react';

const ButtonLoginWallet = () => {
    const { disconnect } = useDisconnect();
    const [isOpen, setOpen] = useState(false);
    const onClose = () => {
        setOpen(false);
    }
    const onOpen = () => {
        setOpen(true);
    }
    return (
        <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div>
                        {!connected ? (
                            <Button
                                onClick={openConnectModal}
                                className="bg-main w-full min-h-[40px] rounded"
                            >
                                <Text className="text-white" type="font-16-600">
                                    Connect Wallet
                                </Text>
                            </Button>
                        ) : (
                            <Popover
                                isOpen={isOpen}
                                onClose={onClose}
                                onOpenChange={onOpen}
                                classNames={{
                                    content:
                                        'rounded border-1 p-0 !bg-gray border-[#F0F0F01A] shadow-dropdown',
                                }}
                                color="default"
                                placement="bottom-end"
                            >
                                <PopoverTrigger>
                                    <Button
                                        isIconOnly
                                        className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10"
                                    >
                                        <Image
                                            src={'/icons/ic-user.svg'}
                                            height={20}
                                            width={20}
                                            alt=""
                                        />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <ContentProfile onClosePopover={onClose} disconnect={disconnect} />
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};

export default ButtonLoginWallet;
