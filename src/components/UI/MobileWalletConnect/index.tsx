import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { useMobileWalletConnection } from '@/hooks/useMobileWalletConnection';
import { isMobile, isMetaMaskInAppBrowser } from '@/utils/mobileDetection';
import Text from '../Text';
import IconUser from '../Icons/IconUser';
import ContentProfile from '@/layout/MainLayout/MainHeader/ContentProfile';

interface MobileWalletConnectProps {
  setVisible?: (visible: boolean) => void;
}

const MobileWalletConnect: React.FC<MobileWalletConnectProps> = ({ setVisible }) => {
  const {
    isConnecting,
    isConnected,
    address,
    connect,
    disconnect,
    connectionMethod,
    isMobileDevice,
  } = useMobileWalletConnection();

  const [isOpen, setOpen] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const onClose = () => {
    setOpen(false);
    if (setVisible) {
      setVisible(false);
    }
  };

  const onOpen = () => {
    setOpen(true);
  };

  const handleConnect = async () => {
    try {
      setConnectionError(null);
      setShowConnectionModal(false);
      await connect();
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
      setShowConnectionModal(true);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const getConnectionButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (isMobileDevice && !isMetaMaskInAppBrowser()) {
      return 'Connect with WalletConnect';
    }
    return 'Connect Wallet';
  };

  const getConnectionMethodText = () => {
    if (isMobileDevice && !isMetaMaskInAppBrowser()) {
      return 'WalletConnect (Recommended for mobile)';
    }
    return 'MetaMask / Browser Wallet';
  };

  useEffect(() => {
    if (isConnected) {
      setShowConnectionModal(false);
      setConnectionError(null);
    }
  }, [isConnected]);

  if (isConnected && address) {
    return (
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          content: 'rounded border-1 p-0 !bg-gray border-[#F0F0F01A] shadow-dropdown',
        }}
        color="default"
        placement="bottom-end"
        onOpenChange={onOpen}
      >
        <PopoverTrigger>
          <Button
            isIconOnly
            className="bg-gray-10 border-1 border-gray-10 rounded-[4px] w-10 h-10"
          >
            <IconUser />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-lg">
          <ContentProfile
            onClosePopover={onClose}
            disconnect={handleDisconnect}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <Button
        onPress={() => setShowConnectionModal(true)}
        className="bg-main w-full min-h-[40px] rounded"
        disabled={isConnecting}
      >
        <Text className="text-letter" type="font-16-600">
          {getConnectionButtonText()}
        </Text>
      </Button>

      <Modal 
        isOpen={showConnectionModal} 
        onClose={() => setShowConnectionModal(false)}
        size="sm"
        classNames={{
          base: "bg-gray-900 border border-gray-700",
          header: "border-b border-gray-700",
          body: "py-6",
          footer: "border-t border-gray-700",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <Text className="text-white" type="font-18-600">
              Connect Wallet
            </Text>
            <Text className="text-gray-400 text-sm" type="font-14-400">
              {getConnectionMethodText()}
            </Text>
          </ModalHeader>
          
          <ModalBody>
            {connectionError && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mb-4">
                <Text className="text-red-400 text-sm" type="font-14-400">
                  {connectionError}
                </Text>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <Text className="text-white mb-2" type="font-16-600">
                  Connection Method
                </Text>
                <Text className="text-gray-400 text-sm" type="font-14-400">
                  {isMobileDevice && !isMetaMaskInAppBrowser() 
                    ? 'Using WalletConnect for optimal mobile experience'
                    : 'Using MetaMask or browser wallet'
                  }
                </Text>
              </div>
              
              {isMobileDevice && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                  <Text className="text-blue-400 text-sm" type="font-14-400">
                    💡 Mobile detected: WalletConnect will provide the best experience
                  </Text>
                </div>
              )}
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setShowConnectionModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-main"
              onPress={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MobileWalletConnect;
