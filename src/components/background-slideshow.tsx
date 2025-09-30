
"use client";

import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import React from 'react';

interface BackgroundSlideshowProps {
  images: ImagePlaceholder[];
  className?: string;
}

export function BackgroundSlideshow({ images, className }: BackgroundSlideshowProps) {
  if (!images || images.length === 0) {
    return null;
  }

  // Each image will be visible for 5s, with a 1s fade transition.
  // Total animation duration is 6s * number of images.
  const animationDuration = images.length * 6;

  return (
    <div className={cn("fixed inset-0 -z-10", className)}>
      {images.map((image, index) => {
        // Delay each animation so they play sequentially
        const animationDelay = index * 6;

        return (
          <div
            key={image.id}
            className="absolute inset-0 h-full w-full md:animate-fade-in-out"
            style={{
              animationDuration: `${animationDuration}s`,
              animationDelay: `${animationDelay}s`,
            }}
          >
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              style={{ filter: 'blur(8px)' }}
              data-ai-hint={image.imageHint}
              priority={index === 0}
            />
          </div>
        );
      })}
    </div>
  );
}
