import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const projectPictures = await prisma.projectPicture.findMany();
    for (const projectPicture of projectPictures) {
        await prisma.projectPicture.update({
            where: { id: projectPicture.id },
            data: { url: projectPicture.url.replace('ueyomfwwqtecfcdrgahe', 'wozumwkyltloehxggvzc'), }
        });
    }
}

main().then(async () => {   
    await prisma.$disconnect();
   }).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
   });