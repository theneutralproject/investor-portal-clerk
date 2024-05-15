import { authMiddleware, redirectToSignUp } from "@clerk/nextjs";
import type { NextRequest } from "next/server";

export default authMiddleware({
  ignoredRoutes: ["/api/webhooks(.*)"],
  publicRoutes: (req: NextRequest) => {
    const publicRoutes = ["/terms", "/support", "/api/clerk"];
    return publicRoutes.some((route) => req.nextUrl.pathname.includes(route));
  },

  // eslint-disable-next-line consistent-return
  afterAuth(auth, _req) {
    if (!auth.userId && !auth.isPublicRoute) {
      
      console.warn(`_____LOGGING API ${_req.method} REQUEST:\tuser: ${auth.userId}\turl: ${_req.url}`);
      if(_req.body) console.warn(_req.body);
      
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return redirectToSignUp({ returnBackUrl: process.env.NEXTAUTH_URL });
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};