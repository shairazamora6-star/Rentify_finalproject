import { useState } from 'react'
import { Routes, Route, Navigate, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Bell, User, ShoppingCart, X, Trash2, ArrowRight, Moon, Sun } from 'lucide-react'
import { useApp } from './contexts/AppContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Search from './pages/Search'
import ItemDetails from './pages/ItemDetails'
import Reserve from './pages/Reserve'
import BookingConfirmation from './pages/BookingConfirmation'
import MyRentals from './pages/MyRentals'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import AccountSettings from './pages/AccountSettings'
import PrivacySettings from './pages/PrivacySettings'
import DataPermissions from './pages/DataPermissions'
import ActivityStatus from './pages/ActivityStatus'
import NotificationPrefs from './pages/NotificationPrefs'
import PersonalInfo from './pages/PersonalInfo'
import OwnerProfile from './pages/OwnerProfile'
import HelpSupport from './pages/HelpSupport'
import Landing from './pages/Landing'
import ExtendRental from './pages/ExtendRental'
import ExtendRentalPending from './pages/ExtendRentalPending'
import ReturnReview from './pages/ReturnReview'
import ChangePassword from './pages/ChangePassword'
import TwoFactorAuth from './pages/TwoFactorAuth'
import LoginActivity from './pages/LoginActivity'
import ConnectedApps from './pages/ConnectedApps'
import DeleteAccount from './pages/DeleteAccount'
import DeleteAccountSuccess from './pages/DeleteAccountSuccess'
import DownloadData from './pages/DownloadData'
import SubmitRequest from './pages/SubmitRequest'
import LegalPage from './pages/LegalPage'
import Nearby from './pages/Nearby'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import RentalAssistant from './components/RentalAssistant'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/AdminLayout'
import AdminOverview from './pages/AdminOverview'
import AdminRentalRequests from './pages/AdminRentalRequests'
import Rentals from './pages/Rentals'
import Bookings from './pages/Bookings'
import Reports from './pages/Reports'
import Complaints from './pages/Complaints'
import Settings from './pages/Settings'
import AdminStub from './pages/AdminStub'

const PUBLIC_ROUTES = ['/login', '/register', '/landing']

