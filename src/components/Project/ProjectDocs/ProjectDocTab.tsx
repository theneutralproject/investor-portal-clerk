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
export const ProjectDocTab: React.FC<{
  project: Project;
  dealStage: number;
}> = ({ project, dealStage }) => {
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
  const { mutate: mutateDeal } = useIncrementDealMutation(project.id);

  if (isLoading) return <div>Loading documents...</div>;
  if (isError) return <div>Error fetching documents: {error.message}</div>;

  const handleViewDocument = (documentId: number) => {
    documentEventMutation.mutate({ documentId, type: "VIEW" });

    // Check if all documents are viewed
    if (data.every((doc) => doc.completed || doc.id === documentId)) {
      mutateDeal("increment");
    }
  };

  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        {data.map((document, index) => (
          <DocumentCard
            key={index}
            document={document}
            dealStage={dealStage}
            handleViewDocument={handleViewDocument}
          />
        ))}
      </CardContent>
    </Card>
  );
};
