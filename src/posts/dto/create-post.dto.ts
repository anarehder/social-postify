import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
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
