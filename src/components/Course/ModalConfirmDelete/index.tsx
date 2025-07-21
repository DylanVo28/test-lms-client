/* eslint-disable indent */
import { forwardRef, useImperativeHandle, useState } from 'react';

import { Button, Input, ModalBody, Spinner, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';
import { useDeleteCourse } from '@/components/CreateCourse/service';
import { toast } from '@/components/UI/Toast/toast';
interface IModalSupport {
  reload: any;
}

const ModalConfirmDelete = (props: IModalSupport, ref?: any) => {
  const [visible, setVisible] = useState(false);
  const [courseId, setCourseId] = useState<any>();

  const { run: runDeleteCourse, loading } = useDeleteCourse({
    onSuccess(res: any) {
      props.reload();
      setVisible(false);
      toast.success('Delete course successfully');
    },
  });

  useImperativeHandle(ref, () => {
    return {
      onOpen: (id: string) => {
        setCourseId(id);
        setVisible(true);
      },
      onClose: () => setVisible(false),
    };
  });
  const onVisible = () => {
    setVisible(!visible);
  };

  const submitDeleteCourse = () => {
    if (loading) return;
    runDeleteCourse(courseId);
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
            <div className="font-bold text-[20px]">{'Delete Course'}</div>
            <div className="font-normal text-base text-[#BFBFBF] text-center">
              Course information cannot be restored after cancellation and
              students cannot continue taking this course, are you sure you want
              to cancel the course?
            </div>
            <Button
              onPress={submitDeleteCourse}
              className="bg-main w-full min-h-[40px] rounded mt-2"
            >
              <Text className="text-letter" type="font-16-600">
                {'Submit'}
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
        </ModalBody>
      </>
    </CustomModal>
  );
};
export default forwardRef(ModalConfirmDelete);

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
