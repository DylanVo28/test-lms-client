import Image, { ImageProps } from 'next/image';
import { forwardRef } from 'react';

interface ImageCustomProps extends Omit<ImageProps, 'quality'> {
  quality?: number;
}

const ImageCustom = forwardRef<HTMLImageElement, ImageCustomProps>(
  ({ quality = 100, src, ...props }, ref) => {
      // return <img ref={ref} quality={quality} {...props}/>
    const trimmedSrc = typeof src === 'string' ? src.trim() : src;
    return <Image ref={ref} quality={quality} {...props} src={trimmedSrc} unoptimized={true} />;
  }
);

ImageCustom.displayName = 'ImageCustom';

export default ImageCustom;