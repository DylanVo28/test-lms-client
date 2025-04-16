import CustomModal from '@/components/UI/CustomModal';
import { toast } from '@/components/UI/Toast/toast';
import {
  registerUser,
  useLoginWeb3,
} from '@/layout/MainLayout/MainHeader/service';
import { setAuthCookies } from '@/store/auth';
import { ModalBody } from '@nextui-org/react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import InputText from '../UI/InputText';

interface IRegisterFormModal {
  registerFormData?: {
    address?: string;
    signature?: string;
    themeCode?: string;
    referralCode?: string;
  };
  handleClose: () => void;
}

const RegisterFormModal = ({
  registerFormData,
  handleClose,
}: IRegisterFormModal) => {
  const { t } = useTranslation('common');
  const [referralCode, setReferralCode] = useState('');

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

  const handleRegister = async () => {
    try {
      await registerUser({
        referralCode,
        ...registerFormData,
      });

      runLoginWeb3({
        address: registerFormData?.address,
        signature: registerFormData?.signature,
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
      isOpen={!!registerFormData}
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
