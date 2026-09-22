'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount?: number;
}

export const MenuSearch: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  resultCount,
}) => {
  return (
    <div className="px-4 sm:px-5 pt-4 pb-3 bg-stone-50 border-b border-stone-200/80 space-y-2.5">
      {/* Section Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 tracking-tight">
            Our Menu
          </h2>
          <p className="text-xs text-stone-500">
            Explore our food and drinks.
          </p>
        </div>

        {searchQuery && typeof resultCount === 'number' && (
          <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </span>
        )}
      </div>

      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
          placeholder="Search dishes, drinks or desserts..."
          className="w-full min-h-[44px] pl-10 pr-9 py-2.5 rounded-xl bg-white border border-stone-300/90 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
