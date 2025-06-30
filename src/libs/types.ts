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
  AdvisorFirmEmployee,
  DealOwnershipType,
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

export type DealWithConversion = Deal & {
  startDealConversion?: DealConversion;
  endDealConversion?: DealConversion;
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

export const POSTHOG_EVENTS = {
  PROJECT_INVEST_CLICKED: '$project_invest_clicked',
  SCHEDULE_CALL_CLICKED: '$schedule_call_clicked',
  DEALFLOW_CONTINUE_CLICKED: '$dealflow_continue_clicked',
  DELETE_DEAL_CLICKED: '$delete_deal_clicked',
  PROJECT_PAGE_VIEWED: '$project_page_viewed',
  DOCUMENT_VIEWED: '$document_viewed',
  DOCUMENT_DOWNLOADED: '$document_downloaded',
  CHAT_OPENED: '$chat_opened',
};

export class APIError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface Pagination {
  /** Current page number */
  page: number;
  /** Number of records per page */
  limit: number;
  /** Total number of records */
  total: number;
  /** Whether there are more records beyond this page */
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  [x: string]: Array<T> | Pagination;
}

export interface AdvisorClient {
  client: {
    id: number;
    name: string;
    email: string;
  };
  organization: {
    id: number;
    name: string;
  };
  totalInvested: number;
  numberOfInvestments: number;
  dealTypes: string[];
  earningsToDate: number;
  projectedEarnings: number;
  totalProjectedReturn: number;
}

export interface AdvisorClientsResponse {
  clients: AdvisorClient[];
  pagination: Pagination;
}

export type AdvisorDocument = {
  id: number;
  name: string;
  type: string;
  projectName: string;
  dealId: number;
  projectId: number;
  clientName: string;
  dateCreated: string;
  downloadUrl: string;
};

export interface UseAdvisorDocumentsResponse {
  documents: AdvisorDocument[];
  clients: string[];
  types: string[];
}

export interface OrganizationWithDealsAndStats {
  organizationId: number;
  organizationName: string;
  userId: number | null;
  clerkId: string | null;
  dealId: number | null;
  closingDate: Date | null;
  status: string | null;
  investmentStatsId: number | null;
  amount: number | null;
  unitType: string | null;
  financingType: string | null;
}

export type AdvisorClientInvestment = OrganizationWithDealsAndStats & {
  ownershipType?: DealOwnershipType;
  projectName: string;
};

export interface UseAdvisorClientInvestmentsResponse {
  deals: AdvisorClientInvestment[];
}

export type AdvisorEmployeeAndUser = AdvisorFirmEmployee & { user: User };

export type ResourceResponse = {
  items: ResourceItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export type ResourceItem = {
  id: string;
  cmsLocaleId: string;
  lastPublished: string;
  lastUpdated: string;
  createdOn: string;
  isArchived: boolean;
  isDraft: boolean;
  fieldData: ResourceFieldData;
};

export type ResourceFieldData = {
  featured: boolean;
  name: string;
  slug: string;
  'resource-type-label': ResourceType;
  'downloadable-file'?: {
    fileId: string;
    url: string;
    alt: string | null;
  };
  'external-link'?: string;
  summary?: string;
  content?: string;
};

export type ResourceType = 'pdf' | 'faq' | 'quick-link' | 'short-article';

export type WebFlowContent = Record<ResourceType, ResourceItem[]>;

export interface AdvisorClientKPIsResponse {
  totalInvested: number;
  numberOfClients: number;
}
