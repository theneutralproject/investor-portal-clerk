// hooks/useInvestmentStats.ts
import { useMemo } from "react";
import type { InvestmentStatsSummary } from "./dealFlow.types";
import type { ReturnsDateObject } from "@/libs/returns/schema";

export const useInvestmentStats = (
  returnsData: ReturnsDateObject[]
): InvestmentStatsSummary | null => {
  return useMemo(() => {
    if (returnsData.length === 0) return null;
    const lastDataPoint = returnsData[returnsData.length - 1];
    const firstDataPoint = returnsData[0];
    if (!lastDataPoint || !firstDataPoint) return null;
    return {
      interestRateOrIrrPerc: lastDataPoint.interestRateOrIrrPerc,
      investmentMultiple: lastDataPoint.investmentMultiple,
      totalGrossReturn: lastDataPoint.totalGrossReturn,
      totalNetReturn: lastDataPoint.totalNetReturn,
    };
  }, [returnsData]);
};
