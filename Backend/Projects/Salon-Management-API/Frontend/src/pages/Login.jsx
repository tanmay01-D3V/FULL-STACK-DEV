import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getApiError } from "../api/client";

const loginSchema = yup.object({
  email: yup.string().required("Email is required").email("Enter a valid email"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema) });

  async function onSubmit(values) {
    setApiError("");
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      setApiError(getApiError(error, "Login failed. Please try again."));
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Log in to manage your salon's services.
        </p>
      </div>

      <div className="card mt-8 p-6 sm:p-8">
        {location.state?.expired && (
          <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
            Your session expired. Please log in again.
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label htmlFor="login-email" className="label">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`input ${errors.email ? "input-error" : ""}`}
              {...register("email")}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="label">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`input ${errors.password ? "input-error" : ""}`}
              {...register("password")}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {apiError && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {apiError}
            </p>
          )}

          <button type="submit" className="btn-primary w-full !py-3" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                  <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Logging in…
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-stone-500">
        New to Glow &amp; Grace?{" "}
        <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-900">
          Create an account
        </Link>
      </p>
    </section>
  );
}
