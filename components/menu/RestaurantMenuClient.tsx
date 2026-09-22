'use client';

import React, { useState, useMemo } from 'react';
import { RestaurantData, MenuItem, FoodFilterType } from '@/lib/types';
import { RestaurantHeader } from './RestaurantHeader';
import { RestaurantInfo } from './RestaurantInfo';
import { MenuSearch } from './MenuSearch';
import { FoodFilter } from './FoodFilter';
import { MenuNavigation } from './MenuNavigation';
import { CategorySection } from './CategorySection';
import { FoodDetails } from './FoodDetails';
import { Footer } from './Footer';
import { Toast } from '@/components/ui/Toast';
import { UtensilsCrossed } from 'lucide-react';

interface Props {
  initialData: RestaurantData;
}

export const RestaurantMenuClient: React.FC<Props> = ({ initialData }) => {
  const { restaurant, categories, menuItems } = initialData;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FoodFilterType>('all');
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id || ''
  );
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Map category IDs for instant lookup
  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c]));
  }, [categories]);

  // Filter items based on Search & Dietary Filter
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return menuItems.filter((item) => {
      // 1. Search Query Filter
      if (query) {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesIngredients = item.ingredients?.some((ing) =>
          ing.toLowerCase().includes(query)
        );
        const matchesTags = item.tags?.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        const cat = categoryMap.get(item.category_id);
        const matchesCategory =
          cat?.name.toLowerCase().includes(query) ||
          cat?.description?.toLowerCase().includes(query);

        if (!matchesName && !matchesDesc && !matchesIngredients && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      // 2. Food Type / Badge Filter
      if (activeFilter === 'veg') return item.food_type === 'veg';
      if (activeFilter === 'non-veg') return item.food_type === 'non-veg';
      if (activeFilter === 'bestsellers') return item.bestseller || item.featured;
      if (activeFilter === 'spicy') return item.spice_level > 1;

      return true;
    });
  }, [menuItems, categoryMap, searchQuery, activeFilter]);

  // Handle smooth scroll to category section
  const handleSelectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const hasNoCategoriesOrItems = categories.length === 0 || menuItems.length === 0;

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900 max-w-md sm:max-w-lg md:max-w-xl mx-auto shadow-xl sm:border-x sm:border-stone-200 transition-colors relative"
      style={
        {
          '--primary': restaurant.primary_color,
          '--secondary': restaurant.secondary_color,
        } as React.CSSProperties
      }
    >
      {/* 1. Header (Cover & Logo) */}
      <RestaurantHeader restaurant={restaurant} />

      {/* 2. Restaurant Info (Address, Hours, Call, Directions, Share) */}
      <RestaurantInfo restaurant={restaurant} onShowToast={showToast} />

      {/* 3. Search Bar */}
      <MenuSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultCount={searchQuery ? filteredItems.length : undefined}
      />

      {/* 4. Dietary Quick Filters */}
      <FoodFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* 5. Sticky Category Navigation */}
      {categories.length > 0 && (
        <MenuNavigation
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleSelectCategory}
        />
      )}

      {/* 6. Categories & Food Items */}
      <main className="px-4 py-4 space-y-8 min-h-[40vh]">
        {hasNoCategoriesOrItems ? (
          <div className="py-16 text-center space-y-3 px-4">
            <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-800">Menu is currently unavailable</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              This restaurant has not published any active menu items yet. Please check back soon.
            </p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryItems = filteredItems.filter(
              (item) => item.category_id === category.id
            );

            return (
              <CategorySection
                key={category.id}
                category={category}
                items={categoryItems}
                onSelectItem={(item) => setSelectedItem(item)}
              />
            );
          })
        )}

        {!hasNoCategoriesOrItems && filteredItems.length === 0 && (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm font-semibold text-stone-700">No dishes found matching &quot;{searchQuery}&quot;</p>
            <p className="text-xs text-stone-500">
              Try adjusting your search query or food filter settings.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-2 text-xs text-amber-700 font-bold underline"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        )}
      </main>

      {/* 7. Item Detail Modal */}
      <FoodDetails
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* 8. White-Label Footer */}
      <Footer restaurant={restaurant} />

      {/* 9. Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
};
