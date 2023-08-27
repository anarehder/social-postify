import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class PostsFactories {
  async createPost(prisma: PrismaService) {
    return await prisma.posts.create({
      data: {
        title: faker.lorem.sentence(),
        text: faker.lorem.text(),
      },
    });
  }

  async createPostWithImage(prisma: PrismaService) {
    return await prisma.posts.create({
      data: {
        title: faker.lorem.sentence(),
        text: faker.lorem.text(),
        image: faker.internet.avatar(),
      },
    });
  }
}
