import { authMiddleware, redirectToSignUp } from "@clerk/nextjs";
import { type NextRequest } from "next/server";

export default authMiddleware({
  ignoredRoutes: ["/api/webhooks(.*)"],
  publicRoutes: (req: NextRequest) => {
    const publicRoutes = ["/terms", "/support", "/api/clerk"];
    return publicRoutes.some((route) => req.nextUrl.pathname.includes(route));
  },

  // eslint-disable-next-line consistent-return
  afterAuth(auth, _req) {
    if (!auth.userId && !auth.isPublicRoute) {
      console.log("not logged in:", _req.url);
      const returnBackUrl = `${_req.url}${
        _req.url.includes("?") ? "&" : "?"
      }afterauth=true`;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      // return redirectToSignUp({ returnBackUrl: process.env.NEXTAUTH_URL });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return redirectToSignUp({ returnBackUrl: returnBackUrl });
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
