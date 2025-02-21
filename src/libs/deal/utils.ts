import type { DealFinancingType } from '@prisma/client';
import { InvestmentEntity, ProjectName } from '@/libs/project/schema';

const _investmentEntity = {
  'The Edison': {
    equity: InvestmentEntity['The Edison'],
    promissory_note_now: InvestmentEntity['The Edison'],
    promissory_note_at_closing: InvestmentEntity['The Edison'],
    promissory_to_equity: InvestmentEntity['The Edison'],
  },
  '519 W Main': {
    equity: InvestmentEntity['519 W Main'],
    promissory_note_now: InvestmentEntity['519 W Main'],
    promissory_note_at_closing: InvestmentEntity['519 W Main'],
    promissory_to_equity: InvestmentEntity['519 W Main'],
  },
  'Bakers Place': {
    equity: InvestmentEntity['Bakers Place'],
    promissory_note_now: InvestmentEntity['Bakers Place'],
    promissory_note_at_closing: InvestmentEntity['Bakers Place'],
    promissory_to_equity: InvestmentEntity['Bakers Place'],
  },
};

// This function is used to get the investment entity for a given project and financing type
// If the investment entity is provided, it will return that (used to import old deals)
export function getInvestmentEntity(
  projectName: string,
  financingType: DealFinancingType,
  investmentEntity?: string
) {
  if (investmentEntity) {
    return investmentEntity;
  }
  switch (projectName) {
    case ProjectName['The Edison']:
    case ProjectName['519 W Main']:
    case ProjectName['Bakers Place']: {
      return _investmentEntity[projectName][financingType];
    }
    default: {
      console.error(
        `The project with name ${projectName} is not yet supported in getInvestmentEntity()`
      );
      return null;
    }
  }
}
