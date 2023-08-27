import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly repository: PostsRepository) {}

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
    //conferir no publications se existe algum registro de media com esse id
    return await this.repository.removePostDB(id);
  }
}
