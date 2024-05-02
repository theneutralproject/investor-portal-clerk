import React from "react";
import { Box, Card, IconButton, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import LockedIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StepAvatar from "@/components/StepAvatar";

import { theme } from "@/components/Shell/NeutralThemeProvider";
import { type DocumentWithCompletion } from "@/app/hooks/useDocuments";

const DocumentCard = ({
  document,
  dealStage,
  handleViewDocument,
}: {
  document: DocumentWithCompletion;
  dealStage: number;
  handleViewDocument: (documentId: number) => void;
}) => {
  const documentLocked = dealStage < document.dealStage;

  const renderIcon = () => {
    if (document.completed) {
      return <StepAvatar isComplete={true} stepNumber={dealStage} />;
    } else if (documentLocked) {
      return <LockedIcon />;
    } else {
      return <VisibilityIcon />;
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        mb: theme.spacing(2),
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          p: theme.spacing(2),
        }}
      >
        {renderIcon()}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="subtitle2">{document.name}</Typography>
        <Typography variant="caption">{document.fileName}</Typography>
      </Box>
      <Box
        sx={{
          display: documentLocked ? "none" : "flex",
          flexDirection: "column",
          flexGrow: 1,
          alignItems: "flex-end",
          p: theme.spacing(1),
        }}
      >
        <IconButton
          aria-label="download"
          size="large"
          onClick={() => {
            handleViewDocument(document.id);
          }}
        >
          <DownloadIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default DocumentCard;
