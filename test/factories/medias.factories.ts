import { faker } from '@faker-js/faker';
import { PrismaService } from '../../src/prisma/prisma.service';

export class MediasFactories {
  async createMedia(prisma: PrismaService) {
    const company = faker.company.companyName();
    const username = faker.internet.userName();
    return await prisma.medias.create({
      data: {
        title: company,
        username: `www.${company}.com.br/${username}`,
      },
    });
  }
}
