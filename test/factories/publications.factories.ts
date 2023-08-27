import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class PublicationFactories {
  async createFuturePublication(
    prisma: PrismaService,
    mediaId: number,
    postId: number,
  ) {
    return await prisma.publications.create({
      data: {
        mediaId,
        postId,
        date: faker.date.future().toISOString(),
      },
    });
  }

  async createPastPublication(
    prisma: PrismaService,
    mediaId: number,
    postId: number,
  ) {
    return await prisma.publications.create({
      data: {
        mediaId,
        postId,
        date: faker.date.past().toISOString(),
      },
    });
  }
}
