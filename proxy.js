import { NextResponse } from 'next/server';

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  const isAuthenticated = request.cookies.get('parkingAuth')?.value === 'true';

  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (pathname.startsWith('/auth') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL(isAuthenticated ? '/dashboard' : '/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
};
