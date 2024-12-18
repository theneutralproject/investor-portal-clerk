import React from "react";
import { Box, Chip, styled, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  type ProjectedReturn,
  type ChartConfig,
  type InvestmentStatsSummary,
} from "./dealFlow.types";
import type { ReturnsDateObject } from "@/libs/returns/schema";
import { DealFinancingType, type DealInvestmentStats } from "@prisma/client";

interface QuickSelectChipsProps {
  amounts: number[];
  selectedAmount: number;
  onSelect: (value: number) => void;
}

export const QuickSelectChips: React.FC<QuickSelectChipsProps> = ({
  amounts,
  selectedAmount,
  onSelect,
}) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    {amounts.map((value) => (
      <Chip
        key={value}
        label={`$${value.toLocaleString()}`}
        onClick={() => onSelect(value)}
        color={selectedAmount === value ? "primary" : "default"}
        variant={selectedAmount === value ? "filled" : "outlined"}
        sx={{
          flex: 1,
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
          "&:focus": {
            backgroundColor: "black",
          },
          "&:active": {
            backgroundColor: "black",
          },
          ...(selectedAmount === value
            ? { backgroundColor: "black", color: "white" }
            : {}),
        }}
      />
    ))}
  </Box>
);

interface ReturnsChartProps {
  data: ProjectedReturn[];
  config: ChartConfig;
}

export const ReturnsChart: React.FC<ReturnsChartProps> = ({ data, config }) => (
  <Box sx={{ height: 200, width: "100%" }}>
    <ResponsiveContainer>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
      >
        <XAxis
          dataKey="year"
          tickFormatter={(value: number) => value.toString()}
        />
        <YAxis
          tickFormatter={config.yAxisFormatter}
          domain={[0, "dataMax"]}
          width={55}
        />
        <Tooltip
          formatter={config.tooltipFormatter}
          labelFormatter={(label) => `Year: ${label}`}
        />
        <Area
          type="monotone"
          dataKey={config.dataKey}
          stroke="#31713d"
          fill="#31713d"
          fillOpacity={0.8}
        />
      </AreaChart>
    </ResponsiveContainer>
  </Box>
);

interface InvestmentStatsDisplayProps {
  stats: InvestmentStatsSummary;
  returnsData: ReturnsDateObject[];
  dealInvestmentStats: DealInvestmentStats;
}
const StyledOuterBox = styled(Box)({
  marginTop: 3,
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: "10px 40px",
});

const StyledStatRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
});

const StyledLabel = styled(Typography)({
  variant: "body2",
});

const StyledValue = styled(Typography)({
  variant: "body1",
  fontWeight: 500,
});

export const InvestmentStatsDisplay: React.FC<InvestmentStatsDisplayProps> = ({
  stats,
  returnsData,
  dealInvestmentStats,
}) => (
  <StyledOuterBox>
    <StyledStatRow>
      <StyledLabel>Investment Term:</StyledLabel>
      <StyledValue>
        {(() => {
          if (returnsData.length < 2) return "N/A";

          const lastDate =
            returnsData[returnsData.length - 1]?.date ?? new Date();
          const firstDate = returnsData[0]?.date ?? new Date();
          const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30;

          const monthsDiff = Math.floor(
            (lastDate.getTime() - firstDate.getTime()) / MS_PER_MONTH
          );
          return monthsDiff + 1;
        })()}{" "}
        Months
      </StyledValue>
    </StyledStatRow>

    <StyledStatRow>
      <StyledLabel>
        {dealInvestmentStats.financingType === DealFinancingType.equity
          ? "IRR"
          : "Interest Rate"}
        :
      </StyledLabel>
      <StyledValue>{stats.interestRateOrIrrPerc}%</StyledValue>
    </StyledStatRow>

    <StyledStatRow>
      <StyledLabel>MOIC:</StyledLabel>
      <StyledValue>{stats.investmentMultiple.toFixed(2)}X</StyledValue>
    </StyledStatRow>

    <StyledStatRow sx={{ mt: 2 }}>
      <StyledLabel>Gross Return:</StyledLabel>
      <StyledValue fontSize={20}>
        ${stats.totalGrossReturn.toLocaleString()}
      </StyledValue>
    </StyledStatRow>
  </StyledOuterBox>
);
