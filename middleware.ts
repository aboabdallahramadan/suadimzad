import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Create intl middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en'
});

// Routes that require authentication
const protectedRoutes = [
  '/profile',
  '/favorites',
  '/post-ad',
  '/chats',
  '/notifications',
];

// Routes that are only accessible to non-authenticated users
const authRoutes = [
  '/login',
  '/register',
  '/otp',
];

export default async function middleware(req: NextRequest) {
  // Get the pathname
  const pathname = req.nextUrl.pathname;
  
  // Check if the token exists in cookies or localStorage
  const hasAuthCookie = req.cookies.has('authToken');
  
  // Check if this is an authentication route
  const isAuthRoute = authRoutes.some(route => 
    pathname.includes(`/${req.nextUrl.locale}${route}`) || 
    pathname === route
  );
  
  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.includes(`/${req.nextUrl.locale}${route}`) || 
    pathname === route
  );
  
  // If the user is logged in and trying to access an auth route, redirect to home
  if (hasAuthCookie && isAuthRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // If the user is not logged in and trying to access a protected route, redirect to login
  if (!hasAuthCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL(`/${req.nextUrl.locale}/login`, req.url));
  }
  
  // Apply intl middleware
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for the ones starting with static, api, _next, favicon.ico, etc.
  matcher: ['/((?!api|_next|.*\\..*).*)']
};