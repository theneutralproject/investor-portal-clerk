// hooks/useInvestmentStats.ts
import { useMemo } from "react";
import { type ReturnsDataPoint, type InvestmentStats } from "./dealFlow.types";

export const useInvestmentStats = (
  returnsData: ReturnsDataPoint[]
): InvestmentStats | null => {
  return useMemo(() => {
    if (returnsData.length === 0) return null;

    const lastDataPoint = returnsData[returnsData.length - 1];
    const firstDataPoint = returnsData[0];

    if (!lastDataPoint || !firstDataPoint) return null;

    const investmentPeriodInMonths =
      (lastDataPoint.date.getTime() - firstDataPoint.date.getTime()) /
      (1000 * 60 * 60 * 24 * 30);

    return {
      irr: `${(
        ((lastDataPoint.cumulativeMultiple - 1) * 100) /
        (investmentPeriodInMonths / 12)
      ).toFixed(1)}%`,
      equityMultiple: lastDataPoint.cumulativeMultiple,
      totalGrossReturn: lastDataPoint.totalGrossReturn,
      totalNetReturn: lastDataPoint.totalNetReturn,
    };
  }, [returnsData]);
};
