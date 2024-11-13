import type { Deal, User, Organization } from "@prisma/client";




export enum MatchConfidence {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    NONE="NONE"
}
export type MatchResponseObject = {
    pdfName: string;
    deal?: Deal;
    error?: string;
    owner?: User;
    organization?: Organization;
    projectName?: string;
    confidence: MatchConfidence;
    matchedWords: string[];
    matchScore: number;
}
