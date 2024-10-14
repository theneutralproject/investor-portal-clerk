import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { DealCreateSchema, DealUpdateSchema } from "@/libs/deal/schema";
import { DealFinancingType } from "@prisma/client";
import axios from "axios";
import { useDealFlow } from "./DealFlowContext";
import { useRouter } from "next/navigation";

interface DealFlowTypeProps {
  onBack: () => void;
  onContinue: () => void;
}

const DealFlowType: React.FC<DealFlowTypeProps> = ({ onBack, onContinue }) => {
  const { project, deal } = useDealFlow();
  const [isLoading, setIsLoading] = useState(false);
  const [financingType, setFinancingType] = useState<DealFinancingType>(
    DealFinancingType.equity
  );

  const handleFinancingTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFinancingType(event.target.value as DealFinancingType);
  };

  const updateDeal = async () => {
    if (!deal) return;
    setIsLoading(true);

    const updatedDeal: DealUpdateSchema = {
      ...deal,
      investmentStats: {
        ...deal.investmentStats,
        financingType: financingType,
      },
    };

    try {
      const { data } = await axios.put<DealUpdateSchema>(
        `/api/deals`,
        updatedDeal
      );
      onContinue();
    } catch (error) {
      console.error("Error updating deal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Get Started
      </Typography>
      <Typography variant="body1" paragraph>
        Select the financing type for this deal.
      </Typography>
      <RadioGroup
        aria-label="financing-type"
        name="financing-type"
        value={financingType}
        onChange={handleFinancingTypeChange}
      >
        {Object.values(DealFinancingType).map((type) => (
          <FormControlLabel
            key={type}
            value={type}
            control={<Radio />}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
          />
        ))}
      </RadioGroup>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button variant="contained" onClick={updateDeal} disabled={isLoading}>
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default DealFlowType;
