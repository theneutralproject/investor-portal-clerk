import { NextResponse } from 'next/server';
import Logger from './libs/logger';

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const publicRoutes = [
  '/terms',
  '/support',
  '/learn',
  '/contact',
  '/dashboard',
  '/projects/(.*)',
  '/api/public/projects',
];

const ignoredRoutes = [
  '/api/webhooks/(.*)',
  '/api/admin/(.*)',
  '/api/docusign/return',
  '/api/docusign/tokenFromCode',
  '/api/finix/webhooks',
  '/api/clerk',
];

const isPublicRoute = createRouteMatcher(publicRoutes);
const isIgnoredRoute = createRouteMatcher(ignoredRoutes);

export default clerkMiddleware(async (auth, request) => {
  if (isIgnoredRoute(request)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId && !isPublicRoute(request)) {
    Logger.log({ message: `Not logged in: ${request.url}` });
    await auth.protect();
  }

  if (userId && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/redirect', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes except ignored ones
    '/(api|trpc)(.*)',
  ],
};
