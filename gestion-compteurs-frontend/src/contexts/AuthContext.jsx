import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

// Décode le payload JWT (base64) pour extraire login et rôle
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      token,
      login: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.sub,
      role:  payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role
    };
  } catch {
    return { token };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(decodeToken(token));
    }
    setLoading(false);
  }, []);

  const login = async (login, password) => {
    try {
      const response = await api.post('/Auth/login', { login, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setUser(decodeToken(token));
      return true;
    } catch (error) {
      console.error('Erreur de connexion', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // isAdmin : true si rôle Administration, false pour Consultation
  const isAdmin = user?.role === 'Administration';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
