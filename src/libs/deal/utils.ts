import type { DealFinancingType } from "@prisma/client";
import { ProjectName } from "../schema";

type InvestmentEntityConfig = {
  equity: string;
  promissory_note_now: string;
  promissory_note_at_closing: string;
  promissory_to_equity: string;
};

type InvestmentEntityMap = {
  [K in ProjectName]?: InvestmentEntityConfig;
};

const INVESTMENT_ENTITY: InvestmentEntityMap = {
  [ProjectName["The Edison"]]: {
    equity: "Edison Project LLC",
    promissory_note_now: "North Edison LLC",
    promissory_note_at_closing: "Edison Project LLC",
    promissory_to_equity: "North Edison LLC",
  },
  [ProjectName["519 W Main"]]: {
    equity: "Vanilla 301 LLC",
    promissory_note_now: "Vanilla 301 LLC",
    promissory_note_at_closing: "Vanilla 301 LLC",
    promissory_to_equity: "Vanilla 301 LLC",
  },
  [ProjectName["Bakers Place"]]: {
    equity: "Bakers Place Investment LLC",
    promissory_note_now: "Bakers Place Investment LLC",
    promissory_note_at_closing: "Bakers Place Investment LLC",
    promissory_to_equity: "Bakers Place Investment LLC",
  },
};

export function getInvestmentEntity(
  projectName: string,
  financingType: DealFinancingType
): string | null {
  const config = INVESTMENT_ENTITY[projectName as ProjectName];

  if (!config) {
    console.error(
      `The project with name ${projectName} is not yet supported in getInvestmentEntity()`
    );
    return null;
  }

  return config[financingType];
}
