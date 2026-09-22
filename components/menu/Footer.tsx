'use client';

import React from 'react';
import { Restaurant } from '@/lib/types';

interface Props {
  restaurant: Restaurant;
}

export const Footer: React.FC<Props> = ({ restaurant }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 px-4 py-8 bg-stone-900 text-stone-300 border-t border-stone-800 text-center space-y-3">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white tracking-wide">{restaurant.name}</h3>
        <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
          {restaurant.address}
        </p>
      </div>

      <div className="pt-2 text-xs text-stone-400 space-y-1">
        <p>Ph: {restaurant.phone}</p>
        <p>{restaurant.opening_hours}</p>
      </div>

      <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400">
        © {currentYear} {restaurant.name}. All rights reserved.
      </div>
    </footer>
  );
};
