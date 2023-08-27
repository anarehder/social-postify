import { Module, forwardRef } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { MediasRepository } from './medias.repository';
import { PublicationsModule } from '../publications/publications.module';
import { PublicationsService } from '../publications/publications.service';
import { PublicationsRepository } from '../publications/publications.repository';
import { PostsService } from '../posts/posts.service';
import { PostsRepository } from '../posts/posts.repository';

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
