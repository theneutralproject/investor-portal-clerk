export type Question = {
  id: string;
  title: string;
  options: string[];
};

export const questions: Question[] = [
  {
    id: "accreditation",
    title: "Choose Accreditation Status",
    options: [
      "I have had income of at least $200,000 individually or at least $300,000 jointly with my spouse in any of the past three years",
      "I have verifiable net worth of at least $1MM (excluding my primary residence)",
      "I have a professional license (Series 7, 65, or 82)",
    ],
  },
  {
    id: "verification",
    title: "Choose Verification Method",
    options: ["Upload Document", "Contact Third Party Verifier"],
  },
];
