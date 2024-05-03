/* eslint-disable */
import { CardContent, Card } from "@mui/material";
import { theme } from "../../Shell/NeutralThemeProvider";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { type Project } from "@prisma/client";
import DocumentCard from "./DocumentCard";
import useDocuments, {
  type DocumentWithCompletion,
} from "@/app/hooks/useDocuments";
import useIncrementDealMutation from "@/app/hooks/useIncrementDealMutation";
import DocumentViewerModal from "./DocumentViewerModal";
import { useState } from "react";

export const ProjectDocTab: React.FC<{
  project: Project;
  dealStage: number;
}> = ({ project, dealStage }) => {
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
  } = useDocuments(project.id, 1);

  if (isLoading) return <div>Loading documents...</div>;
  if (isError) return <div>Error fetching documents: {error.message}</div>;

  const handleViewDocument = (document: DocumentWithCompletion) => {
    setCurrentDocument(document);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);

    if (!currentDocument?.completed) {
      documentEventMutation.mutate({
        documentId: currentDocument?.id,
        type: "VIEW",
      });
    }
  };

  //Sort documents by link contains "youtube" first
  data.sort((a, b) => {
    if (a.link.includes("youtube") && !b.link.includes("youtube")) {
      return -1;
    }
    if (!a.link.includes("youtube") && b.link.includes("youtube")) {
      return 1;
    }
    return 0;
  });

  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        {data.map((document, index) => (
          <DocumentCard
            key={index}
            document={document}
            dealStage={dealStage}
            handleViewDocument={() => handleViewDocument(document)}
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
