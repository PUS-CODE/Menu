import { Restaurant, Category, MenuItem, RestaurantData } from './types';
import { MOCK_RESTAURANTS } from './mock-data';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Global in-memory server cache across API invocations
interface GlobalServerStore {
  restaurants: Restaurant[];
  categories: Category[];
  menuItems: MenuItem[];
}

declare global {
  // eslint-disable-next-line no-var
  var __MEAN_SERVER_STORE__: GlobalServerStore | undefined;
}

function initServerStore(): GlobalServerStore {
  if (global.__MEAN_SERVER_STORE__) {
    return global.__MEAN_SERVER_STORE__;
  }

  const restaurants: Restaurant[] = [];
  const categories: Category[] = [];
  const menuItems: MenuItem[] = [];

  Object.values(MOCK_RESTAURANTS).forEach((rd) => {
    restaurants.push(rd.restaurant);
    categories.push(...rd.categories);
    menuItems.push(...rd.menuItems);
  });

  const store = { restaurants, categories, menuItems };
  global.__MEAN_SERVER_STORE__ = store;
  return store;
}

export async function cloudGetRestaurantBySlug(slug: string): Promise<RestaurantData | null> {
  // 1. Try Supabase if configured
  if (supabase) {
    try {
      const { data: restaurant, error: rErr } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .single();

      if (!rErr && restaurant) {
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
      console.warn('Supabase fetch error, using server memory cache:', e);
    }
  }

  // 2. Fallback to server memory store
  const store = initServerStore();
  const restaurant = store.restaurants.find((r) => r.slug === slug && r.active);
  if (!restaurant) return null;

  const categories = store.categories
    .filter((c) => c.restaurant_id === restaurant.id && c.active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const menuItems = store.menuItems
    .filter((m) => m.restaurant_id === restaurant.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return { restaurant, categories, menuItems };
}

export async function cloudGetAllRestaurants(): Promise<Restaurant[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('restaurants').select('*');
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase error:', e);
    }
  }

  return initServerStore().restaurants;
}

export async function cloudSaveRestaurant(restaurant: Restaurant): Promise<Restaurant> {
  // Update server cache
  const store = initServerStore();
  const idx = store.restaurants.findIndex((r) => r.id === restaurant.id);
  if (idx >= 0) {
    store.restaurants[idx] = restaurant;
  } else {
    store.restaurants.push(restaurant);
  }

  // Write to Supabase if available
  if (supabase) {
    try {
      await supabase.from('restaurants').upsert(restaurant);
    } catch (e) {
      console.warn('Supabase upsert error:', e);
    }
  }

  return restaurant;
}

export async function cloudDeleteRestaurant(id: string): Promise<void> {
  const store = initServerStore();
  store.restaurants = store.restaurants.filter((r) => r.id !== id);
  store.categories = store.categories.filter((c) => c.restaurant_id !== id);
  store.menuItems = store.menuItems.filter((m) => m.restaurant_id !== id);

  if (supabase) {
    try {
      await supabase.from('restaurants').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }
}

export async function cloudGetCategories(restaurantId: string): Promise<Category[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort_order', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase error:', e);
    }
  }

  const store = initServerStore();
  return store.categories
    .filter((c) => c.restaurant_id === restaurantId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function cloudSaveCategory(category: Category): Promise<Category> {
  const store = initServerStore();
  const idx = store.categories.findIndex((c) => c.id === category.id);
  if (idx >= 0) {
    store.categories[idx] = category;
  } else {
    store.categories.push(category);
  }

  if (supabase) {
    try {
      await supabase.from('categories').upsert(category);
    } catch (e) {
      console.warn('Supabase upsert category error:', e);
    }
  }

  return category;
}

export async function cloudDeleteCategory(id: string): Promise<void> {
  const store = initServerStore();
  store.categories = store.categories.filter((c) => c.id !== id);
  store.menuItems = store.menuItems.filter((m) => m.category_id !== id);

  if (supabase) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete category error:', e);
    }
  }
}

export async function cloudGetMenuItems(restaurantId: string): Promise<MenuItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('sort_order', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase error:', e);
    }
  }

  const store = initServerStore();
  return store.menuItems
    .filter((m) => m.restaurant_id === restaurantId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function cloudSaveMenuItem(item: MenuItem): Promise<MenuItem> {
  const store = initServerStore();
  const idx = store.menuItems.findIndex((m) => m.id === item.id);
  if (idx >= 0) {
    store.menuItems[idx] = item;
  } else {
    store.menuItems.push(item);
  }

  if (supabase) {
    try {
      await supabase.from('menu_items').upsert(item);
    } catch (e) {
      console.warn('Supabase upsert menu item error:', e);
    }
  }

  return item;
}

export async function cloudToggleMenuItemAvailable(id: string): Promise<boolean> {
  const store = initServerStore();
  const item = store.menuItems.find((m) => m.id === id);
  if (item) {
    item.available = !item.available;

    if (supabase) {
      try {
        await supabase
          .from('menu_items')
          .update({ available: item.available })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase toggle error:', e);
      }
    }

    return item.available;
  }
  return false;
}

export async function cloudDeleteMenuItem(id: string): Promise<void> {
  const store = initServerStore();
  store.menuItems = store.menuItems.filter((m) => m.id !== id);

  if (supabase) {
    try {
      await supabase.from('menu_items').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete menu item error:', e);
    }
  }
}
