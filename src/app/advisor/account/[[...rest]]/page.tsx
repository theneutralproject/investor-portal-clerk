/* eslint-disable @next/next/no-img-element */
'use client';

import { useUser } from '@clerk/nextjs';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useAdvisor } from '@/app/hooks/useAdvisor';
import AdvisorEmployeesTable from '@/components/Tables/AdvisorEmployeesTable';
import { Repeat } from '@mui/icons-material';

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
          <Card sx={{ borderRadius: '8px', position: 'relative' }}>
            {isLoaded && !isLoadingAdvisor && advisorFirm ? (
              <CardContent
                sx={{
                  '&:last-child': {
                    paddingBottom: '16px',
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '20px',
                    mb: 2,
                  }}
                >
                  Company Info
                </Typography>
                <Box>
                  <TextField
                    label={'Company Name'}
                    variant="standard"
                    fullWidth
                    value={advisorFirm?.name}
                  />
                </Box>

                <Box mt={1}>
                  <Typography variant="caption" color="textSecondary">
                    Company Logo
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                    <img
                      src={advisorFirm?.logoUrl || ''}
                      alt="Company Logo"
                      width={291}
                      height={109}
                      className="border rounded-md"
                      style={{
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="medium"
                      endIcon={<Repeat />}
                      sx={{
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.87)',
                        textTransform: 'none',
                        alignSelf: 'flex-end',
                      }}
                    >
                      Replace Logo
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            ) : (
              <CardContent>
                <Typography variant="body1" fontWeight={500}>
                  Loading company info
                </Typography>
              </CardContent>
            )}
          </Card>
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
