import { Routes, Route, Navigate, Link, NavLink, useNavigate } from 'react-router-dom'
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
import { isDemoMode } from './lib/api'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
import Rentals from './pages/Rentals'
import Bookings from './pages/Bookings'
import Reports from './pages/Reports'
import Complaints from './pages/Complaints'
import Settings from './pages/Settings'

const PUBLIC_ROUTES = ['/login', '/register', '/landing']

function GetLayout({ children }) {
  const { isLoggedIn, user, logout } = useApp()
  const navigate = useNavigate()
  return (
    <div className="app-frame">
      <header className="app-topbar">
        <Link className="app-topbar-brand" to="/">
          <span className="app-topbar-brand-mark">R</span>
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
              <span>{user?.name}</span>
              <button onClick={logout}>Sign out</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Log in</button>
              <button onClick={() => navigate('/register')}>Join</button>
            </>
          )}
        </div>
      </header>
      {children}
      {isLoggedIn && !PUBLIC_ROUTES.includes(window.location.pathname) && <BottomNav />}
      {!PUBLIC_ROUTES.includes(window.location.pathname) && <RentalAssistant />}
    </div>
  )
}

export default function App() {
  const { isLoggedIn } = useApp()

  return (
    <>
      {isDemoMode && (
        <div className="demo-mode-banner" role="status">
          Frontend demo mode — sample data only; changes stay in this browser and are not saved to the database.
        </div>
      )}
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
        <Route index element={<Dashboard />} />
        <Route path="listings" element={<Rentals />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      </Routes>
    </>
  )
}
