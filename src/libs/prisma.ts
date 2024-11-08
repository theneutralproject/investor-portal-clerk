/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Declare module augmentation for global scope
declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

// Initialize as undefined to allow proper typing
let prisma: PrismaClient | null = null;

if (typeof window === "undefined") {
  const { PrismaClient } = require("@prisma/client") as {
    PrismaClient: new () => PrismaClient;
  };
  const { fieldEncryptionExtension } = require("prisma-field-encryption");

  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // @ts-expect-error no type for this
    prisma = new PrismaClient().$extends(fieldEncryptionExtension());
  } else {
    if (!global.prismaClient) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      // @ts-expect-error no type for this
      global.prismaClient = new PrismaClient().$extends(
        fieldEncryptionExtension()
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // @ts-expect-error no type for this
    prisma = global.prismaClient;
  }
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
  organization: OrganizationWithFullMembers;
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
