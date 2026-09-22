'use client';

import React from 'react';
import { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const MenuNavigation: React.FC<Props> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <nav className="sticky top-0 z-30 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
