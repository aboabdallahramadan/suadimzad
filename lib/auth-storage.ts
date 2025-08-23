// Authentication Storage utility for managing tokens and user data in localStorage and cookies

// Check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

// Keys for localStorage and cookies
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

// Cookie options
const COOKIE_OPTIONS = 'path=/; samesite=lax; max-age=2592000'; // 30 days

// Type for user data
interface User {
  id: number;
  name: string;
  phoneNumber: string;
  userType: number;
  profilePhotoUrl?: string;
}

/**
 * Set a cookie
 */
function setCookie(name: string, value: string, options: string = COOKIE_OPTIONS) {
  if (!isBrowser) return;
  document.cookie = `${name}=${value}; ${options}`;
}

/**
 * Get a cookie value
 */
function getCookie(name: string): string | null {
  if (!isBrowser) return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

/**
 * Delete a cookie
 */
function deleteCookie(name: string) {
  if (!isBrowser) return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

/**
 * Set authentication token in localStorage and cookie
 */
export function setAuthToken(token: string): void {
  if (!isBrowser) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  setCookie(AUTH_TOKEN_KEY, token);
}

/**
 * Get authentication token from localStorage or cookie
 */
export function getAuthToken(): string | null {
  if (!isBrowser) return null;
  
  // Try localStorage first
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) return token;
  
  // Fall back to cookie
  return getCookie(AUTH_TOKEN_KEY);
}

/**
 * Set user data in localStorage
 */
export function setUserData(userData: User): void {
  if (!isBrowser) return;
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

/**
 * Get user data from localStorage
 */
export function getUserData(): User | null {
  if (!isBrowser) return null;
  
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (!isBrowser) return false;
  return !!getAuthToken();
}

/**
 * Clear authentication data (logout)
 */
export function clearAuth(): void {
  if (!isBrowser) return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  deleteCookie(AUTH_TOKEN_KEY);
} 