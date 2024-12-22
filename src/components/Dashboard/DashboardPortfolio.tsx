import React from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import PortfolioMetric from './PortfolioMetric';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type {
  ReturnsDateObject,
  PortfolioReturnsResponse,
} from '@/libs/returns/schema';

interface MetricData {
  label: string;
  value: string;
  color: string;
}

interface QuarterData {
  quarter: string;
  principal: number;
  equityDistributions: number;
  debtDistributions: number;
  portfolioValue: number;
  isProjected: boolean;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatQuarter = (dateString: string): string => {
  const date = new Date(dateString);
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  const year = date.getFullYear().toString().slice(-2);
  return `Q${quarter} '${year}`;
};

const groupByQuarter = (schedule: ReturnsDateObject[]): QuarterData[] => {
  const currentDate = new Date();
  const quarterData = schedule.reduce<Record<string, QuarterData>>(
    (acc, curr) => {
      const quarterKey = formatQuarter(curr.date.toString());
      const isProjected = new Date(curr.date) > currentDate;

      if (!acc[quarterKey]) {
        acc[quarterKey] = {
          quarter: quarterKey,
          principal: curr.principalInvestedToDate,
          equityDistributions: 0,
          debtDistributions: 0,
          portfolioValue: curr.portfolioValueToDate,
          isProjected,
        };
      } else {
        acc[quarterKey].isProjected =
          acc[quarterKey].isProjected || isProjected;
      }

      acc[quarterKey].debtDistributions = Math.max(
        acc[quarterKey].debtDistributions,
        curr.debtDistributionsCumulative
      );
      acc[quarterKey].equityDistributions = Math.max(
        0,
        curr.equityDistributionCumulative
      );
      acc[quarterKey].portfolioValue = curr.portfolioValueToDate;

      return acc;
    },
    {}
  );

  return Object.values(quarterData);
};

// Type-safe data accessors for the chart
const dataAccessors = {
  principal: (data: QuarterData) =>
    data.isProjected ? undefined : data.principal,
  principalProjected: (data: QuarterData) =>
    data.isProjected ? data.principal : data.principal,
  equityDistributions: (data: QuarterData) =>
    data.isProjected ? undefined : data.equityDistributions,
  equityDistributionsProjected: (data: QuarterData) =>
    data.isProjected ? data.equityDistributions : data.equityDistributions,
  debtDistributions: (data: QuarterData) =>
    data.isProjected ? undefined : data.debtDistributions,
  debtDistributionsProjected: (data: QuarterData) =>
    data.isProjected ? data.debtDistributions : data.debtDistributions,
  portfolioValue: (data: QuarterData) =>
    data.isProjected ? undefined : data.portfolioValue,
  portfolioValueProjected: (data: QuarterData) =>
    data.isProjected ? data.portfolioValue : data.portfolioValue,
};

const DashboardPortfolio: React.FC<{ loggedIn: boolean }> = ({ loggedIn }) => {
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

  const metrics: MetricData[] = React.useMemo(() => {
    if (!data) {
      return [
        { label: 'Portfolio Value', value: '$0', color: '#FFB800' },
        { label: 'Debt Distributions', value: '$0', color: '#5AAC6A' },
        { label: 'Equity Distributions', value: '$0', color: '#2196F3' },
        { label: 'Principal', value: '$0', color: '#656565' },
      ];
    }

    return [
      {
        label: 'Proj. Portfolio Value',
        value: formatCurrency(data.portfolioStats.projectedPortfolioValue),
        color: '#FFB800',
      },
      {
        label: 'Proj. Debt Distributions',
        value: formatCurrency(data.portfolioStats.projectedDebtDistributions),
        color: '#5AAC6A',
      },
      {
        label: 'Proj. Equity Distributions',
        value: formatCurrency(data.portfolioStats.projectedEquityDistributions),
        color: '#2196F3',
      },
      {
        label: 'Principal',
        value: formatCurrency(data.portfolioStats.principalInvested),
        color: '#656565',
      },
    ];
  }, [data]);

  const chartData = React.useMemo(() => {
    if (!data) return [];
    return groupByQuarter(data.consolidatedSchedule);
  }, [data]);

  return (
    <>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={3} key={index}>
            <PortfolioMetric
              value={metric.value}
              label={metric.label}
              color={metric.color}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ height: 300, mt: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="quarter" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label: string) => `Quarter: ${label}`}
            />
            <Legend />

            {/* Areas for historical data */}
            <Area
              type="monotone"
              dataKey={dataAccessors.principal}
              stroke="#656565"
              fill="#656565"
              fillOpacity={0.1}
              name="Principal"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey={dataAccessors.equityDistributions}
              stroke="#2196F3"
              fill="#2196F3"
              fillOpacity={0.1}
              name="Equity Distributions"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey={dataAccessors.debtDistributions}
              stroke="#5AAC6A"
              fill="#5AAC6A"
              fillOpacity={0.1}
              name="Debt Distributions"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey={dataAccessors.portfolioValue}
              stroke="#FFB800"
              fill="#FFB800"
              fillOpacity={0.1}
              name="Portfolio Value"
              strokeWidth={3}
            />

            {/* Lines for projected data */}
            <Line
              type="monotone"
              dataKey={dataAccessors.principalProjected}
              stroke="#656565"
              name="Principal (Projected)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5"
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey={dataAccessors.equityDistributionsProjected}
              stroke="#2196F3"
              name="Equity Distributions (Projected)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5"
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey={dataAccessors.debtDistributionsProjected}
              stroke="#5AAC6A"
              name="Debt Distributions (Projected)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5"
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey={dataAccessors.portfolioValueProjected}
              stroke="#FFB800"
              name="Portfolio Value (Projected)"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5"
              legendType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>

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
              Invest in Tomorrow, Today
            </Typography>
            <Typography
              variant="subtitle2"
              align="center"
              color="text.secondary"
            >
              We believe in the power of thoughtful investment to positively
              impact your portfolio and the planet. Explore the projects below
              to discover innovative, sustainable, and regenerative development
              solutions. Sign in or create your account to get started.
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

export default DashboardPortfolio;
