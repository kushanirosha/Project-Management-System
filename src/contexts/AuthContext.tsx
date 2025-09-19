import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { dummyUsers } from '../data/dummyData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'admin' | 'client') => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        loading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const user = dummyUsers.find(u => u.email === email);
    
    if (user && password === 'password123') { // Demo password
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false
      });
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: 'admin' | 'client'): Promise<boolean> => {
    // Simulate API call
    const existingUser = dummyUsers.find(u => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }

    const newUser: User = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      role,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    };

    dummyUsers.push(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      loading: false
    });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    // Simulate sending OTP
    const user = dummyUsers.find(u => u.email === email);
    if (user) {
      console.log(`OTP sent to ${email}: 123456`); // Demo OTP
      return true;
    }
    return false;
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    // Simulate password reset
    if (otp === '123456') { // Demo OTP
      console.log(`Password reset successful for ${email}`);
      return true;
    }
    return false;
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};