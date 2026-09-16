import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authApi } from '../api';

export const getRoleHome = (role?: string): string => {
  if (role === 'admin' || role === 'superadmin') return '/lms/admin';
  if (role === 'instructor') return '/instructor';
  return '/student';
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<User>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<User>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<User>;
  refreshUser: () => Promise<User | null>;
  getRoleHome: (role?: string) => string;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        } catch (err) {
          console.error('Failed to restore session:', err);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (data: AuthResponse): User => {
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const login = async (credentials: { email: string; password: string }): Promise<User> => {
    const data = await authApi.login(credentials);
    return handleAuthSuccess(data);
  };

  const register = async (userData: { name: string; email: string; password: string; role?: string }): Promise<User> => {
    const data = await authApi.register(userData);
    return handleAuthSuccess(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const updateUserProfile = async (updateData: Partial<User>) => {
    const updated = await authApi.updateProfile(updateData);
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  };

  const refreshUser = async (): Promise<User | null> => {
    try {
      const profile = await authApi.getMe();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
        refreshUser,
        getRoleHome,
      }}
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
