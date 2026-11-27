import { createContext, useContext, useEffect, useState } from 'react';
import { mockItems, mockRentals } from '../data/mockData';
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
  const [notifications, setNotifications] = useState([]);
  const [items, setItems] = useState(mockItems);

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

  const isFavorited = (id) => favorites.has(id);

  return (
    <AppContext.Provider value={{
      isLoggedIn, setIsLoggedIn, user, setUser, login, register, logout, items,
      favorites, toggleFavorite, isFavorited,
      rentals, addRental, notifications, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
