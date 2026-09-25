import { RestaurantData } from './types';
import { getRestaurantData as getMockData } from './mock-data';
import { getRestaurantBySlugFromStore } from './store';
import { supabase } from './supabase/client';

export async function fetchRestaurantBySlug(slug: string): Promise<RestaurantData | null> {
  // 1. If running in browser, check reactive local store first for real-time admin edits
  if (typeof window !== 'undefined') {
    const storeData = getRestaurantBySlugFromStore(slug);
    if (storeData) return storeData;
  }

  // 2. Query Supabase database if configured
  if (supabase) {
    try {
      const { data: restaurant, error: restError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (!restError && restaurant) {
        const { data: categories } = await supabase
          .from('categories')
          .select('*')
          .eq('restaurant_id', restaurant.id)
          .eq('active', true)
          .order('sort_order', { ascending: true });

        const { data: menuItems } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurant.id)
          .order('sort_order', { ascending: true });

        return {
          restaurant,
          categories: categories || [],
          menuItems: menuItems || [],
        };
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to local store/mock data:', e);
    }
  }

  // 3. Fallback to mock dataset
  return getMockData(slug);
}
