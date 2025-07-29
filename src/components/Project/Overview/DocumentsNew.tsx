import React, { useState } from 'react';
import { Card, CardContent, Divider, Typography } from '@mui/material';
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

        <DocumentsList
          documents={data}
          handleViewDocument={handleViewDocument}
          handleDownloadDocument={handleDownloadDocument}
          currentDocument={currentDocument}
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          loggedIn={loggedIn}
        />
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
  loggedIn,
}: {
  documents: DocumentWithCompletion[];
  handleViewDocument: (document: DocumentWithCompletion) => void;
  handleDownloadDocument: (document: DocumentWithCompletion) => void;
  currentDocument: DocumentWithCompletion | undefined;
  openModal: boolean;
  handleCloseModal: () => void;
  loggedIn: boolean;
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
          loggedIn={loggedIn}
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

export default DocumentsNew;
