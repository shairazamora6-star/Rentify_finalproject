import { createContext, useContext, useEffect, useState } from 'react';
import { mockItems, mockNotifications, mockRentals } from '../data/mockData';
import { apiFetch, isDemoMode } from '../lib/api';

const AppContext = createContext();

const getStoredUser = () => localStorage.getItem('rentify_user') || sessionStorage.getItem('rentify_user');
const readStoredFavorites = () => {
  if (!isDemoMode) return new Set();
  try {
    const saved = JSON.parse(localStorage.getItem('rentify_demo_favorites') || '[]');
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
};
const readStoredRentals = () => {
  if (!isDemoMode) return [];
  try {
    const saved = JSON.parse(localStorage.getItem('rentify_demo_rentals') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};
const readStoredCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('rentify_cart') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getStoredUser()));
  const [user, setUser] = useState(() => {
    const saved = getStoredUser();
    return saved ? JSON.parse(saved) : null;
  });
  const [favorites, setFavorites] = useState(readStoredFavorites);
  const [rentals, setRentals] = useState(() => [
    ...Object.values(mockRentals).flat(),
    ...readStoredRentals(),
  ]);
  const [notifications, setNotifications] = useState(isDemoMode ? mockNotifications : []);
  const [items, setItems] = useState(mockItems);
  const [cart, setCart] = useState(readStoredCart);

  useEffect(() => {
    apiFetch('/api/items')
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(setItems)
      .catch(() => setItems(mockItems));
  }, []);

  const login = async ({ email, password, remember = true }) => {
    const response = await apiFetch('/api/auth/login', {
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

  const updateUser = (updates) => {
    setUser(prev => {
      const next = { ...(prev || {}), ...updates };
      if (localStorage.getItem('rentify_user')) {
        localStorage.setItem('rentify_user', JSON.stringify(next));
      } else if (sessionStorage.getItem('rentify_user')) {
        sessionStorage.setItem('rentify_user', JSON.stringify(next));
      }
      return next;
    });
  };

  const register = async ({ name, email, password }) => {
    const response = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.user;
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

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (isDemoMode) localStorage.setItem('rentify_demo_favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const addRental = (rental) => {
    const newRental = {
      ...rental,
      item: rental.item.title,
      image: rental.item.image,
      startDate: new Date(rental.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      endDate: new Date(rental.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'upcoming',
    };
    setRentals(prev => {
      const next = [newRental, ...prev];
      if (isDemoMode) {
        const demoRentals = next.filter(item => !Object.values(mockRentals).flat().some(sample => sample.id === item.id));
        localStorage.setItem('rentify_demo_rentals', JSON.stringify(demoRentals));
      }
      return next;
    });
  };

  const updateRental = (id, updates) => {
    setRentals(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      if (isDemoMode) {
        const demoRentals = next.filter(item => !Object.values(mockRentals).flat().some(sample => sample.id === item.id));
        localStorage.setItem('rentify_demo_rentals', JSON.stringify(demoRentals));
      }
      return next;
    });
  };

  const isFavorited = (id) => favorites.has(id);

  const addToCart = (item) => {
    setCart(prev => {
      if (prev.some(c => c.id === item.id)) return prev;
      const next = [...prev, { ...item, addedAt: Date.now() }];
      localStorage.setItem('rentify_cart', JSON.stringify(next));
      return next;
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const next = prev.filter(c => c.id !== itemId);
      localStorage.setItem('rentify_cart', JSON.stringify(next));
      return next;
    });
  };

  const isInCart = (itemId) => cart.some(c => c.id === itemId);

  return (
    <AppContext.Provider value={{
      isLoggedIn, setIsLoggedIn, user, setUser, updateUser, login, register, logout, items,
      favorites, toggleFavorite, isFavorited,
      rentals, addRental, updateRental, notifications, addNotification,
      markNotificationRead, markAllNotificationsRead, clearNotifications,
      cart, addToCart, removeFromCart, isInCart,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
