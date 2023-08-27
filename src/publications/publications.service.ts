import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasService } from 'src/medias/medias.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly repository: PublicationsRepository,
    @Inject(forwardRef(() => MediasService))
    private mediasService: MediasService,
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
  ) {}

  async checkId(id: number) {
    const publication = await this.repository.findOnePublicationDB(id);

    if (!publication) {
      throw new NotFoundException('Not found publication');
    }
    return publication;
  }

  async createPublication(body: CreatePublicationDto) {
    const { mediaId, postId } = body;
    await this.mediasService.checkId(mediaId);
    await this.postsService.checkId(postId);
    return this.repository.createPublicationDB(body);
  }

  async findAllPublications(published?: string, after?: string) {
    if (!published && !after) {
      return await this.repository.findAllPublicationsDB();
    }
    if (published && !after) {
      const today = new Date();
      const todayFormatted = today.toISOString();
      return await this.repository.findPublishedDB(published, todayFormatted);
    }
    if (published && after) {
      const afterFormatted = `${after}T00:00:00.000Z`;
      return await this.repository.findPublishedDB(published, afterFormatted);
    }
    return await this.repository.findAllPublicationsDB();
  }

  async findOnePublicationByMedia(id: number) {
    return await this.repository.findOnePublicationByMediaDB(id);
  }

  async findOnePublicationByPost(id: number) {
    return await this.repository.findOnePublicationByPostDB(id);
  }

  async findOnePublication(id: number) {
    const publication = await this.checkId(id);
    return publication;
  }

  async updatePublication(id: number, body: UpdatePublicationDto) {
    await this.checkId(id);
    const { mediaId, postId } = body;
    await this.mediasService.checkId(mediaId);
    await this.postsService.checkId(postId);
    return await this.repository.updatePublicationDB(id, body);
  }

  async removePublication(id: number) {
    await this.checkId(id);
    return await this.repository.removePublicationDB(id);
  }
}
