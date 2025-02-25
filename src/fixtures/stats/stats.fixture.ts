import { faker } from '@faker-js/faker';
import { DealUnitType } from '@prisma/client';

export const statsFixture: any = {
  amount: faker.number.int({ min: 100000, max: 200000 }),
  unitType: DealUnitType.AUNIT,
  equityPreferredReturn: faker.number.int({ min: 8, max: 36 }),
};
