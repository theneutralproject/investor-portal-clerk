import React, { createContext, useState, useContext } from "react";

const DealFlowContext = createContext();

export const DealFlowProvider = ({ children }) => {
  const [step, setStep] = useState(1);

  return (
    <DealFlowContext.Provider value={{ step, setStep }}>
      {children}
    </DealFlowContext.Provider>
  );
};

export const useDealFlow = () => useContext(DealFlowContext);
