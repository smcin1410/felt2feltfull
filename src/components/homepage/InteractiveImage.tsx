'use client';

import Image, { ImageProps } from 'next/image';
import React from 'react';

export default function InteractiveImage(props: ImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Set a fallback image that exists in public/stock-photos
    console.log(`Error loading image: ${props.src}`);
    e.currentTarget.src = '/stock-photos/vegassign.jpeg';
  };

  // Remove any onError prop passed from parent (especially from Server Components)
  const { onError, ...rest } = props;

  return (
    <Image
      {...rest}
      fill
      className={props.className ? `${props.className} object-cover` : 'object-cover'}
      onError={handleError}
    />
  );
}
