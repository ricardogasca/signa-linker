
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user for demo purposes
const sampleUser: User = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  isAdmin: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing auth on load
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // For demo purposes, accept any login with password "password"
    if (password === 'password') {
      if (email === 'admin@example.com') {
        setUser(sampleUser);
      } else {
        setUser({
          id: '2',
          email,
          name: email.split('@')[0],
          isAdmin: false
        });
      }
    } else {
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
