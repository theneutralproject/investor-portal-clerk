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
import { updateHubspotDealProperties } from "@/app/api/utils-module/hubspotUtils";

export const ProjectDocTab: React.FC<{
  project: Project;
  deal: Deal;
}> = ({ project, deal }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentDocument, setCurrentDocument] =
    useState<DocumentWithCompletion>();

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
  } = useDocuments(project.id, 1, deal.financingType!);

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
      const documentNames = data.filter(doc => doc.completed).map(doc => doc.name).toString();
      updateHubspotDealProperties(deal.hubspotId, 1, documentNames);
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
      const documentNames = data.filter(doc => doc.completed).map(doc => doc.name).toString();
      updateHubspotDealProperties(deal.hubspotId, 1, documentNames);
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
        <DocumentViewerModal
          open={openModal}
          onClose={handleCloseModal}
          fileUrl={currentDocument?.link ?? ""}
        />
      </CardContent>
    </Card>
  );
};
