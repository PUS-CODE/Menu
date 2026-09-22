'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Utensils } from 'lucide-react';

interface Props extends Omit<ImageProps, 'onError'> {
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<Props> = ({
  src,
  alt,
  fallbackText = 'Food Dish',
  className = '',
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-stone-200 text-stone-400 p-2 text-center ${className}`}
      >
        <Utensils className="w-6 h-6 stroke-[1.5] text-stone-400 mb-1" />
        <span className="text-[10px] font-medium text-stone-500 truncate max-w-full">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || fallbackText}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};
