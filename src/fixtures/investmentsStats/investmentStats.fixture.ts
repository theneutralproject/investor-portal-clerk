import { faker } from '@faker-js/faker';

export const investmentStatsFixture: any = {
  amount: faker.number.int({ min: 50000, max: 200000 }),
  debtInterestRatePerc: faker.number.int({ min: 5, max: 15 }),
  debtTermMonthsMax: faker.number.int({ min: 12, max: 60 }),
  debtPaymentFreqMonths: faker.helpers.arrayElement([1, 3, 6, 12]),
  dealId: faker.string.uuid(),
};

export const projectInvestmentStatsFixture: any = {
  amount: faker.number.int({ min: 50000, max: 200000 }),
  debtTermMonthsMax: faker.number.int({ min: 12, max: 60 }),
  debtPaymentFreqMonths: faker.helpers.arrayElement([1, 3, 6, 12]),
  interestRateDollarThreshold: faker.number.int({
    min: 50000,
    max: 150000,
  }),
  interestRateMax: faker.number.int({ min: 10, max: 15 }),
  interestRateMin: faker.number.int({ min: 5, max: 9 }),
};
