/* eslint-disable */
import React, { useState } from "react";
import { Modal, Box, Typography, Card, CardContent } from "@mui/material";
import DocumentCard from "../ProjectDocs/DocumentCard";
import useDocuments, {
  type DocumentWithCompletion,
} from "@/app/hooks/useDocuments";
import useIncrementDealMutation from "@/app/hooks/useIncrementDealMutation";
import { type Project } from "@prisma/client";
import { theme } from "@/components/Shell/NeutralThemeProvider";

export const InvestTab: React.FC<{ project: Project; dealStage: number }> = ({
  project,
  dealStage,
}) => {
  const {
    isLoading,
    isError,
    data,
    error,
    documentEventMutation,
  }: {
    isLoading: boolean;
    isError: boolean;
    data: DocumentWithCompletion[];
    error: any;
    documentEventMutation: any;
  } = useDocuments(project.id, 2);

  const { mutate: mutateDeal } = useIncrementDealMutation(project.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );

  const handleViewDocument = (documentId: number) => {
    setSelectedDocumentId(documentId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (selectedDocumentId != null) {
      documentEventMutation.mutate({
        documentId: selectedDocumentId,
        type: "VIEW",
      });

      // Check if all documents are viewed
      if (data.every((doc) => doc.completed || doc.id === selectedDocumentId)) {
        mutateDeal("increment");
      }
    }
  };

  if (isLoading) return <div>Loading documents...</div>;
  if (isError) return <div>Error fetching documents: {error?.message}</div>;

  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        <Typography variant="h6">Sign Investment Agreements</Typography>
        <Typography variant="caption">
          Placeholder description about what this process is and how it works.
        </Typography>

        {data.map((document: DocumentWithCompletion, index) => (
          <DocumentCard
            key={index}
            document={document}
            dealStage={dealStage}
            handleViewDocument={handleViewDocument}
          />
        ))}

        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 800,
              bgcolor: "background.paper",
              border: "2px solid #000",
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Document Viewer
            </Typography>
            <iframe
              src={`https://us.services.docusign.net/webforms-ux/v1.0/forms/ffe2f07796e0e2040fddce114b3d9b04`}
              style={{ width: "100%", height: "800px" }}
            ></iframe>
          </Box>
        </Modal>
      </CardContent>
    </Card>
  );
};
