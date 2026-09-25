'use client';

import React, { useState } from 'react';
import { Category, MenuItem } from '@/lib/types';
import { Plus, Edit2, Trash2, FolderTree, CheckCircle2, X } from 'lucide-react';

interface Props {
  restaurantId: string;
  categories: Category[];
  menuItems: MenuItem[];
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryManager: React.FC<Props> = ({
  restaurantId,
  categories,
  menuItems,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    sort_order: categories.length + 1,
    active: true,
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      sort_order: categories.length + 1,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData(cat);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const categoryToSave: Category = {
      id: editingCategory?.id || `cat-${Date.now()}`,
      restaurant_id: restaurantId,
      name: formData.name.trim(),
      description: formData.description || '',
      sort_order: Number(formData.sort_order) || 1,
      active: formData.active ?? true,
      created_at: editingCategory?.created_at || new Date().toISOString(),
    };

    onSaveCategory(categoryToSave);
    setModalOpen(false);
  };

  return (
    <div className="space-y-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-amber-600" />
            Menu Categories
          </h2>
          <p className="text-xs text-stone-500">
            Organize food and drink sections for your digital menu.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl text-white bg-amber-600 hover:bg-amber-700 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-2.5">
        {categories.map((cat) => {
          const itemCount = menuItems.filter((m) => m.category_id === cat.id).length;

          return (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-300 transition-all"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900 truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-stone-500 bg-stone-200/70 px-2 py-0.5 rounded-full shrink-0">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </span>
                  {!cat.active && (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>
                {cat.description && (
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete category "${cat.name}" and its ${itemCount} food items?`
                      )
                    ) {
                      onDeleteCategory(cat.id);
                    }
                  }}
                  className="p-2 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="py-12 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-300">
            No categories created yet. Click &quot;Add Category&quot; above to create your first menu section.
          </div>
        )}
      </div>

      {/* Add / Edit Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-800 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starters, Main Course, Biryani..."
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short subtitle for this section..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Sort Order</label>
                <input
                  type="number"
                  min={1}
                  value={formData.sort_order || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={formData.active ?? true}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                />
                <label htmlFor="cat-active" className="font-bold text-stone-800">
                  Category Visible on Customer Menu
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white bg-amber-600 hover:bg-amber-700 text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
