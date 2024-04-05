import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const projectRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const { db } = ctx;

        return await db.project.findMany({});
    }),
});
