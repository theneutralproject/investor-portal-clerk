import { PrismaClient, Prisma } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaClient = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prismaClient: PrismaClient;
  };
  if (!globalWithPrisma.prismaClient) {
    globalWithPrisma.prismaClient = new PrismaClient();
  }
  prismaClient = globalWithPrisma.prismaClient;
}

const computedFieldsExtension = Prisma.defineExtension({
  result: {
    deal: {
      hasConversion: {
        needs: {
          conversionId: true,
        },
        compute(deal) {
          return deal.conversionId !== null;
        },
      },
    },
  },
});

const prisma = prismaClient
  .$extends(fieldEncryptionExtension())
  .$extends(computedFieldsExtension);

export default prisma;
