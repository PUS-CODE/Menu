'use client';

import React from 'react';
import { Category, MenuItem } from '@/lib/types';
import { FoodCard } from './FoodCard';

interface Props {
  category: Category;
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export const CategorySection: React.FC<Props> = ({
  category,
  items,
  onSelectItem,
}) => {
  if (items.length === 0) return null;

  return (
    <section id={`category-${category.id}`} className="scroll-mt-14 space-y-3">
      {/* Category Header */}
      <div className="border-b border-stone-200/80 pb-2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            {category.name}
          </h2>
          <span className="text-xs font-medium text-stone-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        {category.description && (
          <p className="mt-0.5 text-xs text-stone-500">{category.description}</p>
        )}
      </div>

      {/* Food Cards Grid / Stack */}
      <div className="space-y-3">
        {items.map((item) => (
          <FoodCard key={item.id} item={item} onSelectItem={onSelectItem} />
        ))}
      </div>
    </section>
  );
};
