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
import { fieldEncryptionExtension } from 'prisma-field-encryption'

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prismaClient: PrismaClient;
  };
  if (!globalWithPrisma.prismaClient) {
    globalWithPrisma.prismaClient = new PrismaClient();
  }
  prismaClient = globalWithPrisma.prismaClient;
}

const prisma = prismaClient.$extends(
  fieldEncryptionExtension()
)

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
  members: MemberWithUser[];
  address: Address | null;
};

export type MemberWithUser = Member & {
  user: Partial<User>;
};
