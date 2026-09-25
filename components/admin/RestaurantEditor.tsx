'use client';

import React, { useState, useEffect } from 'react';
import { Restaurant } from '@/lib/types';
import { Save, Trash2, Palette, MapPin, Phone, Clock, Globe } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface Props {
  restaurant: Restaurant | null;
  onSave: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
}

export const RestaurantEditor: React.FC<Props> = ({
  restaurant,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Restaurant>({
    id: '',
    name: '',
    slug: '',
    logo: '',
    cover_image: '',
    description: '',
    address: '',
    phone: '',
    opening_hours: '',
    google_maps_link: '',
    primary_color: '#d97706',
    secondary_color: '#78350f',
    active: true,
  });

  useEffect(() => {
    if (restaurant) {
      setFormData(restaurant);
    }
  }, [restaurant]);

  if (!restaurant) {
    return (
      <div className="p-8 text-center text-stone-500 bg-white rounded-2xl border border-stone-200 shadow-xs">
        No restaurant selected. Please choose a restaurant above or create a new one.
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Restaurant Settings</h2>
          <p className="text-xs text-stone-500">
            Customize branding, location, hours, and theme colors for <span className="font-semibold text-amber-700">{formData.name || 'this restaurant'}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${formData.name}"? This action cannot be undone.`)) {
                onDelete(formData.id);
              }
            }}
            className="px-3 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-white bg-amber-600 hover:bg-amber-700 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Live Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">Cover Image Preview</label>
          <div className="relative h-28 w-full rounded-xl overflow-hidden bg-stone-200 border border-stone-300">
            <ImageWithFallback
              src={formData.cover_image}
              alt="Cover preview"
              fill
              className="object-cover"
              fallbackText="Cover Image"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">Logo Preview</label>
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0">
              <ImageWithFallback
                src={formData.logo}
                alt="Logo preview"
                fill
                className="object-cover"
                fallbackText="Logo"
              />
            </div>
            <div className="text-xs text-stone-600 space-y-1">
              <p><strong>Primary Color:</strong> <span className="inline-block w-3 h-3 rounded-full align-middle ml-1" style={{ backgroundColor: formData.primary_color }} /> {formData.primary_color}</p>
              <p><strong>Secondary Color:</strong> <span className="inline-block w-3 h-3 rounded-full align-middle ml-1" style={{ backgroundColor: formData.secondary_color }} /> {formData.secondary_color}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-stone-800 mb-1">Restaurant Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 font-semibold"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-800 mb-1">Restaurant Slug (URL Path) *</label>
          <div className="flex items-center">
            <span className="bg-stone-100 border border-r-0 border-stone-300 px-2.5 py-2.5 rounded-l-xl text-stone-500 text-xs">
              /menu/
            </span>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-2.5 rounded-r-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 font-mono font-semibold"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block font-bold text-stone-800 mb-1">Description</label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            placeholder="Short introductory description for customers..."
            className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-800 mb-1">Logo Image URL</label>
          <input
            type="url"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-800 mb-1">Cover Image URL</label>
          <input
            type="url"
            name="cover_image"
            value={formData.cover_image}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full physical address..."
            className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91..."
            className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Opening Hours
          </label>
          <input
            type="text"
            name="opening_hours"
            value={formData.opening_hours}
            onChange={handleChange}
            placeholder="e.g. 11:00 AM - 11:30 PM (Mon-Sun)"
            className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            Google Maps Link
          </label>
          <input
            type="url"
            name="google_maps_link"
            value={formData.google_maps_link}
            onChange={handleChange}
            placeholder="https://maps.google.com/..."
            className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
          />
        </div>

        {/* Brand Theme Accent Colors */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            Primary Accent Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              name="primary_color"
              value={formData.primary_color}
              onChange={handleChange}
              className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
            />
            <input
              type="text"
              name="primary_color"
              value={formData.primary_color}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-stone-300 font-mono text-xs text-stone-900"
            />
          </div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <label className="block font-bold text-stone-800 mb-1 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            Secondary Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              name="secondary_color"
              value={formData.secondary_color}
              onChange={handleChange}
              className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
            />
            <input
              type="text"
              name="secondary_color"
              value={formData.secondary_color}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-stone-300 font-mono text-xs text-stone-900"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="sm:col-span-2 flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
          />
          <label htmlFor="active" className="text-xs font-bold text-stone-800">
            Active Status (When unchecked, customer menu route displays &quot;Menu Not Found&quot;)
          </label>
        </div>
      </div>
    </form>
  );
};
