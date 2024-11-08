import type { Deal, User, Organization } from "@prisma/client";




export enum MatchConfidence {
    HIGH = "HIGH",  // three or more points matched
    MEDIUM = "MEDIUM", // two points matched
    LOW = "LOW" // one point matched
}
export type MatchResponseObject = {
    pdfName: string;
    deal?: Deal;
    error?: string;
    owner?: User;
    organization?: Organization;
    confidence: MatchConfidence;
    matchedWords: string[];
}
