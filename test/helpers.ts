import { PrismaService } from '../src/prisma/prisma.service';

export class TestHelper {
  async cleanDB(prisma: PrismaService) {
    await prisma.publications.deleteMany({});
    await prisma.medias.deleteMany({});
    await prisma.posts.deleteMany({});
  }
}
