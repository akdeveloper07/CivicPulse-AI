import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: (data: { email: string; name: string; picture?: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
  isCitizen: boolean;
  isAdmin: boolean;
  isSysAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('civicpulse_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    const res: AuthResponse = await api.login(credentials);
    localStorage.setItem('civicpulse_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const loginWithGoogle = async (data: { email: string; name: string; picture?: string }) => {
    const res: AuthResponse = await api.googleLogin(data);
    localStorage.setItem('civicpulse_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: { name: string; email: string; password: string; role?: string }) => {
    await api.register(data);
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem('civicpulse_token');
    setToken(null);
    setUser(null);
  };

  const isCitizen = user?.role === 'citizen';
  const isAdmin = user?.role === 'administrator' || user?.role === 'system_admin';
  const isSysAdmin = user?.role === 'system_admin';

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, loginWithGoogle, register, logout, isCitizen, isAdmin, isSysAdmin }}
    >
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
