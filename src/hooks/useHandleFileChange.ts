import { useState } from 'react';

const useHandleFileChange = ({
  callback,
}: {
  callback: (data: any) => void;
}) => {
  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('video/')) {
      // Get video duration
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration; // Thời gian video tính bằng giây
        const canvas = document.createElement('canvas');
        const context: any = canvas.getContext('2d');
        videoElement.currentTime = 1; // Chọn thời điểm 1s đầu tiên

        videoElement.onseeked = () => {
          context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob: any) => {
            if (blob) {
              const thumbnailFile = new File([blob], 'thumbnail.jpg', {
                type: 'image/jpeg',
              });

              const blobThumbnailUrl = URL.createObjectURL(thumbnailFile);

              callback({
                video: file,
                thumbnail: thumbnailFile,
                duration,
                blobThumbnailUrl,
                videoName: file?.name,
              });
            }
          }, 'image/jpeg');
        };
      };
    }
  };

  return {
    handleFileChange,
  };
};

export default useHandleFileChange;
