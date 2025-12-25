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
import { useRouter } from 'next/router';
import {Fragment, useEffect, useState} from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import InputText from '../UI/InputText';
import { useTranslation } from 'next-i18next';
import Link from "next/link";
import {API_PATH} from "@/api/constant";
import {ENV} from "@/utils/env";

const RegisterFormModal = () => {
  const [referralCode, setReferralCode] = useState('');
  const { address, isConnected } = useAccount();
  const { requestGetProfile, loading } = useProfileInitial();
  const [showRegisterForm, setShowRegisterForm] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { t } = useTranslation('common');

  const { run: runLoginWeb3 } = useLoginWeb3({
    onSuccess(res) {
      // toast.success('Login successfully');
      setAuthCookies({
        token: res?.data?.accessToken,
      });
      requestGetProfile();
    },
    onError(err) {
      toast.error(err?.message);
    },
  });

  const handleClose = () => {
    setShowRegisterForm(null);
  };

  const { signMessageAsync } = useSignMessage();

  useEffect(() => {
    // debugger
    // Handle initial connection
    if (!address) return;

    const handleCheckAddress = async () => {
      const res = await serviceCheckAddress(address as string);

      if (res?.data) {
        // check if loginSignature is in local storage
        const loginSignature = localStorage.getItem('loginSignature');
        if (!loginSignature) {
          // get nonce
          try {
            const signMessage = await signMessageAsync({
              message: `i'm the owner of wallet ${address}`,
            });
            localStorage.setItem('loginSignature', signMessage);
          }catch (e) {
            disconnect()
          }

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
      setIsRegistering(true);
      if (!address) {
        toast.error(t('errors.connectWallet'));
        setIsRegistering(false);
        return;
      }
      // Check if address already exists in the database
      if (referralCode) {
        const checkAddressRes = await verifyReferralCode(referralCode);

        if (!checkAddressRes?.data?.exist) {
          toast.error(t('errors.invalidReferral'));
          setIsRegistering(false);
          return;
        }
      }

      const messageNonceRes = await serviceGetUserNonce(address as string);

      const { signature, message } = await signRegistration({
        messageNonce: messageNonceRes?.data,
      });

      if (!signature) {
        setIsRegistering(false);
        handleClose();
        return;
      }

      const prepareRegisterMetadataRes = await fetch(`${ENV.APP_API_URL}${API_PATH.PREPARE_REGISTER_METADATA}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          signature,
          address,
          referralCode: referralCode,
          themeCode: router.query.code as any,
          message,
        })
      })

      if (!prepareRegisterMetadataRes.ok) {
        const errorText = await prepareRegisterMetadataRes.text()
        throw new Error(`HTTP ${prepareRegisterMetadataRes.status}: ${errorText}`)
      }

      const data = await prepareRegisterMetadataRes.json()

      const parentCode = data.parentCode;
      const orderlyAccountId =
          data.orderlyAccountId;

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
        throw new Error(t('errors.registerKeyFailed', { error }));
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
      toast.error(error?.message);
    } finally {
      setIsRegistering(false);
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
          <div className="text-xl font-bold">{t('register.title')}</div>

          <div className="text-md text-gray-500">
            {t('register.description', {
              code:
                showRegisterForm?.themeCode ||
                referralCode ||
                t('register.referral'),
            })}
          </div>

          <div className="text-sm text-red-500">
            Note: You should enable Enable Trading on <Link className={'underline font-bold'} href={"https://trade.what.exchange"}>What Exchange</Link> first, then proceed with registration.
          </div>

          {!showRegisterForm?.themeCode && (
            <InputText
              classInputWrapper="min-w-[400px] bg-white"
              placeholder={t('register.placeholder')}
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
              {t('common.cancel')}
            </div>

            <div
              className={`min-w-[200px] h-[40px] flex justify-center items-center gap-2 w-fit mx-auto text-lg font-semibold ${
                isRegistering
                  ? 'bg-[#02a6c2]/50 cursor-not-allowed'
                  : 'bg-[#02a6c2] cursor-pointer'
              }`}
              onClick={isRegistering ? undefined : handleRegister}
            >
              {isRegistering && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {t('auth.signIn')}
            </div>
          </div>
        </ModalBody>
      </CustomModal>
    </Fragment>
  );
};

export default RegisterFormModal;
