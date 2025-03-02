/* eslint-disable indent */
import { forwardRef, useImperativeHandle, useState } from 'react';

import { Button, Input, ModalBody, Spinner, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';
import { useDeleteCourse } from '@/components/CreateCourse/service';
import { toast } from '@/components/UI/Toast/toast';
import IconClose from '../Icons/IconClose';
import InputText from '../InputText';
import { XLogo } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import { ENV } from '@/utils/env';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

interface IModalShare {}

const ModalShare = (props: IModalShare, ref?: any) => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useImperativeHandle(ref, () => {
    return {
      onOpen: (id: string) => {
        setVisible(true);
      },
      onClose: () => setVisible(false),
    };
  });
  const onVisible = () => {
    setVisible(!visible);
  };

  const onCopy = () => {
    const linkCopy = `${ENV.APP_URL}/course/${router.query.id}`;
    window.navigator.clipboard.writeText(linkCopy);
    toast.success('Copied!');
  };

  return (
    <CustomModal
      placementMoblie="center"
      size="2xl"
      isOpen={visible}
      onClose={onVisible}
    >
      <>
        <ModalBody className="p-6 flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <Text className="text-white" type="font-28-700">
              Share this course
            </Text>
            <Button
              onClick={onVisible}
              isIconOnly
              variant="light"
              radius="full"
            >
              <IconClose />
            </Button>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <InputText
                placeholder={`${ENV.APP_URL}/course/${router.query.id}`}
                isReadOnly
                classInputWrapper="min-w-[450px] min-h-[44px]"
                inputShare
              />
              <Button
                onClick={onCopy}
                className="bg-main w-full min-h-[44px] rounded"
              >
                <Text className="text-white" type="font-16-600">
                  Copy
                </Text>
              </Button>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <FacebookShareButton
                url={`${ENV.APP_URL}/course/${router.query.id}`}
              >
                <button className="w-10 hover:opacity-80 h-10 bg-white-5 flex items-center justify-center rounded-lg">
                  <IconFacebook />
                </button>
              </FacebookShareButton>
              <TwitterShareButton
                url={`${ENV.APP_URL}/course/${router.query.id}`}
              >
                <button className="w-10 hover:opacity-80 h-10 bg-white-5 flex items-center justify-center rounded-lg">
                  <XLogo className="text-white" size={20} />
                </button>
              </TwitterShareButton>
            </div>
          </div>
        </ModalBody>
      </>
    </CustomModal>
  );
};
export default forwardRef(ModalShare);

const IconFacebook = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="20"
      viewBox="0 0 12 20"
      fill="none"
    >
      <path
        d="M10.6802 11.2493L11.2501 7.63143H7.73942V5.27982C7.73942 4.29056 8.22955 3.32391 9.79683 3.32391H11.4154V0.243075C10.4728 0.0929007 9.5204 0.0116567 8.56581 0C5.67631 0 3.78987 1.73544 3.78987 4.87281V7.63143H0.586914V11.2493H3.78987V20H7.73942V11.2493H10.6802Z"
        fill="#337FFF"
      />
    </svg>
  );
};
