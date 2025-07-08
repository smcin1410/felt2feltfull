// src/components/ImageWithFallback.tsx
'use client'; // This component must be a client component

import Image from 'next/image';
import { useState } from 'react';

// Props for our ImageWithFallback component
interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean; // If using fill, make sure parent has position:relative and a height
  width?: number; // If not using fill, provide width and height
  height?: number;
  // Add other props you might pass to next/image
}

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className,
  sizes,
  fill,
  width,
  height,
  ...rest
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      console.error(`Error loading image: ${src}. Attempting fallback...`);
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    } else {
      console.error(`Fallback image also failed: ${fallbackSrc}.`);
      // If even fallback fails, maybe show a blank or default broken image icon
      // setCurrentSrc('/placeholder.png'); // If you have a super basic placeholder
    }
  };

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      sizes={sizes}
      fill={fill}
      width={width}
      height={height}
      onError={handleImageError}
      {...rest} // Pass any other props like object-cover, opacity etc.
    />
  );
}