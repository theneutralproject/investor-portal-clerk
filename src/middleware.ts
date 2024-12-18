import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/terms', 
  '/support',
])

const isIgnoredRoute = createRouteMatcher([
  '/api/webhooks/(.*)', 
  '/api/admin/(.*)', 
  '/api/docusign/return', 
  '/api/finix/webhooks', 
  '/api/clerk'
])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || isIgnoredRoute(req)) return // if it's a public route, do nothing
  await auth.protect() // for any other route, require auth

  const { redirectToSignIn } = await auth()
  if (!(await auth()).userId)  {
    console.log("not logged in:", req.url)
    redirectToSignIn();
  }
});


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
