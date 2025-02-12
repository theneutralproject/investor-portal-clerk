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

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  if (!userId && !isPublicRoute(request)) {
    Logger.log({ message: `Not logged in: ${request.url}` });
    await auth.protect();
  }

  if (userId && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
