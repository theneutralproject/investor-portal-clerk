import React from "react";
import { Box, Button } from "@mui/material";
import { useDealFlow } from "./DealFlowContext";

interface DealFlowFooterProps {
  onBack: () => void;
  onContinue: () => void;
}

const DealFlowFooter: React.FC<DealFlowFooterProps> = ({
  onBack,
  onContinue,
}) => {
  const { isLoading } = useDealFlow();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      <Button variant="contained" onClick={onBack} disabled={isLoading}>
        Back
      </Button>
      <Button variant="contained" onClick={onContinue} disabled={isLoading}>
        Continue
      </Button>
    </Box>
  );
};

export default DealFlowFooter;
