"use client";

import { motion } from "motion/react";

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-dvh">
      {/* Sidebar skeleton */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-stone-200 bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-stone-200 px-5">
          <div className="skeleton size-9 rounded-lg" />
          <div className="space-y-1.5">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-2.5 w-16" />
          </div>
        </div>
        <div className="flex-1 space-y-1 px-3 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <div className="skeleton size-5 rounded" />
              <div className="skeleton h-4 w-20" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 pt-14 lg:pt-0 lg:pl-64">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-6 space-y-2">
            <div className="skeleton h-8 w-64" />
            <div className="skeleton h-4 w-80" />
          </div>

          {/* Stats skeleton */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="stat-card"
              >
                <div className="flex items-center justify-between">
                  <div className="skeleton h-4 w-24" />
                  <div className="skeleton size-5 rounded" />
                </div>
                <div className="skeleton h-8 w-32 mt-1" />
              </motion.div>
            ))}
          </div>

          {/* Chart skeleton */}
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3 card">
              <div className="mb-4 space-y-1.5">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-40" />
              </div>
              <div className="skeleton h-56 rounded-lg" />
            </div>
            <div className="lg:col-span-2 card">
              <div className="mb-4 space-y-1.5">
                <div className="skeleton h-4 w-28" />
                <div className="skeleton h-3 w-36" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="skeleton size-5 rounded" />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between">
                        <div className="skeleton h-3.5 w-28" />
                        <div className="skeleton h-3.5 w-16" />
                      </div>
                      <div className="skeleton h-1.5 w-full rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table skeleton */}
          <div className="card">
            <div className="mb-4 space-y-1.5">
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-3 w-36" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="skeleton size-9 rounded-lg" />
                    <div className="space-y-1.5">
                      <div className="skeleton h-4 w-28" />
                      <div className="skeleton h-3 w-36" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="skeleton h-5 w-16 rounded-full" />
                    <div className="skeleton h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
