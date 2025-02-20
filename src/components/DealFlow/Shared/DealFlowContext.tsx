import { type AccreditationVerificationCreateSchema } from '@/libs/accreditationVerification/schema';
import {
  type OrganizationWithDocuments,
  type ProjectWithAllNestedData,
  type UserWithAddress,
  type DealWithInvestmentStatsAndDocument,
  type MemberWithUser,
  OrganizationWithMembersAndDeals,
} from '@/libs/types';
import {
  DealOwnershipType,
  DealFinancingType,
  type Project,
  type Organization,
  type AccreditationVerification,
} from '@prisma/client';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import DealFlowGetStarted from '@components/DealFlow/GetStarted/DealFlowGetStarted';
import DealFlowType from '@components/DealFlow/Type/DealFlowType';
import DealFlowAmount from '@components/DealFlow/Amount/DealFlowAmount';
import DealFlowDetails from '@components/DealFlow/Details/DealFlowDetails';
import DealFlowDetailsOwnershipType from '@components/DealFlow/Details/DealFlowDetailsOwnershipType';
import DealFlowCoInvestor from '@components/DealFlow/Details/DealFlowCoInvestor';
import DealFlowEntityDetails from '@components/DealFlow/Details/DealFlowEntityDetails';
import DealFlowEntityDetailsCoInvestor from '@components/DealFlow/Details/DealFlowEntityDetailsCoInvestor';
import DealFlowVerifyAccreditation from '@components/DealFlow/Details/VerifyAccreditation/DealFlowVerifyAccreditation';
import {
  type OrganizationMemberCreateSchema,
  type OrganizationMemberUpdateSchema,
} from '@/libs/organization/schema';
import DealFlowReview from '@components/DealFlow/ReviewSign/DealFlowReview';
import DealFlowFund from '@components/DealFlow/Fund/DealFlowFund';
import type { DealCreateSchema } from '@/libs/deal/schema';
import DealFlowDetailsExistingEntity from '../Details/DealFlowDetailsExistingEntity';
// Define the step types
export type StepType =
  | 'get-started'
  | 'type'
  | 'amount'
  | 'details'
  | 'details-existing-entity'
  | 'details-ownership-type'
  | 'co-investor'
  | 'entity-details'
  | 'entity-details-co-investor'
  | 'verify-accreditation'
  | 'review'
  | 'fund';

// Define an interface for the step object
interface Step {
  value: StepType;
  display: string;
  component?: React.ComponentType;
  isMajor?: boolean;
  majorParent?: StepType;
  progress: number;
  requiredDealStage?: number;
}

// Create the steps array with type safety
export const steps: Step[] = [
  {
    value: 'get-started',
    display: 'Get Started',
    component: DealFlowGetStarted,
    progress: 0,
  },
  {
    value: 'type',
    display: 'Type',
    component: DealFlowType,
    isMajor: true,
    progress: 10,
  },
  {
    value: 'amount',
    display: 'Amount',
    component: DealFlowAmount,
    isMajor: true,
    progress: 20,
  },
  {
    value: 'details',
    display: 'Details',
    component: DealFlowDetails,
    isMajor: true,
    progress: 30,
  },
  {
    value: 'details-existing-entity',
    display: 'Existing Entity',
    component: DealFlowDetailsExistingEntity,
    majorParent: 'details',
    progress: 40,
  },
  {
    value: 'details-ownership-type',
    display: 'Ownership Type',
    component: DealFlowDetailsOwnershipType,
    majorParent: 'details',
    progress: 45,
  },
  {
    value: 'co-investor',
    display: 'Co-Investor',
    component: DealFlowCoInvestor,
    majorParent: 'details',
    progress: 50,
  },
  {
    value: 'entity-details',
    display: 'Entity Details',
    component: DealFlowEntityDetails,
    majorParent: 'details',
    progress: 60,
  },
  {
    value: 'entity-details-co-investor',
    display: 'Entity Details (Co-Investor)',
    component: DealFlowEntityDetailsCoInvestor,
    majorParent: 'details',
    progress: 70,
  },
  {
    value: 'verify-accreditation',
    display: 'Verify Accreditation',
    component: DealFlowVerifyAccreditation,
    majorParent: 'details',
    progress: 80,
  },
  {
    value: 'review',
    display: 'Review & Sign',
    component: DealFlowReview,
    isMajor: true,
    progress: 90,
  },
  {
    value: 'fund',
    display: 'Fund',
    component: DealFlowFund,
    isMajor: true,
    progress: 100,
    requiredDealStage: 4,
  },
];

