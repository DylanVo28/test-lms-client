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
import { setAuthCookies, getAccessToken } from '@/store/auth';
import { ModalBody } from '@nextui-org/react';
import { useRouter } from 'next/router';
import {Fragment, useEffect, useState} from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import InputText from '../UI/InputText';
import { useTranslation } from 'next-i18next';
import {API_PATH} from "@/api/constant";
import {ENV} from "@/utils/env";
import { useRef } from 'react';
import {useAccountInfo} from "@/hooks/useAccountInfo";
import {get} from "lodash";
import {useDebounceCallback} from "usehooks-ts";
const RegisterFormModal = () => {
  const [referralCode, setReferralCode] = useState('');
  const { address, isConnected } = useAccount();
  const [showRegisterForm, setShowRegisterForm] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { t } = useTranslation('common');
  const {getReferralInfo}=useAccountInfo()
  const  isExistOrderlyAccount = useRef(false);

  const storeRef=useRef({
    accountId: '',
    privKey:'',
    orderlyKey:'',
    signature:'',
    message: {
      brokerId: '',
      chainId:'',
      orderlyKey: '',
      scope: '',
      timestamp: '',
      expiration: '',
    },
    refCodeKol: ''
  })

  const [isKol, setIsKol] = useState(true);
  const { run: runLoginWeb3 } = useLoginWeb3({
    onSuccess(res) {
      // toast.success('Login successfully');
      setAuthCookies({
        token: res?.data?.accessToken,
      });
      // requestGetProfile();
    },
    onError(err) {
      toast.error(err?.message);
    },
  });
  const { signMessageAsync } = useSignMessage();



  const handleClose = () => {
    setShowRegisterForm(null);
  };

  const handleCheckAccount = async () => {

    // Check if account exists in Orderly
    try {
      const checkAccountRes = await fetch(
          `https://api.orderly.org/v1/get_account?address=${address}&broker_id=what_exchange&chain_type=EVM`
      );

      if (checkAccountRes.ok) {
        const accountData = await checkAccountRes.json();

        // If account exists (success: true), skip registration
        if (accountData?.success === true) {
          isExistOrderlyAccount.current = true;
        } else {
          isExistOrderlyAccount.current = false;
        }


      }
    } catch (error: any) {
      // If check fails, continue with registration (fail-safe)
      console.error('Error checking account:', error);
    }
  }

  const signRegistration = useSignRegistration();

  const signAddOrderlyKey = useSignAddOrderlyKey();
  const handleRegister = async () => {
    if(isExistOrderlyAccount.current) {
      await handleRegisterWithExistCode();
    } else {
      await handleRegisterWithoutExistCode();
    }
  }

  const handleRegisterWithExistCode = async () => {
    setIsRegistering(true);
    if (!address) {
      toast.error(t('errors.connectWallet'));
      setIsRegistering(false);
      return;
    }

    try{
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
      let refCode=''
      if (storeRef.current.accountId) {
        // call api add orderly key
        const data=await serviceAddOrderlyKey({
          message: storeRef.current.message,
          signature: storeRef.current.signature,
          userAddress: address,
        });
        const referralInfo=await getReferralInfo({orderlyAccountId: storeRef.current.accountId,
          orderlySecretKey: storeRef.current.privKey, orderlyKey: storeRef.current.orderlyKey})
        refCode= get(referralInfo,'data.referee_info.referer_code','')
// bind orderly key to user
        await bindReferralCode({
          orderlyAccountId: storeRef.current.accountId,
          referralCode: refCode,
          orderlyKey: storeRef.current.orderlyKey,
          privKey: storeRef.current.privKey,
        });


      }
      const orderlyMetadata = {
        accountId: storeRef.current.accountId,
        orderlyKey: storeRef.current.orderlyKey,
        orderlySecretKey: storeRef.current.privKey,
      };


      await registerUser({
        referralCode:  refCode,
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
      router.replace(`/${refCode}`)

    }
    catch(error: any) {
      toast.error(error?.message);
    }
    finally {
      setIsRegistering(false);
    }
  }

  const handleRegisterWithoutExistCode = async () => {
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
          referralCode: referralCode.length !== 0 ? referralCode : 'WHATLEARN',
          themeCode: router.query.code as any,
          message,
        })
      })

      if (!prepareRegisterMetadataRes.ok) {
        const errorText = await prepareRegisterMetadataRes.text()
        throw new Error(`HTTP ${prepareRegisterMetadataRes.status}: ${errorText}`)
      }

      const data = await prepareRegisterMetadataRes.json()

      const parentCode = data.data.parentCode;
      const orderlyAccountId =
          data.data.orderlyAccountId;
      const {privKey, orderlyKey, signature: signatureOrderly, message:messageOrderly}=await signAddOrderlyKey()


      const res = await fetch('https://api.orderly.org/v1/orderly_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          message: messageOrderly,
          signature: signatureOrderly,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(t('errors.registerKeyFailed', { error }));
      }

      if (parentCode && orderlyAccountId) {
        // call api add orderly key
        await serviceAddOrderlyKey({
          message:messageOrderly,
          signature: signatureOrderly,
          userAddress: address,
        });

        // bind orderly key to user
        await bindReferralCode({
          orderlyAccountId,
          referralCode: parentCode,
          orderlyKey:orderlyKey,
          privKey:privKey,
        });
      }

      const orderlyMetadata = {
        accountId: orderlyAccountId,
        orderlyKey: orderlyKey,
        orderlySecretKey: privKey,
      };


      await registerUser({
        referralCode:  referralCode.length !== 0 ? referralCode : 'WHATLEARN',
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
      router.replace(`/${referralCode.length !== 0 ? referralCode : 'WHATLEARN'}`)

    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const checkIsKolApi = async (code: string): Promise<void> => {
    if(code==='WHATLEARN'){
      setIsKol(true)
      return
    }

    if (!code) {
      setIsKol(false);
      return;
    }

    try {

      const res = await fetch(
        `${ENV.APP_API_URL}/api/auth/is-kol?referralCode=${encodeURIComponent(code)}`,
        {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!res.ok) {
        setIsKol(false);
        return;
      }

      const data = await res.json();
      
      if (data?.status === true && data?.data?.isKol === true) {
        setIsKol(true);
      } else {
        setIsKol(false);
      }
    } catch (error) {
      console.error('Error checking KOL:', error);
      setIsKol(false);
    }
  };

  const checkIsKol = useDebounceCallback(checkIsKolApi, 1000);

  const init=useDebounceCallback(async ()=>{
    try {
      const getAccountRes = await fetch(
          `https://api.orderly.org/v1/get_all_accounts?address=${address}&broker_id=what_exchange&chain_type=EVM`
      );

      if (!getAccountRes.ok) {
        throw new Error('Failed to get orderly account');
      }

      const accountData = await getAccountRes.json();

      if (!accountData?.success || !accountData?.data?.rows || accountData.data.rows.length === 0) {
        throw new Error('Orderly account not found');
      }

      const orderlyAccountId = accountData.data.rows[0].account_id;

      const {privKey, orderlyKey, signature: signatureOrderly, message:messageOrderly}=await signAddOrderlyKey()
      const res = await fetch('https://api.orderly.org/v1/orderly_key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          message: messageOrderly,
          signature: signatureOrderly,
        }),
      });
      const referralInfo=await getReferralInfo({orderlyAccountId, orderlySecretKey: privKey, orderlyKey: orderlyKey})
      const refCode= get(referralInfo,'data.referee_info.referer_code','WHATLEARN')
      setReferralCode(refCode)
      storeRef.current={
        accountId: orderlyAccountId,
        privKey:privKey,
        orderlyKey:orderlyKey,
        message: messageOrderly,
        signature: signatureOrderly,
        refCodeKol: refCode
      }

    }catch (error) {}
  },3000)

  useEffect(() => {
    if (referralCode.length > 0) {
      setIsRegistering(true);
      checkIsKol(referralCode);
      // Use setTimeout to reset loading state after debounce delay + API call time
      const timeoutId = setTimeout(async () => {
        await checkIsKolApi(referralCode);
        setIsRegistering(false);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setIsKol(true);
      setIsRegistering(false);
      setReferralCode('WHATLEARN')
    }
  }, [referralCode]);

  useEffect(() => {
    if(address && isExistOrderlyAccount.current){
      setTimeout(()=>init(),0)
    }
  }, [address, isExistOrderlyAccount.current]);

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


  useEffect(() => {
    if(address) {
      handleCheckAccount();
    }
  }, [address]);


  useEffect(() => {
    if(showRegisterForm && showRegisterForm.themeCode){
        setReferralCode(showRegisterForm.themeCode);
        return
    }
    setReferralCode('');
  }, [showRegisterForm]);
  // !isKol && (referralCode || !isExistOrderlyAccount.current)
  console.log({
    isKol,
    referralCode,
    isExistOrderlyAccount: isExistOrderlyAccount.current
  })
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

          {!showRegisterForm?.themeCode && (
            <InputText
              classInputWrapper="min-w-[400px] bg-white"
              placeholder={t('register.placeholder')}
              isInputSubmit
              value={referralCode}
              onChange={(e: any) => setReferralCode(e.target.value)}
            />
          )}
          {
            isKol  && referralCode !== storeRef.current.refCodeKol && isExistOrderlyAccount.current && <div>
            Note: Your account is currently referred by {storeRef.current.refCodeKol}. If the referral code you entered is {referralCode}, then clicking "Sign In" will change your account’s referral to the KOL {referralCode}. Please double-check before proceeding.
              </div>
          }
          {
            !isKol && referralCode && <div>
            Note: Your KOL referral has not been activated on What Academy yet. Please log in using a different referral code or use the default referral WHATLEARN.
              </div>
          }
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
                (isRegistering || !isKol)
                  ? 'bg-[#02a6c2]/50 cursor-not-allowed'
                  : 'bg-[#02a6c2] cursor-pointer'
              }`}

              onClick={!isRegistering && isKol ? handleRegister : undefined}
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
