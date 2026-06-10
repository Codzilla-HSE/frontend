import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/axiosConfig';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/me')
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
  }, []);

  const login  = (userData) => setUser(userData);
  const logout = () => setUser(null);

  if (loading) return null;

  return (
      <UserContext.Provider value={{ user, login, logout }}>
        {children}
      </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);