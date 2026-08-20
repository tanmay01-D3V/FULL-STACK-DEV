"use client";

import { motion } from "motion/react";
import { formatCurrency } from "@/lib/utils";

interface PopularItem {
  name: string;
  orders: number;
  revenue: number;
}

interface PopularItemsProps {
  items: PopularItem[];
}

export function PopularItems({ items }: PopularItemsProps) {
  const maxOrders = Math.max(...items.map((i) => i.orders));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-stone-900">Popular Items</h3>
        <p className="text-xs text-stone-500">By order count today</p>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.name} className="flex items-center gap-3">
            <span className="w-5 text-right font-mono text-xs text-stone-400">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-stone-800 truncate">
                  {item.name}
                </span>
                <span className="ml-2 text-xs text-stone-500 whitespace-nowrap">
                  {item.orders} orders
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-100">
                <motion.div
                  className="h-full rounded-full bg-terracotta-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.orders / maxOrders) * 100}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
