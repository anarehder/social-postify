import { Module, forwardRef } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PublicationsRepository } from './publications.repository';
import { PostsModule } from 'src/posts/posts.module';
import { MediasModule } from 'src/medias/medias.module';
import { PrismaService } from 'nestjs-prisma';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';
import { MediasRepository } from 'src/medias/medias.repository';
import { PostsRepository } from 'src/posts/posts.repository';

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
