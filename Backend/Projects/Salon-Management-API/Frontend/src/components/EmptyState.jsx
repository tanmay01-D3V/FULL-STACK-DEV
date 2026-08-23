export default function EmptyState({
  icon = "✦",
  title,
  message,
  action,
}) {
  return (
    <div className="card mx-auto flex max-w-md flex-col items-center px-8 py-14 text-center">
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-50 text-xl text-brand-600"
      >
        {icon}
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold text-stone-900">{title}</h3>
      {message && <p className="mt-2 text-sm leading-relaxed text-stone-500">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
