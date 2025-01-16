import React from 'react';
import { Box, Grid, Typography, Divider, Button, Stack } from '@mui/material';
import type { ProjectWithAllNestedData, ProjectWithStats } from '@/libs/types';
import type { ProjectInvestmentStats } from '@prisma/client';
import Link from 'next/link';
import { useDashboard } from '@/components/Dashboard/DashboardContext';
import {
  displayDebtInterest,
  displayEquityIRR,
} from '@/components/Dashboard/DashboardProjects';
const formatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

interface LineDisplayProps {
  name: string;
  value: string | number | React.ReactNode;
}

export const LineDisplay: React.FC<LineDisplayProps> = ({ name, value }) => (
  <Box
    display="flex"
    justifyContent="space-between"
    marginBottom={2}
    marginTop={2}
  >
    <Typography variant="body2">{name}:</Typography>
    {typeof value === 'string' || typeof value === 'number' ? (
      <Typography
        variant="body2"
        sx={{ color: '#000000DE', fontWeight: '600' }}
      >
        {typeof value === 'number' ? value.toString() : value}
      </Typography>
    ) : (
      value
    )}
  </Box>
);

interface DebtSectionProps {
  investmentStats: ProjectInvestmentStats;
  project: ProjectWithAllNestedData;
  showAsterisk?: boolean;
}

const DebtSection: React.FC<DebtSectionProps> = ({
  investmentStats,
  project,
  showAsterisk = false,
}) => {
  const termString =
    investmentStats.debtTermMonthsMin === investmentStats.debtTermMonthsMax
      ? `${investmentStats.debtTermMonthsMax} month`
      : `${investmentStats.debtTermMonthsMin} or ${investmentStats.debtTermMonthsMax} months`;

  return (
    <>
      <Typography variant="body1">Debt Returns</Typography>
      <LineDisplay
        name="Interest"
        value={`${displayDebtInterest(project)}${showAsterisk ? '***' : ''}`}
      />
      <LineDisplay
        name="Min. Investment"
        value={`$${formatter.format(investmentStats.debtMinInvestment)}`}
      />
      <LineDisplay name="Term" value={termString} />
      <LineDisplay name="Payment" value={investmentStats.debtPaymentFreq} />
    </>
  );
};

interface EquitySectionProps {
  investmentStats: ProjectInvestmentStats;
  project: ProjectWithAllNestedData;
}

const EquitySection: React.FC<EquitySectionProps> = ({
  investmentStats,
  project,
}) => (
  <>
    <Typography variant="body1">Equity Returns</Typography>
    <LineDisplay name="IRR" value={displayEquityIRR(project)} />
    <LineDisplay
      name="Min. Investment"
      value={`$${formatter.format(investmentStats.equityMinInvestment)}`}
    />
    <LineDisplay
      name="Term"
      value={`${investmentStats.equityTermMonths} months`}
    />
    <LineDisplay
      name="Distribution"
      value={`${investmentStats.equityPaymentFreq}*`}
    />
    <LineDisplay
      name="Preferred Return"
      value={`${investmentStats.equityPreferredReturn * 100}%**`}
    />
  </>
);

interface FootnotesProps {
  investmentStats: ProjectInvestmentStats;
}

const Footnotes: React.FC<FootnotesProps> = ({ investmentStats }) => (
  <Box sx={{ ml: 2 }}>
    <Typography variant="body2">
      {`*${investmentStats.equityPaymentFreq} distribution shall commence upon stabilization, defined as 95% occupied.`}
    </Typography>
    <Typography variant="body2">
      **Equity investors receive a 10% preferred return.
    </Typography>
    <Typography variant="body2">
      {`***${investmentStats.interestRateMax} for investment amounts above $${
        investmentStats.interestRateDollarThreshold / 1000
      }k.`}
    </Typography>
  </Box>
);

const InvestmentSummaryBox: React.FC<{ data: ProjectWithStats }> = ({
  data,
}) => {
  const { loggedIn } = useDashboard();

  if (!data.investmentStats.boolEquity) {
    return (
      <Grid item xs={12} sm={5.5}>
        <DebtSection
          investmentStats={data.investmentStats}
          project={data as ProjectWithAllNestedData}
        />
      </Grid>
    );
  }

  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ alignItems: 'stretch', height: '100%' }}
      >
        <Grid item xs={12} sm={5.5}>
          <EquitySection
            investmentStats={data.investmentStats}
            project={data as ProjectWithAllNestedData}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={1}
          sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}
        >
          <Divider orientation="vertical" flexItem sx={{ height: '100%' }} />
        </Grid>

        <Grid item xs={12} sm={5.5}>
          <DebtSection
            investmentStats={data.investmentStats}
            project={data as ProjectWithAllNestedData}
            showAsterisk
          />
        </Grid>

        <Footnotes investmentStats={data.investmentStats} />
      </Grid>

      {!loggedIn && (
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(4px)',
            borderRadius: '8px',
          }}
        >
          <Stack spacing={3} alignItems="center" maxWidth="600px" p={4}>
            <Typography variant="body1" align="center" fontWeight="500">
              Create an account
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              color="text.secondary"
            >
              Create an account or sign in to view exclusive investment details.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Link href="/login" passHref>
                <Button variant="neutralYellow">CREATE ACCOUNT</Button>
              </Link>
              <Link href="/login" passHref>
                <Button
                  variant="text"
                  sx={{
                    borderColor: 'text.primary',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'text.primary',
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  SIGN IN
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default InvestmentSummaryBox;
