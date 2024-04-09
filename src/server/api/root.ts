import { createTRPCRouter } from "@/server/api/trpc";
import { profileRouter as profileRouter } from "./routers/profile";
import { projectRouter } from "./routers/project";
import { hubspotRouter } from "./routers/hubspot";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  profile: profileRouter,
  project: projectRouter,
  hubspot: hubspotRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
