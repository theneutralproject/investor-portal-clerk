import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

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

const isIgnoredRoute = createRouteMatcher(ignoredRoutes);
const isOnboardingRoute = createRouteMatcher(['/onboarding']);
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (isIgnoredRoute(request)) {
    return NextResponse.next();
  }

  // For users visiting /onboarding, don't try to redirect
  if (userId && isOnboardingRoute(request)) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && !isPublicRoute(request))
    return redirectToSignIn({ returnBackUrl: request.url });

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboading route to complete onboarding
  console.log(sessionClaims);
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL('/onboarding', request.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is logged in and the route is protected, let them view.
  if (userId && request.nextUrl.pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes except ignored ones
    '/(api|trpc)(.*)',
  ],
};
