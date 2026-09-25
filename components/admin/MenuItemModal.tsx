'use client';

import React, { useState, useEffect } from 'react';
import { MenuItem, Category, FoodType } from '@/lib/types';
import { X, Save, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface Props {
  isOpen: boolean;
  restaurantId: string;
  categories: Category[];
  itemToEdit: MenuItem | null;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

export const MenuItemModal: React.FC<Props> = ({
  isOpen,
  restaurantId,
  categories,
  itemToEdit,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    category_id: categories[0]?.id || '',
    description: '',
    image: '',
    price: 250,
    discount_price: null,
    food_type: 'veg',
    spice_level: 1,
    ingredients: [],
    allergens: [],
    tags: [],
    available: true,
    featured: false,
    bestseller: false,
    sort_order: 1,
  });

  const [rawIngredients, setRawIngredients] = useState('');
  const [rawAllergens, setRawAllergens] = useState('');
  const [rawTags, setRawTags] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit);
      setRawIngredients(itemToEdit.ingredients?.join(', ') || '');
      setRawAllergens(itemToEdit.allergens?.join(', ') || '');
      setRawTags(itemToEdit.tags?.join(', ') || '');
    } else {
      setFormData({
        name: '',
        category_id: categories[0]?.id || '',
        description: '',
        image: '',
        price: 250,
        discount_price: null,
        food_type: 'veg',
        spice_level: 1,
        ingredients: [],
        allergens: [],
        tags: [],
        available: true,
        featured: false,
        bestseller: false,
        sort_order: 1,
      });
      setRawIngredients('');
      setRawAllergens('');
      setRawTags('');
    }
  }, [itemToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.category_id) return;

    const parsedIngredients = rawIngredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedAllergens = rawAllergens
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedTags = rawTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const itemToSave: MenuItem = {
      id: itemToEdit?.id || `item-${Date.now()}`,
      restaurant_id: restaurantId,
      category_id: formData.category_id,
      name: formData.name.trim(),
      description: formData.description || '',
      image: formData.image || '',
      price: Number(formData.price) || 0,
      discount_price: formData.discount_price ? Number(formData.discount_price) : null,
      food_type: (formData.food_type as FoodType) || 'veg',
      spice_level: Number(formData.spice_level) || 0,
      ingredients: parsedIngredients,
      allergens: parsedAllergens,
      tags: parsedTags,
      available: formData.available ?? true,
      featured: formData.featured ?? false,
      bestseller: formData.bestseller ?? false,
      sort_order: Number(formData.sort_order) || 1,
      created_at: itemToEdit?.created_at || new Date().toISOString(),
    };

    onSave(itemToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            {itemToEdit ? 'Edit Food Item' : 'Add New Food Item'}
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Live Image Preview */}
          <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0">
              <ImageWithFallback
                src={formData.image || ''}
                alt="Item preview"
                fill
                className="object-cover"
                fallbackText="Dish Image"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="font-bold text-stone-900 truncate">{formData.name || 'Food Item Name'}</p>
              <p className="text-stone-500 font-semibold">Price: ₹{formData.price || 0}</p>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                  formData.food_type === 'veg' ? 'bg-emerald-100 text-emerald-800' :
                  formData.food_type === 'egg' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {formData.food_type}
                </span>
                {Number(formData.spice_level) > 0 && (
                  <span className="text-[10px] text-rose-600 font-bold">
                    {'🌶️'.repeat(Number(formData.spice_level))}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">Item Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Paneer Butter Masala..."
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Category *</label>
              <select
                required
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 font-semibold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-800 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Tasty description of ingredients & preparation..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.price ?? ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Discount Price (₹ Optional)</label>
              <input
                type="number"
                min={0}
                placeholder="Leave empty if no discount"
                value={formData.discount_price ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_price: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Dietary Food Type</label>
              <select
                value={formData.food_type || 'veg'}
                onChange={(e) => setFormData({ ...formData, food_type: e.target.value as FoodType })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 font-semibold"
              >
                <option value="veg">Veg 🟢</option>
                <option value="non-veg">Non-Veg 🔴</option>
                <option value="egg">Egg 🟠</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                Spice Level (0 to 3)
              </label>
              <select
                value={formData.spice_level ?? 0}
                onChange={(e) => setFormData({ ...formData, spice_level: parseInt(e.target.value, 10) })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
              >
                <option value={0}>0 - Mild / None</option>
                <option value={1}>1 - Low 🌶️</option>
                <option value={2}>2 - Medium 🌶️🌶️</option>
                <option value={3}>3 - Hot 🌶️🌶️🌶️</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-800 mb-1">Food Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-800 mb-1">Ingredients (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Paneer, Yoghurt, Kashmiri Chili, Butter..."
                value={rawIngredients}
                onChange={(e) => setRawIngredients(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Allergens (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Dairy, Nuts, Gluten..."
                value={rawAllergens}
                onChange={(e) => setRawAllergens(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">Tags (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Chef Special, Grill, Clay Oven..."
                value={rawTags}
                onChange={(e) => setRawTags(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
              />
            </div>

            {/* Checkbox Toggles */}
            <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2 border-t border-stone-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available ?? true}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                />
                <span className="font-bold text-stone-800">Available (In Stock)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bestseller ?? false}
                  onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                />
                <span className="font-bold text-amber-900">Mark as Bestseller ⭐</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured ?? false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                />
                <span className="font-bold text-stone-800">Featured Item 🌟</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white bg-amber-600 hover:bg-amber-700 text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{itemToEdit ? 'Save Changes' : 'Create Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
