import React from 'react';
import { Box, Typography, Stack, Tooltip, Paper, Divider } from '@mui/material';

interface PortfolioMetricProps {
  toDateValue: string;
  projectedTotalValue: string;
  label: string;
  color: string;
}
const PortfolioMetric: React.FC<PortfolioMetricProps> = ({
  toDateValue,
  projectedTotalValue,
  label,
  color,
}) => {
  const TooltipContent = () => (
    <Paper
      sx={{
        p: 1,
        bgcolor: 'background.paper',
        width: 'fit-content',
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
        minWidth: '250px',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {label.replaceAll('Proj.', '')}
      </Typography>
      <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.12)', mb: 1 }} />

      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: color,
            }}
          />
          <Stack
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              To Date
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {toDateValue}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: color,
            }}
          />
          <Stack
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Projected Total
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {projectedTotalValue}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <Tooltip
      title={<TooltipContent />}
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'transparent',
            '& .MuiTooltip-arrow': {
              color: 'background.paper',
            },
          },
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 4,
            height: '56px',
            backgroundColor: color,
            borderRadius: '10px',
          }}
        />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {toDateValue}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {label}
          </Typography>
        </Box>
      </Stack>
    </Tooltip>
  );
};

export default PortfolioMetric;
