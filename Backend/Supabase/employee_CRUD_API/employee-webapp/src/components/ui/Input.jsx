import { cn } from '../../lib/utils';

function Input({
  label,
  error,
  hint,
  className,
  containerClassName,
  id,
  ...props
}) {
  const inputId =
    id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400',
          'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
          error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default Input;
