/* eslint-disable */
import useDocuments, { DocumentWithCompletion } from "@/app/hooks/useDocuments";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { type Project } from "@prisma/client";
import DocumentCard from "../ProjectDocs/DocumentCard";
import useIncrementDealMutation from "@/app/hooks/useIncrementDealMutation";
import { Key } from "react";
import LockIcon from "@mui/icons-material/Lock";

export const InvestTab: React.FC<{ project: Project; dealStage: number }> = ({
  project,
  dealStage,
}) => {
  const { isLoading, isError, data, error, documentEventMutation } =
    useDocuments(project.id, 3);

  if (isLoading) return <div>Loading documents...</div>;
  if (isError) return <div>Error fetching documents: {error?.message}</div>;

  const handleViewDocument = (documentId: number) => {
    documentEventMutation.mutate({ documentId, type: "VIEW" });
  };

  const { mutate: mutateDeal } = useIncrementDealMutation(project.id);
  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        <CardContent>
          <Typography variant="h6">Sign Investment Agreements</Typography>
          <Typography variant="caption">
            Placeholder description about what this process is and how it works.
          </Typography>

          {data.map(
            (
              document: DocumentWithCompletion,
              index: Key | null | undefined
            ) => (
              <DocumentCard
                key={index}
                document={document}
                dealStage={dealStage}
                handleViewDocument={handleViewDocument}
              />
            )
          )}
        </CardContent>
      </CardContent>
    </Card>
  );
};
