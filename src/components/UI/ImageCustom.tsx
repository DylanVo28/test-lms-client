import Image, { ImageProps } from 'next/image';
import { forwardRef } from 'react';

interface ImageCustomProps extends Omit<ImageProps, 'quality'> {
  quality?: number;
}

const ImageCustom = forwardRef<HTMLImageElement, ImageCustomProps>(
  ({ quality = 80, ...props }, ref) => {
    return <Image ref={ref} quality={quality} {...props} />;
  }
);

ImageCustom.displayName = 'ImageCustom';

export default ImageCustom;