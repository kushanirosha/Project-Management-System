import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import API_BASE_URL from "../config/apiConfig";

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
      const res = await fetch(`${API_BASE_URL}/api/login`, {
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

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'client',
    phone: string // ✅ add this
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, phone }), // ✅ include phone
      });

      if (!res.ok) return false;
      const user = await res.json(); // includes id, phone etc.

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
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return data.success; // <-- return true/false
    } catch (err) {
      return false;
    }
  };


  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      return false;
    }
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