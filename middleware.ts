'use server'

import withAuth, { NextRequestWithAuth } from 'next-auth/middleware';
import { MiddlewareConfig, NextResponse } from 'next/server';

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: '/', whenAuthenticated: 'next' },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login';

function middleware(request: NextRequestWithAuth) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.nextauth.token;

  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = '/dashboard';

    return NextResponse.redirect(redirectUrl);
  }

  //TODO: check jwt expired, if expired, remove cookie and redirect to login page

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
        */
    '/((?!api/auth|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

export default withAuth(middleware, {
  callbacks: {
    authorized: () => true
  }
});