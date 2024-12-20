import type { ProjectWithStats } from "@/libs/types";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Divider,
  useTheme,
} from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { styled } from "@mui/material/styles";

const InputGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

// Custom Legend styles
const LegendContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "24px",
  justifyContent: "center",
  padding: "8px 0",
});

const LegendItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const LegendDot = styled("div")<{ color: string }>(({ color }) => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: color,
}));

interface LegendPayloadItem {
  color: string;
  value: string;
}

interface CustomLegendProps {
  payload: LegendPayloadItem[];
}

const CustomLegend = ({ payload }: CustomLegendProps) => {
  return (
    <LegendContainer>
      {payload.map((entry, index) => (
        <LegendItem key={`legend-${index}`}>
          <LegendDot color={entry.color} />
          <Typography variant="body2" color="text.secondary">
            {entry.value}
          </Typography>
        </LegendItem>
      ))}
    </LegendContainer>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload?.length) {
    return (
      <Card sx={{ p: 1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
        <Typography variant="subtitle2">Time: {label}</Typography>
        {payload.map((entry) => (
          <Typography
            key={entry.name}
            variant="body2"
            sx={{ color: entry.color }}
          >
            {entry.name}: {entry.value}%
          </Typography>
        ))}
      </Card>
    );
  }
  return null;
};

const InvestmentCalculatorNew = ({
  project,
}: {
  project: ProjectWithStats;
}) => {
  const theme = useTheme();
  const [investment, setInvestment] = useState(100000);
  const [investmentType, setInvestmentType] = useState("Equity");

  const targetTermLengthEquity = project.investmentStats.equityTermMonths;
  const targetTermLengthDebt = project.investmentStats.debtTermMonthsMax;
  const { targetEquityMultiple, interestRateMax, interestRateMin, interestRateDollarThreshold } = project.investmentStats;
  const sp_annual_rate = 12.2;
  const reit_annual_rate = 11.3;

  const sp500return = Math.round(
    investment * (1 + (sp_annual_rate / 100) * (targetTermLengthEquity / 12))
  );
  const reitReturn = Math.round(
    investment * (1 + (reit_annual_rate / 100) * (targetTermLengthEquity / 12))
  );
  const getDebtInterestRate = () => (investment < interestRateDollarThreshold) ? interestRateMin : interestRateMax;

  const getTargetedReturn = () => {
    return Math.round(getTargetMultiple() * investment).toLocaleString();
  }

  const getTargetetTermLength = () => {
    return investmentType === "Equity"
      ? targetTermLengthEquity
      : targetTermLengthDebt;
  }

  const getTargetMultiple = () => {
    return investmentType === "Equity"
      ? targetEquityMultiple
      : (getDebtInterestRate() * targetTermLengthDebt / 12) / 100 + 1;
  }

  const generateEquityChartData = () => {
    const years = Math.ceil(targetTermLengthEquity / 12);
    const data = [];
    const monthlyRate =
      Math.pow(targetEquityMultiple, 1 / targetTermLengthEquity) - 1;
    const sp500MonthlyRate = sp_annual_rate / 1200;
    const reitMonthlyRate = reit_annual_rate / 1200;

    for (let year = 0; year <= years; year++) {
      const months = year * 12;
      const targetValue = investment * Math.pow(1 + monthlyRate, months);
      const sp500Value = investment * Math.pow(1 + sp500MonthlyRate, months);
      const reitValue = investment * Math.pow(1 + reitMonthlyRate, months);

      data.push({
        year: year === 0 ? "0" : `${year}yrs`,
        [`${project.name} (Target Return)`]: Number(
          ((targetValue / investment - 1) * 100).toFixed(1)
        ),
        "S&P 500 (Avg.)": Number(
          ((sp500Value / investment - 1) * 100).toFixed(1)
        ),
        "Real Estate Investment Trust (Avg.)": Number(
          ((reitValue / investment - 1) * 100).toFixed(1)
        ),
      });
    }
    return data;
  };

  const generateDebtChartData = () => {
    const years = Math.ceil(targetTermLengthDebt / 12);
    const data = [];
    const monthlyRate = getDebtInterestRate() / 1200;
    const sp500MonthlyRate = sp_annual_rate / 1200;
    const reitMonthlyRate = reit_annual_rate / 1200;
console.log('monthlyRate', monthlyRate * 12, sp500MonthlyRate, reitMonthlyRate);
    for (let year = 0; year <= years; year++) {
      const months = year * 12;
      const targetValue = investment * Math.pow(1 + monthlyRate, months);
      console.log(Math.pow(1 + monthlyRate, months), targetValue,months);
      const sp500Value = investment * Math.pow(1 + sp500MonthlyRate, months);
      const reitValue = investment * Math.pow(1 + reitMonthlyRate, months);
console.log(year, targetValue, sp500Value, reitValue);
      data.push({
        year: year === 0 ? "0" : `${year}yrs`,
        [`${project.name} (Target Return)`]: Number(
          ((targetValue / investment - 1) * 100).toFixed(1)
        ),
        "S&P 500 (Avg.)": Number(
          ((sp500Value / investment - 1) * 100).toFixed(1)
        ),
        "Real Estate Investment Trust (Avg.)": Number(
          ((reitValue / investment - 1) * 100).toFixed(1)
        ),
      });
    }
    return data;
  }

  const getChartData = () => {
    return investmentType === "Equity"
      ? generateEquityChartData()
      : generateDebtChartData();
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvestment(Number(event.target.value));
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Investment Calculator
        </Typography>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <InputGrid>
          <TextField
            variant="outlined"
            label="Investment Amount ($)"
            type="number"
            value={investment}
            onChange={handleInputChange}
            fullWidth
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={investmentType}
              onChange={(e) => setInvestmentType(e.target.value)}
              label="Type"
            >
              <MenuItem value="Equity">Equity</MenuItem>
              <MenuItem value="Debt">Debt</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Target Term Length"
            value={`${getTargetetTermLength()} Months`}
            disabled
          />

          <TextField
            fullWidth
            label="Target Equity Multiple"
            value={`${getTargetMultiple()}x`}
            disabled
          />
        </InputGrid>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            ${getTargetedReturn()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total target return ({getTargetetTermLength()} Mo.)
          </Typography>
        </Box>

        <Box sx={{ width: "100%", height: 400, mb: 3 }}>
          <ResponsiveContainer>
            <AreaChart
              data={getChartData()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 30]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend payload={[]} />} />
              <Area
                type="monotone"
                dataKey={`${project.name} (Target Return)`}
                stackId="1"
                stroke={theme.palette.success.main}
                fill={theme.palette.success.light}
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="S&P 500 (Avg.)"
                stackId="2"
                stroke={theme.palette.primary.main}
                fill={theme.palette.primary.light}
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="Real Estate Investment Trust (Avg.)"
                stackId="3"
                stroke={theme.palette.warning.main}
                fill={theme.palette.warning.light}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Compare returns:
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">AVG. S&P 500</Typography>
            <Typography>${sp500return.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary">
              AVG. Real estate investment trust
            </Typography>
            <Typography>${reitReturn.toLocaleString()}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvestmentCalculatorNew;
