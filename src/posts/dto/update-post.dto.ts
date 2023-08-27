import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  @IsNotEmpty({
    message: 'Title is required!',
  })
  title: string;

  @IsString()
  @IsNotEmpty({
    message: 'Text is required!',
  })
  text: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;
}
