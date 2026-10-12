import React from 'react';
import { useResolvedMedia } from '../services/mediaService';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src = '',
  fallbackSrc = '/src/assets/images/hero_fashion_model_1791780188473.jpg',
  alt = '',
  className = '',
  ...props
}) => {
  const resolvedSrc = useResolvedMedia(src);

  return (
    <img
      src={resolvedSrc || fallbackSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={(e) => {
        if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        }
      }}
      {...props}
    />
  );
};
