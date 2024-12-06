"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { format } from "date-fns";

interface Document {
  id: number;
  name: string;
  path: string;
  type: string;
  dealId: number;
  dateCreated: string;
  uploadedById: number;
  taxYear: number | null;
  projectName: string;
  downloadUrl: string;
}

interface DocumentsResponse {
  taxDocuments: Document[];
  investmentDocuments: Document[];
}

const handleDownload = async (downloadUrl: string, fileName: string) => {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download the file. Please try again.");
  }
};

const DocumentList = ({
  documents,
  isLoading,
}: {
  documents: Document[];
  isLoading: boolean;
}) => {
  const groupDocumentsByYear = (docs: Document[]) => {
    return docs.reduce((acc: Record<string, Document[]>, doc) => {
      const year = doc.taxYear ?? new Date(doc.dateCreated).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(doc);
      return acc;
    }, {});
  };

  const groupedDocs = groupDocumentsByYear(documents);
  const sortedYears = Object.keys(groupedDocs).sort(
    (a, b) => Number(b) - Number(a)
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (documents.length === 0) {
    return (
      <Card
        sx={{
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardContent>
          <Box sx={{ maxWidth: "800px", textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              No Documents
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Documents will appear here after you complete an investment or
              when your tax documents are generated at the end of the tax
              season.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {sortedYears.map((year) => (
        <Accordion
          key={year}
          defaultExpanded
          sx={{
            mb: 2,
            boxShadow: 0,
            border: "1px solid #e0e0e0",
            borderRadius: "16px",
            "&.MuiAccordion-root": {
              "&:before": {
                display: "none",
              },
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              bgcolor: "background.default",
              "& .MuiAccordionSummary-content": {
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
              }}
            >
              {year}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedDocs[year]?.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.projectName}</TableCell>
                    <TableCell>
                      {format(new Date(doc.dateCreated), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="grayPill"
                        size="small"
                        startIcon={<FileDownloadIcon />}
                        onClick={() =>
                          handleDownload(doc.downloadUrl, doc.name)
                        }
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

const DocumentsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const { data, error, isLoading } = useQuery<DocumentsResponse>({
    queryKey: ["documents"],
    queryFn: () => fetch("/api/documents/deal").then((res) => res.json()),
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Documents
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#1c5e20",
            },
          }}
          sx={{
            "& .MuiTab-root": {
              color: "text.secondary",
              "&.Mui-selected": {
                color: "#1c5e20",
              },
            },
          }}
        >
          <Tab label="TAX DOCS" />
          <Tab label="INVESTMENT DOCS" />
        </Tabs>
      </Box>

      {error ? (
        <Alert severity="error">
          Error loading documents. Please try again later.
        </Alert>
      ) : (
        <>
          {tabValue === 0 && (
            <DocumentList
              documents={data?.taxDocuments ?? []}
              isLoading={isLoading}
            />
          )}
          {tabValue === 1 && (
            <DocumentList
              documents={data?.investmentDocuments ?? []}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default DocumentsPage;
