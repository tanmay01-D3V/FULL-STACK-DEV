export default function Spinner({ label = "Loading…", size = "h-8 w-8" }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-3 py-12">
      <svg viewBox="0 0 24 24" fill="none" className={`${size} animate-spin text-brand-600`} aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="text-sm font-medium text-stone-500">{label}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="h-28 animate-pulse bg-gradient-to-br from-brand-100 to-brand-50" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-stone-200" />
            <div className="h-3 w-full animate-pulse rounded-full bg-stone-100" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-stone-100" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-stone-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
