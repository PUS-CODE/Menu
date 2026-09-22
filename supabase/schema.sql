-- Supabase PostgreSQL Schema for Multi-Restaurant Digital Menu (DM2P HUB Client System)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. RESTAURANTS TABLE
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    logo TEXT,
    cover_image TEXT,
    description TEXT,
    address TEXT,
    phone VARCHAR(50),
    opening_hours VARCHAR(255),
    google_maps_link TEXT,
    primary_color VARCHAR(50) DEFAULT '#d97706',
    secondary_color VARCHAR(50) DEFAULT '#78350f',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2),
    food_type VARCHAR(20) NOT NULL DEFAULT 'veg' CHECK (food_type IN ('veg', 'non-veg', 'egg')),
    spice_level INT DEFAULT 0 CHECK (spice_level BETWEEN 0 AND 3),
    ingredients TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    available BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    bestseller BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR HIGH-PERFORMANCE SLUG & RESTAURANT LOOKUPS
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id ON public.categories(restaurant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_category ON public.menu_items(restaurant_id, category_id, sort_order);

-- ENABLE ROW LEVEL SECURITY (RLS) FOR PUBLIC READ ACCESS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Allow public read active restaurants" ON public.restaurants
    FOR SELECT USING (active = true);

CREATE POLICY "Allow public read active categories" ON public.categories
    FOR SELECT USING (active = true);

CREATE POLICY "Allow public read available menu items" ON public.menu_items
    FOR SELECT USING (available = true);
