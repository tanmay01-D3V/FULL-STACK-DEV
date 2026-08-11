import { cn } from '../../lib/utils';

function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, actions, className }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4',
        className,
      )}
    >
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;

export default Card;
