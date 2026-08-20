"use client";

import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { revenueByHour } from "@/data/mock";

interface RevenueChartProps {
  data: typeof revenueByHour;
}

interface RevenueTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: RevenueTooltipProps) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-md">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="text-sm font-semibold text-stone-900">
        ${typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
};

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="card"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-stone-900">
          Revenue by Hour
        </h3>
        <p className="text-xs text-stone-500">Today&apos;s evening service</p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#968e78" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#968e78" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="revenue" fill="#db6530" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
