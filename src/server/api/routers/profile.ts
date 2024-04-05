import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const { db, auth } = ctx;

    return await db.profile.findFirst({
      where: {
        userId: auth.userId,
      },
    });
  }),
});
