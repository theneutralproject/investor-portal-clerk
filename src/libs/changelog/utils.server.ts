import { Changelog } from '@prisma/client';
import prisma from '../prisma.server';
import { sanitizeJson } from '../utils.server';

export type ChangelogPayload = Omit<
  Changelog,
  'id' | 'createdAt' | 'previousValue' | 'newValue'
> & {
  previousValue?: unknown;
  newValue: unknown;
};

export const createChangeLog = async (data: ChangelogPayload) => {
  const sanitizedPrevious = sanitizeJson(data.previousValue ?? {});
  const sanitizedNew = sanitizeJson(data.newValue);
  const changeLogProps = {
    ...data,
    createdAt: new Date(),
    previousValue: sanitizedPrevious,
    newValue: sanitizedNew,
  };

  return await prisma.changelog.create({
    data: changeLogProps,
  });
};
