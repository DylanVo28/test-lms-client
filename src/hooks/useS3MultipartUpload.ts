import { privateRequest, request } from '@/api/request';
import { useState } from 'react';

const CHUNK_SIZE = 5 * 1024 * 1024;

export function useS3MultipartUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    setProgress(0);

    // 1. init
    const init = await privateRequest(
      request.post,
      '/api/storage/multipart/init',
      {
        data: { filename: file.name },
      }
    );
    const { uploadId, key } = init.data;

    // 2. split
    const chunks = [];
    for (
      let start = 0, partNumber = 1;
      start < file.size;
      start += CHUNK_SIZE, partNumber++
    ) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      chunks.push({ blob: file.slice(start, end), partNumber });
    }

    // 3. upload parts
    const parts: { ETag: string; PartNumber: number }[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const { blob, partNumber } = chunks[i];
      const urlRes = await privateRequest(
        request.get,
        '/api/storage/multipart/url',
        {
          params: { key, uploadId, partNumber },
        }
      );
      const { url } = urlRes.data;

      const res = await fetch(url, { method: 'PUT', body: blob });
      if (!res.ok) throw new Error(`Part ${partNumber} failed`);
      const ETag = res.headers.ge'ETag'!.replaceAll('"', '');
      parts.push({ ETag, PartNumber: partNumber });

      setProgress(Math.round(((i + 1) / chunks.length) * 100));
    }

    // 4. complete
    const resComplete = await privateRequest(
      request.post,
      '/api/storage/multipart/complete',
      {
        data: { key, uploadId, parts },
      }
    );

    setUploading(false);

    return resComplete.data.Location;
  }

  return { upload, progress, uploading };
}
