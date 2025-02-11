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

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     await auth.protect()
//   }
// })

// Function to check if a route is public
// const isPublicRoute = (path: string) => {
//   return publicRoutes.some(route => {
//     if (route.includes('(.*)')) {
//       const pattern = new RegExp(`^${route.replace('(.*)', '.*')}$`);
//       return pattern.test(path);
//     }
//     return path === route;
//   });
// };

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  if (!userId && !isPublicRoute(request)) {
    Logger.log({ message: `Not logged in: ${request.url}` });
    const returnBackUrl = `${request.url}${request.url.includes('?') ? '&' : '?'}afterauth=true`;
    const signUpUrl = new URL('/sign-up', request.url);
    signUpUrl.searchParams.set('returnUrl', returnBackUrl);
    // return NextResponse.redirect(signUpUrl);
    await auth.protect();
  }

  // if (!isPublicRoute(request)) {
  //   await auth.protect();
  // }

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
