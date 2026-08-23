import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { listServices } from "../api/serviceApi";
import { getApiError } from "../api/client";
import ServiceCard from "../components/ServiceCard";
import EmptyState from "../components/EmptyState";
import { CardSkeletonGrid } from "../components/Spinner";
import useAuth from "../hooks/useAuth";
import useScrollReveal from "../hooks/useScrollReveal";

const SORTS = [
  { id: "newest", label: "Newest first" },
  { id: "price-asc", label: "Price: low → high" },
  { id: "price-desc", label: "Price: high → low" },
  { id: "duration-asc", label: "Quickest first" },
];

export default function Services() {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const rootRef = useRef(null);

  useScrollReveal(rootRef, [loading]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listServices();
        if (!cancelled) setServices(data);
      } catch (error) {
        if (!cancelled) toast.error(getApiError(error, "Could not load services."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = services;

    if (q) {
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "duration-asc":
        sorted.sort((a, b) => (a.duration_minutes ?? Infinity) - (b.duration_minutes ?? Infinity));
        break;
      default:
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return sorted;
  }, [services, query, sort]);

  return (
    <section ref={rootRef} className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4" data-reveal>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Our services
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            {loading
              ? "Loading the menu…"
              : `${services.length} treatment${services.length === 1 ? "" : "s"} on the menu`}
          </p>
        </div>

        {isAuthenticated && (
          <Link to="/services/new" className="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add service
          </Link>
        )}
      </div>

      {/* Toolbar */}
      <div className="card mt-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or description…"
            aria-label="Search services"
            className="input !pl-11"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort services"
          className="input sm:w-52"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="mt-8">
        {loading ? (
          <CardSkeletonGrid count={6} />
        ) : visible.length === 0 ? (
          <EmptyState
            icon="✂"
            title={query ? "No matches found" : "No services yet"}
            message={
              query
                ? `Nothing matches "${query}". Try a different search.`
                : isAuthenticated
                  ? "Your menu is empty — add your first treatment to get started."
                  : "The menu is empty right now. Please check back soon."
            }
            action={
              query ? (
                <button type="button" className="btn-secondary" onClick={() => setQuery("")}>
                  Clear search
                </button>
              ) : isAuthenticated ? (
                <Link to="/services/new" className="btn-primary">
                  Add your first service
                </Link>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((service, i) => (
              <div key={service.id} data-reveal>
                <ServiceCard service={service} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
