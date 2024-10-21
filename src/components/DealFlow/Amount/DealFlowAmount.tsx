import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import DealFlowFooter from "@components/DealFlow/Shared/DealFlowFooter";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";

const QUICK_SELECT_AMOUNTS = [25000, 50000, 75000, 100000];

// Fake data for multiples per year
const FAKE_MULTIPLES = [
  { year: 2024, multiple: 0.4 },
  { year: 2025, multiple: 0.6 },
  { year: 2026, multiple: 1.2 },
  { year: 2027, multiple: 1.4 },
  { year: 2028, multiple: 1.8 },
  { year: 2029, multiple: 3.0 },
];

const DealFlowAmount = () => {
  const { deal, updateDeal } = useDealFlow();
  const [amount, setAmount] = useState(deal?.investmentStats?.amount ?? 75000);
  const minInvestment = 5000;

  const error =
    amount < minInvestment
      ? `Minimum investment amount is $${minInvestment.toLocaleString()}`
      : "";

  const projectedReturns = useMemo(() => {
    return FAKE_MULTIPLES.map(({ year, multiple }) => ({
      year,
      value: amount * multiple,
    }));
  }, [amount]);

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(Number(event.target.value));
    },
    []
  );

  const handleUpdateDeal = async () => {
    if (!deal) return;

    await updateDeal({
      ...deal,
      investmentStats: {
        ...deal.investmentStats,
        amount,
      },
    });
  };

  const handleQuickSelect = useCallback((value: number) => {
    setAmount(value);
  }, []);

  const investmentStats = useMemo(
    () => ({
      irr: "18%",
      equityMultiple: 2.4,
      totalReturn: amount * 2.4,
    }),
    [amount]
  );

  return (
    <Box sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Investment Amount
      </Typography>
      <TextField
        fullWidth
        value={amount}
        onChange={handleAmountChange}
        error={!!error}
        helperText={error}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        sx={{ marginBottom: 2, bgcolor: "white", borderRadius: 1 }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 1,
        }}
      >
        {QUICK_SELECT_AMOUNTS.map((value) => (
          <Chip
            key={value}
            label={`$${value.toLocaleString()}`}
            onClick={() => handleQuickSelect(value)}
            color={amount === value ? "primary" : "default"}
            clickable
            sx={{ flex: 1, mx: 0.5 }}
          />
        ))}
      </Box>
      <Typography variant="caption">
        Minimum: ${minInvestment.toLocaleString()}
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 1 }}>
        Projected Returns
      </Typography>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={projectedReturns}>
          <XAxis dataKey="year" />
          <YAxis
            tickFormatter={(value) => `${(value / amount).toFixed(1)}x`}
            domain={[0, "dataMax"]}
          />
          <Tooltip
            formatter={(value) => [
              `${(Number(value) / amount).toFixed(2)}x`,
              "Return",
            ]}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#31713d"
            fill="#31713d"
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography>Investment Term: 60 Months</Typography>
        <Typography>IRR: {investmentStats.irr}</Typography>
        <Typography>
          Equity Multiple: {investmentStats.equityMultiple}x
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          Total Investment Return: $
          {investmentStats.totalReturn.toLocaleString()}
        </Typography>
      </Box>

      <DealFlowFooter onBack={() => null} onContinue={handleUpdateDeal} />
    </Box>
  );
};

export default DealFlowAmount;
