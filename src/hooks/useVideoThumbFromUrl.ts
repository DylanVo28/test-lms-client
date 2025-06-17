import { useEffect, useState } from 'react';

export function useVideoThumbFromUrl(videoUrl: string): string | null {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!videoUrl) return;

    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';

    const handleSeeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
          }
        },
        'image/jpeg',
        0.9
      );
    };

    const handleLoaded = () => {
      video.currentTime = 1;
    };

    video.onloadedmetadata = handleLoaded;
    video.onseeked = handleSeeked;
    video.onerror = () => setBlobUrl(null);

    return () => {
      video.onloadedmetadata = null;
      video.onseeked = null;
      URL.revokeObjectURL(blobUrl || '');
    };
  }, [videoUrl]);

  return blobUrl;
}

export default useVideoThumbFromUrl;
