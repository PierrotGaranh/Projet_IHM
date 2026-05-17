import { NextResponse } from 'next/server';

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // Get session from cookies
  const isAuthenticated = request.cookies.get('parkingAuth')?.value === 'true';

  // If trying to access protected routes without auth, redirect to login
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If trying to access auth pages while authenticated, redirect to dashboard
  if (pathname.startsWith('/auth') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing root, redirect based on auth status
  if (pathname === '/') {
    return NextResponse.redirect(new URL(isAuthenticated ? '/dashboard' : '/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
};
