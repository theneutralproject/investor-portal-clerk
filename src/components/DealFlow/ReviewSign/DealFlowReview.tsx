import React from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  List,
  ListItem,
  Stack,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import { useUser } from "@clerk/nextjs";
import { createDocusignEnvelope } from "@/components/Project/Invest/InvestTab";

interface DocumentItemProps {
  title: string;
  fileName: string;
  status: "SIGNED" | "PENDING";
  onSign?: () => void;
  index: number;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  title,
  fileName,
  status,
  onSign,
  index,
}) => {
  return (
    <ListItem
      disableGutters
      sx={{
        py: 2,
        px: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      {status === "SIGNED" ? (
        <CheckCircleIcon
          sx={{
            color: "success.main",
            width: 24,
            height: 24,
          }}
        />
      ) : (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            typography: "body2",
            color: "text.secondary",
          }}
        >
          {index}
        </Box>
      )}
      <Stack direction="column" spacing={0.5} flex={1}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {fileName}
        </Typography>
      </Stack>
      {status === "SIGNED" ? (
        <Typography variant="body2">Signed</Typography>
      ) : (
        <Button variant="neutralBlack" onClick={onSign}>
          REVIEW & SIGN
        </Button>
      )}
    </ListItem>
  );
};

const DealFlowReview: React.FC = () => {
  const { project, deal } = useDealFlow();
  const { user } = useUser();

  // Filter only DOCUSIGN type documents
  const docusignDocuments =
    project?.documents?.filter((doc) => doc.documentType === "DOCUSIGN") || [];

  const handleSignDocument = (templateId: string) => {
    if (templateId && deal?.id) {
      void createDocusignEnvelope(templateId, deal.id, user);
    }
  };

  // Get the document events or status - This would need to be implemented based on your data structure
  const getDocumentStatus = (documentId: number): "SIGNED" | "PENDING" => {
    // Implement your logic to check if the document is signed
    // This could be checking documentEvents or other data
    //Randomly return signed for now
    return Math.random() > 0.5 ? "SIGNED" : "PENDING";
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Review & Sign Documents
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Once signed, our team will review and countersign these documents to
        finalize your investment.
      </Typography>

      <Card variant="outlined">
        <List disablePadding>
          {docusignDocuments.map((doc, index) => (
            <DocumentItem
              key={doc.id}
              title={doc.name}
              fileName={doc.fileName}
              status={getDocumentStatus(doc.id)}
              onSign={() =>
                doc.docusignTemplateId &&
                handleSignDocument(doc.docusignTemplateId)
              }
              index={index + 1}
            />
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default DealFlowReview;
