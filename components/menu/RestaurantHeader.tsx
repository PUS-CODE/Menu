'use client';

import React from 'react';
import { Restaurant } from '@/lib/types';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface Props {
  restaurant: Restaurant;
}

export const RestaurantHeader: React.FC<Props> = ({ restaurant }) => {
  return (
    <header className="relative w-full bg-stone-900">
      {/* Cover Image */}
      <div className="relative h-36 sm:h-48 w-full overflow-hidden bg-stone-800">
        <ImageWithFallback
          src={restaurant.cover_image}
          alt={`${restaurant.name} Cover`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
          className="object-cover opacity-90"
          fallbackText={restaurant.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-black/10" />
      </div>

      {/* Logo Overlay Container */}
      <div className="px-4 sm:px-5 -mt-8 relative z-10 flex items-end justify-between">
        <div className="relative h-18 w-18 sm:h-22 sm:w-22 rounded-2xl border-3 border-stone-50 bg-white overflow-hidden shadow-md">
          <ImageWithFallback
            src={restaurant.logo}
            alt={`${restaurant.name} Logo`}
            fill
            sizes="88px"
            className="object-cover"
            fallbackText={restaurant.name.charAt(0)}
          />
        </div>
      </div>
    </header>
  );
};
