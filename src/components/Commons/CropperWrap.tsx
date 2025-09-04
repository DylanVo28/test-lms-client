import React, { useEffect } from 'react';
import { Cropper } from 'react-cropper';

export const CropperWrap = ({
  imageSrc,
  value,
  cropperRef,
  fallbackElement,
}: {
  imageSrc?: string;
  value?: string;
  cropperRef: React.RefObject<any>;
  fallbackElement?: React.ReactNode;
}) => {
  if (imageSrc) {
    return (
      <div style={{ width: '100%', height: '200px', position: 'relative' }}>
        <Cropper
          ref={cropperRef}
          src={imageSrc}
          style={{ height: 200, width: '100%' }}
          guides={true}
          cropBoxResizable={true}
          dragMode="move"
          zoomable={false}
          zoomOnWheel={false}
          zoomOnTouch={false}
          minCropBoxWidth={50}
          minCropBoxHeight={50}
        />
      </div>
    );
  }
  return fallbackElement;
};
