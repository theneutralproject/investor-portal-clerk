/* eslint-disable */
import useDocuments from "@/app/hooks/useDocuments";
import { theme } from "@/components/Shell/NeutralThemeProvider";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { type Project } from "@prisma/client";
import DocumentCard from "../ProjectDocs/DocumentCard";
import useIncrementDealMutation from "@/app/hooks/useIncrementDealMutation";

export const InvestTab: React.FC<{ project: Project; dealStage: number }> = ({
  project,
  dealStage,
}) => {
  const { isLoading, isError, data, error, documentEventMutation } =
    useDocuments(project.id, 3);

  if (isLoading) return <div>Loading documents...</div>;
  if (isError) return <div>Error fetching documents: {error.message}</div>;

  const handleViewDocument = (documentId: number) => {
    documentEventMutation.mutate({ documentId, type: "VIEW" });
  };

  const { mutate: mutateDeal, isLoading: isIncrementing } =
    useIncrementDealMutation(project.id);
  return (
    <Card sx={{ mt: theme.spacing(2) }}>
      <CardContent>
        <Card>
          <CardContent>
            <Typography variant="h6">
              Step 3: Sign Investment Agreements
            </Typography>
            <Typography variant="caption">
              Placeholder description about what this process is and how it
              works.
            </Typography>

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

        <Card>
          <CardContent>
            <Typography variant="h6">Step 4: Fund Your Investment</Typography>
            <Typography variant="caption">
              Placeholder description about what this process is and how it
              works.
            </Typography>

            <Box sx={{ display: "flex" }}>
              <Button
                variant="neutralBlack"
                fullWidth
                sx={{ width: "200px" }}
                onClick={() => mutateDeal("increment")}
              >
                Continue
              </Button>
            </Box>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
