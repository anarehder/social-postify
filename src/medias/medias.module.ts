import { Module, forwardRef } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediasRepository } from './medias.repository';
import { PublicationsModule } from 'src/publications/publications.module';
import { PublicationsService } from 'src/publications/publications.service';
import { PublicationsRepository } from 'src/publications/publications.repository';
import { PostsService } from 'src/posts/posts.service';
import { PrismaService } from 'nestjs-prisma';
import { PostsRepository } from 'src/posts/posts.repository';

@Module({
  imports: [PrismaModule, forwardRef(() => PublicationsModule)],
  controllers: [MediasController],
  providers: [
    MediasService,
    MediasRepository,
    PublicationsService,
    PublicationsRepository,
    PostsService,
    PostsRepository,
    PrismaService,
  ],
  exports: [MediasService, MediasRepository],
})
export class MediasModule {}
