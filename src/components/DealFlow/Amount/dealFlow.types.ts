// types/dealFlow.ts
export interface ProjectedReturn {
  year: number;
  cumulativeDistribution: number;
  investmentMultiple: number;
  totalGrossReturn: number;
  totalNetReturn: number;
}

export interface InvestmentStatsSummary {
  interestRateOrIrrPerc: number;
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
