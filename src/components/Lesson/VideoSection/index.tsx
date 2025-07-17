import LoadingContainer from '@/components/UI/LoadingContainer';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import { loadVideoJSPlugins } from '@/utils/videojs-plugins';

import NextVideo from './NextVideo';
import { Button, Tooltip } from '@nextui-org/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { TYPE_COURSE } from '@/utils/const';
import { isMobile } from 'react-device-detect';
import clsx from 'clsx';
import { reviewedAtom } from '..';
import { useAtom } from 'jotai';

const VideoSection = ({
  info,
  loading,
  data,
  handleNextChildSection,
  handlePrevChildSection,
  handleFindIdNextChildSection,
  handleFindIdPrevChildSection,
  handleNextLastSection,
  allItems,
}: {
  allItems: any;
  handleNextLastSection: (id: string, type: string) => void;
  handleNextChildSection: (
    type: string,
    idNext: string,
    idCurrent: string,
    currentType: string,
    contentType: string
  ) => void;
  handlePrevChildSection: (
    type: string,
    idNext: string,
    idCurrent: string,
    currentType: string
  ) => void;

  handleFindIdNextChildSection: any;
  handleFindIdPrevChildSection: any;
  data: any;
  loading: boolean;
  info: any;
}) => {
  const videoRef: any = useRef(null);
  const playerRef: any = useRef(null);
  const [reviewed, setReviewed] = useAtom(reviewedAtom);

  const lastIndex = allItems.findIndex((item: any) => item?.id === data?.id);

  const [endVideo, setEndVideo] = useState(false);

  const dataItemNext = handleFindIdNextChildSection(data?.id);
  const dataItemPrev = handleFindIdPrevChildSection(data?.id);

  const isFirstLesson = lastIndex === 0;
  const isLastLesson = lastIndex === allItems?.length - 1;

  const handleCancelNextChilSection = () => {
    setEndVideo(false);
  };

  useEffect(() => {
    const initializePlayer = async () => {
      // Load VideoJS plugins before initializing player
      await loadVideoJSPlugins();

      // Initialize player if it doesn't exist
      if (!playerRef.current && videoRef.current) {
        const videoElement = document.createElement('video') as any;
        videoElement.className = 'video-js vjs-big-play-centered';
        videoElement.controls = true;
        videoElement.preload = 'auto';
        videoElement.crossOrigin = 'anonymous';

        videoElement.addEventListener('ended', () => {
          setEndVideo(true);
        });

        // Clear existing content and add video element
        videoRef.current.innerHTML = '';
        videoRef.current.appendChild(videoElement);

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
          autoplay: true,
          muted: false,
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
              if ((this as any).hlsQualitySelector) {
                (this as any).hlsQualitySelector();
              }
            }
          );

          playerRef.current.on('fullscreenchange', handleFullscreenChange);

          playerRef.current.on('error', function (error: any) {
            console.error('Video player error' + ':', error);
          });
        } catch (error) {
          console.error('Player initialization error' + ':', error);
        }
      }

      // Update source when URL changes
      if (playerRef.current && info?.urlVideo) {
        const handleTimeUpdate = () => {
          const currentTime = playerRef.current.currentTime();
          const duration = playerRef.current.duration();
          const progress = (currentTime / duration) * 100;

          if (progress >= 90) {
            // setProgressVideo(progress);
            if (lastIndex === allItems?.length - 1 && !reviewed) {
              handleNextLastSection(data?.id, TYPE_COURSE.LECTURE);
              return;
            }
            playerRef.current.off('timeupdate', handleTimeUpdate);
            if (isMobile) {
              setEndVideo(true);
            }
          }
        };

        try {
          playerRef.current.src({
            src: info.urlVideo,
            type: determineVideoType(info.urlVideo),
          });
          playerRef.current.on('timeupdate', handleTimeUpdate);
        } catch (error) {
          console.error('Error updating video source' + ':', error);
        }
      }

      return () => {
        if (playerRef.current) {
          try {
            playerRef.current.dispose();
            playerRef.current = null;
          } catch (error) {
            console.error('Error disposing player' + ':', error);
          }
        }
      };
    };

    initializePlayer();
  }, [info?.urlVideo]);

  const determineVideoType = (url: string): string => {
    if (url.includes('.m3u8')) return 'application/x-mpegURL';
    if (url.includes('.mp4')) return 'video/mp4';
    if (url.includes('.webm')) return 'video/webm';
    return 'video/mp4';
  };

  const resetVideo = () => {
    if (playerRef.current) {
      playerRef.current.currentTime(0);
      playerRef.current.pause();
    }
  };

  return (
    <div
      className={clsx('video-container h-max max-h-[566px] relative group', {
        ['max-h-[400px]']: isMobile,
      })}
    >
      {dataItemPrev?.id && !isFirstLesson && (
        <Button
          className="absolute group-hover:opacity-100 opacity-0 left-0 bg-main border-1 border-white-50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
          isIconOnly
          onPress={() => {
            resetVideo();
            setEndVideo(false);
            handlePrevChildSection(
              dataItemPrev?.type,
              dataItemPrev?.id,
              data?.id,
              TYPE_COURSE.LECTURE
            );
          }}
          size="sm"
          radius="sm"
        >
          <CaretLeft size={24} className="fill-text-white" />
        </Button>
      )}

      {endVideo && !reviewed && (
        <NextVideo
          handleCancelNextChilSection={handleCancelNextChilSection}
          handleNextChildSection={(type, id) => {
            if (lastIndex === allItems?.length - 1) {
              handleNextLastSection(data?.id, TYPE_COURSE.LECTURE);
            } else {
              setEndVideo(false);
              resetVideo();
              handleNextChildSection(
                type,
                id,
                data?.id,
                TYPE_COURSE.LECTURE,
                dataItemNext?.contentType
              );
            }
          }}
          dataItemNext={dataItemNext}
        />
      )}
      {!reviewed && !isLastLesson && (
        <Button
          className="absolute right-0 group-hover:opacity-100 opacity-0 bg-main border-1 border-white-50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
          isIconOnly
          size="sm"
          onPress={() => {
            if (lastIndex === allItems?.length - 1) {
              handleNextLastSection(data?.id, TYPE_COURSE.LECTURE);
            } else {
              resetVideo();
              setEndVideo(false);
              handleNextChildSection(
                dataItemNext?.type,
                dataItemNext?.id,
                data?.id,
                TYPE_COURSE.LECTURE,
                dataItemNext?.contentType
              );
            }
          }}
          radius="sm"
        >
          <CaretRight size={24} className="fill-text-white" />
        </Button>
      )}

      <LoadingContainer loading={loading} />
      <div ref={videoRef} />
    </div>
  );
};

export default VideoSection;
