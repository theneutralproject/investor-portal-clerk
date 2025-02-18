// Modified RightSidebarCTA.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { type ProjectWithAllNestedData } from '@/libs/types';
import { LineDisplay } from '../Overview/InvestmentSummaryBox';
import HubspotScheduleCall from '@/components/HubspotScheduleCall';
import {
  displayDebtInterest,
  displayEquityIRR,
} from '@/components/Dashboard/DashboardProjects';

interface RightSidebarCTAProps {
  project: ProjectWithAllNestedData;
  onInvest: () => void;
}

const RightSidebarCTA: React.FC<RightSidebarCTAProps> = ({
  project,
  onInvest,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fundingPercentage = Math.min(
    100,
    Math.round(
      (project.investmentStats.investmentRaised /
        project.investmentStats.investmentGoal) *
        100
    )
  );

  if (isMobile) return null;

  return (
    <Card sx={{ mb: 2, position: 'sticky', top: 80, zIndex: 1000 }}>
      <CardContent>
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
        <Divider sx={{ my: 2 }} />
        <Box>
          <LineDisplay
            name="Total Units"
            value={project.propertyStats.numUnits}
          />
          <LineDisplay
            name="Investment Term"
            value={`${project.investmentStats.equityTermMonths} Months`}
          />
          <LineDisplay
            name="Min Investment"
            value={`$${project.investmentStats.equityMinInvestment / 1000}k`}
          />
          {project.investmentStats.boolEquity && (
            <LineDisplay name="IRR" value={displayEquityIRR(project)} />
          )}
          {project.investmentStats.boolDebt && (
            <LineDisplay name="Interest" value={displayDebtInterest(project)} />
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={onInvest}
            sx={{
              backgroundColor: '#F0B642',
              '&:hover': { backgroundColor: '#d4a33b' },
              borderRadius: '24px',
              boxShadow: 'none',
            }}
          >
            Invest
          </Button>
          <HubspotScheduleCall onExit={() => null} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RightSidebarCTA;
