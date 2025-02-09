import LoadingContainer from '@/components/UI/LoadingContainer';
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-hls-quality-selector';
import 'videojs-contrib-quality-levels';
import NextVideo from './NextVideo';

const VideoSection = ({
  info,
  loading,
  data,
  currentId,
  handleNextChildSection,
  handleFindIdNextChildSection,
}: {
  handleNextChildSection: (
    type: string,
    idNext: string,
    idCurrent: string
  ) => void;
  handleFindIdNextChildSection: any;
  data: any;
  loading: boolean;
  info: any;
  currentId: string;
}) => {
  const videoRef: any = useRef(null);
  const playerRef: any = useRef(null);

  console.log(currentId, 'currentId');

  // const [progressVideo, setProgressVideo] = useState(0);
  const [endVideo, setEndVideo] = useState(false);

  const dataItemNext = handleFindIdNextChildSection(data?.id);

  console.log(dataItemNext, 'dataItemNext');

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
    <div className="video-container relative">
      {endVideo && (
        <NextVideo
          handleCancelNextChilSection={handleCancelNextChilSection}
          handleNextChildSection={(type, id) => {
            setEndVideo(false);
            resetVideo();
            handleNextChildSection(type, id, data?.id);
          }}
          dataItemNext={dataItemNext}
        />
      )}
      <LoadingContainer loading={loading} />
      <div ref={videoRef} />
    </div>
  );
};

export default VideoSection;
