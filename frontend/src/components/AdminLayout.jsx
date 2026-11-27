import { Link, Navigate, NavLink, Outlet } from 'react-router-dom'
import {
  AlertTriangle,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  SlidersHorizontal,
} from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'
import '../pages/Admin.css'

const links = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/listings', label: 'Listings', Icon: Package },
  { to: '/admin/bookings', label: 'Bookings', Icon: CalendarCheck },
  { to: '/admin/reports', label: 'Reports', Icon: FileText },
  { to: '/admin/complaints', label: 'Complaints', Icon: AlertTriangle },
  { to: '/admin/settings', label: 'Settings', Icon: SlidersHorizontal },
]

export default function AdminLayout() {
  const { admin, isAdmin, adminLogout } = useAdmin()

  // DEMO ONLY guard: this runs in the browser, so it is not real security.
  // A real backend must check the admin role on the server.
  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-login-brand" to="/admin">
          <span className="admin-brand-mark">R</span>
          <span>Rentify</span>
          <span className="admin-badge">ADMIN</span>
        </Link>

        <nav className="admin-nav" aria-label="Admin navigation">
          {links.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/">← Back to Rentify</Link>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <span className="admin-topbar-title">Admin panel</span>
          <div className="admin-topbar-user">
            <span className="admin-avatar">{admin.avatar}</span>
            <span>{admin.name}</span>
            <button className="admin-signout" onClick={adminLogout}>
              <LogOut size={14} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}