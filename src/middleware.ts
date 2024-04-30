import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import type { NextRequest } from "next/server";

export default authMiddleware({
  ignoredRoutes: ["/api/webhooks(.*)"],
  publicRoutes: (req: NextRequest) => {
    const publicRoutes = ["/terms", "/support", "/api/clerk", "/sign-up", "sign-in"];
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


