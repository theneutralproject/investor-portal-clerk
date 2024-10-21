/* eslint-disable */
import React, { use, useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import DocumentCard from "../ProjectDocs/DocumentCard";
import useDocuments, {
  type DocumentWithCompletion,
} from "@/app/hooks/useDocuments";
import { DocumentType, type Project } from "@prisma/client";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import DocumentViewerModal from "../ProjectDocs/DocumentViewerModal";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { updateHubspotDealDocsAccessed } from "@/libs/hubspot/utils";
import type { DocusignEnvelopeSchema } from "@/libs/docusign/schema";
import { DealWithInvestmentStats } from "@/libs/prisma";

export const InvestTab: React.FC<{ project: Project; deal: DealWithInvestmentStats }> = ({
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
  } = useDocuments(project.id, 2, deal.investmentStats.financingType);


  // Hubspot can only process 1 webhook request per minute. 
  // In case the user accesses several docs in a short amount of time, we debounce the request for 75 sec
  const updateHubspotDealDocs = useDebounce(updateHubspotDealDocsAccessed, 75000)

  const [modelOpenType, setModelOpenType] = useState("");
  const [currentDocument, setCurrentDocument] =
    useState<DocumentWithCompletion | null>(null);

  const handleViewDocument = (document: DocumentWithCompletion) => {
    setCurrentDocument(document);
      setModelOpenType("DOCUMENT");
  };

  const handleSignDocument = (document: DocumentWithCompletion) => {
    setCurrentDocument(document);

    if (document?.documentType === DocumentType.DOCUSIGN && document.docusignTemplateId) {
      createDocusignEnvelope(document.docusignTemplateId);
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
      const documentNames = [...[document], ...data.filter(doc => doc.completed)].map(doc => doc.name).toString();
      updateHubspotDealDocs({ dealId: parseInt(deal.hubspotId, 10), dealStage: 2, documentNames: documentNames });
    }
    window.open(document.link, "_blank");
  };

  const handleCloseModal = () => {
    setModelOpenType("");
    if (currentDocument != null) {
      documentEventMutation.mutate({
        documentId: currentDocument.id,
        type: "VIEW",
      });

      // add current doc to list of already read docs and notify hubspot webhook about this event
      const documentNames = [...[currentDocument], ...data.filter(doc => doc.completed)].map(doc => doc?.name).toString();
      updateHubspotDealDocs({ dealId: parseInt(deal.hubspotId, 10), dealStage: 2, documentNames: documentNames });
    }
  };


  const { user } = useUser();
  let renderCTA = () => <Box></Box>;

  const createDocusignEnvelope = async (envelopeId: string) => {
    const url = `/api/docusign`;
    if (!user) {
      console.log("!user")
    } else {

      const body: DocusignEnvelopeSchema = {
        amount: deal.investmentStats.amount,
        envelopeId: envelopeId,
        clerkUserId: user.id,
        projectId: project.id
      };
      
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
              handleSignDocument={handleSignDocument}
            />
          ))}

          <DocumentViewerModal
            open={modelOpenType === "DOCUMENT"}
            onClose={handleCloseModal}
            fileUrl={currentDocument?.link ?? ""}
          />
        </CardContent>
      </Card>
      {renderCTA()}
    </Box>
  );
};
