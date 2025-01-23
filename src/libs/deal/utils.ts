import type { DealFinancingType } from '@prisma/client';
import { ProjectName } from '@/libs/project/schema';

const InvestmentEntity = {
  'The Edison': {
    equity: 'Edison Project LLC',
    promissory_note_now: 'Edison Project LLC',
    promissory_note_at_closing: 'Edison Project LLC',
    promissory_to_equity: 'Edison Project LLC',
  },
  '519 W Main': {
    equity: 'Vanilla 301 LLC',
    promissory_note_now: 'Vanilla 301 LLC',
    promissory_note_at_closing: 'Vanilla 301 LLC',
    promissory_to_equity: 'Vanilla 301 LLC',
  },
  'Bakers Place': {
    equity: 'Bakers Place Investment LLC',
    promissory_note_now: 'Bakers Place Investment LLC',
    promissory_note_at_closing: 'Bakers Place Investment LLC',
    promissory_to_equity: 'Bakers Place Investment LLC',
  },
};

export function getInvestmentEntity(
  projectName: string,
  financingType: DealFinancingType
) {
  switch (projectName) {
    case ProjectName['The Edison']:
    case ProjectName['519 W Main']:
    case ProjectName['Bakers Place']: {
      return InvestmentEntity[projectName][financingType];
    }
    default: {
      console.error(
        `The project with name ${projectName} is not yet supported in getInvestmentEntity()`
      );
      return null;
    }
  }
}
