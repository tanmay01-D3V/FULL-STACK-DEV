"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { formatCurrency, formatTime } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

type OrderStatus = "pending" | "preparing" | "ready" | "served" | "completed";

type DashboardOrder = {
  id: string;
  table: number;
  items: { name: string; quantity: number; price: number }[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  guestName?: string;
};

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: "Pending",
    className: "badge-warning",
    dot: "bg-amber-500",
  },
  preparing: { label: "Preparing", className: "badge-info", dot: "bg-sky-500" },
  ready: { label: "Ready", className: "badge-success", dot: "bg-emerald-500" },
  served: { label: "Served", className: "badge-muted", dot: "bg-stone-400" },
  completed: {
    label: "Completed",
    className: "badge-muted",
    dot: "bg-stone-300",
  },
};

const statusOrder: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "served",
  "completed",
];

export default function OrdersPage() {
  const { menuItems, selectedRestaurant } = useRestaurant();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const initialOrders = useMemo<DashboardOrder[]>(() => {
    return menuItems.slice(0, 8).map((item, index) => ({
      id: `ORD-${index + 1}`,
      table: index + 1,
      items: [{ name: item.name, quantity: 1, price: item.price }],
      status: statusOrder[index % statusOrder.length],
      total: item.price,
      createdAt: item.createdAt,
      guestName: selectedRestaurant?.name ? `Guest ${index + 1}` : undefined,
    }));
  }, [menuItems, selectedRestaurant]);

  const filtered =
    filter === "all"
      ? initialOrders
      : initialOrders.filter((o) => o.status === filter);

  const counts = statusOrder.reduce(
    (acc, s) => ({
      ...acc,
      [s]: initialOrders.filter((o) => o.status === s).length,
    }),
    {} as Record<OrderStatus, number>,
  );

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 pt-14 lg:pt-0 lg:pl-64">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Header
            title="Orders"
            description={
              selectedRestaurant
                ? `Live activity for ${selectedRestaurant.name}.`
                : "Track and manage all restaurant orders."
            }
          />

          {/* Status Filter Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-terracotta-600 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              All ({initialOrders.length})
            </button>
            {statusOrder.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === s
                    ? "bg-terracotta-600 text-white"
                    : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                }`}
              >
                {statusConfig[s].label} ({counts[s]})
              </button>
            ))}
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="card hover:shadow-md transition-shadow"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-terracotta-50 font-serif text-lg text-terracotta-700">
                          {order.table}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-800">
                            {order.guestName || order.id}
                          </p>
                          <p className="text-xs text-stone-500">
                            {order.id} · {formatTime(new Date(order.createdAt))}
                          </p>
                        </div>
                      </div>
                      <span className={status.className}>{status.label}</span>
                    </div>

                    <div className="mb-3 space-y-1.5">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-stone-600">
                            <span className="font-mono text-xs text-stone-400 mr-1.5">
                              {item.quantity}×
                            </span>
                            {item.name}
                          </span>
                          <span className="text-stone-500 tabular-nums">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                      <span className="text-sm font-semibold text-stone-900">
                        Total: {formatCurrency(order.total)}
                      </span>
                      <div className="flex gap-1.5">
                        {order.status !== "completed" && (
                          <>
                            <button className="btn-secondary px-2.5 py-1.5 text-xs">
                              Next
                            </button>
                            <button className="btn-ghost px-2.5 py-1.5 text-xs text-stone-500">
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-stone-100">
                <svg
                  className="size-7 text-stone-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-600">
                No orders found
              </p>
              <p className="text-xs text-stone-400 mt-1">
                No orders match the selected filter
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
