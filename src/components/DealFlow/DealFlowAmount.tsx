import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useDealFlow } from "./DealFlowContext";
import DealFlowFooter from "./DealFlowFooter";

const QUICK_SELECT_AMOUNTS = [25000, 50000, 75000, 100000];

const getBaseReturns = (investmentAmount: number): number[] => {
  if (investmentAmount >= 100000) return [0.5, 0.8, 1.4, 2.0, 2.8, 4.0];
  if (investmentAmount >= 50000) return [0.45, 0.7, 1.2, 1.7, 2.3, 3.5];
  return [0.4, 0.6, 1.0, 1.4, 1.8, 3.0];
};

const DealFlowAmount: React.FC = ({}) => {
  const { deal, updateDeal, project } = useDealFlow();
  const minInvestment = project?.investmentStats?.debtMinInvestment ?? 5000;

  const [amount, setAmount] = useState(
    deal?.investmentStats?.amount ?? minInvestment
  );

  const error =
    amount < minInvestment
      ? `Minimum investment amount is $${minInvestment.toLocaleString()}`
      : "";

  const projectedReturns = useMemo(() => {
    const baseReturns = getBaseReturns(amount);
    const minReturns = getBaseReturns(minInvestment);
    const maxReturns = getBaseReturns(100000);

    return baseReturns.map((returnMultiple, index) => ({
      year: new Date().getFullYear() + index,
      current: amount * returnMultiple,
      min: minInvestment * (minReturns[index] ?? 0),
      max: 100000 * (maxReturns[index] ?? 0),
    }));
  }, [amount, minInvestment]);

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(Number(event.target.value));
    },
    []
  );

  const handleQuickSelect = useCallback((value: number) => {
    setAmount(value);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!deal) return;
    try {
      await updateDeal({
        ...deal,
        investmentStats: {
          ...deal.investmentStats,
          amount: amount,
        },
      });
    } catch (error) {
      console.error("Error updating deal:", error);
    } finally {
    }
  }, [deal, amount, updateDeal]);

  const investmentStats = useMemo(() => {
    const irr = project?.investmentStats?.equityIRR ?? "18%";
    const equityMultiple =
      project?.investmentStats?.targetEquityMultiple ?? 3.0;
    const totalReturn = amount * equityMultiple;

    return { irr, equityMultiple, totalReturn };
  }, [amount, project]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Enter Investment Amount
      </Typography>
      <TextField
        fullWidth
        label="Investment Amount"
        value={amount}
        onChange={handleAmountChange}
        error={!!error}
        helperText={error}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        sx={{ marginBottom: 2 }}
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
          />
        ))}
      </Box>
      <Typography variant="caption">
        Minimum: ${minInvestment.toLocaleString()}
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Projected Returns Comparison
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={projectedReturns}>
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="current"
            name="Your Investment"
            stroke="#4CAF50"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="min"
            name="Minimum Investment"
            stroke="#FFA000"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="max"
            name="Maximum Investment"
            stroke="#2196F3"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>

      <Box sx={{ mt: 3 }}>
        <Typography>
          Investment Term: {project?.investmentStats?.debtTermMonths ?? 60}{" "}
          Months
        </Typography>
        <Typography>IRR: {investmentStats.irr}</Typography>
        <Typography>
          Equity Multiple: {investmentStats.equityMultiple}x
        </Typography>
        <Typography>
          Total Investment Return: $
          {investmentStats.totalReturn.toLocaleString()}
        </Typography>
      </Box>

      <DealFlowFooter onBack={() => null} onContinue={handleSubmit} />
    </Box>
  );
};

export default DealFlowAmount;
