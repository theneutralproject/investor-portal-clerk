import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useClerk } from '@clerk/nextjs';

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { theme } from '@/components/Shell/NeutralThemeProvider';
import { type DocumentWithCompletion } from '@/app/hooks/useDocuments';

const DocumentCard = ({
  document,
  dealStage,
  loggedIn,
  handleViewDocument,
  handleDownloadDocument,
}: {
  document: DocumentWithCompletion;
  dealStage: number;
  loggedIn: boolean;
  handleViewDocument: (document: DocumentWithCompletion) => void;
  handleDownloadDocument: (document: DocumentWithCompletion) => void;
  handleCloseNDAModal: () => void;
  handleSignDocument?: (document: DocumentWithCompletion) => void;
}) => {
  const { openSignIn } = useClerk();
  const documentLocked = dealStage < document.dealStage;
  const requiresLogin = !document.isPublic && !loggedIn;

  const handleSignIn = () => openSignIn();

  // const renderIcon = () => {
  //   if (document.completed) {
  //     return <CheckBoxIcon sx={{ color: "#626f52" }} />;
  //   } else if (documentLocked) {
  //     return <LockedIcon />;
  //   } else {
  //     return <CheckBoxOutlineBlankIcon />;
  //   }
  // };

  if (document.link.includes('youtube')) {
    const id = document.link.split('v=')[1];

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
        display: 'flex',
        mb: theme.spacing(2),
        alignItems: 'center',
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="subtitle2">{document.name}</Typography>
        <Typography variant="caption">{document.fileName}</Typography>
      </Box>
      <Box
        sx={{
          ml: 'auto', // Moves the icons to the right
          display: documentLocked ? 'none' : 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          p: theme.spacing(1),
        }}
      >
        {requiresLogin && (
          <Chip
            label="Sign In to View"
            onClick={handleSignIn}
            sx={{ marginBottom: '7px' }}
          />
        )}
        <IconButton
          aria-label="view document"
          size="large"
          onClick={() => {
            handleViewDocument(document);
          }}
          disabled={requiresLogin}
        >
          <VisibilityIcon />
        </IconButton>
        {!document?.link?.toUpperCase().includes('DOCUSIGN') && (
          <IconButton
            aria-label="download document"
            size="large"
            disabled={requiresLogin}
            onClick={() => {
              handleDownloadDocument(document);
            }}
          >
            <DownloadIcon />
          </IconButton>
        )}
      </Box>
    </Card>
  );
};

export default DocumentCard;
