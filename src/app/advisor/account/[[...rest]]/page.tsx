'use client';

import { useUser } from '@clerk/nextjs';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAdvisor } from '@/app/hooks/useAdvisor';
import AdvisorEmployeesTable from '@/components/Tables/AdvisorEmployeesTable';
import AdvisorFirmInfoForm, {
  AdvisorFirmInfoFormSkeleton,
} from '@/components/Advisor/AdvisorFirmInfo';

const AdvisorAccountPage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { data: advisorFirm, isLoading: isLoadingAdvisor } =
    useAdvisor(isSignedIn);

  return (
    <Box sx={{ width: '100%' }}>
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
          sx={{ background: '#f5f5f5', width: '877', margin: '0 auto' }}
        >
          {isLoaded && !isLoadingAdvisor && advisorFirm ? (
            <Card sx={{ borderRadius: '8px', position: 'relative' }}>
              <CardContent
                sx={{
                  '&:last-child': {
                    paddingBottom: '16px',
                  },
                }}
              >
                <AdvisorFirmInfoForm
                  defaultValues={{
                    name: advisorFirm.name,
                    logoUrl: advisorFirm.logoUrl || '',
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <AdvisorFirmInfoFormSkeleton />
          )}
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
          justifyContent="center"
          sx={{ background: '#f5f5f5', width: '877', margin: '0 auto' }}
        >
          <Card sx={{ borderRadius: '8px', position: 'relative' }}>
            <CardContent>
              <Typography
                variant="body1"
                sx={{
                  fontSize: '20px',
                  mb: 2,
                }}
              >
                Team Members
              </Typography>
              <AdvisorEmployeesTable loadRequest={isSignedIn} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvisorAccountPage;
