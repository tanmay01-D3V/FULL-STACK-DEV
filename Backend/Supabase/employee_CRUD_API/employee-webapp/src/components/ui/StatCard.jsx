import { cn } from '../../lib/utils';

function StatCard({ icon: Icon, label, value, delta, deltaTone = 'up' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span className="inline-flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="size-5" />
        </span>
      </div>
      {delta && (
        <p
          className={cn(
            'mt-3 text-xs font-medium',
            deltaTone === 'up' ? 'text-emerald-600' : 'text-rose-600',
          )}
        >
          {delta}
          <span className="ml-1 font-normal text-slate-400">vs last month</span>
        </p>
      )}
    </div>
  );
}

export default StatCard;
