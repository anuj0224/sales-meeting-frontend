import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('optronix_jwt') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authAPI.getMe(token);
        if (response.success) {
          setUser(response.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        setToken(response.data.token);
        setUser(response.data);
        localStorage.setItem('optronix_jwt', response.data.token);
        return { success: true };
      } else {
        setError(response.error?.message || 'Login failed');
        return { success: false, error: response.error?.message };
      }
    } catch (err) {
      const msg = err.message || 'Server connection error';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const quickLogin = async (role) => {
    let email = 'employee@optronix.com';
    if (role === 'Sales Manager') email = 'manager@optronix.com';
    if (role === 'Admin') email = 'admin@optronix.com';

    return await login(email, 'password123');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('optronix_jwt');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
