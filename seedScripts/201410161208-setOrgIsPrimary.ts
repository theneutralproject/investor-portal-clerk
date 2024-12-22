import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const orgs = await prisma.organization.updateMany({
    where: { isPrimary: false },
    data: { isPrimary: true },
  });
  console.log(`Set ${orgs.count} organizations as primary`);
  return orgs;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
