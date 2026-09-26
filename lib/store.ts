import { Restaurant, Category, MenuItem, RestaurantData } from './types';
import { MOCK_RESTAURANTS } from './mock-data';

const STORAGE_KEY = 'meanu_platform_data_v1';
const DATA_UPDATE_EVENT = 'meanu_data_updated';

interface StorageSchema {
  restaurants: Restaurant[];
  categories: Category[];
  menuItems: MenuItem[];
}

// Helper to seed initial data from mock dataset
function getInitialData(): StorageSchema {
  const restaurants: Restaurant[] = [];
  const categories: Category[] = [];
  const menuItems: MenuItem[] = [];

  Object.values(MOCK_RESTAURANTS).forEach((rd) => {
    restaurants.push(rd.restaurant);
    categories.push(...rd.categories);
    menuItems.push(...rd.menuItems);
  });

  return { restaurants, categories, menuItems };
}

// Load current data from localStorage or fallback to seed data
export function getStoredData(): StorageSchema {
  if (typeof window === 'undefined') {
    return getInitialData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.restaurants && parsed.categories && parsed.menuItems) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored menu data:', e);
  }

  const initial = getInitialData();
  saveStoredData(initial);
  return initial;
}

// Save data to localStorage and notify active pages
export function saveStoredData(data: StorageSchema): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event(DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to save menu data to localStorage:', e);
    }
  }
}

// Subscribe to real-time data changes in browser
export function subscribeToDataChanges(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => callback();
  window.addEventListener(DATA_UPDATE_EVENT, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(DATA_UPDATE_EVENT, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

// --- RESTAURANT CRUD ---
export function getAllRestaurants(): Restaurant[] {
  return getStoredData().restaurants;
}

export function getRestaurantBySlugFromStore(slug: string): RestaurantData | null {
  const data = getStoredData();
  const restaurant = data.restaurants.find((r) => r.slug === slug && r.active);
  if (!restaurant) return null;

  const categories = data.categories
    .filter((c) => c.restaurant_id === restaurant.id && c.active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const menuItems = data.menuItems
    .filter((m) => m.restaurant_id === restaurant.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return { restaurant, categories, menuItems };
}

export async function saveRestaurant(restaurant: Restaurant): Promise<Restaurant> {
  const data = getStoredData();
  const existingIdx = data.restaurants.findIndex((r) => r.id === restaurant.id);

  if (existingIdx >= 0) {
    data.restaurants[existingIdx] = restaurant;
  } else {
    data.restaurants.push(restaurant);
  }

  saveStoredData(data);

  // Sync to Vercel Server API & Supabase
  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurant),
      });
    } catch (e) {
      console.warn('API sync failed:', e);
    }
  }

  return restaurant;
}

export async function deleteRestaurant(id: string): Promise<void> {
  const data = getStoredData();
  data.restaurants = data.restaurants.filter((r) => r.id !== id);
  data.categories = data.categories.filter((c) => c.restaurant_id !== id);
  data.menuItems = data.menuItems.filter((m) => m.restaurant_id !== id);
  saveStoredData(data);

  if (typeof window !== 'undefined') {
    try {
      await fetch(`/api/restaurants?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete failed:', e);
    }
  }
}

// --- CATEGORY CRUD ---
export function getCategoriesByRestaurant(restaurantId: string): Category[] {
  const data = getStoredData();
  return data.categories
    .filter((c) => c.restaurant_id === restaurantId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveCategory(category: Category): Promise<Category> {
  const data = getStoredData();
  const existingIdx = data.categories.findIndex((c) => c.id === category.id);

  if (existingIdx >= 0) {
    data.categories[existingIdx] = category;
  } else {
    data.categories.push(category);
  }

  saveStoredData(data);

  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
    } catch (e) {
      console.warn('API sync failed:', e);
    }
  }

  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  const data = getStoredData();
  data.categories = data.categories.filter((c) => c.id !== id);
  data.menuItems = data.menuItems.filter((m) => m.category_id !== id);
  saveStoredData(data);

  if (typeof window !== 'undefined') {
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete failed:', e);
    }
  }
}

// --- MENU ITEM CRUD ---
export function getMenuItemsByRestaurant(restaurantId: string): MenuItem[] {
  const data = getStoredData();
  return data.menuItems
    .filter((m) => m.restaurant_id === restaurantId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveMenuItem(item: MenuItem): Promise<MenuItem> {
  const data = getStoredData();
  const existingIdx = data.menuItems.findIndex((m) => m.id === item.id);

  if (existingIdx >= 0) {
    data.menuItems[existingIdx] = item;
  } else {
    data.menuItems.push(item);
  }

  saveStoredData(data);

  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    } catch (e) {
      console.warn('API sync failed:', e);
    }
  }

  return item;
}

export async function toggleMenuItemAvailable(id: string): Promise<void> {
  const data = getStoredData();
  const item = data.menuItems.find((m) => m.id === id);
  if (item) {
    item.available = !item.available;
    saveStoredData(data);

    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/menu-items', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
      } catch (e) {
        console.warn('API sync failed:', e);
      }
    }
  }
}

export async function deleteMenuItem(id: string): Promise<void> {
  const data = getStoredData();
  data.menuItems = data.menuItems.filter((m) => m.id !== id);
  saveStoredData(data);

  if (typeof window !== 'undefined') {
    try {
      await fetch(`/api/menu-items?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete failed:', e);
    }
  }
}
