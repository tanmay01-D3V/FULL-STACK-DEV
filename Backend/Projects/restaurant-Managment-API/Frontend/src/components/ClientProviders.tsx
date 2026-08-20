"use client";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import { usePathname } from "next/navigation";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const publicPages = ["/login", "/register"];
  const isPublicPage = publicPages.includes(pathname);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-stone-200 border-t-terracotta-600" />
          <p className="text-sm text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isPublicPage) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-stone-50">
        <div className="w-full max-w-sm px-4 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-terracotta-50 font-serif text-xl text-terracotta-600">
            O
          </div>
          <p className="mb-1 text-sm font-medium text-stone-700">Authentication required</p>
          <p className="mb-6 text-sm text-stone-500">Please sign in to access the dashboard.</p>
          <a href="/login" className="btn-primary">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  if (isPublicPage) {
    return <>{children}</>;
  }

  return <RestaurantProvider>{children}</RestaurantProvider>;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
