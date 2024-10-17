import React, { useState } from "react";
import { Box, Typography, RadioGroup, Card, CardContent } from "@mui/material";
import { DealOwnershipType } from "@prisma/client";
import { useDealFlow } from "./DealFlowContext";
import DealFlowFooter from "./DealFlowFooter";

const DealFlowDetailsOwnershipType: React.FC = () => {
  const { deal, updateDeal } = useDealFlow();
  const [ownershipType, setOwnershipType] = useState<DealOwnershipType>(
    deal?.investmentStats?.ownershipType ?? DealOwnershipType.INDIVIDUAL
  );

  const handleOwnershipTypeChange = (type: DealOwnershipType) => {
    setOwnershipType(type);
  };

  const handleUpdateDeal = async () => {
    if (!deal) return;

    await updateDeal({
      ...deal,
      investmentStats: {
        ...deal.investmentStats,
        ownershipType: ownershipType,
      },
    });
  };

  const formatOwnershipType = (type: string): string => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Investment Details
      </Typography>
      <Typography variant="body1" paragraph>
        How are you investing?
      </Typography>
      <RadioGroup
        aria-label="ownership-type"
        name="ownership-type"
        value={ownershipType}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          {Object.values(DealOwnershipType).map((type) => (
            <Card
              key={type}
              onClick={() => handleOwnershipTypeChange(type)}
              sx={{
                cursor: "pointer",
                border: ownershipType === type ? "2px solid #1976d2" : "none",
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
                    {ownershipType === type && (
                      <Box
                        width={12}
                        height={12}
                        borderRadius="50%"
                        bgcolor="#1976d2"
                      />
                    )}
                  </Box>
                  <Typography variant="h6">
                    {formatOwnershipType(type)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </RadioGroup>

      <DealFlowFooter onBack={() => null} onContinue={handleUpdateDeal} />
    </Box>
  );
};

export default DealFlowDetailsOwnershipType;
