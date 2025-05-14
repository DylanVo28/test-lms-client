/* eslint-disable indent */
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ReactPlayer from 'react-player/lazy';

import { Button, Input, ModalBody, Spinner, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import CustomModal from '@/components/UI/CustomModal';
import Text from '@/components/UI/Text';
import { useDeleteCourse } from '@/components/CreateCourse/service';
import { toast } from '@/components/UI/Toast/toast';
import { useTranslation } from 'next-i18next';
import { isMobile } from 'react-device-detect';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hls-quality-selector';
import 'videojs-contrib-quality-levels';
interface IModalViewVideo {}

const ModalViewVideo = (props: IModalViewVideo, ref?: any) => {
  const { t } = useTranslation('common');
  const [visible, setVisible] = useState(false);
  const [dataVideo, setDataVideo] = useState<any>();
  const videoRef: any = useRef(null);
  const playerRef: any = useRef(null);

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

  const determineVideoType = (url: string): string => {
    if (url.includes('.m3u8')) return 'application/x-mpegURL';
    if (url.includes('.mp4')) return 'video/mp4';
    if (url.includes('.webm')) return 'video/webm';
    return 'video/mp4';
  };

  useEffect(() => {
    // Initialize player if it doesn't exist
    if (!playerRef.current) {
      const videoElement = document.createElement('video');
      videoElement.className = 'video-js vjs-big-play-centered';
      videoElement.controls = true;
      videoElement.preload = 'auto';
      videoElement.crossOrigin = 'anonymous';

      // Replace old video element with new one
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      const handleFullscreenChange = () => {
        if (playerRef.current.isFullscreen()) {
          videoElement.className = 'fullscreen-mode';
        } else {
          videoElement.className = 'exit-fullscreen';
        }
      };

      const options = {
        controls: true,
        responsive: true,
        fluid: true,
        autoplay: false,
        preload: 'auto',

        html5: {
          hls: {
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            overrideNative: true,
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false,
        },
      };

      try {
        playerRef.current = videojs(
          videoElement,
          options,
          function onPlayerReady() {
            playerRef.current.hlsQualitySelector();
            console.log(t('Player is ready'));
          }
        );

        playerRef.current.on('fullscreenchange', handleFullscreenChange);

        playerRef.current.on('error', function (error: any) {
          console.error(t('Video player error') + ':', error);
        });
      } catch (error) {
        console.error(t('Player initialization error') + ':', error);
      }
    }

    // Update source when URL changes
    if (playerRef.current && dataVideo?.video) {
      try {
        playerRef.current.src({
          src: dataVideo?.video,
          type: determineVideoType(dataVideo?.video),
        });
      } catch (error) {
        console.error(t('Error updating video source') + ':', error);
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
          playerRef.current = null;
        } catch (error) {
          console.error(t('Error disposing player') + ':', error);
        }
      }
    };
  }, [dataVideo?.video, visible]);

  return (
    <CustomModal
      placementMoblie="center"
      size="5xl"
      isOpen={visible}
      onClose={onVisible}
    >
      <>
        <ModalBody className="p-6 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <Text className="text-white" type="font-24-700">
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

          <div className="pt-4" ref={videoRef} />
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
