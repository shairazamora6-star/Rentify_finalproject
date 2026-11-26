import { createContext, useContext, useEffect, useState } from 'react';
import { mockItems, mockRentals } from '../data/mockData';

const AppContext = createContext();

const getStoredUser = () => localStorage.getItem('rentify_user') || sessionStorage.getItem('rentify_user');

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getStoredUser()));
  const [user, setUser] = useState(() => {
    const saved = getStoredUser();
    return saved ? JSON.parse(saved) : null;
  });
  const [favorites, setFavorites] = useState(new Set());
  const [rentals] = useState(() => Object.values(mockRentals).flat());
  const [notifications, setNotifications] = useState([]);
  const [items, setItems] = useState(mockItems);

  useEffect(() => {
    fetch('/api/items')
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(setItems)
      .catch(() => setItems(mockItems));
  }, []);

  const login = async ({ email, password, remember = true }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setUser(data.user);
    setIsLoggedIn(true);
    localStorage.removeItem('rentify_user');
    sessionStorage.removeItem('rentify_user');
    (remember ? localStorage : sessionStorage).setItem('rentify_user', JSON.stringify(data.user));
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
    sessionStorage.removeItem('rentify_user');
    localStorage.setItem('rentify_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('rentify_user');
    sessionStorage.removeItem('rentify_user');
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
