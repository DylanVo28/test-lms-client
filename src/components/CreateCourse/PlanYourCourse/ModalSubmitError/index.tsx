/* eslint-disable indent */
import { forwardRef, useImperativeHandle, useState } from 'react';

import { Button, Input, ModalBody, Spinner, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';
import { useDeleteCourse } from '@/components/CreateCourse/service';
import { toast } from '@/components/UI/Toast/toast';

interface IModalSubmitError {}

const ModalSubmitError = (props: IModalSubmitError, ref?: any) => {
  const [visible, setVisible] = useState(false);

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

  return (
    <CustomModal
      placementMoblie="center"
      size="md"
      isOpen={visible}
      onClose={onVisible}
    >
      <>
        <ModalBody className="p-6 flex flex-col gap-2">
          <div className="flex justify-center items-center flex-col gap-2">
            <Image
              alt=""
              src={'/images/img-warning.png'}
              width={120}
              height={120}
              className="w-[120px] h-full mx-auto md:mx-0"
            />
            <Text type="font-20-700" className="text-white">
              Publish course
            </Text>
            <Text type="font-16-400" className="text-black-6">
              Please enter for required fields
            </Text>
            <Button
              onClick={onVisible}
              className="bg-main w-full min-h-[40px] rounded mt-2"
            >
              <Text className="text-white" type="font-16-600">
                Ok
              </Text>
            </Button>
          </div>
        </ModalBody>
      </>
    </CustomModal>
  );
};
export default forwardRef(ModalSubmitError);
