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
  DocusignEvent,
  DealConversion,
} from '@prisma/client';

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

export type DealWithInvestmentStatsAndProjectWithPics = Deal & {
  investmentStats?: DealInvestmentStats | null;
  startDealConversion?: DealConversion | null;
  endDealConversion?: DealConversion | null;
  project?:
    | (Project & {
        milestones: ProjectMilestones | null;
        pictures: ProjectPicture[] | null;
        investmentStats: ProjectInvestmentStats | null;
      })
    | null;
};

export type DealWithOrgMembersAndProject = Deal & {
  organization: OrganizationWithFullMembers;
  project: Project;
  investmentStats?: DealInvestmentStats | null;
};

export type DealWithFullOrgAndProject = Deal & {
  organization: OrganizationWithFullMembersAndAddress & {
    address: Address | null;
  };
  project: ProjectWithAllNestedData;
};

export type DealWithFullOrgAndSlimProject = Deal & {
  organization: OrganizationWithFullMembersAndAddress & {
    address: Address | null;
  };
  project: Project;
};

export type DealWithInvestmentStatsAndDocument = DealWithInvestmentStats & {
  document: DealDocument[];
  DocusignEvent: DocusignEvent[];
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

export type OrganizationWithMembersAndDeals = OrganizationWithFullMembers & {
  deals: Deal[];
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

export interface FinixTransferResponse {
  type?: string;
  state?: string;
  id?: string;
  trace_id: string;
  failure_code: string;
  failure_message: string;
  _embedded?: { errors: { message: string }[] };
}
