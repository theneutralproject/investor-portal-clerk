import { PrismaClient } from '@prisma/client';
import { fieldEncryptionExtension } from 'prisma-field-encryption';

let prismaClient: PrismaClient;

const globalWithPrisma = global as typeof globalThis & {
  prismaClient: PrismaClient;
};

if (!globalWithPrisma.prismaClient) {
  globalWithPrisma.prismaClient = new PrismaClient();
}
prismaClient = globalWithPrisma.prismaClient;

const prisma = prismaClient.$extends(fieldEncryptionExtension());

export default prisma;
