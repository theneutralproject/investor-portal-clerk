/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type DealWithInvestmentStats } from "@/libs/prisma";
import { type Project } from "@prisma/client";
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
  project: Project | null;
  deal: DealWithInvestmentStats | null;
  isLoading: boolean;
  error: string | null;
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

  useEffect(() => {
    if (deal) {
      if (deal.investmentStats?.financingType) {
        setStep("amount");
      } else if (deal.investmentStats?.amount) {
        setStep("details");
      } else {
        setStep("type");
      }
    }
  }, [deal]);

  const contextValue: DealFlowContextType = {
    step,
    projectSlug,
    dealId,
    project,
    deal,
    isLoading,
    error,
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
