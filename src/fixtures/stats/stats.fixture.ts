import { faker } from '@faker-js/faker';
import { DealUnitType } from '@prisma/client';

export const statsFixture: any = {
  amount: faker.number.int({ min: 100000, max: 200000 }),
  unitType: DealUnitType.AUNIT,
  equityPreferredReturn: faker.number.int({ min: 8, max: 36 }),
};

export const baseStats: any = {
  amount: 1000000, // $1M Investment
  unitType: DealUnitType.CUNIT, // Base case for CUNIT
  equityPreferredReturn: 0.08, // 8% preferred return
};
