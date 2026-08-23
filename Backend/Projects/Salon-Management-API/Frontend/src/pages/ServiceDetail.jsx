import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getService, deleteService } from "../api/serviceApi";
import { getApiError } from "../api/client";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatPrice, formatDuration, formatDate } from "../utils/format";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setService(await getService(id));
    } catch (error) {
      toast.error(getApiError(error, "Could not load this service."));
      setService(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteService(id);
      toast.success("Service deleted");
      navigate("/services", { replace: true });
    } catch (error) {
      toast.error(getApiError(error, "Could not delete this service."));
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (loading) return <Spinner label="Loading service…" />;

  if (!service) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <EmptyState
          icon="✦"
          title="Service not found"
          message="This treatment may have been removed or the link is incorrect."
          action={
            <Link to="/services" className="btn-primary">
              Back to services
            </Link>
          }
        />
      </section>
    );
  }

  const duration = formatDuration(service.duration_minutes);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
      <Link to="/services" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
        ← Back to services
      </Link>

      <article className="card mt-6 overflow-hidden">
        <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-brand-500 via-brand-600 to-plum-700 sm:h-52">
          <span aria-hidden="true" className="font-display text-7xl font-semibold text-white/90">
            {(service.name || "?").charAt(0).toUpperCase()}
          </span>
          <span className="absolute right-5 top-5 rounded-full bg-white/95 px-4 py-1.5 text-sm font-bold text-brand-800 shadow-sm">
            {formatPrice(service.price)}
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                {service.name}
              </h1>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-stone-400">
                Added {formatDate(service.created_at)}
              </p>
            </div>

            {isAuthenticated && (
              <div className="flex gap-3">
                <Link to={`/services/${id}/edit`} className="btn-secondary !px-4 !py-2 text-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                  Edit
                </Link>
                <button type="button" className="btn-danger !px-4 !py-2 text-sm" onClick={() => setConfirmOpen(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-stone-50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Price</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-brand-800">
                {formatPrice(service.price)}
              </dd>
            </div>
            <div className="rounded-xl bg-stone-50 px-4 py-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Duration</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-stone-800">
                {duration || "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-600">About this treatment</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-stone-600">
              {service.description?.trim() ||
                "No description yet — but every Glow & Grace treatment includes a warm welcome, a consultation and our signature finish."}
            </p>
          </div>
        </div>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this service?"
        message={`"${service.name}" will be permanently removed from the menu. This cannot be undone.`}
        pending={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
