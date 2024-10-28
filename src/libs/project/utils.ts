import { DealUnitType, type ProjectInvestmentStats, type ProjectMilestones } from "@prisma/client";
import { parse } from 'csv-parse';
import { add, startOfMonth } from "date-fns";
import type { ReturnsDateObjectSchema } from "./schema";
import { isError } from "lodash";
import { finished } from "stream";
import { promisify } from "util";

const finishedAsync = promisify(finished);

interface MilestoneType {
    date: Date,
    aUnitReturns: number,
    cUnitReturns: number,
}
async function readEquityMilestoneData(csvUrl: string): Promise<MilestoneType[] | Error> {
    if (!csvUrl) {
        console.error('CSV url not provided');
        return new Error('CSV url not provided');
    }
    const response = await fetch(csvUrl);
    const text = await response.text();
    const parser = parse(text, { columns: true });

    const milestones: MilestoneType[] = [];
    parser.on('readable', function () {
        let record;
        /* eslint-disable */
        while ((record = parser.read()) !== null) {
            const milestone: MilestoneType = {
                date: new Date(Date.parse(record.date)),
                aUnitReturns: 0,
                cUnitReturns: 0,
            };
            milestone.aUnitReturns = parseFloat(record['aUnitReturns'].replace('$', '').replaceAll(',', ''));
            milestone.cUnitReturns = parseFloat(record['cUnitReturns'].replace('$', '').replaceAll(',', ''));
            /* eslint-enable */
            milestones.push(milestone);
        }
    });
    // Catch any error
    parser.on('error', function (err) {
        console.error(err.message);
        return new Error(err.message);
    });
    parser.on('end', function () {
        return milestones;
    });

    await finishedAsync(parser);
    return milestones;
}

// calculate deal unit type, share of equity, and number of units
export async function getEquityStatsFromProject(amount: number, equityReturnsFileUrl: string, cUnitThresholdAmount: number) {
    let unitType: DealUnitType = DealUnitType.AUNIT;
    let numberCUnits = 0;
    let numberAUnits = 0;
    let shareOfEquity = 0;

    const equityMilestones = await readEquityMilestoneData(equityReturnsFileUrl);
    if (isError(equityMilestones)) {
        return equityMilestones;
    }

    const firstMilestone = equityMilestones?.[0];
    if (!firstMilestone?.aUnitReturns || !firstMilestone?.cUnitReturns) {
        console.error('Milestone data not found in equity returns file');
        return new Error('Milestone data not found in equity returns file');
    }

    if (amount >= cUnitThresholdAmount) {
        unitType = DealUnitType.CUNIT;
        numberCUnits = amount / 100000;
        shareOfEquity = -amount / firstMilestone.cUnitReturns;
    } else {
        numberAUnits = amount / 100000;
        shareOfEquity = -amount / firstMilestone.aUnitReturns;
    }

    console.log('unitType', unitType);
    console.log('numberCUnits', numberCUnits);
    console.log('numberAUnits', numberAUnits);
    console.log('shareOfEquity', shareOfEquity);

    return { unitType, numberCUnits, numberAUnits, shareOfEquity, equityMilestones };
}


export function getDebtPayoutSchedule(
    amount: number,
    investmentStats: ProjectInvestmentStats,
    milestones: ProjectMilestones
): ReturnsDateObjectSchema[] {
    // Initialize closing date logic
    const closingDate = milestones.financialClosing;
    let date = closingDate;
    if (closingDate.getUTCDate() !== 1) {
        date = startOfMonth(closingDate);
    }

    // Calculate interest rate based on threshold
    const interestRate = amount >= investmentStats.interestRateDollarThreshold
        ? investmentStats.interestRateMax
        : investmentStats.interestRateMin;

    const debtPayoutSchedule: ReturnsDateObjectSchema[] = [];
    let cumulativeDistribution = 0;
    let cumulativeMultiple = 0;

    for (let i = 1; i <= investmentStats.debtTermMonths; i++) {
        // Move to next month
        date = startOfMonth(add(date, { months: 1 }));

        // Calculate distribution amount (quarterly interest payments)
        let distributionAmount = 0;
        if (i % 3 === 0 && i !== 0) {
            distributionAmount = (amount * interestRate / 100) / 4;
        }

        // Handle final payment (principal + interest)
        if (i === investmentStats.debtTermMonths) {
            distributionAmount += amount;
        }

        // Calculate running totals
        cumulativeDistribution += distributionAmount;
    
        const multiple = (distributionAmount / amount);
        cumulativeMultiple += multiple;

        // Calculate returns
        const totalGrossReturn = cumulativeDistribution;
        const totalNetReturn = cumulativeDistribution - amount;

        // Round all numerical values for consistency
        const entry: ReturnsDateObjectSchema = {
            date,
            distributionAmount: roundTo(distributionAmount, 2),
            multiple: roundTo(multiple, 4),
            cumulativeDistribution: roundTo(cumulativeDistribution, 2),
            cumulativeMultiple: roundTo(cumulativeMultiple, 4),
            totalGrossReturn: roundTo(totalGrossReturn, 2),
            totalNetReturn: roundTo(totalNetReturn, 2),
        };

        debtPayoutSchedule.push(entry);
    }

    return debtPayoutSchedule;
}

// Helper function for consistent rounding
function roundTo(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}

export function getEquityPayoutSchedule(
    amount: number,
    projectMilestones: ProjectMilestones,
    equityMilestones: MilestoneType[],
    shareOfEquity: number,
    unitType: DealUnitType
): ReturnsDateObjectSchema[] {
    const closingDate = projectMilestones.financialClosing;
    let date = closingDate.getUTCDate() !== 1 ? startOfMonth(closingDate) : closingDate;

    if (!equityMilestones?.length) {
        throw new Error('Milestone data not found in equity returns file');
    }
    let previousEntry: ReturnsDateObjectSchema | undefined = {
        date: new Date(),
        distributionAmount: 0,
        multiple: 1,
        cumulativeDistribution: 0,
        cumulativeMultiple: 1,
        totalGrossReturn: 0,
        totalNetReturn: 0
    }
    return equityMilestones.reduce<ReturnsDateObjectSchema[]>((schedule, em, index) => {
        if (!em) {
            throw new Error(`Invalid milestone data at index ${index}`);
        }
        if (index === 0) {
            return schedule;
        }
        // Advance date by one month
        date = startOfMonth(add(date, { months: 1 }));

        // Calculate distribution amount based on unit type
        const distributionAmount = shareOfEquity *
            (unitType === DealUnitType.CUNIT ? em.cUnitReturns : em.aUnitReturns);

        const cumulativeDistribution = (previousEntry?.cumulativeDistribution ?? 0) + distributionAmount;
        const multiple = distributionAmount / amount;
        const cumulativeMultiple = cumulativeDistribution / amount;

        // Calculate returns
        const totalGrossReturn = cumulativeDistribution;
        const totalNetReturn = cumulativeDistribution - amount;
        schedule.push({
            date,
            distributionAmount: Number(distributionAmount.toFixed(2)),
            multiple: Number(multiple.toFixed(4)),
            cumulativeDistribution: Number(cumulativeDistribution.toFixed(2)),
            cumulativeMultiple: Number(cumulativeMultiple.toFixed(4)),
            totalGrossReturn: Number(totalGrossReturn.toFixed(2)),
            totalNetReturn: Number(totalNetReturn.toFixed(2))
        });
        previousEntry = schedule[schedule.length - 1];

        return schedule;
    }, []);
}