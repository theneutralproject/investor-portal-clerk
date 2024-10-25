import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import { useUser } from "@clerk/nextjs";
import { createDocusignEnvelope } from "@/components/Project/Invest/InvestTab";
const DealFlowReview: React.FC = () => {
  const { project, deal } = useDealFlow();
  const { user } = useUser();

  const docusign = project?.documents?.find(
    (doc) => doc.documentType === "DOCUSIGN"
  );

  const handleSignDocument = () => {
    if (docusign?.docusignTemplateId && deal?.id) {
      void createDocusignEnvelope(docusign.docusignTemplateId, deal.id, user);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Review & Sign Documents
      </Typography>

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSignDocument}>
        Sign
      </Button>

      {/* <DealFlowFooter onBack={() => null} onContinue={handleUpdateDeal} /> */}
    </Box>
  );
};

export default DealFlowReview;
