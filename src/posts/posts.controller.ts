import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreatePostDto) {
    return this.postsService.createPost(body);
  }

  @Get()
  findAll() {
    return this.postsService.findAllPosts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOnePost(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return this.postsService.updatePost(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.removePost(+id);
  }
}
