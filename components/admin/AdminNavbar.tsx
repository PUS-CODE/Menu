'use client';

import React from 'react';
import Link from 'next/link';
import { Restaurant } from '@/lib/types';
import { LayoutDashboard, ExternalLink, Utensils, FolderTree, Settings, Plus } from 'lucide-react';

interface Props {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  activeTab: 'restaurants' | 'categories' | 'items';
  setActiveTab: (tab: 'restaurants' | 'categories' | 'items') => void;
  onAddNewRestaurant: () => void;
}

export const AdminNavbar: React.FC<Props> = ({
  restaurants,
  selectedRestaurant,
  onSelectRestaurant,
  activeTab,
  setActiveTab,
  onAddNewRestaurant,
}) => {
  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-40 shadow-md">
      {/* Top Bar: Brand, Restaurant Switcher & Live Preview */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Admin Brand */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Restaurant Admin Panel
            </h1>
            <p className="text-[11px] text-stone-400">
              Multi-Restaurant Digital Menu Manager
            </p>
          </div>
        </div>

        {/* Restaurant Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {selectedRestaurant && (
            <div className="flex items-center gap-2">
              <select
                value={selectedRestaurant.id}
                onChange={(e) => {
                  const found = restaurants.find((r) => r.id === e.target.value);
                  if (found) onSelectRestaurant(found);
                }}
                className="bg-stone-800 text-white border border-stone-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-[200px] truncate"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.slug})
                  </option>
                ))}
              </select>

              {/* View Live Customer Menu */}
              <Link
                href={`/menu/${selectedRestaurant.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
                title="Open live customer menu in new tab"
              >
                <span>Live Menu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <button
            onClick={onAddNewRestaurant}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Restaurant</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-2">
        <button
          onClick={() => setActiveTab('items')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'items'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Menu Items</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'categories'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'restaurants'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Restaurant Settings</span>
        </button>
      </div>
    </header>
  );
};
