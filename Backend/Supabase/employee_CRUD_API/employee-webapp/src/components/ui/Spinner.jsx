import { cn } from '../../lib/utils';

const SIZES = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

function Spinner({ className, size = 'md' }) {
  return (
    <svg
      className={cn('animate-spin text-current', SIZES[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default Spinner;
