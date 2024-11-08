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
  type Member,
  type AccreditationVerifier,
  type AccreditationVerification,
  type ProjectDocument,
  type OrganizationDocument,
  type DealDocument,
} from "@prisma/client";

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
  documents: ProjectDocument[];
};

export type ProjectWithStats = Project & {
  investmentStats: ProjectInvestmentStats;
  propertyStats: ProjectPropertyStats;
  milestones: ProjectMilestones;
};

export type UserWithAddress = User & {
  address: Address | null;
};

export type UserWithOrganizations = User & {
  organizationsOwned: Organization[];
};

export type DealWithInvestmentStats = Deal & {
  investmentStats: DealInvestmentStats;
};

export type DealWithOrgMembersAndProject = Deal & {
  organization: OrganizationWithFullMembers
  project: Project;
};

export type DealWithFullOrgAndProject = Deal & {
  organization: OrganizationWithFullMembersAndAddress & { address: Address };
  project: Project;
};

export type DealWithInvestmentStatsAndDocument = DealWithInvestmentStats & {
  document: DealDocument[];
};

export type AccreditationVerificationWithVerifier =
  AccreditationVerification & {
    verifier: AccreditationVerifier | null;
  };

export type DealWithInvestmentStatsAndVerification = DealWithInvestmentStats & {
  accreditationVerification: AccreditationVerificationWithVerifier | null;
};

export type OrganizationWithMembersAndAddress = Organization & {
  members: Member[];
  address: Address;
};

export type OrganizationWithFullMembers = Organization & {
  members: MemberWithUser[];
};

export type OrganizationWithDocuments = OrganizationWithFullMembers & {
  document: OrganizationDocument[];
};

export type OrganizationWithFullMembersAndAddress = Organization & {
  members: MemberWithFullUser[];
  address: Address | null;
};

export type MemberWithPartialUser = Member & {
  user: Partial<User>;
};

export type MemberWithUser = Member & {
  user: User;
};

export type MemberWithFullUser = Member & {
  user: User & { address: Address | null };
};