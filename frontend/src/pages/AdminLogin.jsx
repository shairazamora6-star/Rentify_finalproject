import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAdmin } from '../contexts/AdminContext'
import RentifyLogo from '../components/RentifyLogo'
import './Admin.css'

export default function AdminLogin() {
  const { isAdmin, adminLogin } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Already signed in as admin? Go straight to the admin area.
  if (isAdmin) return <Navigate to="/admin" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await adminLogin({ email, password })
      // On success, isAdmin becomes true and the redirect above runs.
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign in. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-main admin-login-page">
      <Link className="admin-login-brand" to="/">
        <span className="admin-brand-mark"><RentifyLogo size={36} /></span>
        <span>Rentify</span>
        <span className="admin-badge">ADMIN</span>
      </Link>

      <div className="auth-content">
        <header className="auth-heading">
          <span className="auth-eyebrow">ADMIN AREA</span>
          <h2>Admin sign in</h2>
          <p>Sign in to manage users, listings, and bookings.</p>
        </header>

        <section className="auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="admin-email">Admin email</label>
              <div className="auth-input-wrap">
                <Mail aria-hidden="true" />
                <input
                  className="auth-input"
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); setError('') }}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="admin-password">Password</label>
              <div className="auth-input-wrap">
                <LockKeyhole aria-hidden="true" />
                <input
                  className="auth-input"
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setError('') }}
                  required
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && <div className="auth-error" role="alert">{error}</div>}

            <button className="auth-submit" type="submit" disabled={isSubmitting}>
              <ShieldCheck size={17} aria-hidden="true" />
              {isSubmitting ? 'Signing in…' : 'Sign in as admin'}
            </button>
          </form>
        </section>

        <div className="admin-demo-note" role="note">
          <strong>Demo only.</strong> This login runs in your browser and is not
          real security. Demo account: <code>admin@rentify.demo</code> /{' '}
          <code>admin123</code>
        </div>

        <div className="auth-footer"><Link to="/">← Back to Rentify</Link></div>
      </div>
    </div>
  )
}