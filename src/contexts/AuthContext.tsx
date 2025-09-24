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
  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) return false;
    const user = await res.json();

    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true, loading: false });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const register = async (name: string, email: string, password: string, role: 'admin' | 'client'): Promise<boolean> => {
  try {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    if (!res.ok) return false;
    const user = await res.json(); // includes 'id'

    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true, loading: false });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
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