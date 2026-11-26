import { createContext, useContext, useState } from 'react';
import { mockProfile } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [rentals] = useState({ active: [], upcoming: [], completed: [], cancelled: [] });
  const [notifications] = useState([]);

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
      isLoggedIn, setIsLoggedIn, user, setUser,
      favorites, toggleFavorite, isFavorited,
      rentals, notifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
