'use client';
import { useState } from 'react';

import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import { useUser } from '@clerk/nextjs';

import { useWebFlowContent } from '@/app/hooks/useWebFlowContent';
import NewsComponent from '@/components/Dashboard/DashboardNews';
import FAQs from '@/components/Resources/FAQs';
import ShortArticles from '@/components/Resources/ShortArticles';
import QuickLinks from '@/components/Resources/QuickLinks';
import ReferencePDFs from '@/components/Resources/ReferencePDFs';
import { ResourceItem } from '@/libs/types';
import Modal from '@/components/Shared/Modal';

const ContentDivider = () => <Divider sx={{ mb: 2 }} />;

const AdvisorResourceCenter = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { data, isLoading } = useWebFlowContent({
    collection: 'resource',
    loadRequest: isSignedIn,
  });
  const [open, setOpen] = useState(false);
  const [shortArticle, setShortArticle] = useState<ResourceItem>();

  const toggleModal = (isOpen: boolean) => () => {
    setOpen(isOpen);
  };

  const handleArticleClick = (resource: ResourceItem) => {
    setShortArticle(resource);
    toggleModal(true)();
  };

  if (!isLoaded || isLoading) return <DashboardSkeleton />;
  if (!data) return;

  return (
    <Box>
      <Grid
        sx={{
          mt: 2,
          background: '#f5f5f5',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: '32px',
            fontWeight: '600',
            mt: 2,
            mb: 3,
          }}
        >
          Resource Center
        </Typography>
        <Divider sx={{ mb: 3, width: '140%', ml: '-10%' }} />
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          mt: 2,
          background: '#f5f5f5',
          borderRadius: '8px',
          display: 'flex',
        }}
      >
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
          justifyContent="center"
          sx={{ background: '#f5f5f5' }}
        >
          <Box sx={{ width: '100%', mb: 2 }}>
            <Card sx={{ borderRadius: '8px', position: 'relative' }}>
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '20px',
                    mb: 2,
                  }}
                >
                  FAQs
                </Typography>
                <ContentDivider />
                <FAQs resources={data?.faq} contentField={'content'} />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Card sx={{ borderRadius: '8px', position: 'relative' }}>
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '20px',
                    mb: 2,
                  }}
                >
                  Short Articles
                </Typography>
                <ContentDivider />
                <ShortArticles
                  resources={data['short-article']}
                  contentField="summary"
                  onArticleClick={handleArticleClick}
                />
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
          justifyContent="center"
          sx={{ background: '#f5f5f5' }}
        >
          <Box sx={{ width: '100%', mb: 2 }}>
            <Card sx={{ borderRadius: '8px', position: 'relative' }}>
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '20px',
                    mb: 2,
                  }}
                >
                  Quick Links
                </Typography>
                <ContentDivider />
                <QuickLinks resources={data['quick-link']} />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: '100%', mb: 2 }}>
            <Card sx={{ borderRadius: '8px', position: 'relative' }}>
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '20px',
                    mb: 2,
                  }}
                >
                  Reference PDFs
                </Typography>
                <ContentDivider />
                <ReferencePDFs resources={data.pdf} />
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ width: '100%' }}>
            <NewsComponent />
          </Box>
        </Grid>
      </Grid>

      <Modal open={open} onClose={toggleModal(false)}>
        <Box
          key={shortArticle?.id}
          sx={{
            p: 4,
            border: 'none',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: '1.25rem',
              fontWeight: '500',
              color: 'rgba(0, 0, 0, 0.87)',
            }}
            id={shortArticle?.fieldData?.slug || ''}
          >
            {shortArticle?.fieldData?.name || ''}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '0.85rem',
              fontWeight: '400',
              color: 'rgba(0, 0, 0, 0.87)',
            }}
            dangerouslySetInnerHTML={{
              __html: shortArticle?.fieldData?.content || '',
            }}
          ></Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdvisorResourceCenter;
