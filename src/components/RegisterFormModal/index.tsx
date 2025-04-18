import CustomModal from '@/components/UI/CustomModal';
import { toast } from '@/components/UI/Toast/toast';
import {
  bindReferralCode,
  registerUser,
  serviceAddOrderlyKey,
  serviceCheckAddress,
  serviceGetUserNonce,
  useGetUserNonce,
  useLoginWeb3,
  verifyReferralCode,
} from '@/layout/MainLayout/MainHeader/service';
import { setAuthCookies } from '@/store/auth';
import { ModalBody } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import InputText from '../UI/InputText';
import useSignAddOrderlyKey from '@/hooks/useSignAddOrderlyKey';
import { useAccount, useDisconnect } from 'wagmi';
import useAccessToken from '@/store/auth/hook/useAccessToken';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import { initialProfile } from '@/store/profile/profile';
import { useRouter } from 'next/router';
import useSignRegistration from '@/hooks/useSignRegistration';

interface IRegisterFormModal {
  registerFormData?: {
    address?: string;
    signature?: string;
    themeCode?: string;
    referralCode?: string;
  };
  handleClose: () => void;
}

const RegisterFormModal = () => {
  const { t } = useTranslation('common');
  const [referralCode, setReferralCode] = useState('');
  const { address, isConnected } = useAccount();
  const token = useAccessToken();
  const { requestGetProfile, setProfile } = useProfileInitial();
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const prevAddress = useRef<string | null>(null);

  const { run: runLoginWeb3 } = useLoginWeb3({
    onSuccess(res) {
      toast.success(t('Login successfully'));
      setAuthCookies({
        token: res?.data?.accessToken,
      });
    },
    onError(err) {
      console.log('errrrrrr', err);
      toast.error(err?.message);
    },
  });

  const handleClose = () => {
    setShowRegisterForm(false);
  };

  useEffect(() => {
    // Handle initial connection
    if (!isConnected) return;

    const handleCheckAddress = async () => {
      const res = await serviceCheckAddress(address as string);
      if (res?.data) {
        runLoginWeb3({
          address: address as string,
        });
        return;
      }
      setShowRegisterForm(true);
    };

    handleCheckAddress();
  }, [isConnected]);

  const signRegistration = useSignRegistration();

  const signAddOrderlyKey = useSignAddOrderlyKey();

  const handleRegister = async () => {
    try {
      // Check if address already exists in the database
      if (referralCode) {
        const checkAddressRes = await verifyReferralCode(referralCode);

        if (!checkAddressRes?.data?.exist) {
          toast.error(t('Referral code is invalid'));
          return;
        }
      }

      const messageNonceRes = await serviceGetUserNonce(address as string);

      const { signature, message } = await signRegistration({
        messageNonce: messageNonceRes?.data,
      });

      const registerRes = await registerUser({
        referralCode,
        signature,
        address,
        themeCode: router.query.code as any,
        message,
      });

      if (registerRes?.status === true && referralCode) {
        const {
          message: addOrderlyKeyMessage,
          signature: addOrderlyKeySignature,
          orderlyKey,
          privKey,
        } = await signAddOrderlyKey();

        // call api add orderly key
        const addOrderlyKeyRes = await serviceAddOrderlyKey({
          message: addOrderlyKeyMessage,
          signature: addOrderlyKeySignature,
          userAddress: address,
        });

        // bind orderly key to user
        const bindReferralCodeRes = await bindReferralCode({
          orderlyAccountId: registerRes?.data?.account_id,
          referralCode,
          orderlyKey,
          privKey,
        });
      }

      runLoginWeb3({
        address: address,
        signature: signature,
      });

      handleClose();
    } catch (error: any) {
      toast.error(t(error?.message));
    }
  };

  return (
    <CustomModal
      placementMoblie="center"
      size="lg"
      isOpen={showRegisterForm}
      onClose={handleClose}
    >
      <ModalBody className="p-6 flex flex-col gap-4 bg-[#191c21]">
        <div className="text-xl font-bold">Connect wallet</div>

        <div className="text-md text-gray-500">
          Your previous access has expired, you will receive a signature request
          to enable trading. Signing is free and will not send a transaction.
        </div>

        <InputText
          classInputWrapper="min-w-[400px] bg-white"
          placeholder="Referral code (Optional)"
          isInputSubmit
          onChange={(e: any) => setReferralCode(e.target.value)}
        />

        <div className="flex gap-x-2">
          <div
            className="min-w-[200px] h-[40px] flex justify-center items-center bg-[#1d2329] w-fit mx-auto cursor-pointer text-lg font-semibold"
            onClick={handleClose}
          >
            Cancel
          </div>

          <div
            className="min-w-[200px] h-[40px] flex justify-center items-center bg-[#02a6c2] w-fit mx-auto cursor-pointer text-lg font-semibold"
            onClick={handleRegister}
          >
            Sign in
          </div>
        </div>
      </ModalBody>
    </CustomModal>
  );
};

export default RegisterFormModal;
