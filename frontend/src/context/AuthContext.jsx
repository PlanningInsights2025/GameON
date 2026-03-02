import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle Google OAuth redirect: /auth/google/success?token=...&user=...
    if (window.location.pathname === '/auth/google/success') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const userParam = params.get('user');
      if (token && userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          // Clean up URL and redirect home
          window.history.replaceState({}, '', '/');
          window.location.href = '/';
          return;
        } catch { /* ignore parse error */ }
      }
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (name, email, password, phone = '') => {
    const data = await authService.register(name, email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ ...data.user, phone }));
    setUser({ ...data.user, phone });
  };

  const loginWithGoogle = () => {
    window.location.href = authService.googleLoginUrl();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
