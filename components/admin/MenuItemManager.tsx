'use client';

import React, { useState, useMemo } from 'react';
import { MenuItem, Category, FoodType } from '@/lib/types';
import { Plus, Search, Edit2, Trash2, Star, Utensils, CheckCircle, XCircle } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface Props {
  restaurantId: string;
  categories: Category[];
  menuItems: MenuItem[];
  onAddNewItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleAvailable: (id: string) => void;
}

export const MenuItemManager: React.FC<Props> = ({
  categories,
  menuItems,
  onAddNewItem,
  onEditItem,
  onDeleteItem,
  onToggleAvailable,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [foodTypeFilter, setFoodTypeFilter] = useState<string>('all');

  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.name]));
  }, [categories]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesIngredients = item.ingredients?.some((ing) => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIngredients) return false;
      }

      // 2. Category Filter
      if (selectedCatFilter !== 'all' && item.category_id !== selectedCatFilter) {
        return false;
      }

      // 3. Food Type Filter
      if (foodTypeFilter !== 'all' && item.food_type !== foodTypeFilter) {
        return false;
      }

      return true;
    });
  }, [menuItems, searchQuery, selectedCatFilter, foodTypeFilter]);

  const renderVegBadge = (type: FoodType) => {
    if (type === 'veg') return <span className="veg-icon mr-1.5" title="Veg"><span className="veg-dot" /></span>;
    if (type === 'egg') return <span className="egg-icon mr-1.5" title="Egg"><span className="egg-dot" /></span>;
    return <span className="non-veg-icon mr-1.5" title="Non-Veg"><span className="non-veg-dot" /></span>;
  };

  return (
    <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" />
            Food Menu Items ({menuItems.length})
          </h2>
          <p className="text-xs text-stone-500">
            Create, update prices, toggle availability, or edit dish details.
          </p>
        </div>

        <button
          onClick={onAddNewItem}
          className="px-4 py-2.5 rounded-xl text-white bg-amber-600 hover:bg-amber-700 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name or ingredient..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCatFilter}
          onChange={(e) => setSelectedCatFilter(e.target.value)}
          className="w-full p-2 rounded-lg bg-white border border-stone-300 text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Food Type Filter */}
        <select
          value={foodTypeFilter}
          onChange={(e) => setFoodTypeFilter(e.target.value)}
          className="w-full p-2 rounded-lg bg-white border border-stone-300 text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        >
          <option value="all">All Food Types</option>
          <option value="veg">Veg 🟢</option>
          <option value="non-veg">Non-Veg 🔴</option>
          <option value="egg">Egg 🟠</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const categoryName = categoryMap.get(item.category_id) || 'Uncategorized';

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                item.available
                  ? 'bg-white border-stone-200 hover:border-stone-300'
                  : 'bg-stone-50 border-stone-200 opacity-75'
              }`}
            >
              {/* Image & Text Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    fallbackText={item.name}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {renderVegBadge(item.food_type)}
                    <span className="text-xs font-bold text-stone-900 truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {categoryName}
                    </span>
                    {item.bestseller && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        Bestseller
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      ₹{item.discount_price ?? item.price}
                    </span>
                    {item.discount_price && (
                      <span className="text-[11px] text-stone-400 line-through">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions & Availability Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleAvailable(item.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    item.available
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-stone-200 text-stone-600 border-stone-300 hover:bg-stone-300'
                  }`}
                  title="Toggle Item Availability"
                >
                  {item.available ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">In Stock</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-stone-500" />
                      <span className="hidden sm:inline">Sold Out</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onEditItem(item)}
                  className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors"
                  title="Edit Item"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
                      onDeleteItem(item.id);
                    }
                  }}
                  className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-colors"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-300 space-y-2">
            <p>No food items match your filter settings.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCatFilter('all');
                setFoodTypeFilter('all');
              }}
              className="text-amber-700 font-bold underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
