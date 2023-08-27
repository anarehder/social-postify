import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPublicationDB(body: CreatePublicationDto) {
    return this.prisma.publications.create({ data: body });
  }

  findAllPublicationsDB() {
    return this.prisma.publications.findMany();
  }

  async findPublishedDB(published: string, date: string) {
    if (published === 'true') {
      return await this.prisma.publications.findMany({
        where: {
          date: { lte: date },
        },
      });
    }
    if (published === 'false') {
      return await this.prisma.publications.findMany({
        where: {
          date: { gt: date },
        },
      });
    }
  }

  findOnePublicationDB(id: number) {
    return this.prisma.publications.findFirst({
      where: { id },
    });
  }

  findOnePublicationByMediaDB(id: number) {
    return this.prisma.publications.findFirst({
      where: { mediaId: id },
    });
  }

  findOnePublicationByPostDB(id: number) {
    return this.prisma.publications.findFirst({
      where: { postId: id },
    });
  }

  updatePublicationDB(id: number, body: UpdatePublicationDto) {
    return this.prisma.publications.update({
      where: { id },
      data: body,
    });
  }

  removePublicationDB(id: number) {
    return this.prisma.publications.delete({
      where: {
        id,
      },
    });
  }
}
