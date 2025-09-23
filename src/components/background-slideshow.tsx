
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface BackgroundSlideshowProps {
  images: ImagePlaceholder[];
  interval?: number;
}

export function BackgroundSlideshow({ images, interval = 5000 }: BackgroundSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [images.length, interval]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {images.map((image, index) => (
        <Image
          key={image.id}
          src={image.imageUrl}
          alt={image.description}
          fill
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ filter: 'blur(8px)' }}
          data-ai-hint={image.imageHint}
          priority={index === 0}
        />
      ))}
    </>
  );
}
