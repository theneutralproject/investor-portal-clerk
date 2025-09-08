import React from 'react';
import { Typography, Box, Divider, Chip, Button } from '@mui/material';
import { useDealFlow } from '@components/DealFlow/Shared/DealFlowContext';
import { DealFinancingType } from '@prisma/client';
import Image from 'next/image';
import DealFlowSidebarDetails from './DealFlowSidebarDetails';
import { getProjectImage } from '@/components/Dashboard/DashboardProjects';
import DealFlowSidebarLoading from './DealFlowSidebarLoading';
const DealFlowSidebar = () => {
  const { project, deal, isLoading } = useDealFlow();

  const projectPicture = getProjectImage(project?.pictures);

  const investmentAmount = deal?.investmentStats?.amount;
  const displayAmount = investmentAmount
    ? `$${investmentAmount.toLocaleString()}`
    : '$0';

  if (isLoading) {
    return <DealFlowSidebarLoading />;
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#f4f5f7',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#333' }}
        >
          Investment Summary
        </Typography>
        {project && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              component="img"
              src={projectPicture}
              sx={{ width: 60, height: 60, mr: 2, borderRadius: 1 }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {project?.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {project?.location}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                ml: 'auto',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  ml: 'auto',
                  fontWeight: 'bold',
                  color: investmentAmount ? 'inherit' : 'text.disabled',
                }}
              >
                {displayAmount}
              </Typography>
              {deal?.investmentStats?.financingType && (
                <Chip
                  label={
                    deal.investmentStats.financingType ===
                    DealFinancingType.equity
                      ? 'Equity'
                      : 'Debt'
                  }
                  size="small"
                  sx={{
                    mt: 0.5,
                    fontWeight: 'bold',
                    color: 'gray',
                    borderRadius: '16px',
                    backgroundColor: 'action.selected',
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      <DealFlowSidebarDetails />

      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              width="40"
              height="40"
              src="/chat_thumbnail_sarah.png"
              alt="Support Avatar"
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Questions?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Give us a call or chat anytime - we will answer any questions you
              have
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                href="mailto:invest@neutral.us"
                target="_blank"
                rel="noopener noreferrer"
                variant="grayPill"
              >
                Email us
              </Button>
              <Typography variant="body2" color="text.secondary">
                (608) 205-8134
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DealFlowSidebar;
