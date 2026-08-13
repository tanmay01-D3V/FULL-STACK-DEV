import { cn } from '../../lib/utils';
import { ATTENDANCE_META } from '../../lib/constants';

function AttendanceBadge({ status, className }) {
  const meta = ATTENDANCE_META[status] || ATTENDANCE_META.absent;
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

export default AttendanceBadge;
