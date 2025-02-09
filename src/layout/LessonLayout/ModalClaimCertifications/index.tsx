/* eslint-disable indent */
import { forwardRef, useImperativeHandle, useState } from 'react';

import { Button, Input, ModalBody, Spinner, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';

interface IModalSupport {}

const ModalClaimCertifications = (props: IModalSupport, ref?: any) => {
  const [visible, setVisible] = useState(false);
  const [dataCertifications, setDataCertifications] = useState<any>({});

  useImperativeHandle(ref, () => {
    return {
      onOpen: (data: any) => {
        setVisible(true);
        setDataCertifications(data);
      },
      onClose: () => setVisible(false),
    };
  });
  const onVisible = () => {
    setVisible(!visible);
  };

  return (
    <CustomModal
      placementMoblie="center"
      size="xl"
      isOpen={visible}
      onClose={onVisible}
    >
      <>
        <ModalBody className="p-6 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Text className="text-white" type="font-18-600">
              You have received a certificate for this course.
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
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex p-4 items-center gap-3 rounded border-1 border-white/10 bg-white/10">
              <Image
                src={dataCertifications?.certificate?.image}
                width={120}
                height={120}
                alt=""
                className="w-[120px] h-[120px] rounded-lg"
              />
              <div className="flex flex-col gap-3">
                <Text type="font-18-600">
                  {dataCertifications?.certificate?.name}
                </Text>
                <Text type="font-16-400" className="text-black-7">
                  {dataCertifications?.certificate?.description}
                </Text>
              </div>
            </div>
          </div>
        </ModalBody>
      </>
    </CustomModal>
  );
};
export default forwardRef(ModalClaimCertifications);

const IconClose = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M16 14.1146L22.6 7.51465L24.4853 9.39998L17.8853 16L24.4853 22.6L22.6 24.4853L16 17.8853L9.39998 24.4853L7.51465 22.6L14.1146 16L7.51465 9.39998L9.39998 7.51465L16 14.1146Z"
        fill="white"
      />
    </svg>
  );
};
