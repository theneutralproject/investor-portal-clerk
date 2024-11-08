import type { DealFinancingType } from "@prisma/client";
import { ProjectName } from "../schema";

const InvestmentEntity = {
    "The Edison": {
        equity: "Edison Project LLC",
        promissory_note_now: "North Edison LLC",
        promissory_note_at_closing: "Edison Project LLC",
        promissory_to_equity: "North Edison LLC",
    },
    "519 W Main": {
        equity: "Vanilla 301 LLC",
        promissory_note_now: "Vanilla 301 LLC",
        promissory_note_at_closing: "Vanilla 301 LLC",
        promissory_to_equity: "Vanilla 301 LLC",
    },
    "Bakers Place": {
        equity: "Bakers Place Investment LLC",
        promissory_note_now: "Bakers Place Investment LLC",
        promissory_note_at_closing: "Bakers Place Investment LLC",
        promissory_to_equity: "Bakers Place Investment LLC",
    },
};

export function getInvestmentEntity(
    projectName: string,
    financingType: DealFinancingType
) {
    /* eslint-disable */
    switch (projectName) {
        case ProjectName["The Edison"]:
        case ProjectName["519 W Main"]:
        case ProjectName["Bakers Place"]: {
            return InvestmentEntity[projectName][financingType];
        }
        default: {
            console.error(
                `The project with name ${projectName} is not yet supported in getInvestmentEntity()`
            );
            return null;
        }
    }
    /* eslint-enable */
};
