import React, { useState } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import type { ProjectWithStats } from "@/libs/types";
import useDocuments from "@/app/hooks/useDocuments";
import { type DocumentWithCompletion } from "@/app/hooks/useDocuments";
import DocumentCard from "../ProjectDocs/DocumentCard";
import DocumentViewerModal from "../ProjectDocs/DocumentViewerModal";

// Define a proper error type
type ApiError = {
  message: string;
};

const DocumentsNew = ({ project }: { project: ProjectWithStats }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<
    DocumentWithCompletion | undefined
  >(undefined);

  const {
    isLoading,
    isError,
    data = [], // Provide default value
    error,
  } = useDocuments(project.id) as {
    isLoading: boolean;
    isError: boolean;
    data: DocumentWithCompletion[];
    error: ApiError | null;
  };

  if (isLoading) return <div>Loading documents...</div>;
  if (isError && error)
    return <div>Error fetching documents: {error.message}</div>;

  const handleViewDocument = (document: DocumentWithCompletion) => {
    setCurrentDocument(document);
    setOpenModal(true);
  };

  const handleDownloadDocument = (document: DocumentWithCompletion) => {
    window.open(document.link, "_blank");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
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
          />
        ))}
        {currentDocument?.link && (
          <DocumentViewerModal
            open={openModal}
            onClose={handleCloseModal}
            fileUrl={currentDocument.link}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsNew;
