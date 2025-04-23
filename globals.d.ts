enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ADVISOR = 'ADVISOR',
}

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      investorPortalId?: number;
      role?: Role;
    };
  }
}
