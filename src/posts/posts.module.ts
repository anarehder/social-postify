import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsRepository } from './posts.repository';
import { PublicationsModule } from 'src/publications/publications.module';
import { PublicationsService } from 'src/publications/publications.service';
import { PublicationsRepository } from 'src/publications/publications.repository';
import { MediasService } from 'src/medias/medias.service';
import { MediasRepository } from 'src/medias/medias.repository';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule, forwardRef(() => PublicationsModule)],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PublicationsService,
    PublicationsRepository,
    MediasService,
    MediasRepository,
    PrismaService,
  ],
  exports: [PostsService, PostsRepository],
})
export class PostsModule {}
