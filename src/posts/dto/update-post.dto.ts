import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  @IsNotEmpty({
    message: 'All fields are required!',
  })
  title: string;

  @IsString()
  @IsNotEmpty({
    message: 'All fields are required!',
  })
  text: string;
}
