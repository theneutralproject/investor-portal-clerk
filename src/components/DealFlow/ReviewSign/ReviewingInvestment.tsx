import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import DealFlowTitle from "@components/DealFlow/Shared/DealFlowTitle";

const ReviewingInvestment: React.FC = () => {
  const router = useRouter();

  return (
    <Box sx={{ p: 3 }}>
      <DealFlowTitle title="We're Reviewing Your Documents" />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        You&apos;ll hear from our team shortly about transferring the funds.
        After that, we&apos;ll keep you posted regularly about construction
        progress, investment updates, and more.
      </Typography>

      <Button variant="neutralBlack" onClick={() => router.push("/projects")}>
        Back to Projects
      </Button>
    </Box>
  );
};

export default ReviewingInvestment;
