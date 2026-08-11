import { createContext, useCallback, useContext, useState } from 'react';
import { Check, CircleAlert, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const ToastContext = createContext(null);

const STYLES = {
  success: {
    icon: Check,
    ring: 'ring-emerald-200',
    iconColor: 'text-emerald-600',
  },
  error: {
    icon: CircleAlert,
    ring: 'ring-rose-200',
    iconColor: 'text-rose-600',
  },
  info: {
    icon: Info,
    ring: 'ring-sky-200',
    iconColor: 'text-sky-600',
  },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, type, message }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const api = {
    success: (message) => push('success', message),
    error: (message) => push('error', message),
    info: (message) => push('info', message),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-4 sm:items-end sm:pr-6">
        {toasts.map((toast) => {
          const style = STYLES[toast.type];
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-lg ring-1 animate-in',
                style.ring,
              )}
            >
              <Icon className={cn('mt-0.5 size-5 shrink-0', style.iconColor)} />
              <p className="flex-1 text-sm font-medium text-slate-700">
                {toast.message}
              </p>
              <button
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
