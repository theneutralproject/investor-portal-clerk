/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ProjectWithAllNestedData,
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
  isLoading: boolean;
  error: string | null;
  updateDeal: (
    updatedDeal: Partial<DealWithInvestmentStats>,
    onContinue: () => void
  ) => Promise<void>;
  createDeal: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<StepType>(initialStep);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/deals/flow?projectSlug=${encodeURIComponent(
            projectSlug
          )}&dealId=${encodeURIComponent(dealId)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: { project: Project; deal: DealWithInvestmentStats | null } =
          await response.json();
        setProject(data.project);
        setDeal(data.deal);
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
    updatedDealData: Partial<DealWithInvestmentStats>,
    onContinue: () => void
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
      onContinue();
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
      router.push(`/dealflow/${project?.slug}/${data.id}/type`);
    } catch (error) {
      console.error("Error creating deal:", error);
      setError("Failed to create deal. Please try again.");
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
    isLoading,
    error,
    updateDeal,
    createDeal,
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
