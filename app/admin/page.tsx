'use client';

import React, { useState, useEffect } from 'react';
import { Restaurant, Category, MenuItem } from '@/lib/types';
import {
  getAllRestaurants,
  saveRestaurant,
  deleteRestaurant,
  getCategoriesByRestaurant,
  saveCategory,
  deleteCategory,
  getMenuItemsByRestaurant,
  saveMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailable,
  subscribeToDataChanges,
} from '@/lib/store';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { RestaurantEditor } from '@/components/admin/RestaurantEditor';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { MenuItemManager } from '@/components/admin/MenuItemManager';
import { MenuItemModal } from '@/components/admin/MenuItemModal';
import { Toast } from '@/components/ui/Toast';
import { Plus, X, Building2 } from 'lucide-react';

export default function AdminPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'categories' | 'items'>('items');

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Item modal state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New restaurant modal state
  const [newRestModalOpen, setNewRestModalOpen] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestSlug, setNewRestSlug] = useState('');

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Load data function
  const refreshData = () => {
    const list = getAllRestaurants();
    setRestaurants(list);

    if (list.length > 0) {
      const current = selectedRestaurant
        ? list.find((r) => r.id === selectedRestaurant.id) || list[0]
        : list[0];

      setSelectedRestaurant(current);
      setCategories(getCategoriesByRestaurant(current.id));
      setMenuItems(getMenuItemsByRestaurant(current.id));
    } else {
      setSelectedRestaurant(null);
      setCategories([]);
      setMenuItems([]);
    }
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeToDataChanges(refreshData);
    return () => unsubscribe();
  }, []);

  const handleSelectRestaurant = (r: Restaurant) => {
    setSelectedRestaurant(r);
    setCategories(getCategoriesByRestaurant(r.id));
    setMenuItems(getMenuItemsByRestaurant(r.id));
  };

  // --- RESTAURANT ACTIONS ---
  const handleSaveRestaurant = (r: Restaurant) => {
    saveRestaurant(r);
    showToast(`Saved restaurant settings for ${r.name}`);
    refreshData();
  };

  const handleDeleteRestaurant = (id: string) => {
    deleteRestaurant(id);
    showToast('Restaurant deleted');
    refreshData();
  };

  const handleCreateNewRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim() || !newRestSlug.trim()) return;

    const newRest: Restaurant = {
      id: `rest-${Date.now()}`,
      name: newRestName.trim(),
      slug: newRestSlug.trim().toLowerCase().replace(/\s+/g, '-'),
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      cover_image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      description: 'Welcome to our digital menu.',
      address: 'City Center',
      phone: '+91 99999 99999',
      opening_hours: '11:00 AM - 11:00 PM (Daily)',
      google_maps_link: 'https://maps.google.com',
      primary_color: '#d97706',
      secondary_color: '#78350f',
      active: true,
      created_at: new Date().toISOString(),
    };

    saveRestaurant(newRest);
    setNewRestName('');
    setNewRestSlug('');
    setNewRestModalOpen(false);
    setSelectedRestaurant(newRest);
    showToast(`Created new restaurant "${newRest.name}"`);
    refreshData();
  };

  // --- CATEGORY ACTIONS ---
  const handleSaveCategory = (cat: Category) => {
    saveCategory(cat);
    showToast(`Saved category "${cat.name}"`);
    if (selectedRestaurant) {
      setCategories(getCategoriesByRestaurant(selectedRestaurant.id));
    }
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    showToast('Category deleted');
    if (selectedRestaurant) {
      setCategories(getCategoriesByRestaurant(selectedRestaurant.id));
      setMenuItems(getMenuItemsByRestaurant(selectedRestaurant.id));
    }
  };

  // --- MENU ITEM ACTIONS ---
  const handleSaveMenuItem = (item: MenuItem) => {
    saveMenuItem(item);
    showToast(`Saved dish "${item.name}"`);
    if (selectedRestaurant) {
      setMenuItems(getMenuItemsByRestaurant(selectedRestaurant.id));
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    deleteMenuItem(id);
    showToast('Food item deleted');
    if (selectedRestaurant) {
      setMenuItems(getMenuItemsByRestaurant(selectedRestaurant.id));
    }
  };

  const handleToggleAvailable = (id: string) => {
    toggleMenuItemAvailable(id);
    showToast('Updated availability status');
    if (selectedRestaurant) {
      setMenuItems(getMenuItemsByRestaurant(selectedRestaurant.id));
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-16">
      {/* Top Navbar */}
      <AdminNavbar
        restaurants={restaurants}
        selectedRestaurant={selectedRestaurant}
        onSelectRestaurant={handleSelectRestaurant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddNewRestaurant={() => setNewRestModalOpen(true)}
      />

      {/* Main Tab Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {!selectedRestaurant ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs text-center space-y-3">
            <Building2 className="w-10 h-10 text-stone-400 mx-auto" />
            <h2 className="text-lg font-bold text-stone-800">No Restaurant Selected</h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Create your first restaurant to start managing your digital menu.
            </p>
            <button
              onClick={() => setNewRestModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Restaurant</span>
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'items' && (
              <MenuItemManager
                restaurantId={selectedRestaurant.id}
                categories={categories}
                menuItems={menuItems}
                onAddNewItem={() => {
                  setEditingItem(null);
                  setItemModalOpen(true);
                }}
                onEditItem={(item) => {
                  setEditingItem(item);
                  setItemModalOpen(true);
                }}
                onDeleteItem={handleDeleteMenuItem}
                onToggleAvailable={handleToggleAvailable}
              />
            )}

            {activeTab === 'categories' && (
              <CategoryManager
                restaurantId={selectedRestaurant.id}
                categories={categories}
                menuItems={menuItems}
                onSaveCategory={handleSaveCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            )}

            {activeTab === 'restaurants' && (
              <RestaurantEditor
                restaurant={selectedRestaurant}
                onSave={handleSaveRestaurant}
                onDelete={handleDeleteRestaurant}
              />
            )}
          </>
        )}
      </main>

      {/* Modal: Create Food Item / Edit Food Item */}
      {selectedRestaurant && (
        <MenuItemModal
          isOpen={itemModalOpen}
          restaurantId={selectedRestaurant.id}
          categories={categories}
          itemToEdit={editingItem}
          onClose={() => setItemModalOpen(false)}
          onSave={handleSaveMenuItem}
        />
      )}

      {/* Modal: Add New Restaurant */}
      {newRestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Add New Restaurant</h3>
              <button
                onClick={() => setNewRestModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewRestaurant} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spice Garden Bistro..."
                  value={newRestName}
                  onChange={(e) => {
                    setNewRestName(e.target.value);
                    setNewRestSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
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
                    required
                    placeholder="spice-garden"
                    value={newRestSlug}
                    onChange={(e) => setNewRestSlug(e.target.value)}
                    className="w-full p-2.5 rounded-r-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setNewRestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-amber-600 hover:bg-amber-700 text-xs font-bold shadow-xs"
                >
                  Create Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
