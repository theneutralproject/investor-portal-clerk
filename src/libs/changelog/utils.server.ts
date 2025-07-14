import { Changelog, Prisma } from '@prisma/client';
import prisma from '../prisma.server';

export type ChangelogPayload = Omit<Changelog, 'id' | 'createdAt'> & {
  previousValue?: Prisma.InputJsonValue;
  newValue: Prisma.InputJsonValue;
};

export const createChangeLog = async (data: ChangelogPayload) => {
  const changeLogProps = {
    ...data,
    createdAt: new Date(),
    previousValue: data.previousValue || {},
  };

  return await prisma.changelog.create({
    data: changeLogProps,
  });
};
