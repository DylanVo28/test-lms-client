import Image, { ImageProps } from 'next/image';
import { forwardRef } from 'react';

interface ImageCustomProps extends Omit<ImageProps, 'quality'> {
  quality?: number;
}

const ImageCustom = forwardRef<HTMLImageElement, ImageCustomProps>(
  ({ quality = 100, ...props }, ref) => {
      // return <img ref={ref} quality={quality} {...props}/>
    return <Image ref={ref} quality={quality} {...props} unoptimized={true} />;
  }
);

ImageCustom.displayName = 'ImageCustom';

export default ImageCustom;