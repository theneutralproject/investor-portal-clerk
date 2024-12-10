import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import DealFlowFooter from "@components/DealFlow/Shared/DealFlowFooter";
import { QuickSelectChips } from "./DealFlowUI";
import { InvestmentStatsDisplay } from "./DealFlowUI";
import { useReturnsData } from "./useReturnsData";
import DealFlowTitle from "@components/DealFlow/Shared/DealFlowTitle";
import { DealFinancingType } from "@prisma/client";

const QUICK_SELECT_AMOUNTS = [25000, 50000, 100000, 250000];
const ACCRUED_RETURN_COLOR = "#d7b15c";
const GROSS_RETURN_COLOR = "#3e6f42";

const DealFlowAmount: React.FC = () => {
  const { deal, updateDeal, project } = useDealFlow();
  const [amount, setAmount] = useState<number>(
    deal?.investmentStats?.amount ?? 100000
  );

  const MIN_INVESTMENT =
    deal?.investmentStats?.financingType === DealFinancingType.equity
      ? project?.investmentStats?.equityMinInvestment ?? 5000
      : project?.investmentStats?.debtMinInvestment ?? 5000;
  const MAX_INVESTMENT = 10_000_000;

  const { returnsData, isLoading, error, stats: investmentStats } = useReturnsData({
    projectId: project?.id,
    amount,
    minInvestment: MIN_INVESTMENT,
    financingType: deal?.investmentStats?.financingType,
  });

  const validationError = useMemo(
    () =>
      amount < MIN_INVESTMENT
        ? `Minimum investment amount is $${MIN_INVESTMENT.toLocaleString()}`
        : "",
    [amount, MIN_INVESTMENT]
  );

  const chartData = useMemo(() => {
    return returnsData.map((dataPoint) => {
      const date = new Date(dataPoint.date);
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const year = date.getFullYear().toString().slice(2);
      return {
        date: `Q${quarter} '${year}`,
        accruedPreferredReturn: dataPoint.equityAccruedPreferredReturn,
        totalGrossReturn: dataPoint.equityDistributionCumulative + dataPoint.debtDistributionsCumulative,
        fullDate: date,
      };
    });
  }, [returnsData]);

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount = Number(event.target.value);
      if (newAmount > MAX_INVESTMENT) {
        setAmount(MAX_INVESTMENT);
      } else {
        setAmount(newAmount);
      }
    },
    []
  );

  const handleUpdateDeal = async () => {
    if (!deal) return;

    await updateDeal({
      ...deal,
      dealStage: 1, //Input amount
      investmentStats: {
        ...deal.investmentStats,
        amount,
      },
    });
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  interface TooltipProps {
    active?: boolean;
    payload?: {
      dataKey: string;
      value: number;
      color: string;
    }[];
    label?: string;
  }

  const customTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload?.length) {
      return (
        <Box
          sx={{
            backgroundColor: "white",
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 1,
          }}
        >
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.dataKey === "totalGrossReturn"
                ? "Cumulative Investor Return: "
                : "Investor Accrued Preferred Return: "}
              {formatCurrency(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <DealFlowTitle title="Enter Investment Amount" />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          type="text"
          value={amount.toLocaleString()}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            handleAmountChange({
              target: { value },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          error={!!validationError}
          helperText={validationError}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
        />

        <QuickSelectChips
          amounts={QUICK_SELECT_AMOUNTS}
          selectedAmount={amount}
          onSelect={setAmount}
        />

        <Typography variant="caption" color="text.secondary">
          Minimum: ${MIN_INVESTMENT.toLocaleString()}
        </Typography>

        {isLoading ? (
          <Box
            sx={{
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ height: 400 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Investor Returns
            </Typography>

            <Box sx={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 60,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    tickFormatter={formatCurrency}
                    width={60}
                    tickMargin={5}
                  />
                  {/* @ts-expect-error type error */}
                  <Tooltip content={customTooltip} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="totalGrossReturn"
                    stackId="1"
                    stroke={GROSS_RETURN_COLOR}
                    fill={GROSS_RETURN_COLOR}
                    name="Cumulative Investor Return"
                    fillOpacity={1}
                  />
                  <Area
                    type="monotone"
                    dataKey="accruedPreferredReturn"
                    stackId="2"
                    stroke={ACCRUED_RETURN_COLOR}
                    fill={ACCRUED_RETURN_COLOR}
                    name="Investor Accrued Preferred Return"
                    fillOpacity={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>

            {investmentStats && (
              <InvestmentStatsDisplay
                stats={investmentStats}
                returnsData={returnsData}
                dealInvestmentStats={deal.investmentStats}
              />
            )}
          </>
        )}
      </Box>

      <DealFlowFooter onBack={() => null} onContinue={handleUpdateDeal} />
    </Box>
  );
};

export default DealFlowAmount;
