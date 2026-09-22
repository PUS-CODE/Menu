'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation2, Share2, Info } from 'lucide-react';
import { Restaurant } from '@/lib/types';
import { getRestaurantOpenStatus } from '@/lib/utils/time';

interface Props {
  restaurant: Restaurant;
  onShowToast: (msg: string) => void;
}

export const RestaurantInfo: React.FC<Props> = ({ restaurant, onShowToast }) => {
  const [showHoursModal, setShowHoursModal] = useState(false);
  const status = getRestaurantOpenStatus(restaurant.opening_hours);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `Check out the digital menu for ${restaurant.name}`,
          url: url,
        });
        return;
      } catch (e) {
        // User cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      onShowToast('Menu link copied!');
    } catch (err) {
      onShowToast('Copied menu link');
    }
  };

  return (
    <section className="px-4 sm:px-5 pt-3 pb-4 bg-stone-50 border-b border-stone-200">
      {/* Title & Open/Closed Status */}
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-tight">
          {restaurant.name}
        </h1>
        
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
            status.isOpen
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          {status.statusText}
        </span>
      </div>

      {/* Description */}
      {restaurant.description && (
        <p className="mt-1 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
          {restaurant.description}
        </p>
      )}

      {/* Location & Opening Hours Info */}
      <div className="mt-3 space-y-1.5 text-xs text-stone-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate font-medium">{restaurant.address}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>{status.detailText}</span>
          </div>
          <button
            onClick={() => setShowHoursModal(!showHoursModal)}
            className="text-amber-700 hover:text-amber-900 underline text-xs font-semibold"
          >
            Hours & Info
          </button>
        </div>
      </div>

      {/* Action Buttons: Call | Directions | Share */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <a
          href={`tel:${restaurant.phone}`}
          className="min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-stone-800 bg-stone-200/90 hover:bg-stone-300 transition-colors border border-stone-300/60 shadow-xs active:scale-95"
        >
          <Phone className="w-3.5 h-3.5 text-stone-700" />
          <span>Call</span>
        </a>

        <a
          href={restaurant.google_maps_link}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs active:scale-95"
        >
          <Navigation2 className="w-3.5 h-3.5" />
          <span>Directions</span>
        </a>

        <button
          onClick={handleShare}
          className="min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 transition-colors border border-stone-300/80 shadow-xs active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5 text-stone-600" />
          <span>Share</span>
        </button>
      </div>

      {/* Info Modal */}
      {showHoursModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl space-y-3">
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-600" />
                Restaurant Details
              </h3>
              <button
                onClick={() => setShowHoursModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-stone-600">
              <p><strong>Name:</strong> {restaurant.name}</p>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Phone:</strong> {restaurant.phone}</p>
              <p><strong>Opening Hours:</strong> {restaurant.opening_hours}</p>
              <p><strong>Status:</strong> {status.statusText} ({status.detailText})</p>
            </div>
            <button
              onClick={() => setShowHoursModal(false)}
              className="w-full py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
