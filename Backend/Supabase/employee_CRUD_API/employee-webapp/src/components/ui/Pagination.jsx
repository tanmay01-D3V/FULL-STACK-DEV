import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

function pageItems(current, total) {
  const pages = [];
  const push = (value) => {
    if (!pages.includes(value) && value >= 1 && value <= total) pages.push(value);
  };

  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) push(i);
    return pages;
  }

  push(1);
  if (current > 3) push('ellipsis-start');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i += 1) {
    push(i);
  }
  if (current < total - 2) push('ellipsis-end');
  push(total);
  return pages;
}

function Pagination({
  page,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (pageCount <= 1) return null;

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  const items = pageItems(page, pageCount);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-5 py-4 sm:flex-row">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{' '}
        <span className="font-medium text-slate-700">{totalItems}</span>
      </p>
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        {items.map((item, index) =>
          item === 'ellipsis-start' || item === 'ellipsis-end' ? (
            <span
              key={`${item}-${index}`}
              className="px-1 text-sm text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors',
                item === page
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Next page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
