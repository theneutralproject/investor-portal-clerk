/* eslint-disable import/no-mutable-exports */
import { 
  PrismaClient, 
  type ProjectMilestones, 
  type Address, 
  type ProjectPicture, 
  type Deal, 
  type Project, 
  type User, 
  type ProjectInvestmentStats, 
  type ProjectPropertyStats, 
  type DealInvestmentStats, 
  type Organization, 
  type Member } from "@prisma/client";


const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    result: {
      user: {
        isGhost: {
          needs: { clerkId: true },
          compute: (user: User) => {
            return !user.clerkId;
          }
        }
      }
    }
  });
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

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

export type OrganizationWithMembersAndAddress = Organization & {
  members: Member[],
  address: Address,
}

export type OrganizationWithFullMembers = Organization & {
  members: MemberWithUser[],
}

export type MemberWithUser = Member & {
  user: User;
}