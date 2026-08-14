import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">+</span> CareLink
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                Hospitals
              </NavLink>
              <NavLink to="/hospitals/new" className={({ isActive }) => (isActive ? 'active' : '')}>
                Add Hospital
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip">{user.username}</span>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
