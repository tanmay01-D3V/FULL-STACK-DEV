import { cn } from '../../lib/utils';
import { STATUS_META } from '../../lib/constants';

function StatusBadge({ status, className }) {
  const meta = STATUS_META[status] || STATUS_META.inactive;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        meta.badge,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  );
}

export default StatusBadge;
