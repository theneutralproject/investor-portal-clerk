export type Question = {
  id: string;
  title: string;
  subtitle: string;
  options: string[];
};

export const questions: Question[] = [
  {
    id: "accreditation",
    title: "Verify Your Accreditation Status",
    subtitle: "Select the option that best applies",
    options: [
      "I have had income of at least $200,000 individually or at least $300,000 jointly with my spouse in any of the past three years",
      "I have verifiable net worth of at least $1MM (excluding my primary residence)",
      "I have a professional license (Series 7, 65, or 82)",
    ],
  },
  {
    id: "verification",
    title: "How would you like to verify your accreditation?",
    subtitle: "Choose a verification method",
    options: ["Upload Document", "Contact Third Party Verifier"],
  },
];
