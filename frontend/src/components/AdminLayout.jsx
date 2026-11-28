import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  MapPin,
  Package,
  Tag,
  Wallet,
  BarChart2,
  Star,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'
import '../pages/Admin.css'
import RentifyLogo from './RentifyLogo'

// ── Sidebar navigation (Customers, Owners, Account & Settings removed) ──
const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { to: '/admin',                label: 'Overview',         Icon: LayoutDashboard, end: true },
      { to: '/admin/rental-requests',label: 'Rental Requests',  Icon: ClipboardList },
      { to: '/admin/bookings',       label: 'Bookings',         Icon: CalendarCheck },
      { to: '/admin/active-tracking',label: 'Active Tracking',  Icon: MapPin },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      { to: '/admin/listings',   label: 'Listings',           Icon: Package },
      { to: '/admin/categories', label: 'Categories & Search', Icon: Tag },
    ],
  },
  {
    label: 'Business',
    items: [
      { to: '/admin/earnings',      label: 'Earnings & Payments', Icon: Wallet },
      { to: '/admin/analytics',     label: 'Analytics',           Icon: BarChart2 },
      { to: '/admin/reviews',       label: 'Reviews',             Icon: Star },
      { to: '/admin/notifications', label: 'Notifications',       Icon: Bell },
    ],
  },
]

export default function AdminLayout() {
  const { admin, isAdmin, adminLogout } = useAdmin()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen]   = useState(false)   // mobile drawer
  const [hamburgerOpen, setHamburgerOpen] = useState(false) // header dropdown

  const hamburgerRef = useRef(null)

  // Close hamburger dropdown on outside click
  useEffect(() => {
    if (!hamburgerOpen) return
    function handle(e) {
      if (hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
        setHamburgerOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [hamburgerOpen])

  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return (
    <div className="admin-shell">

      {/* ════════════════════════════════════════
          HEADER  (pure white, bordered)
          ════════════════════════════════════════ */}
      <header className="admin-header">

        {/* Left: mobile sidebar toggle + logo */}
        <div className="admin-header-left">
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(p => !p)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/admin" className="admin-header-brand">
            <RentifyLogo size={34} />
            <span className="admin-header-brand-name">Rentify</span>
            <span className="admin-header-brand-badge">Admin</span>
          </Link>
        </div>

        {/* Right: avatar name + hamburger */}
        <div className="admin-header-right">
          <div className="admin-header-user">
            <span className="admin-header-avatar">{admin.avatar}</span>
            <span className="admin-header-username">{admin.name}</span>
          </div>

          {/* Hamburger button + dropdown */}
          <div className="admin-hamburger-wrap" ref={hamburgerRef}>
            <button
              className={`admin-hamburger-btn ${hamburgerOpen ? 'is-open' : ''}`}
              onClick={() => setHamburgerOpen(p => !p)}
              aria-label="Open menu"
              aria-expanded={hamburgerOpen}
            >
              <span />
              <span />
              <span />
            </button>

            {hamburgerOpen && (
              <div className="admin-hamburger-dropdown" role="menu">
                <div className="admin-hdd-user">
                  <span className="admin-header-avatar">{admin.avatar}</span>
                  <div>
                    <p className="admin-hdd-name">{admin.name}</p>
                    <p className="admin-hdd-email">{admin.email}</p>
                  </div>
                </div>
                <div className="admin-hdd-divider" />
                <button
                  className="admin-hdd-item"
                  role="menuitem"
                  onClick={() => { setHamburgerOpen(false); navigate('/admin/settings') }}
                >
                  <Settings size={15} />
                  Account &amp; Settings
                </button>
                <div className="admin-hdd-divider" />
                <button
                  className="admin-hdd-item admin-hdd-signout"
                  role="menuitem"
                  onClick={() => { setHamburgerOpen(false); adminLogout() }}
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════
          BODY  (sidebar + main)
          ════════════════════════════════════════ */}
      <div className="admin-body">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="admin-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar (white, light) ── */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
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
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
