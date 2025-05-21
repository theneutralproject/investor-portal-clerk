/* eslint-disable @next/next/no-img-element */
'use client';

import { useUser } from '@clerk/nextjs';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Pencil } from 'lucide-react';
import { useAdvisor } from '@/app/hooks/useAdvisor';
import { useAdvisorEmployees } from '@/app/hooks/useAdvisorEmployees';

const AdvisorAccountPage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { data: advisorFirm, isLoading: isLoadingAdvisor } =
    useAdvisor(isSignedIn);
  const { data: advisorFirmEmployees, isLoading: isLoadingAdvisorEmployees } =
    useAdvisorEmployees(isSignedIn);

  console.log({ advisorFirmEmployees, isLoadingAdvisorEmployees });
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
            md: 7,
          }}
          justifyContent="center"
          sx={{ background: '#f5f5f5', width: '877', margin: '0 auto' }}
        >
          <Card sx={{ borderRadius: '8px', position: 'relative' }}>
            {isLoaded && !isLoadingAdvisor && advisorFirm ? (
              <CardContent>
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

                <Box>
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
                    />
                    <Button variant="outlined" size="medium">
                      Replace Logo <Pencil className="w-4 h-4 ml-2" />
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />
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
      </Grid>
    </Box>
  );
};

export default AdvisorAccountPage;
