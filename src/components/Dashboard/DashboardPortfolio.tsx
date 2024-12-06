import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
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
} from "recharts";
import PortfolioMetric from "./PortfolioMetric";

interface MetricData {
  label: string;
  value: string;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
}

const DashboardPortfolio: React.FC<{ loggedIn: boolean }> = ({ loggedIn }) => {
  const theme = useTheme();

  const metrics: MetricData[] = [
    { label: "Portfolio Value", value: "$0", color: "#FFB800" },
    { label: "Distributions", value: "$0", color: "#5AAC6A" },
    { label: "Accrued Interest", value: "$0", color: "#2196F3" },
    { label: "Principal", value: "$0", color: "#656565" },
  ];

  const chartData: ChartData[] = [
    { name: "Q1 23", value: 0 },
    { name: "Q2 23", value: 0 },
    { name: "Q3 23", value: 0 },
    { name: "Q4 23", value: 0 },
    { name: "Q1 24", value: 0 },
    { name: "Q2 24", value: 0 },
  ];

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
              margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
            >
              <CartesianGrid
                stroke={theme.palette.grey[200]}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary }}
                dy={10}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme.palette.text.secondary }}
                ticks={[0, 100000, 200000, 300000]}
                tickFormatter={(value) => `$${value / 1000}k`}
                dx={-10}
                padding={{ top: 20, bottom: 20 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={false}
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
