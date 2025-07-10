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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onError, ...rest } = props;
  // onError is intentionally removed and not used

  return (
    <Image
      {...rest}
      fill
      alt={props.alt || 'Interactive image'}
      className={props.className ? `${props.className} object-cover` : 'object-cover'}
      onError={handleError}
    />
  );
}
