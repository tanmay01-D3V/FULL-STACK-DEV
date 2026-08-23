import { Link } from "react-router-dom";
import { formatPrice, formatDuration } from "../utils/format";

const gradients = [
  "from-brand-500 to-plum-700",
  "from-rose-400 to-brand-700",
  "from-fuchsia-500 to-brand-800",
  "from-pink-400 to-rose-600",
  "from-purple-400 to-brand-600",
];

export default function ServiceCard({ service, index = 0 }) {
  const gradient = gradients[index % gradients.length];
  const duration = formatDuration(service.duration_minutes);

  return (
    <Link
      to={`/services/${service.id}`}
      className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span aria-hidden="true" className="font-display text-4xl font-semibold text-white/90">
          {(service.name || "?").charAt(0).toUpperCase()}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-800 shadow-sm">
          {formatPrice(service.price)}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-stone-900 transition group-hover:text-brand-800">
          {service.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-relaxed text-stone-500">
          {service.description || "A signature Glow & Grace treatment."}
        </p>

        <div className="mt-4 flex items-center justify-between">
          {duration ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" />
              </svg>
              {duration}
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs font-semibold text-brand-700 transition group-hover:translate-x-0.5">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
