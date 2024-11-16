/* eslint-disable */
import { CardContent, Card } from "@mui/material";
import { theme } from "../../Shell/NeutralThemeProvider";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Deal, type Project } from "@prisma/client";
import DocumentCard from "./DocumentCard";
import useDocuments, {
  type DocumentWithCompletion,
} from "@/app/hooks/useDocuments";
import DocumentViewerModal from "./DocumentViewerModal";
import { useState } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";
import { updateHubspotDealDocsAccessed } from "@/libs/hubspot/utils";
import { DealWithInvestmentStats } from "@/libs/types";

export const ProjectDocTab: React.FC<{
  project: Project;
  deal: DealWithInvestmentStats;
}> = ({ project, deal }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentDocument, setCurrentDocument] =
    useState<DocumentWithCompletion>();

  // Hubspot can only process 1 webhook request per minute.
  // In case the user accesses several docs in a short amount of time, we debounce the request for 75 sec
  const updateHubspotDealDocs = useDebounce(
    updateHubspotDealDocsAccessed,
    75000
  );

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
  } = useDocuments(project.id, 1, deal.investmentStats.financingType);

  if (isLoading) return <div>Loading documents...</div>;
  if (isError) return <div>Error fetching documents: {error.message}</div>;

  const handleViewDocument = (document: DocumentWithCompletion) => {
    setCurrentDocument(document);
    setOpenModal(true);
  };

  const handleDownloadDocument = (document: DocumentWithCompletion) => {
    if (!document?.completed) {
      documentEventMutation.mutate({
        documentId: document?.id,
        type: "DOWNLOAD",
      });
      // add current doc to list of already read docs and notify hubspot webhook about this event
      const documentNames = [
        ...[document],
        ...data.filter((doc) => doc.completed),
      ]
        .map((doc) => doc.name)
        .toString();
      updateHubspotDealDocs({
        dealId: parseInt(deal.hubspotId, 10),
        dealStage: 1,
        documentNames: documentNames,
      });
    }
    window.open(document.link, "_blank");
  };

  const handleCloseModal = () => {
    setOpenModal(false);

    if (!currentDocument?.completed) {
      documentEventMutation.mutate({
        documentId: currentDocument?.id,
        type: "VIEW",
      });

      // add current doc to list of already read docs and notify hubspot webhook about this event
      const documentNames = [
        ...[currentDocument],
        ...data.filter((doc) => doc.completed),
      ]
        .map((doc) => doc?.name)
        .toString();
      updateHubspotDealDocs({
        dealId: parseInt(deal.hubspotId, 10),
        dealStage: 1,
        documentNames: documentNames,
      });
    }
  };

  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        {data.map((document, index) => (
          <DocumentCard
            key={index}
            document={document}
            dealStage={deal.dealStage}
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
