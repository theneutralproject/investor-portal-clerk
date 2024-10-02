import React, { createContext, useState, useContext } from "react";

interface DealFlowContextType {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const DealFlowContext = createContext<DealFlowContextType | undefined>(undefined);

export const DealFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);

  return (
    <DealFlowContext.Provider value={{ step, setStep }}>
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