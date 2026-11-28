import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/my-rentals', icon: Calendar, label: 'My Rentals' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)',
      zIndex: 100,
    }}>
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className="bottom-nav-item"
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} style={{ transition: 'transform 0.15s' }} />
              <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400, transition: 'color 0.15s' }}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
