import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getService, createService, updateService } from "../api/serviceApi";
import { getApiError } from "../api/client";
import ServiceForm from "../components/ServiceForm";

export default function AddEditService() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isEdit) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const service = await getService(id);
        if (!cancelled) setInitial(service);
      } catch (error) {
        toast.error(getApiError(error, "Could not load this service."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  async function handleSubmit(values) {
    setPending(true);

    // Send only fields the backend understands; drop empty optionals.
    const payload = { name: values.name.trim(), price: values.price };
    if (values.description) payload.description = values.description;
    if (values.duration_minutes) payload.duration_minutes = values.duration_minutes;

    try {
      if (isEdit) {
        await updateService(id, payload);
        toast.success("Service updated");
        navigate(`/services/${id}`);
      } else {
        const created = await createService(payload);
        toast.success("Service added to the menu");
        navigate(`/services/${created.id}`);
      }
    } catch (error) {
      toast.error(getApiError(error, "Could not save this service."));
      setPending(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-xl flex-col px-4 py-12 sm:px-6 lg:py-16">
      <Link
        to={isEdit ? `/services/${id}` : "/services"}
        className="text-sm font-semibold text-brand-700 hover:text-brand-900"
      >
        ← Back
      </Link>

      <div className="card mt-6 p-6 sm:p-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
          {isEdit ? "Edit service" : "Add a new service"}
        </h1>
        <p className="mt-2 mb-8 text-sm text-stone-500">
          {isEdit
            ? "Update the treatment details below."
            : "Fill in the details to add this treatment to the menu."}
        </p>

        {loading ? (
          <div className="space-y-5" aria-hidden="true">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded-full bg-stone-200" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-stone-100" />
              </div>
            ))}
          </div>
        ) : isEdit && !initial ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            This service could not be loaded. It may have been deleted.
          </p>
        ) : (
          <ServiceForm
            initial={initial ?? {}}
            submitLabel={isEdit ? "Save changes" : "Add service"}
            pending={pending}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </section>
  );
}
