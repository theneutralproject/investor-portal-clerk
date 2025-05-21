// MobileCTA.tsx
import React, { useMemo } from 'react';
import {
  Box,
  AppBar,
  Container,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import { type ProjectWithAllNestedData } from '@/libs/types';
import HubspotScheduleCall from '@/components/HubspotScheduleCall';
import {
  INACTIVE_BUTTON_TOOLTIP,
  isInvestButtonDisabled,
} from '@/libs/project/utils.client';

interface MobileCTAProps {
  project: ProjectWithAllNestedData;
  onInvest: () => void;
}

const MobileCTA = ({ project, onInvest }: MobileCTAProps) => {
  const fundingPercentage = Math.min(
    100,
    Math.round(
      (project.investmentStats.investmentRaised /
        project.investmentStats.investmentGoal) *
        100
    )
  );

  const isButtonDisabled = isInvestButtonDisabled(project.status);
  const ctaBtn = useMemo(() => {
    const btn = (
      <Button
        fullWidth
        variant="contained"
        onClick={onInvest}
        disabled={isButtonDisabled}
        sx={{
          backgroundColor: '#F0B642',
          '&:hover': { backgroundColor: '#d4a33b' },
          boxShadow: 'none',
        }}
      >
        Invest
      </Button>
    );
    if (isButtonDisabled) {
      return (
        <Tooltip
          title={INACTIVE_BUTTON_TOOLTIP[project.status]}
          placement="top"
        >
          <span>{btn}</span>
        </Tooltip>
      );
    }

    return btn;
  }, [isButtonDisabled, onInvest, project.status]);

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          top: 60,
          borderBottom: '1px solid',
          borderColor: 'divider',
          borderRadius: '4px',
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
          mb: 2,
          mt: 2,
          zIndex: 1100,
        }}
      >
        <Container sx={{ py: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              height: '50px',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {project.displayName}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {project.location}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: `conic-gradient(#F0B642 ${fundingPercentage}%, #E5E7EB ${fundingPercentage}% 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 'auto',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                  {fundingPercentage}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </AppBar>

      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          top: 'auto',
          bottom: 0,
          borderTop: '1px solid',
          borderColor: 'divider',
          borderRadius: '4px',
          width: '100%',
          zIndex: 1100,
        }}
      >
        <Container sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ctaBtn}
            <HubspotScheduleCall onExit={() => null} />
          </Box>
        </Container>
      </AppBar>
    </>
  );
};

export default MobileCTA;
