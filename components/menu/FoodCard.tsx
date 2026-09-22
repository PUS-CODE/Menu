'use client';

import React from 'react';
import { MenuItem } from '@/lib/types';
import { Plus, Star } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface Props {
  item: MenuItem;
  onSelectItem: (item: MenuItem) => void;
}

export const FoodCard: React.FC<Props> = ({ item, onSelectItem }) => {
  const renderFoodTypeBadge = () => {
    if (item.food_type === 'veg') {
      return (
        <span className="veg-icon" title="Vegetarian">
          <span className="veg-dot" />
        </span>
      );
    }
    if (item.food_type === 'egg') {
      return (
        <span className="egg-icon" title="Contains Egg">
          <span className="egg-dot" />
        </span>
      );
    }
    return (
      <span className="non-veg-icon" title="Non-Vegetarian">
        <span className="non-veg-dot" />
      </span>
    );
  };

  const renderSpiceLevel = () => {
    if (item.spice_level <= 0) return null;
    return (
      <span className="text-xs" title={`Spice level: ${item.spice_level}/3`}>
        {'🌶️'.repeat(item.spice_level)}
      </span>
    );
  };

  return (
    <article
      onClick={() => onSelectItem(item)}
      className="group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-stone-300 transition-all cursor-pointer active:bg-stone-50/80"
    >
      {/* Text Info */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2">
          {renderFoodTypeBadge()}
          {item.bestseller && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              Bestseller
            </span>
          )}
          {renderSpiceLevel()}
        </div>

        <h3 className="mt-1.5 text-sm font-bold text-stone-900 leading-snug group-hover:text-amber-800 transition-colors">
          {item.name}
        </h3>

        <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-normal">
          {item.description}
        </p>

        {/* Price & Discount */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-sm font-extrabold text-stone-900">
            ₹{item.discount_price ?? item.price}
          </span>
          {item.discount_price && (
            <span className="text-xs text-stone-400 line-through">
              ₹{item.price}
            </span>
          )}
        </div>
      </div>

      {/* Image & ADD Button */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="relative h-22 w-22 sm:h-26 sm:w-26 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            fill
            sizes="104px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fallbackText={item.name}
          />
        </div>

        {/* 44px Minimum Touch Target ADD Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectItem(item);
          }}
          className="mt-[-14px] z-10 min-w-[76px] min-h-[44px] px-3 py-1.5 rounded-lg bg-white border border-amber-600/90 text-amber-700 text-xs font-extrabold shadow-xs hover:bg-amber-600 hover:text-white transition-colors flex items-center justify-center gap-1 active:scale-95"
          aria-label={`Select ${item.name}`}
        >
          <span>ADD</span>
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </article>
  );
};
