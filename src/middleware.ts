export const runtime = 'nodejs';
import { authMiddleware, redirectToSignUp } from '@clerk/nextjs';
import { type NextRequest, NextResponse } from 'next/server';

export default authMiddleware({
  ignoredRoutes: [
    '/api/webhooks/(.*)',
    '/api/admin/(.*)',
    '/api/docusign/return',
    '/api/finix/webhooks',
    '/api/clerk',
  ],
  publicRoutes: (req: NextRequest) => {
    const publicRoutes = [
      '/terms',
      '/support',
      '/learn',
      '/contact',
      '/dashboard',
      '/projects/(.*)',
      '/api/public/projects',
    ];

    // Use exact path matching or proper pattern matching
    return publicRoutes.some(route => {
      if (route.includes('(.*)')) {
        // For wildcard routes, convert to regex
        const pattern = new RegExp(`^${route.replace('(.*)', '.*')}$`);
        return pattern.test(req.nextUrl.pathname);
      }
      // For exact routes, use exact matching
      return req.nextUrl.pathname === route;
    });
  },

  afterAuth(auth, _req) {
    if (!auth.userId && !auth.isPublicRoute) {
      console.log('not logged in:', _req.url);
      const returnBackUrl = `${_req.url}${
        _req.url.includes('?') ? '&' : '?'
      }afterauth=true`;
      return redirectToSignUp({ returnBackUrl: returnBackUrl });
    }

    //Redirect to dashboard if user is logged in and on /login page
    if (auth.userId && _req.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', _req.url));
    }
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};
