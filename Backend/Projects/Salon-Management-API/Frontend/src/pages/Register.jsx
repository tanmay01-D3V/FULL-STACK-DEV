import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { getApiError } from "../api/client";

const registerSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email: yup.string().required("Email is required").email("Enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(registerSchema) });

  async function onSubmit(values) {
    setApiError("");
    try {
      await signup(values);
      toast.success("Account created! Please log in.");
      navigate("/login", { replace: true });
    } catch (error) {
      setApiError(getApiError(error, "Registration failed. Please try again."));
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Join Glow &amp; Grace to manage services.
        </p>
      </div>

      <div className="card mt-8 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label htmlFor="register-name" className="label">Full name</label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Aarav Sharma"
              className={`input ${errors.name ? "input-error" : ""}`}
              {...register("name")}
            />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="register-email" className="label">Email</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`input ${errors.email ? "input-error" : ""}`}
              {...register("email")}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="register-password" className="label">Password</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
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
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-900">
          Log in
        </Link>
      </p>
    </section>
  );
}
