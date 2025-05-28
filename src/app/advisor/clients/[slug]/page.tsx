'use client';

import { use, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DashboardSkeleton from '@/components/SkeletonLoading/DashboardSkeleton';
import { useUser } from '@clerk/nextjs';
import AdvisorDocumentsTable from '@/components/Tables/AdvisorDocumentsTable';
import { NextClientPage } from '@/types/page';
import DashboardPortfolio from '@/components/Dashboard/DashboardPortfolio';
import axios from 'axios';
import AdvisorClientInvestmentsTable from '@/components/Tables/AdvisorClientInvestmentsTable';
import AccountProfileDetails from '@/components/Account/AccountProfileDetails';
import { UserWithAddress } from '@/libs/types';
import { toast } from 'react-toastify';
import { useAdvisorClientReturns } from '@/app/hooks/useAdvisorClientReturns';
import { useAdvisorClientUser } from '@/app/hooks/useAdvisorClientUser';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const AdvisorClientPage = ({ params }: NextClientPage) => {
  const router = useRouter();
  const { slug: id } = use(params);
  const { isSignedIn, isLoaded } = useUser();
  const clientId = parseInt(id, 10);
  const { data, isLoading: isLoadingReturns } = useAdvisorClientReturns(
    isSignedIn,
    clientId
  );
  const {
    data: clientUserOrganizationData,
    isLoading: isLoadingClientUserData,
  } = useAdvisorClientUser(isSignedIn, clientId);

  const clientName = useMemo(() => {
    if (!clientUserOrganizationData?.user) return '';

    return [
      clientUserOrganizationData?.user.firstName,
      clientUserOrganizationData?.user.lastName,
    ].join(' ');
  }, [clientUserOrganizationData]);

  const handleProfileUpdate = async (updatedUser: UserWithAddress) => {
    try {
      await axios.put<UserWithAddress>(
        `/api/advisors/clients/${clientId}/user`,
        updatedUser
      );
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!isLoaded) return <DashboardSkeleton />;

  return (
    <Box>
      <Grid
        sx={{
          mt: 2,
          background: '#f5f5f5',
        }}
      >
        <IconButton
          sx={{
            color: 'rgba(0, 0, 0, 0.56)',
            backgroundColor: 'rgba(238, 238, 238, 1)',
          }}
          onClick={handleGoBack}
        >
          <ArrowBack sx={{ color: 'rgba(0, 0, 0, 0.56)' }} />
        </IconButton>
        <Typography
          variant="h4"
          sx={{
            fontSize: '32px',
            fontWeight: '600',
            mt: 2,
            mb: 3,
          }}
        >
          {clientName}
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
            md: 7,
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
                  Investments
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {isLoadingReturns && (
                  <Typography
                    variant="body2"
                    sx={{ py: 4, textAlign: 'center' }}
                  >
                    Loading Returns...
                  </Typography>
                )}
                {data && (
                  <DashboardPortfolio loggedIn={isSignedIn} data={data} />
                )}
                <AdvisorClientInvestmentsTable
                  clientId={clientId}
                  loadRequest={isSignedIn}
                />
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
                  Documents
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <AdvisorDocumentsTable
                  loadRequest={isSignedIn}
                  hiddenFilters={['client']}
                  hiddenColumns={['clientName']}
                  clientId={clientId}
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
          display="flex"
          justifyContent="center"
          sx={{ background: '#f5f5f5' }}
        >
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
                  Personal Info
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {isLoadingClientUserData && (
                  <Typography
                    variant="body2"
                    sx={{ py: 4, textAlign: 'center' }}
                  >
                    Loading Personal Info...
                  </Typography>
                )}
                {clientUserOrganizationData && (
                  <AccountProfileDetails
                    user={clientUserOrganizationData.user}
                    onUpdate={handleProfileUpdate}
                  />
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvisorClientPage;
