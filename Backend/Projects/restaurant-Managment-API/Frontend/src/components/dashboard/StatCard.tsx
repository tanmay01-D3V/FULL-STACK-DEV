"use client";

import { motion } from "motion/react";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  format?: "currency" | "number";
  delay?: number;
}

export function StatCard({ label, value, change, icon, delay = 0 }: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="stat-card"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-500">{label}</span>
        <span className="text-stone-400">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-3xl text-stone-900">{value}</span>
        {change !== undefined && (
          <span
            className={`text-xs font-medium ${
              isPositive ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
