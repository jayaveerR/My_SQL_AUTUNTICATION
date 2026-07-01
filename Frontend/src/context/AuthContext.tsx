import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  createdAt?: string;
  lastLoginIp?: string;
  lastLoginDevice?: string;
  lastLoginLocation?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      try {
        const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        setUser(res.data.user);
      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            // Try to refresh token
            await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
            // If refresh succeeded, try getting user again
            const retryRes = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
            setUser(retryRes.data.user);
          } catch (refreshError) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
