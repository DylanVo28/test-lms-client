/* eslint-disable indent */
import { forwardRef, useImperativeHandle, useState } from 'react';
import ReactPlayer from 'react-player/lazy';

import { Button, Input, ModalBody, Spinner, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';
import { useDeleteCourse } from '@/components/CreateCourse/service';
import { toast } from '@/components/UI/Toast/toast';
import { useTranslation } from 'next-i18next';
import { isMobile } from 'react-device-detect';

interface IModalViewVideo {}

const ModalViewVideo = (props: IModalViewVideo, ref?: any) => {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const [dataVideo, setDataVideo] = useState<any>();

  useImperativeHandle(ref, () => {
    return {
      onOpen: (data: any) => {
        setVisible(true);
        setDataVideo(data);
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
      size="4xl"
      isOpen={visible}
      onClose={onVisible}
    >
      <>
        <ModalBody className="p-6 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <Text className="text-white" type="font-28-700">
              {dataVideo?.title}
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
          <div className="h-[300px] md:h-[500px]">
            <ReactPlayer
              url={dataVideo?.video}
              width="100%"
              height={isMobile ? '300px' : '500px'}
              controls
              playing={visible}
              pip
              config={{
                file: {
                  attributes: {
                    crossOrigin: 'anonymous',
                    controlsList: 'nodownload',
                  },
                },
              }}
            />
          </div>
        </ModalBody>
      </>
    </CustomModal>
  );
};
export default forwardRef(ModalViewVideo);

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
