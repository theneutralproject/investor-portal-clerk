/* eslint-disable import/no-mutable-exports */
import { PrismaClient, type ProjectMilestones, type Address, type ProjectPicture, type Deal, type Project, type User, type ProjectInvestmentStats, type ProjectPropertyStats, type DealInvestmentStats } from "@prisma/client";

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

export type ProjectWithAllNestedData = Project & {
  pictures: ProjectPicture[];
  milestones: ProjectMilestones;
  investmentStats: ProjectInvestmentStats;
  propertyStats: ProjectPropertyStats;
};

export type ProjectWithStats = Project & {
  investmentStats: ProjectInvestmentStats;
  propertyStats: ProjectPropertyStats;
}

export type UserWithAddress = User & {
  address: Address | null;
};

export type DealWithInvestmentStats = Deal & {
  investmentStats: DealInvestmentStats
}