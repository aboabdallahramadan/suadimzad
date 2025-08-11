// API utility functions for authentication and other operations
import axios from 'axios';
import { setAuthToken, getAuthToken, setUserData, clearAuth } from './auth-storage';
import { User } from './auth-context';

const BASE_URL = 'http://localhost:5000/api';

// Check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  exception?: string;
  stackTrace?: string;
}

interface UserData {
  id: number;
  name: string;
  phoneNumber: string;
}

// Follow Toggle API
export interface FollowToggleResponse {
  id: number;
  name: string;
  isFollowed: boolean;
}

export const toggleFollow = async (providerId: number, locale: string = 'en'): Promise<ApiResponse<FollowToggleResponse>> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${BASE_URL}/followers/toggle/${providerId}`, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept-Language': locale
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling follow status:', error);
    throw error;
  }
};

interface LoginResponse {
  userId: number;
}

interface VerifyOtpResponse {
  token: string;
  user: UserData;
}

// Function to login with phone number
export async function loginWithPhone(phoneNumber: string, locale: string): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>('/User/login', {
      phoneNumber,
    }, {
      headers: {
        'Accept-Language': locale,
      },
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Login error:', error.response.data);
      throw new Error(error.response.data?.message?.english || 'Login failed');
    }
    console.error('Login error:', error);
    throw error;
  }
}

// Function to verify OTP
export async function verifyOtp(userId: number, otp: string, locale: string): Promise<ApiResponse<VerifyOtpResponse>> {
  try {
    const response = await api.post<ApiResponse<VerifyOtpResponse>>('/User/verify-otp', {
      userId,
      otp,
    }, {
      headers: {
        'Accept-Language': locale,
      },
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message);
    }

    // If verification is successful, store the token in localStorage
    if (data.success && data.data?.token) {
      setAuthToken(data.data.token);
      setUserData(data.data.user as User);
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('OTP verification error:', error.response.data);
      throw new Error(error.response.data?.message?.english || 'OTP verification failed');
    }
    console.error('OTP verification error:', error);
    throw error;
  }
}

// Function to register a new user
export async function registerUser(name: string, phoneNumber: string, locale: string): Promise<ApiResponse<UserData>> {
  try {
    const response = await api.post<ApiResponse<UserData>>('/User/register', {
      name,
      phoneNumber,
    }, {
      headers: {
        'Accept-Language': locale,
      },
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Registration error:', error.response.data);
      throw new Error(error.response.data?.message?.english || 'Registration failed');
    }
    console.error('Registration error:', error);
    throw error;
  }
}

// Function to get user profile (requires authentication)
export async function getUserProfile(locale: string): Promise<ApiResponse<UserData>> {
  try {
    if (!isBrowser) {
      throw new Error('This function can only be called in browser environment');
    }

    const token = getAuthToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.get<ApiResponse<UserData>>('/User/profile', {
      headers: {
        'Accept-Language': locale,
      },
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Handle 401 unauthorized specifically
      if (error.response.status === 401) {
        logout();
      }
      console.error('Get profile error:', error.response.data);
      throw new Error(error.response.data?.message || 'Failed to get profile');
    }
    console.error('Get profile error:', error);
    throw error;
  }
}

// Utility function to check if user is logged in - using auth-storage
export { isAuthenticated } from './auth-storage';

// Utility function to logout user
export function logout(): void {
  clearAuth();
} 