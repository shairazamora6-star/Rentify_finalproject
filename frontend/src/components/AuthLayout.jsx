import { ArrowUpRight, Camera, CircleCheck, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AuthLayout({ title, description, children, footer, variant }) {
  return (
    <div className={`auth-shell${variant ? ` auth-shell-${variant}` : ''}`}>
      <aside className="auth-aside">
        <Link className="auth-brand" to="/">
          <span className="auth-brand-mark">R</span>
          <span>Rentify</span>
        </Link>

        <div className="auth-pitch">
          <span className="auth-eyebrow">A BETTER WAY TO RENT</span>
          <h1>Make room for <em>more.</em></h1>
          <p>Find quality gear for the moments that matter. Rent nearby, save more, and return when you&apos;re done.</p>
        </div>

        <div className="auth-art" aria-hidden="true">
          <div className="auth-art-orbit auth-art-orbit-one" />
          <div className="auth-art-orbit auth-art-orbit-two" />
          <div className="auth-product-card">
            <span className="auth-product-icon"><Camera size={22} /></span>
            <span className="auth-product-copy"><strong>More access, less clutter</strong><small>Good things are better shared.</small></span>
            <ArrowUpRight size={17} />
          </div>
          <span className="auth-art-check"><CircleCheck size={18} /> Easy local pickup</span>
        </div>

        <div className="auth-assurance"><ShieldCheck size={16} /> Your account, your rentals, all in one place.</div>
      </aside>

      <main className="auth-main">
        <Link className="auth-mobile-brand" to="/">
          <span className="auth-brand-mark">R</span>
          <span>Rentify</span>
        </Link>
        <div className="auth-content">
          <header className="auth-heading">
            <span className="auth-eyebrow">YOUR RENTIFY ACCOUNT</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </header>
          <section className="auth-card">{children}</section>
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
