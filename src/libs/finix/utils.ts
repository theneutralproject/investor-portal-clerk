import 'server-only';

export const getFinixUserName = (projectSlug: string) => {
  switch (projectSlug) {
    case 'edison':
      return process.env.FINIX_USERNAME_EDISON!;
    case 'bakers':
      return process.env.FINIX_USERNAME_BAKERS!;
    case '519':
      return process.env.FINIX_USERNAME_519!;
    default:
      throw new Error('Invalid project slug in getFinixUserName');
  }
};

export const getFinixPassword = (projectSlug: string) => {
  switch (projectSlug) {
    case 'edison':
      return process.env.FINIX_PASSWORD_EDISON!;
    case 'bakers':
      return process.env.FINIX_PASSWORD_BAKERS!;
    case '519':
      return process.env.FINIX_PASSWORD_519!;
    default:
      throw new Error('Invalid project slug in getFinixPassword');
  }
};
