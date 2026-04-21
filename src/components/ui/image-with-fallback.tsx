
"use client";

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

/**
 * A wrapper around Next.js's Image component that gracefully falls back to a placeholder
 * if the primary image fails to load. This prevents broken image icons from appearing.
 */
export function ImageWithFallback({ src, fallbackSrc = 'https://picsum.photos/seed/fallback/800/600', alt, ...props }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        // If the primary image fails, we update the state to use the fallback source.
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
