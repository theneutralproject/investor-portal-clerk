import React from 'react';
import {
  Box,
  Typography,
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
  Card,
  CardContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { format } from 'date-fns';
import { DealDocumentType } from '@prisma/client';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import Logger from '@/libs/logger';
import { toast } from 'react-toastify';

const titleMap = {
  [DealDocumentType.K1]: 'K1',
  [DealDocumentType.VERIFICATION_ACCREDITATION]: 'Verification Accreditation',
  [DealDocumentType.INVESTMENT_DOCUMENT]: 'Investment Document',
  [DealDocumentType.REPORT]: 'Quarterly Report',
};

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

const handleDownload = async (downloadUrl: string, fileName: string) => {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    Logger.error(error, null, {
      message: 'Error downloading document',
      fileName,
      downloadUrl,
      error: errorMessage,
    });
    toast.error(
      errorMessage === 'Download failed'
        ? 'Unable to download the file. Please try again later.'
        : 'An error occurred while downloading. Please try again.'
    );
  }
};

const DocumentList = ({
  documents,
  isLoading,
  type,
}: {
  documents: Document[];
  isLoading: boolean;
  type: 'tax' | 'investment';
}) => {
  const groupDocumentsByProject = (docs: Document[]) => {
    return docs.reduce((acc: Record<string, Document[]>, doc) => {
      const project = doc.projectName || 'Other';
      if (!acc[project]) {
        acc[project] = [];
      }
      acc[project].push(doc);
      return acc;
    }, {});
  };

  const groupedDocs = groupDocumentsByProject(documents);
  const sortedProjects = Object.keys(groupedDocs).sort();

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
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardContent>
          <Box sx={{ maxWidth: '800px', textAlign: 'center' }}>
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
      {sortedProjects.map(project => (
        <Accordion
          key={project}
          defaultExpanded
          sx={{
            mb: 2,
            boxShadow: 0,
            border: '1px solid #e0e0e0',
            borderRadius: '16px',
            '&.MuiAccordion-root': {
              '&:before': {
                display: 'none',
              },
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              bgcolor: 'white',
              '& .MuiAccordionSummary-content': {
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
              }}
            >
              {project}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Document Name</TableCell>
                  {type === 'tax' && <TableCell>Tax Year</TableCell>}
                  {type === 'investment' && <TableCell>Type</TableCell>}
                  <TableCell>Date Created</TableCell>
                  <TableCell align="right"></TableCell> {/*Action */}
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedDocs[project]?.map(doc => (
                  <TableRow
                    key={doc.id}
                    sx={{
                      borderBottom: '1px solid #e0e0e0 !important',
                      height: '65px',
                    }}
                  >
                    <TableCell
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: 'none',
                        height: '65px',
                      }}
                    >
                      {doc.path.endsWith('.pdf') ? (
                        <PictureAsPdfIcon />
                      ) : (
                        <DescriptionIcon />
                      )}
                      <Box sx={{ ml: 1 }}>{doc.name}</Box>
                    </TableCell>
                    {type === 'tax' && (
                      <TableCell
                        sx={{
                          border: 'none',
                        }}
                      >
                        {doc.taxYear || new Date(doc.dateCreated).getFullYear()}
                      </TableCell>
                    )}
                    {type === 'investment' && (
                      <TableCell
                        sx={{
                          border: 'none',
                        }}
                      >
                        {titleMap[doc.type as DealDocumentType]}
                      </TableCell>
                    )}
                    <TableCell
                      sx={{
                        border: 'none',
                      }}
                    >
                      {format(new Date(doc.dateCreated), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        border: 'none',
                      }}
                    >
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

export default DocumentList;
