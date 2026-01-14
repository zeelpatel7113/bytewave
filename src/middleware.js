import { NextResponse } from 'next/server';

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  const isAuthenticated = req.cookies.get('auth_token');

  // Public API routes - Allow access without authentication
  const publicApiRoutes = [
    '/api/services',
    '/api/training-courses',
    '/api/service-requests',
    '/api/training-requests',
    '/api/auth/login',
    '/api/contacts',
    '/api/career-posting', 
    '/api/career-requests',
    '/api/blogs'
  ];

  // Check if the current path is a public API route
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    // Allow GET requests without authentication
    if (req.method === 'GET' && (pathname === '/api/services' || pathname === '/api/training-courses' || pathname === '/api/career-posting')) {
      return NextResponse.next();
    }
    
    // Allow POST requests for form submissions
    if (req.method === 'POST' && (pathname === '/api/contacts'||pathname==='/api/career-requests'||pathname === '/api/service-requests' || pathname === '/api/training-requests')) {
      return NextResponse.next();
    }

    // Allow login endpoint
    if (pathname === '/api/auth/login') {
      return NextResponse.next();
    }
  }

  // Protect API routes that require authentication
  if (pathname !== '/api/blogs' && pathname.startsWith('/api')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Authentication required',
          timestamp: "2025-04-04 09:53:50",
          user: null
        },
        { status: 401 }
      );
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Redirect authenticated users away from login
  if (pathname.startsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/login',
  ],
};