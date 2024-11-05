import React from "react";
import { Box, Button } from "@mui/material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";

interface DealFlowFooterProps {
  onBack: () => void;
  onContinue: () => void;
  isContinueDisabled?: boolean;
}

const DealFlowFooter: React.FC<DealFlowFooterProps> = ({
  onBack,
  onContinue,
  isContinueDisabled = false,
}) => {
  const { isLoading } = useDealFlow();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      <Button variant="contained" onClick={onBack} disabled={true}>
        Back
      </Button>
      <Button
        variant="contained"
        onClick={onContinue}
        disabled={isLoading || isContinueDisabled}
        sx={{
          backgroundColor: "#f0b84a",
          color: "white",
          boxShadow: 0,
          borderRadius: "25px",
          padding: "8px 25px",
          textTransform: "uppercase",
          "&:hover": {
            backgroundColor: "#e0a83a",
          },
        }}
      >
        Continue
      </Button>
    </Box>
  );
};

export default DealFlowFooter;
