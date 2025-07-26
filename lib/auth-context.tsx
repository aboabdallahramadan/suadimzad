"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserProfile, logout } from './api';
import { getUserData, isAuthenticated, setUserData } from './auth-storage';

// Check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

// Define the user type
interface User {
  id: number;
  name: string;
  phoneNumber: string;
  userType: number;
  profilePhotoUrl?: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the user is authenticated when the app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    if (!isBrowser) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      if (isAuthenticated()) {
        // Get user data from localStorage first for immediate UI update
        const storedUser = getUserData();
        if (storedUser) {
          setUser(storedUser);
        }

        // Then fetch fresh data from the API
        try {
          const response = await getUserProfile();
          if (response.success && response.data) {
            setUser(response.data);
            setUserData(response.data);
          }
        } catch (apiError) {
          console.error('Failed to fetch fresh user data:', apiError);
          // Continue with locally stored data if API call fails
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setError('Authentication check failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to log out user
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // Function to set user and update storage
  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      setUserData(newUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setUser: updateUser,
        logout: handleLogout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 