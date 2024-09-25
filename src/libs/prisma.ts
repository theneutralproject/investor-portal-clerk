/* eslint-disable import/no-mutable-exports */
import { PrismaClient, type ProjectMilestones, type Address, type Pictures, type Project, type User } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;

export type ProjectWithPicturesAndMilestones = Project & {
  pictures: Pictures[];
  milestones: ProjectMilestones;
};

export type UserWithAddress = User & {
  address: Address | null;
};