"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useRestaurant, type Restaurant } from "@/contexts/RestaurantContext";
import { motion, AnimatePresence } from "motion/react";

const cuisineOptions = [
  "Italian",
  "Japanese",
  "Mexican",
  "Indian",
  "Chinese",
  "French",
  "Thai",
  "American",
  "Mediterranean",
  "Korean",
];

export default function RestaurantsPage() {
  const {
    restaurants,
    loading,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
  } = useRestaurant();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    cuisine: "Italian",
    rating: "4.5",
  });

  const resetForm = () => {
    setForm({ name: "", city: "", address: "", cuisine: "Italian", rating: "4.5" });
  };

  const openAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEdit = (r: Restaurant) => {
    setEditingRestaurant(r);
    setForm({
      name: r.name,
      city: r.city,
      address: r.address,
      cuisine: r.cuisine,
      rating: String(r.rating),
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingRestaurant(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.address) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        city: form.city,
        address: form.address,
        cuisine: form.cuisine,
        rating: parseFloat(form.rating) || 0,
      };
      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant._id, payload);
      } else {
        await addRestaurant(payload);
      }
      closeModal();
    } catch {
      // handled by context
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this restaurant and all its menu items?")) return;
    await deleteRestaurant(id);
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      <span className="inline-flex items-center gap-0.5 text-sm">
        {Array.from({ length: full }).map((_, i) => (
          <svg key={`f${i}`} className="size-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {Array.from({ length: half }).map((_, i) => (
          <svg key={`h${i}`} className="size-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#d6d3d1" />
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <svg key={`e${i}`} className="size-4 text-stone-200" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-stone-500 tabular-nums">{rating.toFixed(1)}</span>
      </span>
    );
  };

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 pt-14 lg:pt-0 lg:pl-64">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Header
            title="Restaurants"
            description="Manage your restaurants, locations, and cuisines."
            actions={
              <button onClick={openAdd} className="btn-primary">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Restaurant
              </button>
            }
          />

          {/* Restaurant Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {restaurants.map((r) => (
                <motion.div
                  key={r._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}
                  className="card group relative overflow-hidden"
                >
                  {/* Header stripe */}
                  <div className="h-1.5 bg-gradient-to-r from-terracotta-400 to-terracotta-600" />

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg text-stone-900 truncate">{r.name}</h3>
                        <p className="text-sm text-stone-500">{r.cuisine}</p>
                      </div>
                      <div className="ml-3 flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(r)}
                          className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                          title="Edit"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="rounded-md p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">{renderStars(r.rating)}</div>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-start gap-2">
                        <svg className="mt-0.5 size-4 shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <span className="text-stone-600">{r.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="size-4 shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        <span className="text-stone-600">{r.city}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {!loading && restaurants.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-stone-100">
                <svg className="size-8 text-stone-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21h3.75M12 21V9.349m0 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0-3h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <p className="mb-1 text-sm font-medium text-stone-700">No restaurants yet</p>
              <p className="mb-5 text-sm text-stone-400">Add your first restaurant to get started</p>
              <button onClick={openAdd} className="btn-primary">
                Add Restaurant
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="size-8 animate-spin rounded-full border-2 border-stone-200 border-t-terracotta-600" />
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Modal */}
      {(showAddModal || editingRestaurant) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-lg">
            <h2 className="mb-5 font-serif text-lg text-stone-900">
              {editingRestaurant ? "Edit Restaurant" : "Add Restaurant"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                  placeholder="Osteria Downtown"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-stone-700">Cuisine</label>
                  <select
                    value={form.cuisine}
                    onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                  >
                    {cuisineOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Address</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-stone-700">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={closeModal} className="btn-ghost text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                  {submitting ? "Saving..." : editingRestaurant ? "Save Changes" : "Add Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
