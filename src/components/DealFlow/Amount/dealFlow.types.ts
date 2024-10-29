// types/dealFlow.ts

export interface ReturnsDataPoint {
  date: Date;
  distributionAmount: number;
  multiple: number;
  cumulativeDistribution: number;
  cumulativeMultiple: number;
  totalGrossReturn: number;
  totalNetReturn: number;
}

export interface ProjectedReturn {
  year: number;
  cumulativeDistribution: number;
  cumulativeMultiple: number;
  totalGrossReturn: number;
  totalNetReturn: number;
}

export interface InvestmentStats {
  irr: string;
  investmentMultiple: number;
  totalGrossReturn: number;
  totalNetReturn: number;
}

export type ViewMode = "distribution" | "multiple";

export interface ChartConfig {
  dataKey: string;
  yAxisFormatter: (value: number) => string;
  tooltipFormatter: (value: number) => [string, string];
}
