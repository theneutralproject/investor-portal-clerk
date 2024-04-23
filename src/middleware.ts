import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import type { NextRequest } from "next/server";
import process from "process";

export default authMiddleware({
  // ignoredRoutes: ["/api/hubspot(.*)"],
  publicRoutes: (req: NextRequest) => {
    const publicRoutes = ["/terms", "/support", "/api/clerk"];

    return publicRoutes.some((route) => req.nextUrl.pathname.includes(route));
  },

  // eslint-disable-next-line consistent-return
  afterAuth(auth, _req) {
    if (!auth.userId && !auth.isPublicRoute) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return redirectToSignIn({ returnBackUrl: process.env.NEXTAUTH_URL });
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};


