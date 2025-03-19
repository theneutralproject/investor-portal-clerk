import React, { useState } from 'react';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import { POSTHOG_EVENTS, type ProjectWithStats } from '@/libs/types';
import useDocuments from '@/app/hooks/useDocuments';
import { type DocumentWithCompletion } from '@/app/hooks/useDocuments';
import DocumentCard from '../ProjectDocs/DocumentCard';
import DocumentViewerModal from '../ProjectDocs/DocumentViewerModal';
import { usePostHog } from 'posthog-js/react';
import { DOCUMENTS_NEW_TEST_ID } from 'e2e/testIds';

// Define a proper error type
type ApiError = {
  message: string;
};

const DocumentsNew = ({ project }: { project: ProjectWithStats }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<
    DocumentWithCompletion | undefined
  >(undefined);

  const posthog = usePostHog();

  const {
    isLoading,
    isError,
    data = [], // Provide default value
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
    posthog.capture(POSTHOG_EVENTS.DOCUMENT_VIEWED, {
      document_id: document.id,
      document_name: document.name,
      project_id: project.id,
      project_name: project.name,
    });
    setCurrentDocument(document);
    setOpenModal(true);
  };

  const handleDownloadDocument = (document: DocumentWithCompletion) => {
    posthog.capture(POSTHOG_EVENTS.DOCUMENT_DOWNLOADED, {
      document_id: document.id,
      document_name: document.name,
      project_id: project.id,
      project_name: project.name,
    });
    window.open(document.link, '_blank');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Card sx={{ mt: 2 }} data-testid={DOCUMENTS_NEW_TEST_ID}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          data-testid={`${DOCUMENTS_NEW_TEST_ID}-title`}
        >
          Documents
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />
        {data.map((document, index) => (
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
      </CardContent>
    </Card>
  );
};

export default DocumentsNew;
