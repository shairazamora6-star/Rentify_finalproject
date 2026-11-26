import { createContext, useContext, useEffect, useState } from 'react';
import { mockItems, mockProfile } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('rentify_user')));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rentify_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [favorites, setFavorites] = useState(new Set());
  const [rentals] = useState({ active: [], upcoming: [], completed: [], cancelled: [] });
  const [notifications, setNotifications] = useState([]);
  const [items, setItems] = useState(mockItems);

  useEffect(() => {
    fetch('/api/items')
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(setItems)
      .catch(() => setItems(mockItems));
  }, []);

  const login = async ({ email, password }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setUser(data.user);
    setIsLoggedIn(true);
    localStorage.setItem('rentify_user', JSON.stringify(data.user));
  };

  const register = async ({ name, email, password }) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setUser(data.user);
    setIsLoggedIn(true);
    localStorage.setItem('rentify_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('rentify_user');
  };

  const addNotification = (notification) => {
    setNotifications(prev => [{ id: Date.now(), read: false, ...notification }, ...prev]);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isFavorited = (id) => favorites.has(id);

  return (
    <AppContext.Provider value={{
      isLoggedIn, setIsLoggedIn, user, setUser, login, register, logout, items,
      favorites, toggleFavorite, isFavorited,
      rentals, notifications, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
