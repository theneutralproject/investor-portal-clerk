/* eslint-disable import/no-mutable-exports */
import {
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
  type ProjectPaymentInfo,
} from "@prisma/client";
import { ReturnsDateObject } from "./returns/schema";

export type ProjectWithAllNestedData = Project & {
  pictures: ProjectPicture[];
  milestones: ProjectMilestones;
  investmentStats: ProjectInvestmentStats;
  propertyStats: ProjectPropertyStats;
  documents: ProjectDocument[];
  projectPaymentInfo: ProjectPaymentInfo[];
};

export type ProjectWithStats = Project & {
  investmentStats: ProjectInvestmentStats;
  propertyStats: ProjectPropertyStats;
  milestones: ProjectMilestones;
};

export type ProjectWithInvestmentStats = Project & {
  investmentStats: ProjectInvestmentStats;
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

export type DealWithInvestmentStatsAndProject = Deal & {
  investmentStats?: DealInvestmentStats | null;
  project?: Project & { milestones: ProjectMilestones | null } | null;
};

export type DealWithOrgMembersAndProject = Deal & {
  organization: OrganizationWithFullMembers;
  project: Project;
};

export type DealWithFullOrgAndProject = Deal & {
  organization: OrganizationWithFullMembersAndAddress & {
    address: Address | null;
  };
  project: ProjectWithAllNestedData;
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
  address: Address | null;
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
