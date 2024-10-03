/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Deal, type Project } from "@prisma/client";
import React, { createContext, useState, useContext, useEffect } from "react";

interface DealFlowContextType {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  projectSlug: string;
  dealId: string;
  project: Project | null;
  deal: Deal | null;
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
}

export const DealFlowProvider: React.FC<DealFlowProviderProps> = ({
  children,
  projectSlug,
  dealId,
}) => {
  const [step, setStep] = useState(1);
  const [project, setProject] = useState<Project | null>(null);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const data: { project: Project; deal: Deal | null } =
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

  const contextValue: DealFlowContextType = {
    step,
    setStep,
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
