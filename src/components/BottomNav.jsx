import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/my-rentals', icon: Calendar, label: 'Rentals' },
    { path: '/messages', icon: MessageCircle, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'white',
      borderTop: '1px solid #DCE8F5',
      display: 'flex',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)',
      zIndex: 100,
    }}>
      {navItems.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '6px 0',
            color: isActive ? '#2563EB' : '#94A3B8',
            transition: 'color 0.15s',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 400 }}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
