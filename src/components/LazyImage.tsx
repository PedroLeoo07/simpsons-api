"use client";

import { memo } from "react";
import { useImageLazyLoad } from "@/hooks/useImageLazyLoad";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

function LazyImage({ src, alt, className = "", onError }: LazyImageProps) {
  const { imageSrc, imageRef, isLoaded } = useImageLazyLoad(src);

  return (
    <div className={`lazy-image-wrapper ${className}`}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        className={`card-image ${isLoaded ? "loaded" : "loading"}`}
        onError={onError}
      />
      {!isLoaded && imageSrc && (
        <div className="image-placeholder">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default memo(LazyImage);
