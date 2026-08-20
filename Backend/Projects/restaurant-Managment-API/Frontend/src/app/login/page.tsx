"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh">
      {/* Left Panel — Brand */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex bg-gradient-to-br from-stone-900 via-stone-800 to-terracotta-950">
        {/* Decorative grain overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        {/* Decorative circles */}
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-terracotta-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-terracotta-500/8 blur-2xl" />

        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
            <span className="font-serif text-3xl text-white">O</span>
          </div>
          <h1 className="font-serif text-4xl leading-tight text-white">
            Osteria
          </h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-terracotta-300/80">
            Restaurant Management
          </p>
          <div className="mx-auto my-8 h-px w-16 bg-gradient-to-r from-transparent via-terracotta-400/40 to-transparent" />
          <p className="text-base leading-relaxed text-stone-400">
            Manage your kitchen, track orders, and delight guests — all from one place.
          </p>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Orders", "Menu", "Reservations"].map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-stone-300"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-1 items-center justify-center bg-stone-50 px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-10 text-center lg:hidden">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-terracotta-600 font-serif text-xl text-white">
              O
            </div>
            <h1 className="font-serif text-2xl text-stone-900">Osteria</h1>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-2xl text-stone-900">Welcome back</h2>
            <p className="mt-1.5 text-sm text-stone-500">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-terracotta-400 focus:ring-4 focus:ring-terracotta-100"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-stone-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 pr-11 text-sm text-stone-900 outline-none transition-all duration-200 placeholder:text-stone-400 focus:border-terracotta-400 focus:ring-4 focus:ring-terracotta-100"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full overflow-hidden rounded-xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-terracotta-600/20 transition-all duration-200 hover:bg-terracotta-700 hover:shadow-md hover:shadow-terracotta-600/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <svg className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
