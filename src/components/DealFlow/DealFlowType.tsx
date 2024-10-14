import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  Card,
  CardContent,
} from "@mui/material";
import { DealFinancingType } from "@prisma/client";
import { useDealFlow } from "./DealFlowContext";

interface DealFlowTypeProps {
  onBack: () => void;
  onContinue: () => void;
}

const DealFlowType: React.FC<DealFlowTypeProps> = ({ onBack, onContinue }) => {
  const { deal, updateDeal, isLoading } = useDealFlow();
  const [financingType, setFinancingType] = useState<DealFinancingType>(
    deal?.investmentStats?.financingType ?? DealFinancingType.equity
  );

  const handleFinancingTypeChange = (type: DealFinancingType) => {
    setFinancingType(type);
  };

  const handleUpdateDeal = async () => {
    if (!deal) return;

    await updateDeal(
      {
        ...deal,
        investmentStats: {
          ...deal.investmentStats,
          financingType: financingType,
        },
      },
      () => {
        onContinue();
      }
    );
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
      >
        <Box display="flex" flexDirection="column" gap={2}>
          {Object.values(DealFinancingType).map((type) => (
            <Card
              key={type}
              onClick={() => handleFinancingTypeChange(type)}
              sx={{
                cursor: "pointer",
                border: financingType === type ? "2px solid #1976d2" : "none",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box
                    width={20}
                    height={20}
                    borderRadius="50%"
                    border="2px solid #1976d2"
                    mr={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {financingType === type && (
                      <Box
                        width={12}
                        height={12}
                        borderRadius="50%"
                        bgcolor="#1976d2"
                      />
                    )}
                  </Box>
                  <Typography variant="h6">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Placeholder text for {type} financing type
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </RadioGroup>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdateDeal}
          disabled={isLoading}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default DealFlowType;
