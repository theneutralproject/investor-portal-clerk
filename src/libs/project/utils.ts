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
        console.log('readable');
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

export function getDebtPayoutSchedule(amount: number, investmentStats: ProjectInvestmentStats, milestones: ProjectMilestones) {
    const closingDate = milestones.financialClosing;
    let date = closingDate;
    if (closingDate.getUTCDate() !== 1) {
        date = startOfMonth(closingDate);
    }
    console.log('closing date', closingDate);
    console.log('start date', date);
    const interestRate = amount >= investmentStats.interestRateDollarThreshold ? investmentStats.interestRateMax : investmentStats.interestRateMin;
    const debtPayoutSchedule = [];
    let lastMultiple = 0;
    for (let i = 0; i <= investmentStats.debtTermMonths; i++) {
        date = startOfMonth(add(date, { months: 1 }));
        let distributionAmount = 0;
        if (i % 3 === 0 && i !== 0) {
            distributionAmount = (amount * interestRate / 100) / 4;
        }
        let multiple = (lastMultiple + (distributionAmount / amount));
        lastMultiple = multiple;
        if (i === investmentStats.debtTermMonths) {
            multiple += 1;
            distributionAmount += amount;
        }
        debtPayoutSchedule.push({ date, distributionAmount: Math.round(distributionAmount * 100) / 100, multiple: Math.round(multiple * 10000) / 10000 } as ReturnsDateObjectSchema);
    }
    return debtPayoutSchedule;
}

export function getEquityPayoutSchedule(amount: number, projectMilestones: ProjectMilestones, equityMilestones: MilestoneType[], shareOfEquity: number, unitType: DealUnitType) {
    const closingDate = projectMilestones.financialClosing;
    let date = closingDate;
    if (closingDate.getUTCDate() !== 1) {
        date = startOfMonth(closingDate);
    }
    const equityPayoutSchedule = [];
    let distributionAmount = 0;
    let lastMultiple = 1;
    for (const em of equityMilestones) {
        if (!em) {
            return new Error('Milestone data not found in equity returns file');
        }
        date = startOfMonth(add(date, { months: 1 }));
        if (unitType === DealUnitType.CUNIT) distributionAmount = shareOfEquity * em.cUnitReturns;
        else distributionAmount = shareOfEquity * em.aUnitReturns;
        const multiple = (lastMultiple + distributionAmount / amount);
        lastMultiple = multiple;
        equityPayoutSchedule.push({ date, distributionAmount: Math.round(distributionAmount * 100) / 100, multiple: Math.round(multiple * 10000) / 10000 });
    }
    return equityPayoutSchedule;
}
