import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DealOwnershipType } from "@prisma/client";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";

const DealFlowReview: React.FC = () => {
  const { deal, updateDeal, createOrganization, project } = useDealFlow();
  const [ownershipType, setOwnershipType] = useState<DealOwnershipType>(
    deal?.investmentStats?.ownershipType ?? DealOwnershipType.INDIVIDUAL
  );

  console.log(project);

  //First project.document that contains "docusign" in the fileName
  const docusign = project?.documents?.find((doc) =>
    doc.fileName.toLowerCase().includes("docusign")
  );
  console.log(docusign);
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Review & Sign Documents
      </Typography>

      <Button variant="contained" sx={{ mt: 2 }}>
        Sign
      </Button>

      {/* <DealFlowFooter onBack={() => null} onContinue={handleUpdateDeal} /> */}
    </Box>
  );
};

export default DealFlowReview;
