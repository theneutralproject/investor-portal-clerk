import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  styled,
  Tooltip,
  IconButton,
} from '@mui/material';
import { getProjectPicture } from './CompleteInvestment';
import type { PortfolioReturnsResponse } from '@/libs/returns/schema';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoopIcon from '@mui/icons-material/Loop';
import { DashboardDealConversionModal } from './DashboardDealConversionModal';

interface DashboardDealsProps {
  loggedIn: boolean;
}

interface Project {
  name: string;
  location: string;
}

const StyledCard = styled(Card)({
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  borderRadius: 8,
  marginTop: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ProjectImage = styled('img')({
  width: 48,
  height: 48,
  objectFit: 'cover',
  borderRadius: 4,
});

const TableHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '300px 1fr 1fr 1fr 1fr',
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  minWidth: 900,
}));

const TableRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '300px 1fr 1fr 1fr 1fr',
  padding: theme.spacing(1.5),
  alignItems: 'center',
  minWidth: 900,
  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledHeader = styled(Typography)(({}) => ({
  color: 'rgba(0, 0, 0, 0.87)',
  fontSize: 14,
  fontWeight: 500,
}));

const ScrollContainer = styled(Box)({
  overflowX: 'auto',
  width: '100%',
});

const DashboardDeals: React.FC<DashboardDealsProps> = ({ loggedIn }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConversionId, setSelectedConversionId] = useState<
    number | null
  >(null);

  const handleOpenModal = (conversionId: number) => {
    setSelectedConversionId(conversionId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedConversionId(null);
  };

  const { data } = useQuery<PortfolioReturnsResponse, Error>({
    queryKey: ['dashboard', 'portfolio'],
    queryFn: async () => {
      const response = await axios.get<PortfolioReturnsResponse>(
        '/api/dashboard/returns'
      );
      return response.data;
    },
    enabled: loggedIn,
  });
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!data?.dealStats || data.dealStats.length === 0) {
    return (
      <StyledCard sx={{ height: '300px' }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            You don&apos;t have any investments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse active projects below to get started
          </Typography>
        </CardContent>
      </StyledCard>
    );
  }

  return (
    <>
      <StyledCard>
        <ScrollContainer>
          <TableHeader>
            <Box /> {/* Empty space for image and name column */}
            <StyledHeader>Type</StyledHeader>
            <StyledHeader>Committed</StyledHeader>
            <StyledHeader>Distributions to Date</StyledHeader>
            <StyledHeader>Projected Return</StyledHeader>
          </TableHeader>
          <CardContent sx={{ p: 0 }}>
            {data.dealStats.map(deal => {
              if (!deal.project) return null;
              // @ts-expect-error this mapping is okay
              const picture = getProjectPicture(deal);
              return (
                <TableRow key={deal.dealId}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ProjectImage src={picture} />
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {(deal.project as Project)?.name || 'Project'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(deal.project as Project)?.location || 'Location'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {deal.financingType === 'equity' ? 'Equity' : 'Debt'}
                    </Typography>
                    {deal.conversionId && (
                      <Tooltip title="Show Conversion">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenModal(deal.conversionId!)}
                        >
                          <LoopIcon sx={{ color: 'gray' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Typography variant="body2">
                    {formatCurrency(deal.committedAmount)}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(deal.distributionsToDate)}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(deal.distributionsProjected)}
                  </Typography>
                </TableRow>
              );
            })}
          </CardContent>
        </ScrollContainer>
      </StyledCard>
      <Typography
        variant="subtitle2"
        sx={{ mt: 2, fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.5)' }}
      >
        The financial projections on the Neutral Investor Portal are estimates
        based on current assumptions and are updated monthly for transparency.
        However, they are not guarantees and may change due to market
        conditions. Real estate investments are illiquid, and past performance
        does not ensure future results. Returns depend on factors like property
        performance, investment timing, and economic conditions. All figures are
        illustrative, and Neutral is not a cryptocurrency platform.
      </Typography>

      <DashboardDealConversionModal
        conversionId={selectedConversionId}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default DashboardDeals;
