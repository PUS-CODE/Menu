'use client';

import React from 'react';
import Image from 'next/image';
import { MenuItem } from '@/lib/types';
import { X, Flame, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  item: MenuItem | null;
  onClose: () => void;
}

export const FoodDetails: React.FC<Props> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 transition-opacity">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Image Header */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              {item.food_type === 'veg' ? (
                <span className="veg-icon">
                  <span className="veg-dot" />
                </span>
              ) : item.food_type === 'egg' ? (
                <span className="egg-icon">
                  <span className="egg-dot" />
                </span>
              ) : (
                <span className="non-veg-icon">
                  <span className="non-veg-dot" />
                </span>
              )}
              
              <span className="text-xs font-semibold text-stone-600 capitalize">
                {item.food_type}
              </span>

              {item.spice_level > 0 && (
                <span className="flex items-center text-xs text-rose-600 font-medium ml-2">
                  <Flame className="w-3.5 h-3.5 mr-0.5" />
                  Spice Level: {'🌶️'.repeat(item.spice_level)}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-stone-900 mt-2">{item.name}</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Pricing Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-xs text-stone-500 block">Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-stone-900">
                  ₹{item.discount_price ?? item.price}
                </span>
                {item.discount_price && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{item.price}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-md hover:bg-amber-700 transition-colors"
            >
              Select Item
            </button>
          </div>

          {/* Ingredients */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Allergen Info */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Allergen Information
              </h4>
              <p className="text-xs text-amber-800">
                Contains: {item.allergens.join(', ')}. Please inform staff of severe allergies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
