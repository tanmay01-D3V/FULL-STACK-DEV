"use client";

import { motion } from "motion/react";
import { formatCurrency, formatTime } from "@/lib/utils";
import type { Order, OrderStatus } from "@/data/mock";

interface RecentOrdersProps {
  orders: Order[];
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "badge-warning" },
  preparing: { label: "Preparing", className: "badge-info" },
  ready: { label: "Ready", className: "badge-success" },
  served: { label: "Served", className: "badge-muted" },
  completed: { label: "Completed", className: "badge-muted" },
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="card"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">Recent Orders</h3>
          <p className="text-xs text-stone-500">Active and recent</p>
        </div>
        <a href="/orders" className="text-xs font-medium text-terracotta-600 hover:text-terracotta-700 transition-colors">
          View all
        </a>
      </div>
      <div className="divide-y divide-stone-100">
        {orders.map((order, i) => {
          const status = statusConfig[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 items-center justify-center rounded-lg bg-stone-100 text-sm font-semibold text-stone-700">
                  {order.table}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {order.guestName || order.id}
                  </p>
                  <p className="text-xs text-stone-500">
                    {order.items.length} items · {formatTime(new Date(order.createdAt))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={status.className}>{status.label}</span>
                <span className="text-sm font-semibold text-stone-900 tabular-nums">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
