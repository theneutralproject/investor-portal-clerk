import { Status } from '@prisma/client';

export const INACTIVE_BUTTON_TOOLTIP = {
  [Status.ACTIVE]: null,
  [Status.INACTIVE]: 'This investment opportunity has closed.',
  [Status.UPCOMING]:
    'This project isn’t open for investment yet. Please check back soon.',
};

export const isInvestButtonDisabled = (status: Status) => {
  return status === Status.INACTIVE || status === Status.UPCOMING;
};
