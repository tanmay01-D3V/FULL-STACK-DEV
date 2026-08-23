import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive ? "bg-brand-100 text-brand-800" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  function handleLogout() {
    logout();
    closeMenu();
    toast.success("Logged out. See you soon!");
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-plum-700 text-white shadow-card">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12 2c1.1 3 2.9 4.8 5.9 5.9C14.9 9 13.1 10.8 12 13.8 10.9 10.8 9.1 9 6.1 7.9 9.1 6.8 10.9 5 12 2z" />
              <circle cx="18" cy="17.5" r="3.5" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-stone-900">
            Glow &amp; Grace
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>

          {user ? (
            <div className="ml-4 flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
                <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                  {(user.name || "?").charAt(0).toUpperCase()}
                </span>
                {user.name}
              </span>
              <button type="button" onClick={handleLogout} className="btn-secondary !px-4 !py-2">
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-4 flex items-center gap-2">
              <Link to="/login" className="btn-secondary !px-4 !py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100 md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-stone-100 bg-white px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/services" className={navLinkClass} onClick={closeMenu}>
              Services
            </NavLink>
          </div>
          <div className="mt-4 border-t border-stone-100 pt-4">
            {user ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-stone-700">
                  Signed in as <span className="font-semibold text-brand-800">{user.name}</span>
                </p>
                <button type="button" onClick={handleLogout} className="btn-secondary w-full">
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" className="btn-secondary w-full" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary w-full" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
