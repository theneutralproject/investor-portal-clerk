import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  '/terms',
  '/support',
  '/learn',
  '/contact',
  '/dashboard',
  '/projects/(.*)',
  '/api/public/rss',
];

const ignoredRoutes = [
  '/api/webhooks/(.*)',
  '/api/admin/(.*)',
  '/api/docusign/return',
  '/api/docusign/tokenFromCode',
  '/api/finix/webhooks',
  '/api/clerk',
  '/api/public/projects',
  '/api/hubspot/token',
];

const isIgnoredRoute = createRouteMatcher(ignoredRoutes);
const isOnboardingRoute = createRouteMatcher(['/onboarding']);
const isPublicRoute = createRouteMatcher(publicRoutes);
const isAdvisorRoute = createRouteMatcher([
  '/advisor',
  '/advisor/(.*)',
  '/api/advisors',
  '/api/advisors/(.*)',
]);
const isUsersRoute = createRouteMatcher([
  '/api/users',
  '/api/users/(.*)',
  '/account',
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  if (isIgnoredRoute(request)) {
    return NextResponse.next();
  }
  const { userId, sessionClaims } = await auth();

  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(request)) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(request)) {
    await auth.protect();
  }

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboading route to complete onboarding
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    console.log(
      'User has not completed onboarding, redirecting to /onboarding',
      sessionClaims?.metadata
    );
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  const role = sessionClaims?.metadata?.role;

  // Only allow advisors into /advisor routes
  if (isAdvisorRoute(request) && role !== 'ADVISOR') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is an advisor and accessing non-advisor routes, redirect them
  if (
    role === 'ADVISOR' &&
    !isAdvisorRoute(request) &&
    !isPublicRoute(request) &&
    !isUsersRoute(request)
  ) {
    return NextResponse.redirect(new URL('/advisor/dashboard', request.url));
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is logged in and the route is onboarding, redirect to dashboard.
  // if (userId && request.nextUrl.pathname === '/onboarding') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  // User is authenticated, let them view.
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
