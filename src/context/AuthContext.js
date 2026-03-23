import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'biopath_user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

function clearUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [authError, setAuthError] = useState(null);

  const login = useCallback((email, password) => {
    setAuthError(null);
    if (!email || !password) {
      setAuthError('Completează toate câmpurile.');
      return false;
    }
    // Mock: accept any non-empty credentials
    const mockUser = {
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      joinedAt: new Date().toISOString(),
    };
    saveUser(mockUser);
    setUser(mockUser);
    return true;
  }, []);

  const register = useCallback((name, email, password, confirmPassword) => {
    setAuthError(null);
    if (!name || !email || !password || !confirmPassword) {
      setAuthError('Completează toate câmpurile.');
      return false;
    }
    if (password !== confirmPassword) {
      setAuthError('Parolele nu coincid.');
      return false;
    }
    if (password.length < 6) {
      setAuthError('Parola trebuie să aibă cel puțin 6 caractere.');
      return false;
    }
    const newUser = {
      name,
      email,
      joinedAt: new Date().toISOString(),
    };
    saveUser(newUser);
    setUser(newUser);
    return true;
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      saveUser(updated);
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
    setAuthError(null);
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  return (
    <AuthContext.Provider value={{ user, authError, login, register, updateUser, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
