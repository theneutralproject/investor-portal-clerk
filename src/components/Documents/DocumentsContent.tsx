'use client';

import { Box, Typography, Alert, Tabs, Tab } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import DocumentList from './DocumentsList';

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

type DocumentType = 'investment' | 'tax';

const DocumentValueToTab = {
  investment: 0,
  tax: 1,
};
const DocumentTabToValue: { [x: number]: DocumentType } = {
  0: 'investment',
  1: 'tax',
};

const routes = {
  investment: '/documents/investor',
  tax: '/documents/tax-doc',
};

const DocumentsContent = ({ type }: { type: DocumentType }) => {
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const newType = DocumentTabToValue[newValue];
    if (!newType) return;

    router.push(routes[newType]);
  };

  const { data, error, isLoading } = useQuery<DocumentsResponse>({
    queryKey: ['documents'],
    queryFn: () => fetch('/api/documents/deal').then(res => res.json()),
  });

  const documents =
    type === 'investment' ? data?.investmentDocuments : data?.taxDocuments;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Documents
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={DocumentValueToTab[type]}
          onChange={handleTabChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: '#1c5e20',
            },
          }}
          sx={{
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: '#1c5e20',
              },
            },
          }}
        >
          <Tab label="INVESTMENT DOCS" />

          <Tab label="TAX DOCS" />
        </Tabs>
      </Box>

      {error ? (
        <Alert severity="error">
          Error loading documents. Please try again later.
        </Alert>
      ) : (
        <DocumentList
          documents={documents ?? []}
          isLoading={isLoading}
          type={type}
        />
      )}
    </Box>
  );
};

export default DocumentsContent;
