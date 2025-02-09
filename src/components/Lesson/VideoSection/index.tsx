import LoadingContainer from '@/components/UI/LoadingContainer';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hls-quality-selector';
import 'videojs-contrib-quality-levels';
import NextVideo from './NextVideo';
import { Button, Tooltip } from '@nextui-org/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { TYPE_COURSE } from '@/utils/const';

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
  handleNextLastSection: VoidFunction;
  handleNextChildSection: (
    type: string,
    idNext: string,
    idCurrent: string,
    currentType: string
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

  const lastIndex = allItems.findIndex((item: any) => item?.id === data?.id);

  const [endVideo, setEndVideo] = useState(false);

  const dataItemNext = handleFindIdNextChildSection(data?.id);
  const dataItemPrev = handleFindIdPrevChildSection(data?.id);

  const handleCancelNextChilSection = () => {
    setEndVideo(false);
  };

  useEffect(() => {
    // Initialize player if it doesn't exist
    if (!playerRef.current) {
      const videoElement = document.createElement('video');
      videoElement.className = 'video-js vjs-big-play-centered';
      videoElement.controls = true;
      videoElement.preload = 'auto';
      videoElement.crossOrigin = 'anonymous';

      videoElement.addEventListener('ended', () => {
        setEndVideo(true);
      });

      // Replace old video element with new one
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

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
            console.log('Player is ready');
          }
        );

        playerRef.current.on('error', function (error: any) {
          console.error('Video player error:', error);
        });
      } catch (error) {
        console.error('Player initialization error:', error);
      }
    }

    // Update source when URL changes
    if (playerRef.current && info?.urlVideo) {
      const handleTimeUpdate = () => {
        const currentTime = playerRef.current.currentTime();
        const duration = playerRef.current.duration();
        const progress = (currentTime / duration) * 100;

        if (progress >= 80) {
          // setProgressVideo(progress);
          playerRef.current.off('timeupdate', handleTimeUpdate);
        }
      };

      try {
        playerRef.current.src({
          src: info.urlVideo,
          type: determineVideoType(info.urlVideo),
        });
        playerRef.current.on('timeupdate', handleTimeUpdate);
      } catch (error) {
        console.error('Error updating video source:', error);
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
          playerRef.current = null;
        } catch (error) {
          console.error('Error disposing player:', error);
        }
      }
    };
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
    <div className="video-container relative group">
      {dataItemPrev?.id && (
        <Button
          className="absolute group-hover:opacity-100 opacity-0 left-0 bg-main border-1 border-white/50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
          isIconOnly
          onClick={() => {
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
          <CaretLeft size={24} />
        </Button>
      )}

      {endVideo && (
        <NextVideo
          handleCancelNextChilSection={handleCancelNextChilSection}
          handleNextChildSection={(type, id) => {
            if (lastIndex === allItems?.length - 1) {
              handleNextLastSection();
            } else {
              setEndVideo(false);
              resetVideo();
              handleNextChildSection(type, id, data?.id, TYPE_COURSE.LECTURE);
            }
          }}
          dataItemNext={dataItemNext}
        />
      )}
      <Button
        className="absolute right-0 group-hover:opacity-100 opacity-0 bg-main border-1 border-white/50 min-h-[50px] z-[1000] top-1/2 -translate-y-1/2"
        isIconOnly
        size="sm"
        onClick={() => {
          if (lastIndex === allItems?.length - 1) {
            handleNextLastSection();
          } else {
            resetVideo();
            setEndVideo(false);
            handleNextChildSection(
              dataItemNext?.type,
              dataItemNext?.id,
              data?.id,
              TYPE_COURSE.LECTURE
            );
          }
        }}
        radius="sm"
      >
        <CaretRight size={24} />
      </Button>

      <LoadingContainer loading={loading} />
      <div ref={videoRef} />
    </div>
  );
};

export default VideoSection;
