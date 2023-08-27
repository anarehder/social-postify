import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { PostsRepository } from './posts.repository';
import { PublicationsModule } from '../publications/publications.module';
import { PublicationsService } from '../publications/publications.service';
import { PublicationsRepository } from '../publications/publications.repository';
import { MediasService } from '../medias/medias.service';
import { MediasRepository } from '../medias/medias.repository';

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
