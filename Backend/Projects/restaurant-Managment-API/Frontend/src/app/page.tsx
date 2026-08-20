"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { PopularItems } from "@/components/dashboard/PopularItems";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import type { Order } from "@/data/mock";

export default function DashboardPage() {
  const { user } = useAuth();
  const { restaurants, menuItems, selectedRestaurant } = useRestaurant();

  const derivedOrders: Order[] = menuItems.length
    ? menuItems.slice(0, 5).map((item, index) => ({
        id: `ORD-${index + 1}`,
        table: index + 1,
        items: [{ name: item.name, quantity: 1, price: item.price }],
        status: ["pending", "preparing", "ready", "served", "completed"][
          index % 5
        ] as Order["status"],
        total: item.price,
        createdAt: item.createdAt,
        guestName: `Guest ${index + 1}`,
      }))
    : [];

  const revenue = derivedOrders.reduce((sum, order) => sum + order.total, 0);
  const ordersCount = derivedOrders.length || restaurants.length || 0;
  const guestsCount = derivedOrders.length
    ? derivedOrders.length * 3 + restaurants.length
    : restaurants.length * 2;
  const avgTicket = ordersCount ? revenue / ordersCount : 0;

  const revenueByHour = [
    { hour: "5PM", revenue: Math.max(120, Math.round(revenue * 0.12)) },
    { hour: "6PM", revenue: Math.max(180, Math.round(revenue * 0.22)) },
    { hour: "7PM", revenue: Math.max(220, Math.round(revenue * 0.28)) },
    { hour: "8PM", revenue: Math.max(200, Math.round(revenue * 0.24)) },
    { hour: "9PM", revenue: Math.max(140, Math.round(revenue * 0.12)) },
    { hour: "10PM", revenue: Math.max(80, Math.round(revenue * 0.08)) },
  ];

  const popularItems = menuItems
    .slice(0, 5)
    .map((item, index) => ({
      name: item.name,
      orders: Math.max(1, 4 - index),
      revenue: item.price * Math.max(1, 4 - index),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const dashboardStats = {
    revenue,
    orders: ordersCount,
    guests: guestsCount,
    avgTicket,
    revenueChange: menuItems.length ? 8.4 : 0,
    ordersChange: menuItems.length ? 6.1 : 0,
  };

  const recentOrders = derivedOrders
    .filter((o) => o.status !== "completed")
    .slice(0, 5);

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main className="flex-1 pt-14 lg:pt-0 lg:pl-64">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Header
            title={`Good evening, ${user?.username || selectedRestaurant?.name || "there"}`}
            description={
              selectedRestaurant
                ? `Overview for ${selectedRestaurant.name}.`
                : "Here&apos;s what&apos;s happening at Osteria tonight."
            }
          />

          {/* Stats Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Today's Revenue"
              value={formatCurrency(dashboardStats.revenue)}
              change={dashboardStats.revenueChange}
              icon={
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659 1.171-1.17a5 5 0 0 1 6.742 6.742l-1.17 1.171.659.878A8.969 8.969 0 0 1 12 21a8.969 8.969 0 0 1-6.265-2.492l-.659-.878 1.17-1.17a5 5 0 0 1 6.742-6.742l1.17 1.171.879-.659A8.969 8.969 0 0 1 21 12a8.969 8.969 0 0 1-2.492 6.265l-.878.659-1.17-1.17a5 5 0 0 1-6.742-6.742l1.17-1.17-.659-.878A8.969 8.969 0 0 1 12 3a8.969 8.969 0 0 1 6.265 2.492Z"
                  />
                </svg>
              }
              delay={0}
            />
            <StatCard
              label="Orders"
              value={dashboardStats.orders}
              change={dashboardStats.ordersChange}
              icon={
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              }
              delay={0.1}
            />
            <StatCard
              label="Guests"
              value={dashboardStats.guests}
              icon={
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              }
              delay={0.2}
            />
            <StatCard
              label="Avg. Ticket"
              value={formatCurrency(dashboardStats.avgTicket)}
              icon={
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>
              }
              delay={0.3}
            />
          </div>

          {/* Charts & Lists Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <RevenueChart data={revenueByHour} />
            </div>
            <div className="lg:col-span-2">
              <PopularItems items={popularItems} />
            </div>
          </div>

          {/* Recent Orders */}
          <RecentOrders orders={recentOrders} />
        </div>
      </main>
    </div>
  );
}
