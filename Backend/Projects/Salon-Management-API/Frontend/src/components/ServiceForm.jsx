import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const serviceSchema = yup.object({
  name: yup
    .string()
    .required("Service name is required")
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  description: yup
    .string()
    .transform((v) => (typeof v === "string" && v.trim() === "" ? undefined : v))
    .max(500, "Description must be at most 500 characters")
    .notRequired(),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0"),
  duration_minutes: yup
    .number()
    .transform((v) => (Number.isNaN(v) ? undefined : v))
    .typeError("Duration must be a number")
    .integer("Enter whole minutes")
    .positive("Duration must be greater than 0")
    .notRequired(),
});

export default function ServiceForm({
  initial = {},
  submitLabel = "Save service",
  pending = false,
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      name: initial.name ?? "",
      description: initial.description ?? "",
      price: initial.price ?? "",
      duration_minutes: initial.duration_minutes ?? "",
    },
  });

  const busy = pending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="service-name" className="label">
          Service name <span className="text-brand-700">*</span>
        </label>
        <input
          id="service-name"
          type="text"
          placeholder="e.g. Signature Balayage"
          className={`input ${errors.name ? "input-error" : ""}`}
          {...register("name")}
        />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="service-description" className="label">
          Description{" "}
          <span className="text-xs font-normal text-stone-400">(optional)</span>
        </label>
        <textarea
          id="service-description"
          rows={3}
          placeholder="What makes this treatment special?"
          className={`input resize-none ${errors.description ? "input-error" : ""}`}
          {...register("description")}
        />
        {errors.description && <p className="field-error">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="service-price" className="label">
            Price (₹) <span className="text-brand-700">*</span>
          </label>
          <input
            id="service-price"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 1499"
            className={`input ${errors.price ? "input-error" : ""}`}
            {...register("price")}
          />
          {errors.price && <p className="field-error">{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="service-duration" className="label">
            Duration (minutes){" "}
            <span className="text-xs font-normal text-stone-400">(optional)</span>
          </label>
          <input
            id="service-duration"
            type="number"
            step="1"
            min="1"
            placeholder="e.g. 60"
            className={`input ${errors.duration_minutes ? "input-error" : ""}`}
            {...register("duration_minutes")}
          />
          {errors.duration_minutes && (
            <p className="field-error">{errors.duration_minutes.message}</p>
          )}
        </div>
      </div>

      <button type="submit" className="btn-primary w-full" disabled={busy}>
        {busy ? (
          <>
            <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-30" />
              <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
