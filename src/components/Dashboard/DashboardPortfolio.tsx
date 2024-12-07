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
import { ProjectWithAllNestedData } from "@/libs/types";
import { useQuery } from "@tanstack/react-query";
import { DashboardPortfolioResponse } from "@/libs/types";
import axios from "axios";

interface MetricData {
  label: string;
  value: string;
  color: string;
}

const DashboardPortfolio: React.FC<{ loggedIn: boolean }> = ({ loggedIn }) => {
  const { isLoading, data } = useQuery<DashboardPortfolioResponse, Error>({
    queryKey: ["dashboard", "portfolio"],
    queryFn: () =>
      axios
        .get<DashboardPortfolioResponse>("/api/dashboard/returns")
        .then((res) => res.data),
  });

  const metrics: MetricData[] = [
    { label: "Portfolio Value", value: "$0", color: "#FFB800" },
    { label: "Distributions", value: "$0", color: "#5AAC6A" },
    { label: "Accrued Interest", value: "$0", color: "#2196F3" },
    { label: "Principal", value: "$0", color: "#656565" },
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
            <LineChart data={[]}></LineChart>
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


/*
Example response:
{
  "consolidatedSchedule": [
    {
      "date": "2024-12-01T06:00:00.000Z",
      "distributionAmount": 0,
      "multiple": 0,
      "cumulativeDistribution": 0,
      "investmentMultiple": 0,
      "totalGrossReturn": 0,
      "totalNetReturn": -100000,
      "interestRateOrIrrPerc": -1200,
      "accruedPreferredReturn": 0,
      "dealId": 1216
    },
    {
      "date": "2025-01-01T06:00:00.000Z",
      "distributionAmount": 0,
      "multiple": 0,
      "cumulativeDistribution": 0,
      "investmentMultiple": 0,
      "totalGrossReturn": 0,
      "totalNetReturn": -100000,
      "interestRateOrIrrPerc": -600,
      "accruedPreferredReturn": 0,
      "dealId": 1216
    }
  ],
  "portfolioStats": {
    "portfolioValueToDate": 100000,
    "distributionsToDate": 0,
    "accruedInterestToDate": 0,
    "projectedInterest": 0,
    "projectedDistributions": 193006.9300000001,
    "projectedPortfolioValue": 293006.9299999999,
    "principalInvested": 100000
  },
  "dealSummaryStats": [
    {
      "dealId": 1216,
      "committedAmount": 100000,
      "distributionsToDate": 0,
      "accruedInterestToDate": 0
    }
  ]
}
*/