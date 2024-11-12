// components/DealFlowAmount.tsx
import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useDealFlow } from "@components/DealFlow/Shared/DealFlowContext";
import DealFlowFooter from "@components/DealFlow/Shared/DealFlowFooter";
import { QuickSelectChips } from "./DealFlowUI";
import { ReturnsChart } from "./DealFlowUI";
import { InvestmentStatsDisplay } from "./DealFlowUI";
import { useReturnsData } from "./useReturnsData";
import { useInvestmentStats } from "./useInvestmentStats";
import { type ViewMode } from "./dealFlow.types";
import DealFlowTitle from "@components/DealFlow/Shared/DealFlowTitle";

const QUICK_SELECT_AMOUNTS = [25000, 50000, 100000, 250000];
const MIN_INVESTMENT = 5000;
const MAX_INVESTMENT = 10_000_000;

const DealFlowAmount: React.FC = () => {
  const { deal, updateDeal, project } = useDealFlow();
  const [amount, setAmount] = useState<number>(
    deal?.investmentStats?.amount ?? 100000
  );
  const [viewMode, setViewMode] = useState<ViewMode>("distribution");

  const { returnsData, isLoading, error } = useReturnsData({
    projectId: project?.id,
    amount,
    minInvestment: MIN_INVESTMENT,
    financingType: deal?.investmentStats?.financingType,
  });

  const investmentStats = useInvestmentStats(returnsData);

  const validationError = useMemo(
    () =>
      amount < MIN_INVESTMENT
        ? `Minimum investment amount is $${MIN_INVESTMENT.toLocaleString()}`
        : "",
    [amount]
  );

  const projectedReturns = useMemo(() => {
    return returnsData.map((dataPoint) => ({
      year: dataPoint.date.getFullYear(),
      cumulativeDistribution: dataPoint.cumulativeDistribution,
      investmentMultiple: dataPoint.investmentMultiple,
      totalGrossReturn: dataPoint.totalGrossReturn,
      totalNetReturn: dataPoint.totalNetReturn,
    }));
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

  const handleViewModeChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, newMode: ViewMode) => {
      if (newMode !== null) {
        setViewMode(newMode);
      }
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

  const chartConfig = useMemo(() => {
    if (viewMode === "distribution") {
      return {
        dataKey: "cumulativeDistribution",
        yAxisFormatter: (value: number) => `$${value.toLocaleString()}`,
        tooltipFormatter: (value: number) => [
          `$${value.toLocaleString()}`,
          "Cumulative Distribution",
        ],
      };
    }
    return {
      dataKey: "investmentMultiple",
      yAxisFormatter: (value: number) => `${value.toFixed(1)}x`,
      tooltipFormatter: (value: number) => [
        `${value.toFixed(2)}x`,
        "Cumulative Multiple",
      ],
    };
  }, [viewMode]);

  return (
    <Box>
      <DealFlowTitle title="Enter Investment Amount" />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          type="number"
          value={amount}
          onChange={handleAmountChange}
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
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ height: 200 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography variant="h6">Projected Returns</Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
              >
                <ToggleButton value="distribution">Distribution</ToggleButton>
                <ToggleButton value="multiple">Multiple</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* @ts-expect-error chart types */}
            <ReturnsChart data={projectedReturns} config={chartConfig} />

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
