/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ProjectWithAllNestedData,
  UserWithAddress,
  type DealWithInvestmentStats,
} from "@/libs/prisma";
import { DealFinancingType, type Project } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";

// Define the step types
export type StepType =
  | "get-started"
  | "type"
  | "amount"
  | "details"
  | "review"
  | "fund";

// Define an interface for the step object
interface Step {
  value: StepType;
  display: string;
}

// Create the steps array with type safety
export const steps: Step[] = [
  { value: "get-started", display: "Get Started" },
  { value: "type", display: "Type" },
  { value: "amount", display: "Amount" },
  { value: "details", display: "Details" },
  { value: "review", display: "Review & Sign" },
  { value: "fund", display: "Fund" },
];

// If you need just the values, you can derive them from the steps array
export const stepValues: StepType[] = steps.map((step) => step.value);

interface DealFlowContextType {
  step: StepType;
  projectSlug: string;
  dealId: string;
  project: ProjectWithAllNestedData | null;
  deal: DealWithInvestmentStats | null;
  user: UserWithAddress | null;
  isLoading: boolean;
  error: string | null;
  updateDeal: (updatedDeal: Partial<DealWithInvestmentStats>) => Promise<void>;
  createDeal: () => Promise<void>;
  updateUser: (updatedUser: Partial<UserWithAddress>) => Promise<void>;
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
  const [project, setProject] = useState<Project | null>(null);
  const [deal, setDeal] = useState<DealWithInvestmentStats | null>(null);
  const [user, setUser] = useState<UserWithAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<StepType>(initialStep);
  const router = useRouter();

  const getNextStep = (currentStep: StepType): StepType | null => {
    const currentIndex = steps.findIndex((s) => s.value === currentStep);
    return steps[currentIndex + 1]?.value ?? null;
  };

  useEffect(() => {
    const fetchData = async () => {
      return;

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

        setProject(dealData.project);
        setDeal(dealData.deal);
        setUser(userData);
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
    } catch (error) {
      console.error("Error updating deal:", error);
      setError("Failed to update deal. Please try again.");
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
    } catch (error) {
      console.error("Error creating deal:", error);
      setError("Failed to create deal. Please try again.");
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

      // Note: We don't navigate to the next step here as it might not be appropriate for all user updates
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: DealFlowContextType = {
    step,
    projectSlug,
    dealId,
    project,
    deal,
    user,
    isLoading,
    error,
    updateDeal,
    createDeal,
    updateUser,
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
