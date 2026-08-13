import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

function Select({
  label,
  error,
  hint,
  className,
  children,
  placeholder,
  value,
  ...props
}) {
  const isPlaceholder = placeholder && !value;
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          className={cn(
            'h-10 w-full appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-9 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
            error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20',
            isPlaceholder && 'text-slate-400',
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default Select;