function GetLayout({ children }) {
  const { isLoggedIn, user, logout, cart, removeFromCart, theme, toggleTheme } = useApp()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const cartCount = cart.length
  const cartSubtotal = cart.reduce((sum, c) => sum + (c.price || 0), 0)

  const goCheckout = () => {
    setCartOpen(false)
    navigate('/search')
  }

  return (
    <div className="app-frame">
      <header className="app-topbar">
        <Link className="app-topbar-brand" to="/">
          <span className="app-topbar-brand-mark"><RentifyLogo size={31} /></span>
          <span>Rentify</span>
        </Link>
        <nav className="app-topbar-links" aria-label="Main navigation">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : undefined}>Explore</NavLink>
          <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : undefined}>Browse rentals</NavLink>
          <NavLink to="/nearby" className={({ isActive }) => isActive ? 'active' : undefined}>Nearby</NavLink>
          {isLoggedIn && <NavLink to="/my-rentals" className={({ isActive }) => isActive ? 'active' : undefined}>My rentals</NavLink>}
        </nav>
        <div className="app-topbar-user">
          {isLoggedIn ? (
            <>
              <Link className="app-topbar-user-profile" to="/profile" aria-label="Profile">
                {user?.profileImage ? (
                  <img className="app-topbar-avatar" src={user.profileImage} alt="" />
                ) : (
                  <User size={18} />
                )}
                <span className="app-topbar-username">{user?.name}</span>
              </Link>
              <button className="app-topbar-icon app-topbar-cart" onClick={() => setCartOpen(true)} aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}>
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="app-topbar-cart-badge">{cartCount}</span>
                )}
              </button>
              <Link className="app-topbar-icon" to="/notifications" aria-label="Notifications">
                <Bell size={18} />
              </Link>
              <button className="app-topbar-icon" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </>
          ) : (
            <>
              <button className="app-topbar-icon" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => navigate('/login')}>Log in</button>
              <button onClick={() => navigate('/register')}>Join</button>
            </>
          )}
        </div>
      </header>

      {/* Cart drawer */}
      <div className={`cart-drawer-overlay${cartOpen ? ' open' : ''}`} aria-hidden={!cartOpen}>
        <aside className={`cart-drawer${cartOpen ? ' open' : ''}`} role="dialog" aria-label="Your cart">
          <div className="cart-drawer-header">
            <span className="cart-drawer-title">Your cart</span>
            <button className="cart-drawer-close" onClick={() => setCartOpen(false)} aria-label="Close cart">
              <X size={18} />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <ShoppingCart size={30} />
              <p>No items in your cart yet.</p>
              <button className="cart-drawer-empty-link" onClick={goCheckout}>Browse items</button>
            </div>
          ) : (
            <>
              <div className="cart-drawer-list">
                {cart.map(c => (
                  <div key={c.id} className="cart-drawer-item">
                    <img src={c.image} alt="" className="cart-drawer-item-img" />
                    <div className="cart-drawer-item-body">
                      <span className="cart-drawer-item-name">{c.title}</span>
                      <span className="cart-drawer-item-price">${c.price}<span> /day</span></span>
                    </div>
                    <button className="cart-drawer-item-remove" onClick={() => removeFromCart(c.id)} aria-label={`Remove ${c.title} from cart`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-drawer-footer">
                <div className="cart-drawer-subtotal">
                  <span>Subtotal</span>
                  <strong>${cartSubtotal}<span> /day</span></strong>
                </div>
                <button className="cart-drawer-checkout" onClick={goCheckout}>
                  Reserve items <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {children}
      {isLoggedIn && !PUBLIC_ROUTES.includes(pathname) && <BottomNav />}
      {!PUBLIC_ROUTES.includes(pathname) && <RentalAssistant />}
    </div>
  )
}

export default function App() {
  const { isLoggedIn } = useApp()

  return (
    <>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/landing" element={<Landing />} />
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <GetLayout><Home /></GetLayout>
          ) : (
            <Landing />
          )
        }
      />
      <Route path="/search" element={<GetLayout><Search /></GetLayout>} />
      <Route path="/nearby" element={<GetLayout><Nearby /></GetLayout>} />
      <Route
        path="/item/:id"
        element={
          <GetLayout><ItemDetails /></GetLayout>
        }
      />
      <Route
        path="/reserve/:id"
        element={
          isLoggedIn ? (
            <GetLayout><Reserve /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/booking-confirmation/:id"
        element={
          isLoggedIn ? (
            <GetLayout><BookingConfirmation /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/my-rentals"
        element={
          isLoggedIn ? (
            <GetLayout><MyRentals /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/messages"
        element={
          isLoggedIn ? (
            <GetLayout><Messages /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/notifications"
        element={
          isLoggedIn ? (
            <GetLayout><Notifications /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          isLoggedIn ? (
            <GetLayout><Profile /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/favorites"
        element={
          isLoggedIn ? (
            <GetLayout><Favorites /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/account-settings"
        element={
          isLoggedIn ? (
            <GetLayout><AccountSettings /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/privacy-settings"
        element={
          isLoggedIn ? (
            <GetLayout><PrivacySettings /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/data-permissions"
        element={
          isLoggedIn ? (
            <GetLayout><DataPermissions /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/activity-status"
        element={
          isLoggedIn ? (
            <GetLayout><ActivityStatus /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/notifications-settings"
        element={
          isLoggedIn ? (
            <GetLayout><NotificationPrefs /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/personal-info"
        element={
          isLoggedIn ? (
            <GetLayout><PersonalInfo /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/owner-profile/:id"
        element={
          isLoggedIn ? (
            <GetLayout><OwnerProfile /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/help-support"
        element={
          isLoggedIn ? (
            <GetLayout><HelpSupport /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/extend-rental/:id"
        element={
          isLoggedIn ? (
            <GetLayout><ExtendRental /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/extend-rental-pending/:id"
        element={
          isLoggedIn ? (
            <GetLayout><ExtendRentalPending /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/return-review/:id"
        element={
          isLoggedIn ? (
            <GetLayout><ReturnReview /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/change-password"
        element={
          isLoggedIn ? (
            <GetLayout><ChangePassword /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/2fa"
        element={
          isLoggedIn ? (
            <GetLayout><TwoFactorAuth /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login-activity"
        element={
          isLoggedIn ? (
            <GetLayout><LoginActivity /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/connected-apps"
        element={
          isLoggedIn ? (
            <GetLayout><ConnectedApps /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/delete-account"
        element={
          isLoggedIn ? (
            <GetLayout><DeleteAccount /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/delete-account-success"
        element={
          isLoggedIn ? (
            <GetLayout><DeleteAccountSuccess /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/delete-account-request"
        element={
          isLoggedIn ? (
            <Navigate to="/delete-account" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/download-data"
        element={
          isLoggedIn ? (
            <GetLayout><DownloadData /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/submit-request"
        element={
          isLoggedIn ? (
            <GetLayout><SubmitRequest /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/privacy-policy"
        element={
          isLoggedIn ? (
            <GetLayout><LegalPage type="privacy-policy" /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/terms-of-service"
        element={
          isLoggedIn ? (
            <GetLayout><LegalPage type="terms-of-service" /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/cookie-policy"
        element={
          isLoggedIn ? (
            <GetLayout><LegalPage type="cookie-policy" /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dpa"
        element={
          isLoggedIn ? (
            <GetLayout><LegalPage type="dpa" /></GetLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        {/* Overview — Marketplace Overview (new Figma page) */}
        <Route index element={<AdminOverview />} />
        {/* Workspace */}
        <Route path="rental-requests" element={<AdminRentalRequests />} />
        <Route path="active-tracking" element={<AdminStub title="Active Tracking" />} />
        {/* Marketplace */}
        <Route path="listings" element={<Rentals />} />
        <Route path="listings/new" element={<AdminStub title="Add New Item" />} />
        <Route path="categories" element={<AdminStub title="Categories & Search" />} />
        <Route path="customers" element={<AdminStub title="Customers" />} />
        <Route path="owners" element={<AdminStub title="Owners" />} />
        {/* Business */}
        <Route path="earnings" element={<AdminStub title="Earnings & Payments" />} />
        <Route path="analytics" element={<Reports />} />
        <Route path="reviews" element={<AdminStub title="Reviews" />} />
        <Route path="notifications" element={<AdminStub title="Notifications" />} />
        {/* Legacy routes kept for backward compatibility */}
        <Route path="bookings" element={<Bookings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
