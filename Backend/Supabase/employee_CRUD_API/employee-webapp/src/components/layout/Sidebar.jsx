import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck2,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/attendance', label: 'Attendance', icon: CalendarCheck2 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white',
            )
          }
        >
          <item.icon className="size-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-indigo-500 text-white">
        <Users className="size-5" />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-bold text-white">PeoplePilot</p>
        <p className="text-[11px] font-medium text-slate-400">
          Employee Management
        </p>
      </div>
    </div>
  );
}

function UserFooter({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <Avatar name={user?.name || 'User'} size="sm" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium text-white">
            {user?.name || 'User'}
          </p>
          <p className="truncate text-xs text-slate-400">
            {user?.email || 'user@peoplepilot.io'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label="Sign out"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-900 transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between lg:justify-start">
          <Brand />
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="mr-4 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <NavItems onNavigate={onClose} />

        <UserFooter onNavigate={onClose} />
      </aside>
    </>
  );
}
