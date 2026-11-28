import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  MapPin,
  Package,
  Tag,
  Users,
  UserCheck,
  Wallet,
  BarChart2,
  Star,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import '../pages/Admin.css'

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { to: '/admin', label: 'Overview', Icon: LayoutDashboard, end: true },
      { to: '/admin/rental-requests', label: 'Rental Requests', Icon: ClipboardList },
      { to: '/admin/bookings', label: 'Bookings', Icon: CalendarCheck },
      { to: '/admin/active-tracking', label: 'Active Tracking', Icon: MapPin },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      { to: '/admin/listings', label: 'Listings', Icon: Package },
      { to: '/admin/categories', label: 'Categories & Search', Icon: Tag },
      { to: '/admin/customers', label: 'Customers', Icon: Users },
      { to: '/admin/owners', label: 'Owners', Icon: UserCheck },
    ],
  },
  {
    label: 'Business',
    items: [
      { to: '/admin/earnings', label: 'Earnings & Payments', Icon: Wallet },
      { to: '/admin/analytics', label: 'Analytics', Icon: BarChart2 },
      { to: '/admin/reviews', label: 'Reviews', Icon: Star },
      { to: '/admin/notifications', label: 'Notifications', Icon: Bell },
    ],
  },
]

export default function AdminLayout() {
  const { admin, isAdmin, adminLogout } = useAdmin()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return (
    <div className="admin-shell">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="admin-sidebar-brand">
          <Link className="admin-login-brand" to="/admin">
            <span className="admin-brand-mark">R</span>
            <span>Rentify</span>
          </Link>
          <span className="admin-badge">ADMIN CONSOLE</span>
        </div>

        {/* Navigation */}
        <nav className="admin-nav" aria-label="Admin navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="admin-nav-section">
              <p className="admin-nav-section-label">{section.label}</p>
              {section.items.map(({ to, label, Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <NavLink
            to="/admin/settings"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings size={17} />
            Account &amp; Settings
          </NavLink>
          <div className="admin-sidebar-user">
            <span className="admin-avatar">{admin.avatar}</span>
            <div className="admin-sidebar-user-info">
              <span className="admin-sidebar-user-name">{admin.name}</span>
              <span className="admin-sidebar-user-email">{admin.email}</span>
            </div>
            <button
              className="admin-sidebar-signout"
              onClick={adminLogout}
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content area ── */}
      <div className="admin-content">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label="Toggle sidebar"
          >
            <span /><span /><span />
          </button>
          <span className="admin-topbar-title">Admin Console</span>
          <div className="admin-topbar-user">
            <span className="admin-avatar">{admin.avatar}</span>
            <span className="admin-topbar-name">{admin.name}</span>
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
