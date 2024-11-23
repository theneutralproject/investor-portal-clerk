import React from "react";
import { Box, Typography } from "@mui/material";
import DealFlowDocumentUpload from "@/components/DealFlow/Shared/DealFlowDocumentUpload";
import { DealDocumentType } from "@prisma/client";

interface UploadDocumentContentProps {
  accreditationType: string;
}

const UploadDocumentContent: React.FC<UploadDocumentContentProps> = ({
  accreditationType,
}) => {
  let uploadInstructions = "";
  let documentList: string[] = [];
  const dealDocumentType: DealDocumentType =
    DealDocumentType.VERIFICATION_ACCREDITATION;

  if (accreditationType?.includes("income")) {
    uploadInstructions =
      "Upload one of the following documents for each of the last two years to verify accreditation:";
    documentList = ["K1", "W2", "1099", "1040"];
  } else if (accreditationType?.includes("net worth")) {
    uploadInstructions = "Upload one of the following to verify accreditation:";
    documentList = [
      "Bank statement",
      "Brokerage statement",
      "Certificate of deposit",
    ];
  } else if (accreditationType?.includes("professional license")) {
    uploadInstructions =
      "Upload documents to prove you hold a license and are in good standing.";
  }

  return (
    <Box>
      <Typography variant="body2" gutterBottom>
        {uploadInstructions}
      </Typography>
      {documentList.map((doc, index) => (
        <Typography key={index} variant="body2" component="li">
          {doc}
        </Typography>
      ))}
      {(accreditationType?.includes("income") ||
        accreditationType?.includes("net worth")) && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Documents must show proof of{" "}
          {accreditationType?.includes("income")
            ? "income over $200,000 (individually) or $300,000 (with spouse or partner) in each of the prior two years, and reasonably expects the same for the current year."
            : "net worth over $1 million, excluding primary residence (individually or with spouse or partner)."}
        </Typography>
      )}

      <DealFlowDocumentUpload
        type="deal"
        documents={[
          {
            display: "Verification Accreditation",
            key: "VERIFICATION_ACCREDITATION",
          },
        ]}
        dealDocumentType={dealDocumentType}
      />
    </Box>
  );
};

export default UploadDocumentContent;
