import { type DealInvestmentStats, DealUnitType, type ProjectInvestmentStats, type ProjectMilestones } from "@prisma/client";
import { parse } from 'csv-parse';
import { add, endOfMonth, startOfMonth } from "date-fns";
import type { ReturnsDateObject } from "./schema";
import { finished } from "stream";
import { promisify } from "util";

const finishedAsync = promisify(finished);

interface MilestoneType {
    date: Date,
    aUnitReturns: number,
    cUnitReturns: number,
}
export async function readEquityMilestoneData(csvUrl: string) {
    if (!csvUrl) {
        console.error('CSV url not provided');
        throw new Error('CSV url not provided');
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
        throw new Error(err.message);
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
    try {
        const equityMilestones = await readEquityMilestoneData(equityReturnsFileUrl);

        const firstMilestone = equityMilestones?.[0];
        if (!firstMilestone?.aUnitReturns || !firstMilestone?.cUnitReturns) {
            console.error('Milestone data not found in equity returns file');
            throw new Error('Milestone data not found in equity returns file');
        }

        if (amount >= cUnitThresholdAmount) {
            unitType = DealUnitType.CUNIT;
            numberCUnits = amount / 100000;
            shareOfEquity = -amount / firstMilestone.cUnitReturns;
        } else {
            numberAUnits = amount / 100000;
            shareOfEquity = -amount / firstMilestone.aUnitReturns;
        }

        return { unitType, numberCUnits, numberAUnits, shareOfEquity, equityMilestones };
    } catch (e) {
        console.error('Failed to get equity stats for project:', e);
        throw e;
    }
}

// Calculate interest rate based on threshold
export function getDebtInterestRate(amount: number, investmentStats: ProjectInvestmentStats) {
    return amount >= investmentStats.interestRateDollarThreshold
        ? investmentStats.interestRateMax
        : investmentStats.interestRateMin;
}

    // find last day of first month of next quarter
export function getPayoutScheduleStartDate(closingDate: Date) {
    const thisQuarter = Math.ceil((closingDate.getUTCMonth()) / 3);
    const firstDayOfNextQuarter = new Date(closingDate.getUTCFullYear(), thisQuarter * 3, 1);
    return new Date(endOfMonth(firstDayOfNextQuarter).setHours(0, 0, 0, 0));
}

function _getDebtPayoutSchedule(amount: number, interestRate: number, termMonths: number, paymentFreqMonths: number, closingDate: Date) {
    const debtPayoutSchedule: ReturnsDateObject[] = [];
    let cumulativeDistribution = 0;
    let investmentMultiple = 0;

    let distributionDivisor = 4;
    let paymentFreq = paymentFreqMonths; //default to every 3 months
    console.log("paymentFreq", paymentFreq);
    if (paymentFreq === 0) {
        // one time payment at the end of the term
        paymentFreq = termMonths;
        distributionDivisor = 1;
    }
    console.log("closingDate\t\t\t", closingDate);    
    let date = getPayoutScheduleStartDate(closingDate);
    console.log("payout schedule start date\t", date);
    for (let i = 1; i <= termMonths; i++) {
        // Move to next month
        date = startOfMonth(add(date, { months: 1 }));

        // Calculate distribution amount based on payment frequency
        let distributionAmount = 0;
        if (i % paymentFreq === 0 && i !== 0) {
            if (paymentFreq === termMonths) {
                // onetime payment at the end of the term:
                distributionAmount = amount * interestRate / 100 * termMonths / 12;
            }
            else {
                distributionAmount = (amount * interestRate / 100) / distributionDivisor;
            }
        }

        // Handle final payment (principal + interest)
        if (i === termMonths) {
            distributionAmount += amount;
        }

        // Calculate running totals
        cumulativeDistribution += distributionAmount;

        const multiple = (distributionAmount / amount);
        investmentMultiple += multiple;

        // Calculate returns
        const totalGrossReturn = cumulativeDistribution;
        const totalNetReturn = cumulativeDistribution - amount;

        // Round all numerical values for consistency
        const entry: ReturnsDateObject = {
            date,
            distributionAmount: roundTo(distributionAmount, 2),
            multiple: roundTo(multiple, 4),
            cumulativeDistribution: roundTo(cumulativeDistribution, 2),
            investmentMultiple: roundTo(investmentMultiple, 4),
            totalGrossReturn: roundTo(totalGrossReturn, 2),
            totalNetReturn: roundTo(totalNetReturn, 2),
            interestRateOrIrrPerc: interestRate,
        };

        debtPayoutSchedule.push(entry);
    }
    // console.log(debtPayoutSchedule);
    return debtPayoutSchedule;

}

// Calculate debt payout schedule for a closed or in progress deal (used in dashboard)
export function getDebtPayoutScheduleForDeal(investmentStats: DealInvestmentStats, closingDate: Date): ReturnsDateObject[] {
    if (!closingDate) {

    }
    return _getDebtPayoutSchedule(
        investmentStats.amount,
        investmentStats.debtInterestRatePerc,
        investmentStats.debtTermMonthsMax,
        investmentStats.debtPaymentFreqMonths,
        closingDate
    );
}

// Calculate debt payout schedule for a project (used to simulate returns before a deal has closed)
export function getDebtPayoutScheduleForProject(
    amount: number,
    investmentStats: ProjectInvestmentStats,
    closingDate: Date
): ReturnsDateObject[] {
    const interestRate = getDebtInterestRate(amount, investmentStats);
    return _getDebtPayoutSchedule(
        amount,
        interestRate,
        investmentStats.debtTermMonthsMax,
        investmentStats.debtPaymentFreqMonths,
        closingDate
    );
}

// Helper function for consistent rounding
export function roundTo(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}

// used in dashboard for finalized deals
export function getEquityPayoutScheduleForDeal(
    stats: DealInvestmentStats,
    projectMilestones: ProjectMilestones,
    equityMilestones: MilestoneType[]
): ReturnsDateObject[] {
    const { amount, shareOfEquity, unitType, equityPreferredReturn } = stats;
    return getEquityPayoutSchedule(
        amount,
        projectMilestones,
        equityMilestones,
        shareOfEquity,
        unitType,
        equityPreferredReturn
    );
}
// used to simulate returns for equity financing
export function getEquityPayoutScheduleForProject(
    amount: number,
    projectMilestones: ProjectMilestones,
    equityMilestones: MilestoneType[],
    shareOfEquity: number,
    unitType: DealUnitType,
    preferredReturn: number
): ReturnsDateObject[] {
    return getEquityPayoutSchedule(amount, projectMilestones, equityMilestones, shareOfEquity, unitType, preferredReturn);
}

function getEquityPayoutSchedule(
    amount: number,
    projectMilestones: ProjectMilestones,
    equityMilestones: MilestoneType[],
    shareOfEquity: number,
    unitType: DealUnitType,
    preferredReturn: number
): ReturnsDateObject[] {
    const closingDate = projectMilestones.financialClosing;
    let date = closingDate.getUTCDate() !== 1 ? startOfMonth(closingDate) : closingDate;

    if (!equityMilestones?.length) {
        throw new Error('Milestone data not found in equity returns file');
    }
    let previousEntry: ReturnsDateObject | undefined = {
        date: new Date(),
        distributionAmount: 0,
        multiple: 1,
        cumulativeDistribution: 0,
        investmentMultiple: 1,
        totalGrossReturn: 0,
        totalNetReturn: 0,
        interestRateOrIrrPerc: 0,
        accruedPreferredReturn: 0,
    }
    return equityMilestones.reduce<ReturnsDateObject[]>((schedule, em, index) => {
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
        const investmentMultiple = cumulativeDistribution / amount;
        const irr = (investmentMultiple - 1) / (index / 12);
        const accruedPreferredReturn = amount * preferredReturn * (index / 12);
        // Calculate returns
        const totalGrossReturn = cumulativeDistribution;
        const totalNetReturn = cumulativeDistribution - amount;
        schedule.push({
            date,
            distributionAmount: Number(distributionAmount.toFixed(2)),
            multiple: Number(multiple.toFixed(4)),
            cumulativeDistribution: Number(cumulativeDistribution.toFixed(2)),
            investmentMultiple: Number(investmentMultiple.toFixed(4)),
            totalGrossReturn: Number(totalGrossReturn.toFixed(2)),
            totalNetReturn: Number(totalNetReturn.toFixed(2)),
            interestRateOrIrrPerc: Number((irr * 100).toFixed(2)),
            accruedPreferredReturn: Number(accruedPreferredReturn.toFixed(2)),
        });
        previousEntry = schedule[schedule.length - 1];
        console.log(schedule[schedule.length - 1]);
        return schedule;
    }, []);
}