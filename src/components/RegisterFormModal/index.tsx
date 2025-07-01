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
  servicePrepareRegisterMetadata,
  useLoginWeb3,
  verifyReferralCode,
} from '@/layout/MainLayout/MainHeader/service';
import { setAuthCookies } from '@/store/auth';
import { useProfileInitial } from '@/store/profile/useProfileInitial';
import { ModalBody } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import InputText from '../UI/InputText';

const RegisterFormModal = () => {
  const { t } = useTranslation('common');
  const [referralCode, setReferralCode] = useState('');
  const { address, isConnected } = useAccount();
  const { requestGetProfile, loading } = useProfileInitial();
  const [showRegisterForm, setShowRegisterForm] = useState<any>(null);
  const router = useRouter();
  const { disconnect } = useDisconnect();

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

  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    // Handle initial connection
    if (!address) return;

    const handleCheckAddress = async () => {
      const res = await serviceCheckAddress(address as string);

      if (res?.data) {
        // check if loginSignature is in local storage
        const loginSignature = localStorage.getItem('loginSignature');
        if (!loginSignature) {
          // get nonce
          const signMessage = await signMessageAsync({
            message: `i'm the owner of wallet ${address}`,
          });
          localStorage.setItem('loginSignature', signMessage);
        }

        const loginRes = await runLoginWeb3({
          address: address as string,
          signMessage: loginSignature,
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

    // lib need time to refresh state
    const timer = setTimeout(() => {
      handleCheckAddress();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isConnected]);

  const signRegistration = useSignRegistration();

  const signAddOrderlyKey = useSignAddOrderlyKey();

  const handleRegister = async () => {
    try {
      if (!address) {
        toast.error(t('Please connect your wallet'));
        return;
      }
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

      if (!signature) {
        window.location.reload();
        return;
      }

      const prepareRegisterMetadataRes = await servicePrepareRegisterMetadata({
        signature,
        message,
        address,
        themeCode: router.query.code as any,
      });

      const parentCode = prepareRegisterMetadataRes?.data?.parentCode;
      const orderlyAccountId =
        prepareRegisterMetadataRes?.data?.orderlyAccountId;

      const {
        message: addOrderlyKeyMessage,
        signature: addOrderlyKeySignature,
        orderlyKey,
        privKey,
      } = await signAddOrderlyKey();

      const res = await fetch('https://api.orderly.org/v1/orderly_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          message: addOrderlyKeyMessage,
          signature: addOrderlyKeySignature,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Đăng ký key thất bại: ${error}`);
      }

      if (parentCode && orderlyAccountId) {
        // call api add orderly key
        await serviceAddOrderlyKey({
          message: addOrderlyKeyMessage,
          signature: addOrderlyKeySignature,
          userAddress: address,
        });

        // bind orderly key to user
        await bindReferralCode({
          orderlyAccountId,
          referralCode: parentCode,
          orderlyKey,
          privKey,
        });
      }

      const orderlyMetadata = {
        accountId: orderlyAccountId,
        orderlyKey: orderlyKey,
        orderlySecretKey: privKey,
      };

      console.log('orderlyMetadata', signature, orderlyMetadata);

      await registerUser({
        referralCode,
        signature,
        address,
        themeCode: router.query.code as any,
        message,
        orderlyMetadata,
      });

      runLoginWeb3({
        address: address,
        signature: signature,
      });

      handleClose();
    } catch (error: any) {
      toast.error(t(error?.message));
    }
  };

  useEffect(() => {
    setReferralCode('');
  }, [showRegisterForm]);

  return (
    <Fragment>
      <CustomModal
        placementMoblie="center"
        size="lg"
        isOpen={showRegisterForm}
        onClose={() => {}}
      >
        <ModalBody className="p-6 flex flex-col gap-4 bg-[#191c21]">
          <div className="text-xl font-bold">Register account</div>

          <div className="text-md text-gray-500">
            You register an account using{' '}
            <span className="text-white font-semibold">
              [{showRegisterForm?.themeCode || referralCode || 'Referral'}]
            </span>{' '}
            code, and you will receive a signature request to enable read
            access. Signing is free and does not send a transaction.
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
              onClick={() => {
                handleClose();
                disconnect();
              }}
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
    </Fragment>
  );
};

export default RegisterFormModal;
