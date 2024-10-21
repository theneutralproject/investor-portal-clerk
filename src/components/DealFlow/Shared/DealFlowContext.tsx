/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type AccreditationVerifierCreateSchema } from "@/libs/accreditationVerifier/schema";
import {
  type OrganizationWithFullMembers,
  type ProjectWithAllNestedData,
  type UserWithAddress,
  type DealWithInvestmentStats,
} from "@/libs/prisma";
import {
  DealOwnershipType,
  DealFinancingType,
  type Project,
  type Organization,
  type MembershipType,
  type User,
  type AccreditationVerifier,
} from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import DealFlowGetStarted from "@components/DealFlow/GetStarted/DealFlowGetStarted";
import DealFlowType from "@components/DealFlow/Type/DealFlowType";
import DealFlowAmount from "@components/DealFlow/Amount/DealFlowAmount";
import DealFlowDetails from "@components/DealFlow/Details/DealFlowDetails";
import DealFlowDetailsOwnershipType from "@components/DealFlow/Details/DealFlowDetailsOwnershipType";
import DealFlowCoInvestor from "@components/DealFlow/Details/DealFlowCoInvestor";
import DealFlowEntityDetails from "@components/DealFlow/Details/DealFlowEntityDetails";
import DealFlowEntityDetailsCoInvestor from "@components/DealFlow/Details/DealFlowEntityDetailsCoInvestor";
import DealFlowVerifyAccreditation from "@components/DealFlow/Details/VerifyAccreditation/DealFlowVerifyAccreditation";

// Define the step types
export type StepType =
  | "get-started"
  | "type"
  | "amount"
  | "details"
  | "details-ownership-type"
  | "co-investor"
  | "entity-details"
  | "entity-details-co-investor"
  | "verify-accreditation"
  | "review"
  | "fund";

// Define an interface for the step object
interface Step {
  value: StepType;
  display: string;
  component?: React.ComponentType;
  isMajor?: boolean;
  majorParent?: StepType;
}

// Create the steps array with type safety
export const steps: Step[] = [
  {
    value: "get-started",
    display: "Get Started",
    component: DealFlowGetStarted,
  },
  { value: "type", display: "Type", component: DealFlowType, isMajor: true },
  {
    value: "amount",
    display: "Amount",
    component: DealFlowAmount,
    isMajor: true,
  },
  {
    value: "details",
    display: "Details",
    component: DealFlowDetails,
    isMajor: true,
  },
  {
    value: "details-ownership-type",
    display: "Ownership Type",
    component: DealFlowDetailsOwnershipType,
    majorParent: "details",
  },
  {
    value: "co-investor",
    display: "Co-Investor",
    component: DealFlowCoInvestor,
    majorParent: "details",
  },
  {
    value: "entity-details",
    display: "Entity Details",
    component: DealFlowEntityDetails,
    majorParent: "details",
  },
  {
    value: "entity-details-co-investor",
    display: "Entity Details (Co-Investor)",
    component: DealFlowEntityDetailsCoInvestor,
    majorParent: "details",
  },
  {
    value: "verify-accreditation",
    display: "Verify Accreditation",
    component: DealFlowVerifyAccreditation,
    majorParent: "details",
  },
  { value: "review", display: "Review & Sign", isMajor: true },
  { value: "fund", display: "Fund", isMajor: true },
];

export const stepComponents = Object.fromEntries(
  steps
    .filter((step) => step.component)
    .map((step) => [step.value, step.component])
);

export const MAJOR_STEPS = steps.filter((step) => step.isMajor);

export const stepValues: StepType[] = steps.map((step) => step.value);

interface DealFlowContextType {
  step: StepType;
  projectSlug: string;
  dealId: string;
  project: ProjectWithAllNestedData;
  deal: DealWithInvestmentStats;
  user: UserWithAddress;
  organization: OrganizationWithFullMembers;
  isLoading: boolean;
  error: string | null;
  updateDeal: (updatedDeal: Partial<DealWithInvestmentStats>) => Promise<void>;
  createDeal: () => Promise<void>;
  updateUser: (updatedUser: Partial<UserWithAddress>) => Promise<void>;
  createOrganization: (
    organizationData: Partial<OrganizationWithFullMembers>
  ) => Promise<void>;
  updateOrganization: (
    organizationId: number,
    updatedOrganization: Partial<OrganizationWithFullMembers>
  ) => Promise<void>;
  createOrganizationMember: (
    dealId: number,
    user: Partial<User>,
    type: MembershipType
  ) => Promise<void>;
  updateOrganizationMember: (user: Partial<User>) => Promise<void>;
  createVerifier: (
    verifierData: AccreditationVerifierCreateSchema
  ) => Promise<void>;
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
  const [deal, setDeal] = useState<DealWithInvestmentStats | null>(null);
  const [user, setUser] = useState<UserWithAddress | null>(null);
  const [organization, setOrganization] =
    useState<OrganizationWithFullMembers | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [step, setStep] = useState<StepType>(initialStep);
  const router = useRouter();

