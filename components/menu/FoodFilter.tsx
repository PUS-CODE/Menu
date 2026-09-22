'use client';

import React from 'react';
import { FoodFilterType } from '@/lib/types';
import { Sparkles, Flame } from 'lucide-react';

interface Props {
  activeFilter: FoodFilterType;
  setActiveFilter: (filter: FoodFilterType) => void;
}

export const FoodFilter: React.FC<Props> = ({ activeFilter, setActiveFilter }) => {
  const filters: { id: FoodFilterType; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Dishes' },
    {
      id: 'veg',
      label: 'Veg',
      icon: (
        <span className="veg-icon mr-1">
          <span className="veg-dot" />
        </span>
      ),
    },
    {
      id: 'non-veg',
      label: 'Non-Veg',
      icon: (
        <span className="non-veg-icon mr-1">
          <span className="non-veg-dot" />
        </span>
      ),
    },
    {
      id: 'bestsellers',
      label: 'Bestsellers',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />,
    },
    {
      id: 'spicy',
      label: 'Spicy',
      icon: <Flame className="w-3.5 h-3.5 text-rose-500 mr-1" />,
    },
  ];

  return (
    <div className="px-4 py-2 bg-stone-50 border-b border-stone-200">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${
                isActive
                  ? 'bg-stone-900 text-white shadow-stone-900/10'
                  : 'bg-white text-stone-700 border border-stone-300/70 hover:bg-stone-100'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