export const stepComponents = Object.fromEntries(
  steps.filter(step => step.component).map(step => [step.value, step.component])
);

export const MAJOR_STEPS = steps.filter(step => step.isMajor);

export const stepValues: StepType[] = steps.map(step => step.value);

export const calculateDealProgress = (
  currentStep: StepType,
  ownershipType: DealOwnershipType | undefined
): number => {
  // Find current step info
  const currentStepInfo = steps.find(s => s.value === currentStep);
  if (!currentStepInfo) return 0;

  // Handle optional paths based on ownership type
  if (currentStepInfo.majorParent === 'details') {
    const entityDetailsRequired =
      ownershipType &&
      ['CORPORATION', 'COMMON', 'OTHER', 'TRUST'].includes(
        ownershipType as string
      );

    const coInvestorRequired =
      ownershipType &&
      ['PARTNERSHIP', 'MARITAL', 'JOINT'].includes(ownershipType as string);

    // Skip entity-details progress if not required
    if (currentStepInfo.value === 'entity-details' && !entityDetailsRequired) {
      return steps.find(s => s.value === 'verify-accreditation')?.progress ?? 0;
    }

    // Skip co-investor progress if not required
    if (currentStepInfo.value === 'co-investor' && !coInvestorRequired) {
      return steps.find(s => s.value === 'verify-accreditation')?.progress ?? 0;
    }
  }

  return currentStepInfo.progress;
};

interface DealFlowContextType {
  step: StepType;
  projectSlug: string;
  dealId: string;
  project: ProjectWithAllNestedData;
  deal: DealWithInvestmentStatsAndDocument;
  user: UserWithAddress;
  organization: OrganizationWithDocuments;
  organizationsOwned: OrganizationWithMembersAndDeals[];
  isLoading: boolean;
  error: string | null;
  updateDeal: (
    updatedDeal: Partial<DealWithInvestmentStatsAndDocument>,
    incrementStep?: boolean
  ) => Promise<void>;
  createDeal: () => Promise<void>;
  updateUser: (updatedUser: Partial<UserWithAddress>) => Promise<void>;
  createOrganization: (
    organizationData: Partial<OrganizationWithDocuments>
  ) => Promise<void>;
  updateOrganization: (
    organizationId: number,
    updatedOrganization: Partial<OrganizationWithDocuments>
  ) => Promise<void>;
  createOrganizationMember: (
    createData: OrganizationMemberCreateSchema
  ) => Promise<void>;
  updateOrganizationMember: (
    memberId: number,
    updateData: OrganizationMemberUpdateSchema
  ) => Promise<void>;
  createVerification: (
    verificationData: AccreditationVerificationCreateSchema
  ) => Promise<void>;
  deleteOrganizationMember: (memberId: number) => Promise<void>;
  refetchOrganization: () => Promise<void>;
  refetchDeal: () => Promise<void>;
}

const DealFlowContext = createContext<DealFlowContextType | undefined>(
  undefined
);

interface DealFlowProviderProps {
  children: React.ReactNode;
  projectSlug: string;
  dealId: string;
  initialStep: StepType;
}

