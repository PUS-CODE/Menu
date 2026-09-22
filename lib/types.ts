export type FoodType = 'veg' | 'non-veg' | 'egg';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  cover_image: string;
  description: string;
  address: string;
  phone: string;
  opening_hours: string;
  google_maps_link: string;
  primary_color: string;
  secondary_color: string;
  active: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  sort_order: number;
  active: boolean;
  created_at?: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount_price?: number | null;
  food_type: FoodType;
  spice_level: number; // 0 = None, 1 = Low, 2 = Medium, 3 = High
  ingredients: string[];
  allergens: string[];
  tags: string[];
  available: boolean;
  featured: boolean;
  bestseller: boolean;
  sort_order: number;
  created_at?: string;
}

export interface RestaurantData {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
}

export type FoodFilterType = 'all' | 'veg' | 'non-veg' | 'bestsellers' | 'spicy';
