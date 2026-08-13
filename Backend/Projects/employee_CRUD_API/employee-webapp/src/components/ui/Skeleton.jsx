import { cn } from '../../lib/utils';

function Skeleton({ className }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/80', className)}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
