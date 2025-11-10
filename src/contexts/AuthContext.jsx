import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Admin credentials (you can move this to environment variables later)
const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin123'
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    // Check if admin is logged in (from localStorage)
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    const savedEmail = localStorage.getItem('adminEmail') || '';
    setIsAdmin(adminStatus);
    setAdminEmail(savedEmail);
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Validate email and password
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      setAdminEmail(email);
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminEmail('');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminEmail');
  };

  const value = {
    isAdmin,
    adminEmail,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};