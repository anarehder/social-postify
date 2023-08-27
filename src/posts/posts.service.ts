import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { PublicationsService } from '../publications/publications.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly repository: PostsRepository,
    @Inject(forwardRef(() => PublicationsService))
    private publicationsService: PublicationsService,
  ) {}

  async checkId(id: number) {
    const post = await this.repository.findOnePostDB(id);

    if (!post) {
      throw new NotFoundException('Not found post');
    }
    return post;
  }

  async createPost(body: CreatePostDto) {
    return this.repository.createPostDB(body);
  }

  async findAllPosts() {
    const posts = await this.repository.findAllPostsDB();
    posts.map((p) => p.image === null && delete p.image);
    return posts;
  }

  async findOnePost(id: number) {
    const post = await this.checkId(id);
    if (post.image === null) delete post.image;
    return post;
  }

  async updatePost(id: number, body: UpdatePostDto) {
    await this.checkId(id);
    return await this.repository.updatePostDB(id, body);
  }

  async removePost(id: number) {
    await this.checkId(id);
    const publication =
      await this.publicationsService.findOnePublicationByPost(id);
    if (publication) {
      throw new ForbiddenException('Post attached with publication');
    }
    return await this.repository.removePostDB(id);
  }
}
