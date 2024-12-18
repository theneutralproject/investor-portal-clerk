import React from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import { type DocumentWithCompletion } from "@/app/hooks/useDocuments";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const DocumentCard = ({
  document,
  dealStage,
  handleViewDocument,
  handleDownloadDocument,
  handleSignDocument,
}: {
  document: DocumentWithCompletion;
  dealStage: number;
  handleViewDocument: (document: DocumentWithCompletion) => void;
  handleDownloadDocument: (document: DocumentWithCompletion) => void;
  handleSignDocument?: (document: DocumentWithCompletion) => void;
}) => {
  const DOCUSIGN_FLAG = false;

  const documentLocked = dealStage < document.dealStage;

  // const renderIcon = () => {
  //   if (document.completed) {
  //     return <CheckBoxIcon sx={{ color: "#626f52" }} />;
  //   } else if (documentLocked) {
  //     return <LockedIcon />;
  //   } else {
  //     return <CheckBoxOutlineBlankIcon />;
  //   }
  // };

  if (document.link.includes("youtube")) {
    const id = document.link.split("v=")[1];

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2">
            Project Document Walk-through
          </Typography>
          <Typography variant="caption">
            In this video our team will review each of the project documents
            below, what they mean, and answer common questions.
          </Typography>
          <LiteYouTubeEmbed id={id!} title={document.name} />
        </CardContent>
      </Card>
    );
  }

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
          p: theme.spacing(1),
        }}
      >
        {/* {renderIcon()} */}
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
          ml: "auto", // Moves the icons to the right
          display: documentLocked ? "none" : "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          p: theme.spacing(1),
        }}
      >
        <IconButton
          aria-label="view document"
          size="large"
          onClick={() => {
            handleViewDocument(document);
          }}
        >
          <VisibilityIcon />
        </IconButton>
        {!document?.link?.toUpperCase().includes("DOCUSIGN") && (
          <IconButton
            aria-label="download document"
            size="large"
            onClick={() => {
              handleDownloadDocument(document);
            }}
          >
            <DownloadIcon />
          </IconButton>
        )}
        {DOCUSIGN_FLAG &&
          document?.link?.toUpperCase().includes("DOCUSIGN") && (
            <Tooltip title="Launch Docusign" placement="bottom">
              <IconButton
                aria-label="sign document"
                size="large"
                onClick={() => {
                  handleSignDocument && handleSignDocument(document);
                }}
              >
                <BorderColorIcon />
              </IconButton>
            </Tooltip>
          )}
      </Box>
    </Card>
  );
};

export default DocumentCard;
