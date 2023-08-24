import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}
  createMediaDB(data: CreateMediaDto) {
    return this.prisma.medias.create({ data });
  }

  findAllMediasDB() {
    return this.prisma.medias.findMany();
  }

  findOneMediaDB(id: number) {
    return this.prisma.medias.findUnique({
      where: { id },
    });
  }

  updateMediaDB(id: number, body: UpdateMediaDto) {
    return this.prisma.medias.update({
      where: { id },
      data: {
        title: body.title,
        username: body.username,
      },
    });
    return `This action updates a #${id} media`;
  }

  removeMediaDB(id: number) {
    return this.prisma.medias.delete({
      where: {
        id,
      },
    });
  }
}
