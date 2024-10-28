import React from "react";
import { Box, Chip, Typography } from "@mui/material";
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
  type InvestmentStats,
  type ReturnsDataPoint,
} from "./dealFlow.types";

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
        sx={{ flex: 1 }}
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
  stats: InvestmentStats;
  returnsData: ReturnsDataPoint[];
}

export const InvestmentStatsDisplay: React.FC<InvestmentStatsDisplayProps> = ({
  stats,
  returnsData,
}) => (
  <Box
    sx={{
      mt: 3,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Typography>
      Investment Term:{" "}
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
    </Typography>
    <Typography>IRR: {stats.irr}</Typography>
    <Typography>MOIC: {stats.investmentMultiple.toFixed(2)}X</Typography>
    <Typography>
      Gross Return: ${stats.totalGrossReturn.toLocaleString()}
    </Typography>
  </Box>
);
