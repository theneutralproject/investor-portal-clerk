import { ReturnsDealStats } from '../returns/schema';
import {
  Bill,
  ProjectFinanceBreakdownByProjectId,
  PositionsByProject,
} from './schema';

export const groupDealStatsByProjectAndFinanceType = (
  dealStats: ReturnsDealStats[]
) =>
  dealStats.reduce((acc, stat) => {
    const { project, ...dealStat } = stat;
    const key = project.id;
    const financingType = stat.financingType;

    if (!acc[key]) {
      acc[key] = {
        debt: [],
        equity: [],
      };
    }

    acc[key][financingType].push(dealStat);

    return acc;
  }, {} as PositionsByProject);

export const buildProjectFinanceBreakdown = (
  dealsPositions: PositionsByProject,
  bills: Bill[]
) =>
  bills.reduce((acc, bill) => {
    const { project, ...payment } = bill;
    const key = project.id;

    if (!acc[key]) {
      acc[key] = {
        project: project,
        debt: {
          payments: [],
          positions: dealsPositions[key]?.debt || [],
        },
        equity: {
          payments: [],
          positions: dealsPositions[key]?.equity || [],
        },
      };
    }

    acc[key][payment.financingType].payments.push(payment);

    return acc;
  }, {} as ProjectFinanceBreakdownByProjectId);