export const DealFlowProvider: React.FC<DealFlowProviderProps> = ({
  children,
  projectSlug,
  dealId,
  initialStep,
}) => {
  const [project, setProject] = useState<ProjectWithAllNestedData | null>(null);
  const [deal, setDeal] = useState<DealWithInvestmentStatsAndDocument | null>(
    null
  );
  const [user, setUser] = useState<UserWithAddress | null>(null);
  const [organization, setOrganization] =
    useState<OrganizationWithDocuments | null>(null);
  const [organizationsOwned, setOrganizationsOwned] = useState<
    OrganizationWithMembersAndDeals[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [step, setStep] = useState<StepType>(initialStep);
  const router = useRouter();
  const pathname = usePathname();
  const getNextStep = (
    currentStep: StepType,
    deal?: DealWithInvestmentStatsAndDocument | null | undefined
  ): StepType | null => {
    const currentIndex = steps.findIndex(s => s.value === currentStep);

    const nextStep = steps[currentIndex + 1]?.value ?? null;

    //Note: NEXT STEP DEPENDS ON ANSWER
    if (
      currentStep === 'details-ownership-type' ||
      currentStep === 'details-existing-entity'
    ) {
      const ownershipType = deal?.investmentStats?.ownershipType;

      if (!ownershipType) {
        return 'verify-accreditation';
      }

      const coInvestorTypes: DealOwnershipType[] = [
        DealOwnershipType.PARTNERSHIP,
        DealOwnershipType.MARITAL,
        DealOwnershipType.JOINT,
      ];

      const entityDetailsTypes: DealOwnershipType[] = [
        DealOwnershipType.CORPORATION,
        DealOwnershipType.COMMON,
        DealOwnershipType.OTHER,
        DealOwnershipType.TRUST,
      ];

      if (coInvestorTypes.some(type => type === ownershipType)) {
        return 'co-investor';
      }

      if (entityDetailsTypes.some(type => type === ownershipType)) {
        return 'entity-details';
      }

      return 'verify-accreditation';
    }

    return nextStep;
  };

  // Add route validation effect
  useEffect(() => {
    if (!deal || !pathname) return;

    // Extract the current step from the pathname
    const pathParts = pathname.split('/');
    const currentRouteStep = pathParts[pathParts.length - 1] as StepType;

    // Find step info for the current route
    const currentStepInfo = steps.find(s => s.value === currentRouteStep);
    if (!currentStepInfo) return;

    // If this step has a required deal stage
    if (currentStepInfo.requiredDealStage !== undefined) {
      if (deal.dealStage < currentStepInfo.requiredDealStage) {
        // Find the last valid step based on deal stage
        const lastValidStep = steps
          .filter(
            s =>
              s.requiredDealStage === undefined ||
              deal.dealStage >= s.requiredDealStage
          )
          .slice(-1)[0];

        if (lastValidStep) {
          // Only redirect if we're not already on the last valid step
          if (lastValidStep.value !== currentRouteStep) {
            router.push(
              `/dealflow/${projectSlug}/${dealId}/${lastValidStep.value}`
            );
            toast.error('Please complete previous steps first');
          }
        } else {
          router.push(`/dealflow/${projectSlug}/${dealId}`);
          toast.error('Invalid deal stage for this step');
        }
      }
    }
  }, [pathname, deal, projectSlug, dealId, router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [dealResponse, userResponse, organizationsOwnedResponse] =
          await Promise.all([
            fetch(
              `/api/deals/flow?projectSlug=${encodeURIComponent(
                projectSlug
              )}&dealId=${encodeURIComponent(dealId)}`
            ),
            fetch('/api/users'),
            fetch('/api/organizations/owned'),
          ]);

        if (!dealResponse.ok || !userResponse.ok) {
          throw new Error(
            `HTTP error! status: ${dealResponse.status} ${userResponse.status}`
          );
        }

        const dealData: {
          project: Project;
          deal: DealWithInvestmentStatsAndDocument | null;
        } = await dealResponse.json();
        const userData: UserWithAddress = await userResponse.json();
        setProject(dealData.project as ProjectWithAllNestedData);
        setDeal(dealData.deal);
        setUser(userData);
        const organizationsOwnedData: OrganizationWithMembersAndDeals[] =
          await organizationsOwnedResponse.json();
        setOrganizationsOwned(organizationsOwnedData);

        if (dealData.deal?.organizationId) {
          const organizationResponse = await fetch(
            `/api/organizations/${dealData.deal.organizationId}`
          );

          if (!organizationResponse.ok) {
            throw new Error(
              `HTTP error! status: ${organizationResponse.status}`
            );
          }

          const organizationData: Organization =
            await organizationResponse.json();
          setOrganization(organizationData as OrganizationWithDocuments);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [projectSlug, dealId]);

  const updateDeal = async (
    updatedDealData: Partial<DealWithInvestmentStatsAndDocument>,
    incrementStep = true
  ) => {
    if (!deal) return;
    setIsLoading(true);
    // Remove signaturesCompletedDate from updatedDealData because it was formatted as a string
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { signaturesCompletedDate, ...updatedDeal } = updatedDealData;
    try {
      const { data } = await axios.put<DealWithInvestmentStatsAndDocument>(
        `/api/deals`,
        updatedDeal
      );
      setDeal(data);

      const nextStep = getNextStep(step, data);
      if (nextStep && incrementStep) {
        router.push(`/dealflow/${projectSlug}/${dealId}/${nextStep}`);
      }
      toast.success('Deal updated successfully');
    } catch (error) {
      console.error('Error updating deal:', error);
      setError('Failed to update deal. Please try again.');
      toast.error('Failed to update deal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createDeal = async () => {
    if (!project) return;
    setIsLoading(true);

    const dealCreateData: DealCreateSchema = {
      financingType: DealFinancingType.promissory_note_now,
      projectId: project.id,
    };

    try {
      const { data } = await axios.post<{ id: string }>(
        '/api/deals',
        dealCreateData
      );
      const nextStep = getNextStep(step);
      if (nextStep) {
        router.push(`/dealflow/${project.slug}/${data.id}/${nextStep}`);
      }
      toast.success('Deal created successfully');
    } catch (error) {
      console.error('Error creating deal:', error);
      setError('Failed to create deal. Please try again.');
      toast.error('Failed to create deal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedUserData: Partial<UserWithAddress>) => {
    if (!user) return;
    setIsLoading(true);

    const updatedUser = {
      ...user,
      ...updatedUserData,
    };

    try {
      const { data } = await axios.put<UserWithAddress>(
        `/api/users`,
        updatedUser
      );
      setUser(data);

      const nextStep = getNextStep(step);
      if (nextStep) {
        router.push(`/dealflow/${project?.slug}/${deal?.id}/${nextStep}`);
      }
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
      toast.error('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createOrganization = async (
    organizationData: Partial<Organization>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<Organization>(
        '/api/organizations',
        organizationData
      );
      setOrganization(data as OrganizationWithDocuments);

      if (!deal) {
        throw new Error('Deal not found');
      }

      //Update deal with new organizationId
      await updateDeal({
        ...deal,
        organizationId: data.id,
        investmentStats: {
          ...deal.investmentStats,
          ownershipType: data.ownershipType,
        },
      });
    } catch (error) {
      console.error('Error creating organization:', error);
      setError('Failed to create organization. Please try again.');
      toast.error('Failed to create organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refetchOrganization = async () => {
    if (!organization) return;
    const { data } = await axios.get<Organization>(
      `/api/organizations/${organization.id}`
    );
    setOrganization(data as OrganizationWithDocuments);
  };

  const refetchDeal = async () => {
    if (!deal || !project) return;
    try {
      const dealResponse = await fetch(
        `/api/deals/flow?projectSlug=${encodeURIComponent(
          project.slug
        )}&dealId=${encodeURIComponent(deal.id)}`
      );

      if (!dealResponse.ok) {
        throw new Error(`HTTP error! status: ${dealResponse.status}`);
      }

      const dealData: {
        project: Project;
        deal: DealWithInvestmentStatsAndDocument | null;
      } = await dealResponse.json();

      setDeal(dealData.deal);
    } catch (error) {
      console.error('Error fetching deal data:', error);
      setError('Failed to load deal data. Please try again.');
    }
  };

  const updateOrganization = async (
    organizationId: number,
    updatedOrganizationData: Partial<Organization>
  ) => {
    if (!organization) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.put<Organization>(
        `/api/organizations/${organizationId}`,
        updatedOrganizationData
      );
      setOrganization(data as OrganizationWithDocuments);

      const nextStep = getNextStep(step);
      if (nextStep) {
        router.push(`/dealflow/${projectSlug}/${dealId}/${nextStep}`);
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      setError('Failed to update organization. Please try again.');
      toast.error('Failed to update organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createOrganizationMember = async (
    createData: OrganizationMemberCreateSchema
  ) => {
    if (!organization) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<MemberWithUser>(
        `/api/organizations/${organization.id}/members`,
        createData
      );
      //Add new member to local organization state
      setOrganization({
        ...organization,
        members: [...organization.members, data],
      });
      toast.success('Co-investor created successfully');
    } catch (error) {
      console.error('Error creating organization member:', error);
      setError('Failed to create organization member. Please try again.');
      toast.error('Failed to create organization member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrganizationMember = async (memberId: number) => {
    if (!organization) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.delete<OrganizationWithDocuments>(
        `/api/organizations/${organization.id}/members/${memberId}`
      );
      setOrganization(data);
      toast.success('Co-investor deleted successfully');
    } catch (error) {
      console.error('Error deleting organization member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrganizationMember = async (
    memberId: number,
    updateData: OrganizationMemberUpdateSchema
  ) => {
    if (!user || !organization) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.put<MemberWithUser>(
        `/api/organizations/${organization.id}/members/${memberId}`,
        updateData
      );
      //Find organization member by userId and update
      const organizationMember = organization?.members.find(
        member => member.id === data?.id
      );
      if (organizationMember) {
        organizationMember.title = data.title;
        organizationMember.user = data.user;
      }
      setOrganization(organization);
      toast.success('Co-investor updated successfully');
    } catch (error) {
      console.error('Error updating organization member:', error);
      setError('Failed to update organization member. Please try again.');
      toast.error('Failed to update organization member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createVerification = async (
    verificationData: AccreditationVerificationCreateSchema
  ) => {
    if (!deal) return;
    setIsLoading(true);
    setError(null);

    try {
      await axios.post<AccreditationVerification>('/api/deals/verification', {
        ...verificationData,
        dealId: deal.id,
      });

      toast.success('Accreditation verifier created successfully');
    } catch (error) {
      console.error('Error creating accreditation verifier:', error);
      setError('Failed to create accreditation verifier. Please try again.');
      toast.error('Failed to create accreditation verifier. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: DealFlowContextType = {
    step,
    projectSlug,
    dealId,
    project: project!,
    deal: deal!,
    user: user!,
    organization: organization!,
    organizationsOwned: organizationsOwned,
    isLoading,
    error,
    updateDeal,
    createDeal,
    updateUser,
    createOrganization,
    updateOrganization,
    updateOrganizationMember,
    createOrganizationMember,
    deleteOrganizationMember,
    createVerification,
    refetchOrganization,
    refetchDeal,
  };

  return (
    <DealFlowContext.Provider value={contextValue}>
      {children}
    </DealFlowContext.Provider>
  );
};

export const useDealFlow = (): DealFlowContextType => {
  const context = useContext(DealFlowContext);
  if (context === undefined) {
    throw new Error('useDealFlow must be used within a DealFlowProvider');
  }
  return context;
};
