import { avatarColor, cn, initials } from '../../lib/utils';

const SIZES = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
  xl: 'size-20 text-2xl',
};

function Avatar({ name, size = 'md', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold',
        SIZES[size],
        avatarColor(name),
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      {initials(name)}
    </span>
  );
}

export default Avatar;
