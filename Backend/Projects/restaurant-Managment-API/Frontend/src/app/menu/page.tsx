"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useRestaurant, type ApiMenuItem } from "@/contexts/RestaurantContext";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function MenuPage() {
  const {
    restaurants,
    selectedRestaurant,
    selectRestaurant,
    menuItems,
    loading,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useRestaurant();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiMenuItem | null>(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    setSubmitting(true);
    try {
      await addMenuItem(newName, parseFloat(newPrice));
      setNewName("");
      setNewPrice("");
      setShowAddModal(false);
    } catch {
      // error handled by context
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !newName || !newPrice) return;
    setSubmitting(true);
    try {
      await updateMenuItem(editingItem._id, { name: newName, price: parseFloat(newPrice) });
      setEditingItem(null);
      setNewName("");
      setNewPrice("");
    } catch {
      // error handled by context
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this menu item?")) return;
    await deleteMenuItem(id);
  };

  const handleToggleAvailability = async (item: ApiMenuItem) => {
    await updateMenuItem(item._id, { isAvailable: !item.isAvailable });
  };

  const openEdit = (item: ApiMenuItem) => {
    setEditingItem(item);
    setNewName(item.name);
    setNewPrice(String(item.price));
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    setNewName("");
    setNewPrice("");
  };

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 pt-14 lg:pt-0 lg:pl-64">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Header
            title="Menu"
            description="Manage your menu items, pricing, and availability."
            actions={
              <div className="flex items-center gap-3">
                {restaurants.length > 1 && (
                  <select
                    value={selectedRestaurant?._id ?? ""}
                    onChange={(e) => {
                      const r = restaurants.find((r) => r._id === Number(e.target.value));
                      if (r) selectRestaurant(r);
                    }}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 outline-none"
                  >
                    {restaurants.map((r) => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                  </select>
                )}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Item
                </button>
              </div>
            }
          />

          {/* Restaurant Info */}
          {selectedRestaurant && (
            <div className="mb-6 rounded-lg border border-stone-200 bg-white px-4 py-3">
              <p className="text-sm text-stone-500">
                Showing menu for <span className="font-medium text-stone-800">{selectedRestaurant.name}</span>
                {selectedRestaurant.city && <span className="text-stone-400"> in {selectedRestaurant.city}</span>}
              </p>
            </div>
          )}

          {/* Menu Table */}
          <div className="card overflow-hidden p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="size-6 animate-spin rounded-full border-2 border-stone-200 border-t-terracotta-600" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Item
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Price
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Status
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <AnimatePresence mode="popLayout">
                    {menuItems.map((item) => (
                      <motion.tr
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                        className="group hover:bg-stone-50/50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-medium text-stone-800">{item.name}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-semibold text-stone-800 tabular-nums">
                            {formatCurrency(item.price)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-300 ${
                              item.isAvailable ? "bg-emerald-500" : "bg-stone-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 mt-0.5 ${
                                item.isAvailable ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(item)}
                              className="btn-ghost px-2 py-1.5 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="btn-ghost px-2 py-1.5 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}

            {!loading && menuItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-stone-100">
                  <svg className="size-6 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-stone-600">No menu items yet</p>
                <p className="text-xs text-stone-400 mt-1">Add your first menu item to get started</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 font-serif text-lg text-stone-900">
              {editingItem ? "Edit Item" : "Add Item"}
            </h2>
            <form onSubmit={editingItem ? handleEdit : handleAdd} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                  placeholder="Grilled Ribeye"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Price ($)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                  placeholder="24.00"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="btn-ghost text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                  {submitting ? "Saving..." : editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
