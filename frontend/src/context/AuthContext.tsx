import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services';
import type { AuthContextType, User, LoginCredentials, RegisterData } from '../types';
import { message } from 'antd';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore auth state from localStorage on mount
    const currentUser = authService.getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      const userData = response.data.user;
      
      // Store user in localStorage (token is in HTTP-only cookie)
      authService.setUser(userData);
      setUser(userData);
      
      message.success(response.message || 'Login successful!');
    } catch (error: any) {
      // Extract error message from backend response
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      message.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      const userData = response.data.user;
      
      // Store user in localStorage (token is in HTTP-only cookie)
      authService.setUser(userData);
      setUser(userData);
      
      message.success(response.message || 'Registration successful!');
    } catch (error: any) {
      // Extract error message from backend response
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      message.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      message.success('Logged out successfully');
    } catch (error: any) {
      // Even if API call fails, clear local state
      authService.clearUser();
      setUser(null);
      message.info('Logged out');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
