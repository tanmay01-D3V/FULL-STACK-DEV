import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import { cn } from '../../lib/utils';

function Topbar({ onOpenSidebar }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden w-full max-w-xs items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 md:flex">
          <Search className="size-4" />
          <span>Search employees, departments…</span>
          <kbd className="ml-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-lg p-1.5 pr-2 hover:bg-slate-100"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Avatar name={user?.name || 'User'} size="sm" />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight text-slate-700">
                  {user?.name || 'User'}
                </span>
                <span className="block text-xs leading-tight text-slate-400">
                  Admin
                </span>
              </span>
              <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.name || 'User'}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email || 'user@peoplepilot.io'}
                    </p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Settings
                  </Link>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
