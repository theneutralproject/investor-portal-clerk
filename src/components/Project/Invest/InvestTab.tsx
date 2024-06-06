/* eslint-disable */
import React, { use, useState } from "react";
import { Modal, Box, Typography, Card, CardContent, Button } from "@mui/material";
import DocumentCard from "../ProjectDocs/DocumentCard";
import useDocuments, {
  type DocumentWithCompletion,
} from "@/app/hooks/useDocuments";
import { Deal, type Project } from "@prisma/client";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import DocumentViewerModal from "../ProjectDocs/DocumentViewerModal";
import { useUser } from "@clerk/nextjs";
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

const SHOWDOCUSIGNBUTTON = false;

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
        type: "VIEW",
      });
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
    }
  };


  const { user } = useUser();
  let renderCTA = () => <Box></Box>;
  let renderDocuSignExperimentalButton = () => {
    if (SHOWDOCUSIGNBUTTON) {
      return (<Button
        variant="neutralBlack"
        fullWidth
        onClick={() => createDocusignEnvelope()}
      >
        Launch Docusign
      </Button>)
    }
  }
  const createDocusignEnvelope = async () => {
    const url = `/api/docusign`;
    if (!user) {

    } else {


      const { firstName, fullName, lastName, primaryEmailAddress, id } = user;
      const body = { user: { id, firstName, lastName, fullName, email: primaryEmailAddress?.emailAddress }, amount: deal.amount };
      const docusignResponse = await axios.post(url, body).catch((error) => {
        if (error.response) {
          console.log("\n\n\nDOCUSIGN AXIOS NOT HAPPY:", error.response)
        }
      })
      if (docusignResponse?.data?.consentUrl) {
        console.log("must authenticate using consentUrl")
        window.location.assign(docusignResponse.data.consentUrl)
      }

      if (docusignResponse?.data?.url) {
        window.location.assign(docusignResponse.data.url)
      }
    }
  }

  if (isLoading) return <div>Loading documents...</div>;
  if (isError) return <div>Error fetching documents: {error?.message}</div>;

  return (
    <Box>
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
      {renderDocuSignExperimentalButton()}
      {renderCTA()}
    </Box>
  );
};
