import { RestaurantData } from './types';
import { getRestaurantData } from './mock-data';
import { supabase } from './supabase/client';

export async function fetchRestaurantBySlug(slug: string): Promise<RestaurantData | null> {
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
          .eq('available', true)
          .order('sort_order', { ascending: true });

        return {
          restaurant,
          categories: categories || [],
          menuItems: menuItems || [],
        };
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to mock data:', e);
    }
  }

  // Fallback to local seed mock data for instant preview & dev
  return getRestaurantData(slug);
}
