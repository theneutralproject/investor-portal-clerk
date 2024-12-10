import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import PortfolioMetric from "./PortfolioMetric";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {
  ReturnsDateObject,
  PortfolioReturnsResponse,
  ReturnsPortfolioStats,
} from "@/libs/returns/schema";

interface MetricData {
  label: string;
  value: string;
  color: string;
}

interface QuarterData {
  quarter: string;
  principal: number;
  accruedInterest: number;
  distributions: number;
  portfolioValue: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
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

const groupByQuarter = (
  schedule: ReturnsDateObject[],
  portfolioStats: ReturnsPortfolioStats
): QuarterData[] => {
  const quarterData = schedule.reduce<Record<string, QuarterData>>(
    (acc, curr) => {
      const quarterKey = formatQuarter(curr.date.toString());

      if (!acc[quarterKey]) {
        acc[quarterKey] = {
          quarter: quarterKey,
          principal: portfolioStats.principalInvested,
          accruedInterest: 0,
          distributions: 0,
          portfolioValue: curr.portfolioValueToDate,
        };
      }

      // Update values with the current period data
      acc[quarterKey].distributions = Math.max(
        acc[quarterKey].distributions,
        curr.cumulativeDistribution
      );
      acc[quarterKey].accruedInterest = Math.max(
        0,
        curr.accruedPreferredReturn
      );
      acc[quarterKey].portfolioValue = curr.portfolioValueToDate;

      return acc;
    },
    {}
  );

  return Object.values(quarterData);
};

const DashboardPortfolio: React.FC<{ loggedIn: boolean }> = ({ loggedIn }) => {
  const { data } = useQuery<PortfolioReturnsResponse, Error>({
    queryKey: ["dashboard", "portfolio"],
    queryFn: async () => {
      const response = await axios.get<PortfolioReturnsResponse>(
        "/api/dashboard/returns"
      );
      return response.data;
    },
  });

  const metrics: MetricData[] = React.useMemo(() => {
    if (!data) {
      return [
        { label: "Portfolio Value", value: "$0", color: "#FFB800" },
        { label: "Distributions", value: "$0", color: "#5AAC6A" },
        { label: "Accrued Interest", value: "$0", color: "#2196F3" },
        { label: "Principal", value: "$0", color: "#656565" },
      ];
    }

    return [
      {
        label: "Portfolio Value",
        value: formatCurrency(data.portfolioStats.portfolioValueToDate),
        color: "#FFB800",
      },
      {
        label: "Distributions",
        value: formatCurrency(data.portfolioStats.distributionsToDate),
        color: "#5AAC6A",
      },
      {
        label: "Accrued Interest",
        value: formatCurrency(data.portfolioStats.accruedInterestToDate),
        color: "#2196F3",
      },
      {
        label: "Principal",
        value: formatCurrency(data.portfolioStats.principalInvested),
        color: "#656565",
      },
    ];
  }, [data]);

  const chartData = React.useMemo(() => {
    if (!data) return [];
    return groupByQuarter(data.consolidatedSchedule, data.portfolioStats);
  }, [data]);

  return (
    <Card sx={{ borderRadius: "8px", position: "relative" }}>
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            fontSize: "20px",
            mb: 2,
          }}
        >
          Portfolio
        </Typography>

        <Divider sx={{ mb: 3 }} />

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
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label: string) => `Quarter: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="principal"
                stroke="#656565"
                name="Principal"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="accruedInterest"
                stroke="#2196F3"
                name="Accrued Interest"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="distributions"
                stroke="#5AAC6A"
                name="Distributions"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="portfolioValue"
                stroke="#FFB800"
                name="Portfolio Value"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {!loggedIn && (
          <Box
            sx={{
              position: "absolute",
              top: 80,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(4px)",
              borderRadius: "8px",
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
                to discover innovative, sustainable, and regenerative
                development solutions. Sign in or create your account to get
                started.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="neutralYellow">CREATE ACCOUNT</Button>
                <Button
                  variant="text"
                  sx={{
                    borderColor: "text.primary",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "text.primary",
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  SIGN IN
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardPortfolio;