  const getNextStep = (currentStep: StepType): StepType | null => {
    const currentIndex = steps.findIndex((s) => s.value === currentStep);

    const nextStep = steps[currentIndex + 1]?.value ?? null;

    //Note: NEXT STEP DEPENDS ON ANSWER
    if (currentStep === "details-ownership-type") {
      const ownershipType = deal?.investmentStats?.ownershipType;

      if (!ownershipType) {
        return "verify-accreditation";
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

      if (coInvestorTypes.some((type) => type === ownershipType)) {
        return "co-investor";
      }

      if (entityDetailsTypes.some((type) => type === ownershipType)) {
        return "entity-details";
      }

      return "verify-accreditation";
    }

    return nextStep;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [dealResponse, userResponse] = await Promise.all([
          fetch(
            `/api/deals/flow?projectSlug=${encodeURIComponent(
              projectSlug
            )}&dealId=${encodeURIComponent(dealId)}`
          ),
          fetch("/api/users"),
        ]);

        if (!dealResponse.ok || !userResponse.ok) {
          throw new Error(
            `HTTP error! status: ${dealResponse.status} ${userResponse.status}`
          );
        }

        const dealData: {
          project: Project;
          deal: DealWithInvestmentStats | null;
        } = await dealResponse.json();
        const userData: UserWithAddress = await userResponse.json();

        setProject(dealData.project as ProjectWithAllNestedData);
        setDeal(dealData.deal);
        setUser(userData);

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
          setOrganization(organizationData as OrganizationWithFullMembers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [projectSlug, dealId]);

  const updateDeal = async (
    updatedDealData: Partial<DealWithInvestmentStats>
  ) => {
    if (!deal) return;
    setIsLoading(true);

    const updatedDeal = {
      ...deal,
      ...updatedDealData,
    };

    try {
      const { data } = await axios.put<DealWithInvestmentStats>(
        `/api/deals`,
        updatedDeal
      );
      setDeal(data);

      const nextStep = getNextStep(step);
      if (nextStep) {
        router.push(`/dealflow/${projectSlug}/${dealId}/${nextStep}`);
      }
      toast.success("Deal updated successfully");
    } catch (error) {
      console.error("Error updating deal:", error);
      setError("Failed to update deal. Please try again.");
      toast.error("Failed to update deal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createDeal = async () => {
    if (!project) return;
    setIsLoading(true);

    const dealCreateData = {
      financingType: DealFinancingType.equity,
      projectId: project.id,
    };

    try {
      const { data } = await axios.post<{ id: string }>(
        "/api/deals",
        dealCreateData
      );
      const nextStep = getNextStep(step);
      if (nextStep) {
        router.push(`/dealflow/${project.slug}/${data.id}/${nextStep}`);
      }
      toast.success("Deal created successfully");
    } catch (error) {
      console.error("Error creating deal:", error);
      setError("Failed to create deal. Please try again.");
      toast.error("Failed to create deal. Please try again.");
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
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
      toast.error("Failed to update user. Please try again.");
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
        "/api/organizations",
        organizationData
      );
      setOrganization(data as OrganizationWithFullMembers);

      if (!deal) {
        throw new Error("Deal not found");
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
      console.error("Error creating organization:", error);
      setError("Failed to create organization. Please try again.");
      toast.error("Failed to create organization. Please try again.");
    } finally {
      setIsLoading(false);
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
      setOrganization(data as OrganizationWithFullMembers);

      const nextStep = getNextStep(step);
      if (nextStep) {
        router.push(`/dealflow/${projectSlug}/${dealId}/${nextStep}`);
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      setError("Failed to update organization. Please try again.");
      toast.error("Failed to update organization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createOrganizationMember = async (
    dealId: number,
    user: Partial<User>,
    type: MembershipType
  ) => {
    if (!organization) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<OrganizationWithFullMembers>(
        `/api/organizations/${organization.id}/members`,
        { dealId, user, type }
      );
      setOrganization(data);
      toast.success("Co-investor created successfully");
    } catch (error) {
      console.error("Error creating organization member:", error);
      setError("Failed to create organization member. Please try again.");
      toast.error("Failed to create organization member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrganizationMember = async (user: Partial<User>) => {
    if (!user || !organization) return;
    setIsLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.put<UserWithAddress>(
        `/api/users/${user.id}`,
        user
      );
      //Find organization member by userId and update
      const organizationMember = organization?.members.find(
        (member) => member.userId === user.id
      );
      if (organizationMember) {
        organizationMember.user.email = user.email;
        organizationMember.user.phoneNumber = user.phoneNumber;
        organizationMember.user.firstName = user.firstName;
        organizationMember.user.lastName = user.lastName;
      }
      setOrganization(organization);
      toast.success("Co-investor updated successfully");
    } catch (error) {
      console.error("Error updating organization member:", error);
      setError("Failed to update organization member. Please try again.");
      toast.error("Failed to update organization member. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createVerifier = async (
    verifierData: AccreditationVerifierCreateSchema
  ) => {
    if (!deal) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<AccreditationVerifier>(
        "/api/deals/verifier",
        { ...verifierData, dealId: deal.id }
      );

      //Update deal.accreditationVerifierId
      await updateDeal({
        ...deal,
        accreditationVerifierId: data.id,
      });

      toast.success("Accreditation verifier created successfully");
    } catch (error) {
      console.error("Error creating accreditation verifier:", error);
      setError("Failed to create accreditation verifier. Please try again.");
      toast.error("Failed to create accreditation verifier. Please try again.");
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
    isLoading,
    error,
    updateDeal,
    createDeal,
    updateUser,
    createOrganization,
    updateOrganization,
    updateOrganizationMember,
    createOrganizationMember,
    createVerifier,
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
    throw new Error("useDealFlow must be used within a DealFlowProvider");
  }
  return context;
};
