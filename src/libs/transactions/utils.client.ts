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
  dealStats: ReturnsDealStats[],
  bills: Bill[]
) =>
  dealStats.reduce((acc, stat) => {
    const { project, ...dealStat } = stat;
    const key = project.id;
    const financingType = stat.financingType;

    if (!acc[key]) {
      acc[key] = {
        project: project,
        debt: {
          payments: [],
          positions: [],
        },
        equity: {
          payments: [],
          positions: [],
        },
      };
    }

    acc[key][financingType].positions.push(dealStat);
    const payments = bills.filter(
      bill => bill.financingType === financingType && bill.project.id === key
    );
    acc[key][financingType].payments = payments;

    return acc;
  }, {} as ProjectFinanceBreakdownByProjectId);
