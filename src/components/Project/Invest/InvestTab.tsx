/* eslint-disable */
import React, { useState } from "react";
import { Modal, Box, Typography, Card, CardContent } from "@mui/material";
import DocumentCard from "../ProjectDocs/DocumentCard";
import useDocuments, {
  type DocumentWithCompletion,
} from "@/app/hooks/useDocuments";
import { Deal, type Project } from "@prisma/client";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import DocumentViewerModal from "../ProjectDocs/DocumentViewerModal";
import axios from "axios";

export const InvestTab: React.FC<{ project: Project; deal: Deal }> = ({
  project,
  deal,
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
  } = useDocuments(project.id, 2, deal.financingType!);

  const [modelOpenType, setModelOpenType] = useState("");
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentWithCompletion | null>(null);

  const handleViewDocument = (document: DocumentWithCompletion) => {
    setSelectedDocument(document);

    if (document?.link.includes("docusign.")) {
      setModelOpenType("DOCUSIGN");
    } else {
      setModelOpenType("DOCUMENT");
    }
  };

  const handleDownloadDocument = (document: DocumentWithCompletion) => {
    if (!document?.completed) {
      documentEventMutation.mutate({
        documentId: document?.id,
        type: "DOWNLOAD",
      });
      const documentNames = data.filter(doc => doc.completed).map(doc => doc.name).toString();
      const body = { hubspotDealId: deal.hubspotId, dealStage: 2, documentNames };
      axios.put('/api/deals', body);
    }
    window.open(document.link, "_blank");
  };

  const handleCloseModal = () => {
    setModelOpenType("");
    if (selectedDocument != null) {
      documentEventMutation.mutate({
        documentId: selectedDocument.id,
        type: "VIEW",
      });
      const documentNames = data.filter(doc => doc.completed).map(doc => doc.name).toString();
      const body = { hubspotDealId: deal.hubspotId, dealStage: 2, documentNames };
      axios.put('/api/deals', body);
    }
  };

  if (isLoading) return <div>Loading documents...</div>;
  if (isError) return <div>Error fetching documents: {error?.message}</div>;

  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        <Typography variant="h6">
          Review and Sign Investment Agreements
        </Typography>
        <Typography variant="caption">
          Please review these Investment Documents. The files starting with
          'Docusign:' will be emailed to you for your e-signature, but we also
          list them here in case you want a sneak peek.
        </Typography>

        {data.map((document: DocumentWithCompletion, index) => (
          <DocumentCard
            key={index}
            document={document}
            dealStage={deal.dealStage}
            handleViewDocument={handleViewDocument}
            handleDownloadDocument={handleDownloadDocument}
          />
        ))}

        <DocumentViewerModal
          open={modelOpenType === "DOCUMENT"}
          onClose={handleCloseModal}
          fileUrl={selectedDocument?.link ?? ""}
        />
        <Modal
          open={modelOpenType === "DOCUSIGN"}
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
