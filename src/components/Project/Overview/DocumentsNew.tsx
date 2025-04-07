import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  CreateAccountButton,
  SignInButton,
} from '@/components/Dashboard/CreateAccount';
import { type ProjectWithStats } from '@/libs/types';
import useDocuments from '@/app/hooks/useDocuments';
import { type DocumentWithCompletion } from '@/app/hooks/useDocuments';
import DocumentCard from '../ProjectDocs/DocumentCard';
import DocumentViewerModal from '../ProjectDocs/DocumentViewerModal';
import { usePostHog } from 'posthog-js/react';
import { DOCUMENTS_NEW_TEST_ID } from 'e2e/testIds';
import {
  captureDocumentDownloadEvent,
  captureDocumentViewEvent,
} from '@/libs/posthog/events';

type ApiError = {
  message: string;
};

const DocumentsNew = ({
  project,
  loggedIn,
}: {
  project: ProjectWithStats;
  loggedIn: boolean;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<
    DocumentWithCompletion | undefined
  >(undefined);

  const posthog = usePostHog();

  const {
    isLoading,
    isError,
    data = [],
    error,
  } = useDocuments(project.id, 1) as {
    isLoading: boolean;
    isError: boolean;
    data: DocumentWithCompletion[];
    error: ApiError | null;
  };

  if (isLoading) return <div>Loading documents...</div>;
  if (isError && error)
    return <div>Error fetching documents: {error.message}</div>;

  const handleViewDocument = (document: DocumentWithCompletion) => {
    captureDocumentViewEvent(posthog, {
      documentId: document.id,
      documentName: document.name,
      projectId: project.id,
      projectName: project.name,
    });
    setCurrentDocument(document);
    setOpenModal(true);
  };

  const handleDownloadDocument = (document: DocumentWithCompletion) => {
    captureDocumentDownloadEvent(posthog, {
      documentId: document.id,
      documentName: document.name,
      projectId: project.id,
      projectName: project.name,
    });
    window.open(document.link, '_blank');
  };

  const handleCloseModal = () => setOpenModal(false);

  return (
    <Card
      sx={{ mt: 2, position: 'relative' }}
      data-testid={DOCUMENTS_NEW_TEST_ID}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          data-testid={`${DOCUMENTS_NEW_TEST_ID}-title`}
        >
          Documents
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />

        {loggedIn ? (
          <DocumentsList
            documents={data}
            handleViewDocument={handleViewDocument}
            handleDownloadDocument={handleDownloadDocument}
            currentDocument={currentDocument}
            openModal={openModal}
            handleCloseModal={handleCloseModal}
          />
        ) : (
          <NonLoggedInView />
        )}
      </CardContent>
    </Card>
  );
};

const DocumentsList = ({
  documents,
  handleViewDocument,
  handleDownloadDocument,
  currentDocument,
  openModal,
  handleCloseModal,
}: {
  documents: DocumentWithCompletion[];
  handleViewDocument: (document: DocumentWithCompletion) => void;
  handleDownloadDocument: (document: DocumentWithCompletion) => void;
  currentDocument: DocumentWithCompletion | undefined;
  openModal: boolean;
  handleCloseModal: () => void;
}) => {
  return (
    <>
      {documents.map((document: DocumentWithCompletion, index: number) => (
        <DocumentCard
          key={index}
          document={document}
          dealStage={55}
          handleViewDocument={handleViewDocument}
          handleDownloadDocument={handleDownloadDocument}
          data-testid={`${DOCUMENTS_NEW_TEST_ID}-document-card`}
        />
      ))}
      {currentDocument?.link && (
        <DocumentViewerModal
          open={openModal}
          onClose={handleCloseModal}
          fileUrl={currentDocument.link}
          data-testid={`${DOCUMENTS_NEW_TEST_ID}-document-viewer-modal`}
        />
      )}
    </>
  );
};

const NonLoggedInView = () => {
  return (
    <>
      <SkeletonDocuments />
      <LoginOverlay />
    </>
  );
};

const SkeletonDocuments = () => {
  return (
    <>
      {[1, 2, 3, 4].map((_, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            opacity: 0.6,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton
              variant="rectangular"
              width={40}
              height={40}
              sx={{ borderRadius: 1 }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              sx={{ borderRadius: 1 }}
            />
          </Box>
          <Skeleton variant="rectangular" height={2} />
        </Box>
      ))}
    </>
  );
};

const LoginOverlay = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(4px)',
        borderRadius: '8px',
      }}
      data-testid={`${DOCUMENTS_NEW_TEST_ID}-create-account`}
    >
      <Stack spacing={3} alignItems="center" maxWidth="600px" p={4}>
        <Typography variant="body1" align="center" fontWeight="500">
          Create an account
        </Typography>
        <Typography variant="subtitle2" align="center" color="text.secondary">
          Create an account or sign in to view documents such as Market Study,
          Tax Analysis, and Investment Deck.
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <div data-testid={`${DOCUMENTS_NEW_TEST_ID}-sign-up`}>
            <CreateAccountButton
              variant="neutralYellow"
              data-testid={`${DOCUMENTS_NEW_TEST_ID}-sign-up-btn`}
            />
          </div>
          <div data-testid={`${DOCUMENTS_NEW_TEST_ID}-sign-in`}>
            <SignInButton
              variant="text"
              data-testid={`${DOCUMENTS_NEW_TEST_ID}-sign-in-btn`}
            />
          </div>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DocumentsNew;
