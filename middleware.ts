import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes - check for token cookie
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const tokenCookie = req.cookies.get('admin_token');

    if (!tokenCookie?.value) {
      // Redirect to login page if no token cookie
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
