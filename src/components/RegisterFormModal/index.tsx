import CustomModal from '@/components/UI/CustomModal';
import { toast } from '@/components/UI/Toast/toast';
import useSignAddOrderlyKey from '@/hooks/useSignAddOrderlyKey';
import useSignRegistration from '@/hooks/useSignRegistration';
import {
  bindReferralCode,
  registerUser,
  serviceAddOrderlyKey,
  serviceCheckAddress,
  serviceGetUserNonce,
  useLoginWeb3,
  verifyReferralCode,
} from '@/layout/MainLayout/MainHeader/service';
import { setAuthCookies } from '@/store/auth';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import { ModalBody } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import InputText from '../UI/InputText';

const RegisterFormModal = () => {
  const { t } = useTranslation('common');
  const [referralCode, setReferralCode] = useState('');
  const { address, isConnected } = useAccount();
  const { requestGetProfile } = useProfileInitial();
  const [showRegisterForm, setShowRegisterForm] = useState<any>(null);
  const router = useRouter();

  const { run: runLoginWeb3 } = useLoginWeb3({
    onSuccess(res) {
      // toast.success(t('Login successfully'));
      setAuthCookies({
        token: res?.data?.accessToken,
      });
      requestGetProfile();
    },
    onError(err) {
      console.log('errrrrrr', err);
      toast.error(err?.message);
    },
  });

  const handleClose = () => {
    setShowRegisterForm(null);
  };

  useEffect(() => {
    // Handle initial connection
    if (!isConnected) return;

    const handleCheckAddress = async () => {
      const res = await serviceCheckAddress(address as string);
      if (res?.data) {
        const loginRes = await runLoginWeb3({
          address: address as string,
        });
        return;
      }

      const themeCode =
        router?.query?.code === 'platform' ? '' : router?.query?.code;

      // because we need a direct user actions, to show metamask popup
      setShowRegisterForm({
        isShow: true,
        themeCode: themeCode as any,
      });
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

      const parentCode = registerRes?.data?.parentCode;
      const orderlyAccountId = registerRes?.data?.orderlyAccountId;

      if (parentCode && orderlyAccountId) {
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
          orderlyAccountId,
          referralCode: parentCode,
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
      console.log('error::::::', error);
      toast.error(t(error?.message));
    }
  };

  useEffect(() => {
    setReferralCode('');
  }, [showRegisterForm]);

  return (
    <CustomModal
      placementMoblie="center"
      size="lg"
      isOpen={showRegisterForm}
      onClose={handleClose}
    >
      <ModalBody className="p-6 flex flex-col gap-4 bg-[#191c21]">
        <div className="text-xl font-bold">Register account</div>

        <div className="text-md text-gray-500">
          You register an account using{' '}
          <span className="text-white font-semibold">
            [{showRegisterForm?.themeCode || referralCode || 'Referral'}]
          </span>{' '}
          code, and you will receive a signature request to enable read access.
          Signing is free and does not send a transaction.
        </div>

        {!showRegisterForm?.themeCode && (
          <InputText
            classInputWrapper="min-w-[400px] bg-white"
            placeholder="Referral code (Optional)"
            isInputSubmit
            onChange={(e: any) => setReferralCode(e.target.value)}
          />
        )}
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
