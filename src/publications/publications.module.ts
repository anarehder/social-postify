import { Module, forwardRef } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { PublicationsRepository } from './publications.repository';
import { PostsModule } from '../posts/posts.module';
import { MediasModule } from '../medias/medias.module';
import { MediasService } from '../medias/medias.service';
import { PostsService } from '../posts/posts.service';
import { MediasRepository } from '../medias/medias.repository';
import { PostsRepository } from '../posts/posts.repository';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => MediasModule),
    forwardRef(() => PostsModule),
  ],
  controllers: [PublicationsController],
  providers: [
    PublicationsService,
    PublicationsRepository,
    MediasService,
    MediasRepository,
    PostsService,
    PostsRepository,
    PrismaService,
  ],
  exports: [PublicationsService, PublicationsRepository],
})
export class PublicationsModule {}
