import { cn } from '../../lib/utils';

function Table({ className, children }) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full border-collapse text-left', className)}>
        {children}
      </table>
    </div>
  );
}

function THead({ children }) {
  return (
    <thead>
      <tr className="border-b border-slate-200 bg-slate-50/80">{children}</tr>
    </thead>
  );
}

function Th({ className, children }) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 first:pl-5 last:pr-5',
        className,
      )}
    >
      {children}
    </th>
  );
}

function TBody({ children }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

function Tr({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-slate-50/70',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

function Td({ className, children }) {
  return (
    <td className={cn('px-4 py-3.5 text-sm first:pl-5 last:pr-5', className)}>
      {children}
    </td>
  );
}

Table.Head = THead;
Table.Th = Th;
Table.Body = TBody;
Table.Row = Tr;
Table.Cell = Td;

export default Table;
