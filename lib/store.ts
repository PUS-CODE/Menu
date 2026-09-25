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

export function saveRestaurant(restaurant: Restaurant): Restaurant {
  const data = getStoredData();
  const existingIdx = data.restaurants.findIndex((r) => r.id === restaurant.id);

  if (existingIdx >= 0) {
    data.restaurants[existingIdx] = restaurant;
  } else {
    data.restaurants.push(restaurant);
  }

  saveStoredData(data);
  return restaurant;
}

export function deleteRestaurant(id: string): void {
  const data = getStoredData();
  data.restaurants = data.restaurants.filter((r) => r.id !== id);
  data.categories = data.categories.filter((c) => c.restaurant_id !== id);
  data.menuItems = data.menuItems.filter((m) => m.restaurant_id !== id);
  saveStoredData(data);
}

// --- CATEGORY CRUD ---
export function getCategoriesByRestaurant(restaurantId: string): Category[] {
  const data = getStoredData();
  return data.categories
    .filter((c) => c.restaurant_id === restaurantId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function saveCategory(category: Category): Category {
  const data = getStoredData();
  const existingIdx = data.categories.findIndex((c) => c.id === category.id);

  if (existingIdx >= 0) {
    data.categories[existingIdx] = category;
  } else {
    data.categories.push(category);
  }

  saveStoredData(data);
  return category;
}

export function deleteCategory(id: string): void {
  const data = getStoredData();
  data.categories = data.categories.filter((c) => c.id !== id);
  data.menuItems = data.menuItems.filter((m) => m.category_id !== id);
  saveStoredData(data);
}

// --- MENU ITEM CRUD ---
export function getMenuItemsByRestaurant(restaurantId: string): MenuItem[] {
  const data = getStoredData();
  return data.menuItems
    .filter((m) => m.restaurant_id === restaurantId)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function saveMenuItem(item: MenuItem): MenuItem {
  const data = getStoredData();
  const existingIdx = data.menuItems.findIndex((m) => m.id === item.id);

  if (existingIdx >= 0) {
    data.menuItems[existingIdx] = item;
  } else {
    data.menuItems.push(item);
  }

  saveStoredData(data);
  return item;
}

export function toggleMenuItemAvailable(id: string): void {
  const data = getStoredData();
  const item = data.menuItems.find((m) => m.id === id);
  if (item) {
    item.available = !item.available;
    saveStoredData(data);
  }
}

export function deleteMenuItem(id: string): void {
  const data = getStoredData();
  data.menuItems = data.menuItems.filter((m) => m.id !== id);
  saveStoredData(data);
}
