import {
  PortfolioReturnsResponse,
  ReturnsDateObject,
} from '@/libs/returns/schema';

export interface MetricData {
  label: string;
  toDateValue: string;
  projectedTotalValue: string;
  color: string;
}

export interface QuarterData {
  quarter: string;
  principal: number;
  equityDistributions: number;
  debtDistributions: number;
  portfolioValue: number;
  isProjected: boolean;
}

export interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  payload: { isProjected: boolean };
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatQuarter = (dateString: string): string => {
  const date = new Date(dateString);
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  const year = date.getFullYear().toString().slice(-2);
  return `Q${quarter} '${year}`;
};

export const groupByQuarter = (
  schedule: ReturnsDateObject[]
): QuarterData[] => {
  const currentDate = new Date();
  const quarterData = schedule.reduce<Record<string, QuarterData>>(
    (acc, curr) => {
      const quarterKey = formatQuarter(curr.date.toString());
      const isProjected = new Date(curr.date) > currentDate;

      if (!acc[quarterKey]) {
        acc[quarterKey] = {
          quarter: quarterKey,
          principal: curr.principalInvestedToDate,
          equityDistributions: 0,
          debtDistributions: 0,
          portfolioValue: curr.portfolioValueToDate,
          isProjected,
        };
      } else {
        acc[quarterKey].isProjected =
          acc[quarterKey].isProjected || isProjected;
      }

      acc[quarterKey].debtDistributions = Math.max(
        acc[quarterKey].debtDistributions,
        curr.debtDistributionsCumulative
      );
      acc[quarterKey].equityDistributions = Math.max(
        0,
        curr.equityDistributionCumulative
      );
      acc[quarterKey].portfolioValue =
        acc[quarterKey].principal +
        acc[quarterKey].equityDistributions +
        curr.portfolioValueToDate -
        acc[quarterKey].debtDistributions;

      return acc;
    },
    {}
  );

  return Object.values(quarterData);
};

// Calculate the position for today's reference line
export const calculateTodayLinePosition = (chartData: any) => {
  if (!chartData.length) return null;

  const today = new Date();
  const currentQuarter = Math.floor(today.getMonth() / 3) + 1;
  const currentYear = today.getFullYear();
  // Find the current quarter in the chart data
  const currentQuarterIndex = chartData.findIndex((data: QuarterData) => {
    const [q, year] = data.quarter.split(' ');
    const quarterNum = parseInt(q?.slice(1) ?? '0');
    const yearNum = 2000 + parseInt(year?.slice(1) ?? '0');

    return yearNum === currentYear && quarterNum === currentQuarter;
  });

  if (currentQuarterIndex === -1) {
    // If current quarter is before first quarter in data, return 0
    const [q, year] = chartData[0].quarter.split(' ');
    const firstQuarterNum = parseInt(q.slice(1));
    const firstYearNum = 2000 + parseInt(year.slice(1));

    if (
      currentYear < firstYearNum ||
      (currentYear === firstYearNum && currentQuarter < firstQuarterNum)
    ) {
      return 0;
    }
    // If current quarter is after last quarter in data, return 100
    return 100;
  }

  // Calculate how far we are through the current quarter
  const monthInQuarter = today.getMonth() % 3;
  const dayInMonth = today.getDate();
  const percentThroughQuarter = (monthInQuarter * 30 + dayInMonth) / (3 * 30);

  // Calculate percentage through all data
  const percentage =
    ((currentQuarterIndex + percentThroughQuarter) / chartData.length) * 100;

  return percentage;
};

export const dataAccessors = {
  principal: (data: QuarterData) =>
    data.isProjected ? undefined : data.principal,
  principalProjected: (data: QuarterData) =>
    data.isProjected ? data.principal : data.principal,
  equityDistributions: (data: QuarterData) =>
    data.isProjected ? undefined : data.equityDistributions,
  equityDistributionsProjected: (data: QuarterData) =>
    data.isProjected ? data.equityDistributions : data.equityDistributions,
  debtDistributions: (data: QuarterData) =>
    data.isProjected ? undefined : data.debtDistributions,
  debtDistributionsProjected: (data: QuarterData) =>
    data.isProjected ? data.debtDistributions : data.debtDistributions,
  portfolioValue: (data: QuarterData) =>
    data.isProjected ? undefined : data.portfolioValue,
  portfolioValueProjected: (data: QuarterData) =>
    data.isProjected ? data.portfolioValue : data.portfolioValue,
};

export const getMetrics = (
  data: PortfolioReturnsResponse | null
): MetricData[] => {
  if (!data) {
    return [
      {
        label: 'Portfolio Value',
        toDateValue: '$0',
        projectedTotalValue: '$0',
        color: '#FFB800',
      },
      {
        label: 'Debt Distributions',
        toDateValue: '$0',
        projectedTotalValue: '$0',
        color: '#5AAC6A',
      },
      {
        label: 'Equity Distributions',
        toDateValue: '$0',
        projectedTotalValue: '$0',
        color: '#2196F3',
      },
      {
        label: 'Principal',
        toDateValue: '$0',
        projectedTotalValue: '$0',
        color: '#656565',
      },
    ];
  }

  return [
    {
      label: 'Proj. Portfolio Value',
      toDateValue: formatCurrency(data.portfolioStats.portfolioValueToDate),
      projectedTotalValue: formatCurrency(
        data.portfolioStats.projectedPortfolioValue
      ),
      color: '#FFB800',
    },
    {
      label: 'Proj. Debt Distributions',
      toDateValue: formatCurrency(data.portfolioStats.debtDistributionsToDate),
      projectedTotalValue: formatCurrency(
        data.portfolioStats.projectedDebtDistributions
      ),
      color: '#5AAC6A',
    },
    {
      label: 'Proj. Equity Distributions',
      toDateValue: formatCurrency(
        data.portfolioStats.equityDistributionsToDate
      ),
      projectedTotalValue: formatCurrency(
        data.portfolioStats.projectedEquityDistributions
      ),
      color: '#2196F3',
    },
    {
      label: 'Principal',
      toDateValue: formatCurrency(data.portfolioStats.principalInvested),
      projectedTotalValue: formatCurrency(
        data.portfolioStats.principalInvested
      ),
      color: '#656565',
    },
  ];
};

export const getChartData = (data: PortfolioReturnsResponse | null) => {
  if (!data) return [];
  return groupByQuarter(data.consolidatedSchedule);
};

// Find the first projected quarter index
export const getProjectedStartIndex = (data: PortfolioReturnsResponse) => {
  return getChartData(data).findIndex(data => data.isProjected);
};
