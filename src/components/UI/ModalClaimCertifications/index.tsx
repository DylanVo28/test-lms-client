/* eslint-disable indent */
import { forwardRef, useImperativeHandle, useState } from 'react';

import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';
import { Button, ModalBody } from '@nextui-org/react';
import Image from 'next/image';
import IconClose from '../Icons/IconClose';

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
              onPress={onVisible}
              isIconOnly
              variant="light"
              radius="full"
            >
              <IconClose />
            </Button>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex p-4 items-center gap-3 rounded border-1 border-white-10 bg-white-10">
              <Image
                src={dataCertifications?.certificate?.image}
                alt=""
                width={120}
                height={120}
                className="w-[120px] h-[120px] rounded-lg"
                onError={(e: any) => {
                  e.target.srcset = '/images/img-certification.png';
                }}
              />
              <div className="flex flex-col gap-3 flex-1">
                <Text type="font-16-600">
                  {dataCertifications?.certificate?.name}
                </Text>
                <Text type="font-14-400" className="text-black-7">
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
