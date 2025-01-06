export const runtime = 'nodejs';
import { authMiddleware, redirectToSignUp } from '@clerk/nextjs';
import { type NextRequest } from 'next/server';

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
      '/dashboard',
      '/api/public/projects',
      '/projects/(.*)',
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

  // eslint-disable-next-line consistent-return
  afterAuth(auth, _req) {
    if (!auth.userId && !auth.isPublicRoute) {
      console.log('not logged in:', _req.url);
      const returnBackUrl = `${_req.url}${
        _req.url.includes('?') ? '&' : '?'
      }afterauth=true`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return redirectToSignUp({ returnBackUrl: returnBackUrl });
    }
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};
