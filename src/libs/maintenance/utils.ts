import { Role } from "@prisma/client";
import prisma from "../prisma.server";


export async function isAdminUser(clerkId: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
        where: { clerkId, role: Role.ADMIN },
    });
    return !!user;
}