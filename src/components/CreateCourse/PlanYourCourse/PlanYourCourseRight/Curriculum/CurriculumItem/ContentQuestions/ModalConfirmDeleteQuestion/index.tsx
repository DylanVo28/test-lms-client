/* eslint-disable indent */
import { forwardRef, useImperativeHandle, useState } from 'react';

import { Button, Input, ModalBody, Spinner, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';
import { useDeleteCourse } from '@/components/CreateCourse/service';
import { toast } from '@/components/UI/Toast/toast';
interface IModalModalConfirmDeleteQuestion {
  handleSubmitDelete: (values: any) => void;
  loading: boolean;
}

const ModalConfirmDeleteQuestion = (
  props: IModalModalConfirmDeleteQuestion,
  ref?: any
) => {
  const { handleSubmitDelete, loading } = props;
  const [visible, setVisible] = useState(false);
  const [dataDelete, setDataDelete] = useState<any>({});

  useImperativeHandle(ref, () => {
    return {
      onOpen: (values: any) => {
        setDataDelete(values);
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
      size="lg"
      isOpen={visible}
      onClose={onVisible}
    >
      <>
        <ModalBody className="p-6 flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center items-center flex-col gap-2">
              <Image
                alt=""
                src={'/images/img-warning.png'}
                width={120}
                height={120}
                className="w-[120px] h-full mx-auto md:mx-0"
              />
              <Text type="font-20-700" className="text-letter">
                {'Please confirm'}
              </Text>
              <Text type="font-16-400" className="text-letter/70 text-center">
                You are about to delete a question. Are you sure you want to
                continue?
              </Text>
            </div>
            <div className="flex items-end gap-3 justify-end mt-4">
              <Button
                onPress={() => {
                  onVisible();
                  handleSubmitDelete(dataDelete);
                }}
                isLoading={loading}
                className="bg-main w-full min-h-[40px] rounded"
              >
                <Text className="text-letter" type="font-16-600">
                  {'Ok'}
                </Text>
              </Button>
              <Button
                onPress={() => setVisible(false)}
                className="bg-[#383d41] w-full min-h-[40px] rounded"
              >
                <Text className="text-letter" type="font-16-600">
                  {'Cancel'}
                </Text>
              </Button>
            </div>
          </div>
        </ModalBody>
      </>
    </CustomModal>
  );
};
export default forwardRef(ModalConfirmDeleteQuestion);

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
        fill="var(--theme-letter)"
      />
    </svg>
  );
};
