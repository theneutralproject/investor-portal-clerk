import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { CreateAccountButton, SignInButton } from './CreateAccount';

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
  ReferenceLine,
} from 'recharts';
import PortfolioMetric from './PortfolioMetric';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { PortfolioReturnsResponse } from '@/libs/returns/schema';
import { CustomLegend } from '../Project/Overview/InvestmentCalculatorNew';
import {
  getChartData,
  getMetrics,
  dataAccessors,
  CustomTooltipProps,
  TooltipPayloadItem,
  formatCurrency,
  calculateTodayLinePosition,
} from './Portfolio/portfolioHelpers';
import { DASHBOARD_POSTFOLIO_TEST_ID } from 'e2e/testIds';

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload) return null;

  const isProjected = payload[0]?.payload?.isProjected;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 2,
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Quarter: {label}
      </Typography>
      {payload.map((entry: TooltipPayloadItem) => {
        if (!isProjected && entry.name.includes('Projected')) return null;
        if (isProjected && !entry.name.includes('Projected')) return null;

        if (entry.value !== undefined) {
          return (
            <Typography
              key={entry.name}
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: entry.color,
                  display: 'inline-block',
                }}
              />
              {entry.name}: {formatCurrency(entry.value)}
            </Typography>
          );
        }
        return null;
      })}
    </Box>
  );
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

  const metrics = getMetrics(data || null);
  const chartData = getChartData(data || null);
  const todayLinePosition = calculateTodayLinePosition(chartData);
  return (
    <div data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}`}>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <PortfolioMetric
              toDateValue={metric.toDateValue}
              projectedTotalValue={metric.projectedTotalValue}
              label={metric.label}
              color={metric.color}
            />
          </Grid>
        ))}
      </Grid>

      {chartData.length > 0 && (
        <Box sx={{ height: 300, mt: 4, display: { xs: 'none', sm: 'block' } }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip
                content={<CustomTooltip />}
                labelFormatter={(label: string) => `Quarter: ${label}`}
              />
              <Legend content={<CustomLegend payload={[]} />} />
              <XAxis
                xAxisId="percentageAxis"
                type="number"
                domain={[0, 100]}
                hide
              />

              {todayLinePosition !== null && (
                <ReferenceLine
                  xAxisId="percentageAxis"
                  x={todayLinePosition}
                  stroke="#656565"
                  label={{
                    value: 'Today',
                    position: 'insideTopLeft',
                    fill: '#656565',
                  }}
                />
              )}

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
      )}

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
          data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-create-account`}
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
            <Stack direction="row" spacing={2} alignItems="center">
              <div data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-sign-up`}>
                <CreateAccountButton
                  variant="neutralYellow"
                  data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-sign-up-btn`}
                />
              </div>
              <div data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-sign-in`}>
                <SignInButton
                  variant="text"
                  data-testid={`${DASHBOARD_POSTFOLIO_TEST_ID}-sign-in-btn`}
                />
              </div>
            </Stack>
          </Stack>
        </Box>
      )}
    </div>
  );
};

export default DashboardPortfolio;
