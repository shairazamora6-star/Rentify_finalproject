import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import AuthLayout from '../components/AuthLayout'

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login({ email: email.trim(), password, remember })
      navigate('/')
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to find your next great rental."
      footer={<>New to Rentify? <Link to="/register">Create an account</Link></>}
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {location.state?.registered && !error && <div className="auth-success" role="status">Account created. Please sign in.</div>}
        <div className="auth-field">
          <label htmlFor="login-email">Email address</label>
          <div className="auth-input-wrap">
            <Mail aria-hidden="true" />
            <input
              className="auth-input"
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setError('') }}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <LockKeyhole aria-hidden="true" />
            <input
              className="auth-input"
              id="login-password"
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

        <div className="auth-options">
          <label className="auth-checkbox">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          <LogIn size={17} aria-hidden="true" />
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="auth-terms">By signing in, you agree to Rentify&apos;s terms and privacy policy.</p>
      </form>
    </AuthLayout>
  )
}
