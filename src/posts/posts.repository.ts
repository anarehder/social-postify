import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPostDB(data: CreatePostDto) {
    return this.prisma.posts.create({ data });
  }

  findAllPostsDB() {
    return this.prisma.posts.findMany();
  }

  findOnePostDB(id: number) {
    return this.prisma.posts.findFirst({
      where: { id },
    });
  }

  updatePostDB(id: number, body: UpdatePostDto) {
    return this.prisma.posts.update({
      where: { id },
      data: body,
    });
  }

  removePostDB(id: number) {
    return this.prisma.posts.delete({
      where: {
        id,
      },
    });
  }
}
